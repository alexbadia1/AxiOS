/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            /// Get gloabal reference to the input log
            _taProgramInput = document.getElementById("taProgramInput");

            /// Get global reference for visual memory
            _visualMemory = document.getElementById("visual--memory--table");

            /// Get global reference for visual cpu
            _visualCpu = document.getElementById("visual--cpu--table");

            /// Get global reference for visual pcb
            _visualPcb = document.getElementById("visual--pcb--table");

            /// Get global reference for visual pcb
            _visualResidentList = document.getElementById("visual--pcb");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement>document.getElementById("taHostLog")).value = "";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement>document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement>document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            /// and the single step buttons
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStepMode")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            _CPU_BURST = 0; /// Starts on CPU burst 0 have been performed.

            /// ... Create and initialize the Memory
            _Memory = new Memory();
            _Memory.init();

            /// ... Create and initialize Memory Accessor
            _MemoryAccessor = new MemoryAccessor();

            /// ...Create a PCB queue to keep track of currently running pcb's
            _ResidentList = new ResidentList();
            _ResidentList.init();

            /// ... Create and initialize Dispatcher
            _Dispatcher = new Dispatcher();

            /// ... Create and initialize Scheduler
            _Scheduler = new Scheduler();

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.

            /// Change Status to Alive BEFORE GlaDos, so nothing is overwritten
            document.getElementById('divLog--status').innerText = 'AxiOS Alive';

            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static hostBtnSingleStep_click(btn): void {
            /// Enable Next Step Button
            ///
            ///Enter Single step mode...
            /// Or out of single step mode..
            ///
            /// Must do this first so the text label updates properly
            _SingleStepMode = !_SingleStepMode;
            if (_SingleStepMode) {
                (<HTMLButtonElement>document.getElementById("btnNextStep")).disabled = false;
                (<HTMLButtonElement>document.getElementById("btnSingleStepMode")).value = "Single Step OFF";
            }/// if
            else {
                (<HTMLButtonElement>document.getElementById("btnNextStep")).disabled = true;
                (<HTMLButtonElement>document.getElementById("btnSingleStepMode")).value = "Single Step ON";
            }/// else
            _KernelInterruptPriorityQueue.enqueue(new TSOS.Node(new TSOS.Interrupt(SINGLE_STEP_IRQ, [])));
        }

        public static hostBtnNextStep_click(btn): void {
            /// Process single step interrupt
            _KernelInterruptPriorityQueue.enqueue(new TSOS.Node(new TSOS.Interrupt(NEXT_STEP_IRQ, [])));
        }

        public static initializeVisualMemory() {
            /// Increment by 8 on order to create a row every 8 bytes
            for (var physicalAddressRow: number = 0; physicalAddressRow < _MemoryAccessor.mainMemorySize() / 8; ++physicalAddressRow) {
                var row = _visualMemory.insertRow(physicalAddressRow); /// This multiplication works since all volumes are the cam size

                /// Write to 8 cells
                for (var cellInRow: number = 0; cellInRow < 9; ++cellInRow) {
                    if (cellInRow === 0) {
                        /// Add the row header

                        /// Formating the row headers
                        ///
                        /// Using 8 to calculate the correct decimal starting value of the row
                        var decimalTemp: number = physicalAddressRow * 8;

                        /// Convert decimal number to a hex base decimal string
                        var hexTemp: string = decimalTemp.toString(16);

                        /// Add left 0 padding
                        var formattedHexTemp: string = "000" + hexTemp;
                        formattedHexTemp = formattedHexTemp.substr(formattedHexTemp.length - 3).toUpperCase();

                        /// Add the '0x' universal prefix for base 16 numbers
                        formattedHexTemp = `0x${formattedHexTemp}`;

                        /// Finally put memory into it
                        row.insertCell(cellInRow).innerHTML = formattedHexTemp;
                    }/// if
                    else {
                        /// Add the actual data
                        row.insertCell(cellInRow).innerHTML = _Memory.getAddress(physicalAddressRow + cellInRow).read();
                    }/// else
                }/// for
            }/// for
        }/// intializeVisualMemory

        public static updateVisualMemory() {
            var physicalAddress: number = 0;
            /// Increment by 8 on order to create a row every 8 bytes
            for (var currentRow: number = 0; currentRow < _MemoryAccessor.mainMemorySize() / 8; ++currentRow) {
                /// Write to 8 cells
                for (var cellInRow: number = 0; cellInRow < 8; ++cellInRow) {
                    /// Plus one because we don't want to overwrite the row header
                    _visualMemory.rows[currentRow].cells[cellInRow + 1].innerHTML = _Memory.getAddress(physicalAddress).read();
                    physicalAddress++;
                }/// for
            }/// for
        }/// updateVisualMemory

        public static updateVisualCpu() {
            _visualCpu.rows[1].cells[0].innerHTML = this.formatToHexWithPadding(_CPU.PC);
            _visualCpu.rows[1].cells[1].innerHTML = _CPU.IR;
            _visualCpu.rows[1].cells[2].innerHTML = _CPU.Acc;
            _visualCpu.rows[1].cells[3].innerHTML = _CPU.Xreg;
            _visualCpu.rows[1].cells[4].innerHTML = _CPU.Yreg;
            _visualCpu.rows[1].cells[5].innerHTML = _CPU.Zflag;
        }/// updateVisualCpu

        public static updateVisualPcb() {
            /// Visual Updates
            _visualPcb.rows[1].cells[0].innerHTML = _CPU.localPCB.processID;
            _visualPcb.rows[1].cells[1].innerHTML = this.formatToHexWithPadding(_CPU.PC);
            _visualPcb.rows[1].cells[2].innerHTML = _CPU.IR;
            _visualPcb.rows[1].cells[3].innerHTML = _CPU.Acc;
            _visualPcb.rows[1].cells[4].innerHTML = _CPU.Xreg;
            _visualPcb.rows[1].cells[5].innerHTML = _CPU.Yreg;
            _visualPcb.rows[1].cells[6].innerHTML = _CPU.Zflag;
            _visualPcb.rows[1].cells[7].innerHTML = _CPU.localPCB.priority;
            _visualPcb.rows[1].cells[8].innerHTML = _CPU.localPCB.processState;
            _visualPcb.rows[1].cells[9].innerHTML = `Vol ${_CPU.localPCB.volumeIndex + 1}`;
        }/// updateVisualPcb

        public static visualizeInstructionRegister(newInsruction: string) {
            /// Instruction Register
            _CPU.IR = newInsruction;
            _CPU.localPCB.instructionRegister = newInsruction;
        }/// visualizeInstructionRegister


        public static formatToHexWithPadding(decimalNum: number) {
            var hexNumber: string = decimalNum.toString(16);

            /// Add left 0 padding
            var paddedhexNumber: string = "00" + hexNumber;
            paddedhexNumber = paddedhexNumber.substr(paddedhexNumber.length - 2).toUpperCase();

            return paddedhexNumber;
        }/// formatToHexWithPadding


        /*************************************************************************************
        iProject4 Display: 
            calculateAvergeWaitTime()
            calculateAverageTurnAroundTime()
            showCPUBurstUsage()
            showWaitTimes()
            showTurnaroundTimes()
            showProcessOutputs()
            dumpScheduleMetaData()
            dumpResidentList()
        ***************************************************************************************/

        /// Calculate the average wait time by summing all the wait times divided by the number of processes
        public static calculateAverageWaitTime(): number {
            var totalWaitTime: number = 0;
            for (var i: number = 0; i < _Scheduler.processesMetaData.length; ++i) {
                /// _Scheduler.processWaitTimes contains a list of lists where the nested list contains:
                ///     [processID, processTimeSpentExecuting, processWaitTime, processTurnaroundTime]
                totalWaitTime += _Scheduler.processesMetaData[i][2];
            }///for
            return (totalWaitTime / _Scheduler.processesMetaData.length);
        }/// calculateAverageWaitTime

        /// Calculate the average wait time by summing all the wait times divided by the number of processes
        public static calculateAverageTurnaroundTime(): number {
            var totalTurnaroundTime: number = 0;
            for (var i: number = 0; i < _Scheduler.processesMetaData.length; ++i) {
                /// _Scheduler.processWaitTimes contains a list of lists where the nested list contains:
                ///     [processID, processTimeSpentExecuting, processWaitTime, processTurnaroundTime]
                /// Ex:
                ///     [[0, 11, 2, 4], [1, 5, 4, 8], ...]
                totalTurnaroundTime += _Scheduler.processesMetaData[i][3];
            }/// for
            return totalTurnaroundTime / _Scheduler.processesMetaData.length;
        }/// calculateAverageWaitTime


        public static showCPUBurstUsage(): void {
            /// Header
            _StdOut.putText("Scheduled Processes CPU Burst Usage (cycles):");
            _StdOut.advanceLine();

            /// _Scheduler.processWaitTimes contains a list of lists where the nested list contains:
            ///     [processID, processTimeSpentExecuting, processWaitTime, processTurnaroundTime]
            /// Ex:
            ///     [[0, 11, 2, 4], [1, 5, 4, 8], ...]
            for (var i: number = 0; i < _Scheduler.processesMetaData.length; ++i) {
                i === 0 ?
                    /// Indent on first Pid
                    _StdOut.putText(`  Pid ${_Scheduler.processesMetaData[i][0]}: ${_Scheduler.processesMetaData[i][1]}`)

                    /// No Indent on all the other pid's
                    : _StdOut.putText(`Pid ${_Scheduler.processesMetaData[i][0]}: ${_Scheduler.processesMetaData[i][1]}`)

                /// Don't add a comma after the last pid
                if (i !== _Scheduler.processesMetaData.length - 1) {
                    _StdOut.putText(", ");
                }/// if
            }///for
            _StdOut.advanceLine();
            _StdOut.putText("...");
            _StdOut.advanceLine();
        }/// showCPUBurstUsage

        public static showWaitTimes(): void {
            _StdOut.putText("Scheduled Processes Wait Time (cycles):");
            _StdOut.advanceLine();
            _StdOut.putText(`  AWT: ${Math.ceil(this.calculateAverageWaitTime())}, `);
            for (var i: number = 0; i < _Scheduler.processesMetaData.length; ++i) {
                /// _Scheduler.processWaitTimes contains a list of lists where the nested list contains:
                ///     [processID, processTimeSpentExecuting, processWaitTime, processTurnaroundTime]
                /// Ex:
                ///     [[0, 11, 2, 4], [1, 5, 4, 8], ...]
                _StdOut.putText(`Pid ${_Scheduler.processesMetaData[i][0]}: ${_Scheduler.processesMetaData[i][2]}`);

                /// Again, don't add a comma after the last pid
                if (i !== _Scheduler.processesMetaData.length - 1) {
                    _StdOut.putText(", ");
                }/// if
            }///for
            _StdOut.advanceLine();
            _StdOut.putText("...");
            _StdOut.advanceLine();
        }/// showWaitTimes()

        public static showTurnaroundTimes(): void {
            _StdOut.putText("Scheduled Processes Turnaround Time (cycles):");
            _StdOut.advanceLine();
            _StdOut.putText(`  ATT: ${Math.ceil(this.calculateAverageTurnaroundTime())}, `);
            for (var i: number = 0; i < _Scheduler.processesMetaData.length; ++i) {
                /// _Scheduler.processWaitTimes contains a list of lists where the nested list contains:
                ///     [processID, processTimeSpentExecuting, processWaitTime, processTurnaroundTime]
                /// Ex:
                ///     [[0, 11, 2, 4], [1, 5, 4, 8], ...]
                _StdOut.putText(`Pid ${_Scheduler.processesMetaData[i][0]}: ${_Scheduler.processesMetaData[i][3]}`);
                if (i !== _Scheduler.processesMetaData.length - 1) {
                    _StdOut.putText(", ");
                }/// if
            }///for
            _StdOut.advanceLine();
            _StdOut.putText("...");
            _StdOut.advanceLine();
        }/// showTurnaroundTimes

        public static showProcessesOutputs(): void {
            _StdOut.putText("Dumping Processes Output(s):");
            _StdOut.advanceLine();
            for (var i: number = 0; i < _Scheduler.unInterleavedOutput.length; ++i) {
                _StdOut.putText(`  ${_Scheduler.unInterleavedOutput[i]}`);
                if (i !== _Scheduler.unInterleavedOutput.length - 1)
                    _StdOut.advanceLine();
            }///for
        }/// showProcessesOutputs

        public static dumpScheduleMetaData(): void {
            _StdOut.advanceLine();
            _StdOut.putText("Schedule Terminated!");
            _StdOut.advanceLine();
            _StdOut.putText("...");
            _StdOut.advanceLine();
            _StdOut.putText("Schedule Metadata:");
            _StdOut.advanceLine();
            _StdOut.putText(`  Quantum used: ${_Scheduler.quanta}, Total CPU Bursts: ${_CPU_BURST}`);
            _StdOut.advanceLine();
            _StdOut.putText("...");
            _StdOut.advanceLine();

            /// Show scheduling and processes data
            this.showCPUBurstUsage();
            this.showTurnaroundTimes();
            this.showWaitTimes();
            this.showProcessesOutputs();
            _StdOut.advanceLine();
            _OsShell.putPrompt();
        }/// dumpScheduleMetaData

        public static createVisualResidentList(pcb): void {
            /// Create a table with two rows
            var table = document.createElement('table');
            table.setAttribute("id", "tempTable");
            var rowWithHeaders = document.createElement('tr');
            var rowWithValues = document.createElement('tr');

            table.appendChild(rowWithHeaders);
            table.appendChild(rowWithValues);

            /// Create cells with text
            for (var cellNum: number = 0; cellNum < 10; ++cellNum) {
                /// Create the header cell
                var headerCell = document.createElement('td');
                var innerHtmlHeaderCell = document.createTextNode("");

                /// Create value cell
                var valueCell = document.createElement('td');
                var innerHtmlValueCell = document.createTextNode("");

                /// Append the cells and their values
                valueCell.appendChild(innerHtmlValueCell);
                headerCell.appendChild(innerHtmlHeaderCell);
                rowWithValues.appendChild(valueCell);
                rowWithHeaders.appendChild(headerCell);
            }/// for

            _visualResidentList.appendChild(table);

            for (var i: number = 0; i < 1; ++i) {
                table.rows[1].cells[0].innerHTML = pcb.processID.toString();
                table.rows[1].cells[1].innerHTML = this.formatToHexWithPadding(pcb.programCounter);
                table.rows[1].cells[2].innerHTML = pcb.instructionRegister;
                table.rows[1].cells[3].innerHTML = pcb.accumulator;
                table.rows[1].cells[4].innerHTML = pcb.xRegister;
                table.rows[1].cells[5].innerHTML = pcb.yRegister;
                table.rows[1].cells[6].innerHTML = pcb.zFlag.toString();
                table.rows[1].cells[7].innerHTML = pcb.priority.toString();
                table.rows[1].cells[8].innerHTML = pcb.processState;
                table.rows[1].cells[9].innerHTML = `Vol ${pcb.volumeIndex + 1}`;
            }/// for
        }/// dumpResidentList

        public static visualizeResidentList() {
            try {
                document.getElementById("tempTable").parentNode.removeChild(document.getElementById("tempTable"));
                document.getElementById("tempTable").parentNode.removeChild(document.getElementById("tempTable"));
            }/// try
            catch (e) {
                _Kernel.krnTrace(e);
                 _Kernel.krnTrace("No resident list to delete.");
            }/// catch
            for (var index: number = 0; index < _Scheduler.readyQueue.length; ++index){
                this.createVisualResidentList(_Scheduler.readyQueue[index]);
            }/// for
        }/// visualizeResidentList
    }/// class
}/// module
