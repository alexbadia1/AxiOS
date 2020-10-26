/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Kernel {
        ///
        /// OS Startup and Shutdown Routines
        ///
        /// Page 8
        krnBootstrap() {
            /// Use hostLog because we ALWAYS want this, even if _Trace is off.
            TSOS.Control.hostLog("bootstrap", "host");
            /// Initialize our global queues.
            /// 
            /// A (currently) priority queue for interrupt requests (IRQs).
            _KernelInterruptPriorityQueue = new TSOS.PriorityQueue();
            /// Buffers... for kernel
            _KernelBuffers = new Array();
            /// Where device input lands before being processed out somewhere.
            _KernelInputQueue = new TSOS.Queue();
            /// Initialize the console.
            /// The command line interface / console I/O device.
            _Console = new TSOS.Console();
            _Console.init();
            /// Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;
            /// Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            /// "Construct" the "actual" KeyboardDevice Drives.
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard();
            /// Call the driverEntry() initialization routine.
            _krnKeyboardDriver.driverEntry();
            this.krnTrace(_krnKeyboardDriver.status);
            //
            // ... more?
            //
            _MemoryManager = new TSOS.MemoryManager();
            /// Visualize Memory...
            TSOS.Control.initializeVisualMemory();
            /// Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            /// Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();
            /// Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            } /// if
        } /// krBootstrap
        krnShutdown() {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        } /// krnShutdown
        krnOnCPUClockPulse() {
            /*
               This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.
            */
            /// Check for an interrupt, if there are any. Page 560
            if (_KernelInterruptPriorityQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                /// TODO (maybe): Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptPriorityQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            } /// if
            /// _CPU.isExecuting: controls if the cpu will try to read an instruction from memory
            ///
            /// Various things will change this including but not limited to:
            ///     - Interrupts
            ///     - CLI / Shell Commands
            ///     - Error handling
            ///     - Maybe processes themselves?
            ///     - etc.
            else if (_CPU.isExecuting) {
                /// Perform One Single Step
                if (_SingleStepMode) {
                    if (_NextStep) {
                        this.countCpuBurst();
                        _CPU.cycle();
                        _Scheduler.roundRobinCheck();
                        TSOS.Control.updateVisualMemory();
                        TSOS.Control.updateVisualCpu();
                        TSOS.Control.updateVisualPcb();
                        TSOS.Control.visualizeResidentList();
                        _NextStep = false;
                    } /// if
                } /// if
                /// Run normally
                else {
                    this.countCpuBurst();
                    _CPU.cycle();
                    _Scheduler.roundRobinCheck();
                    TSOS.Control.updateVisualMemory();
                    TSOS.Control.updateVisualCpu();
                    TSOS.Control.updateVisualPcb();
                    TSOS.Control.visualizeResidentList();
                } /// else
                /// TODO: Make the date and time update NOT dependent on the cpu actually cycling
                this.getCurrentDateTime();
            } /// else
            /// If there are no interrupts and there is nothing being executed then just be idle.
            else {
                this.getCurrentDateTime();
                this.krnTrace("Idle");
            } /// else
        } /// krnOnCPUClockPulse
        countCpuBurst() {
            /// Increase cpu burst count
            ///
            /// Single Step is special as you can force count to keep increasing in single step...
            /// so reset _CPU_BURST when in Single Step and the scheduler is empty
            ///
            /// Not the best solution I could think of, but the first,
            /// Call this a "temporary fix"
            if (_Scheduler.currentProcess === null && _Scheduler.readyQueue.getSize() === 0) {
                _CPU_BURST = 0;
            } /// if
            else {
                _CPU_BURST++;
            }
            /// Wait time is time spent in the ready queue soo...
            /// Loop through Ready Queue and increment each pcb's wait time by 1 cycle
            for (var i = 0; i < _Scheduler.readyQueue.getSize(); ++i) {
                _Scheduler.readyQueue.getIndex(i).waitTime += 1;
            } /// for
            /// Turnaround Time is time running and in waiting queue...
            /// So track nummber of cpu cycles used per process and add cpu cycles used and wait time for turnaround time
            _Scheduler.currentProcess.timeSpentExecuting += 1;
        } /// countCpuBurst
        /// Hopefully Updates the Date and Time
        getCurrentDateTime() {
            var current = new Date();
            var day = String(current.getDate()).padStart(2, '0');
            var month = String(current.getMonth()).padStart(2, '0');
            var year = String(current.getFullYear()).padStart(2, '0');
            var hours = String(current.getHours()).padStart(2, '0');
            var minutes = String(current.getMinutes()).padStart(2, '0');
            var seconds = String(current.getSeconds()).padStart(2, '0');
            document.getElementById('divLog--date').innerText = `${month}/${day}/${year}`;
            document.getElementById('divLog--time').innerText = `${hours}:${minutes}:${seconds}`;
        } /// getCurrentDateTime
        //////////////////////////
        /// Interrupt Handling ///
        //////////////////////////
        krnEnableInterrupts() {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        } /// krnEnableInterrupts
        krnDisableInterrupts() {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        } /// krnDisableInterrupts
        krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);
            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                /// Kernel built-in routine for timers (not the clock).
                case TIMER_IRQ:
                    this.krnTimerISR();
                    break;
                /// Hardware Interrupt
                case KEYBOARD_IRQ:
                    // Kernel mode device driver
                    _krnKeyboardDriver.isr(params);
                    _StdIn.handleInput();
                    break;
                /// Read/Write Console Interrupts
                case SYS_CALL_IRQ:
                    this.sysCallISR(params);
                    break;
                case PS_IRQ:
                    this.psISR();
                    break;
                /// Single Step Interrupts
                case SINGLE_STEP_IRQ:
                    this.singleStepISR();
                    break;
                case NEXT_STEP_IRQ:
                    this.nextStepISR();
                    break;
                /// Scheduling Interrupts
                case CONTEXT_SWITCH_IRQ:
                    this.contextSwitchISR();
                    break;
                case CHANGE_QUANTUM_IRQ:
                    this.changeQuantumISR(params);
                    break;
                /// Create Process Interrupts
                case RUN_PROCESS_IRQ:
                    this.runProcessISR(params);
                    break;
                case RUN_ALL_PROCESSES_IRQ:
                    this.runAllProcesesISR();
                    break;
                ///////////////////////////////
                /// Exit Process Interrupts ///
                ///////////////////////////////
                /// When a process ends, it sends its own termination interrupt
                case TERMINATE_PROCESS_IRQ:
                    this.terminateProcessISR();
                    break;
                /// This is the user "killing" the process,
                /// NOT the process sending its own termination interrupt
                case KILL_PROCESS_IRQ:
                    this.killProcessISR(params);
                    break;
                case KILL_ALL_PROCESSES_IRQ:
                    this.killAllProcessesISR();
                    break;
                /// Invalid interrupt doofus, make sure you defined it in global.ts and added it to the switch case, 
                /// Otherwise the system should not be requesting unknown interrupts, dummy...
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            } /// switch
        } /// krnInterruptHandler
        krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
            // Or do it elsewhere in the Kernel. We don't really need this.
        } /// krnTimerISR
        sysCallISR(params) {
            var myPcb = params[0];
            /// Print out the Y-reg if X-reg has 01
            if (parseInt(_CPU.Xreg, 16) === 1) {
                _StdOut.putText(` ${_CPU.Yreg} `);
                myPcb.outputBuffer += ` ${_CPU.Yreg} `;
            } /// if
            /// Print from memeory starting at address
            if (parseInt(_CPU.Xreg, 16) === 2) {
                var ans = "";
                /// I'm assuming the program is using the logical address
                ///
                /// I'll find out the hard-way if I'm right or wrong...
                var logicalCurrAddress = parseInt(_CPU.Yreg, 16);
                /// Use Y-reg to find out which memory location to start reading from
                ///
                /// Convert to decimal char chode as well
                var decimalCharCode = parseInt(_MemoryAccessor.read(_MemoryManager.simpleVolumes[_CPU.localPCB.volumeIndex], logicalCurrAddress), 16);
                /// Keep going until we hit a 00 which represents the end of the string
                while (decimalCharCode !== 0) {
                    ans += String.fromCharCode(decimalCharCode);
                    /// Read nex character
                    logicalCurrAddress++;
                    decimalCharCode = parseInt(_MemoryAccessor.read(_MemoryManager.simpleVolumes[_CPU.localPCB.volumeIndex], logicalCurrAddress), 16);
                } /// while
                _StdOut.putText(ans);
                myPcb.outputBuffer += ans;
            } /// if
        } /// sysCallISR
        psISR() {
            for (var pos = 0; pos < _ResidentList.residentList.length; ++pos) {
                pos === 0 ?
                    _StdOut.putText(`  pid ${_ResidentList.residentList[pos].processID}: ${_ResidentList.residentList[pos].processState}`)
                    : _StdOut.putText(`pid ${_ResidentList.residentList[pos].processID}: ${_ResidentList.residentList[pos].processState}`);
                if (pos !== _ResidentList.residentList.length - 1) {
                    _StdOut.putText(`, `);
                } /// if
            } /// for
            _StdOut.advanceLine();
            _OsShell.putPrompt();
        } /// psISR
        singleStepISR() {
            if (_SingleStepMode) {
                /// Stop the CPU from executing
                _CPU.isExecuting = false;
            } /// if
            else {
                /// Go back to cpu executing
                _CPU.isExecuting = true;
            } /// else
        } /// singleStepISR
        nextStepISR() {
            /// If we're in single step mode
            if (_SingleStepMode) {
                /// Run 1 cycle
                _NextStep = true;
                _CPU.isExecuting = true;
            } /// if
        } /// singleStepISR
        contextSwitchISR() {
            this.krnTrace("Calling dispatcher for context switch");
            _Dispatcher.contextSwitch();
        } /// contextSwitch
        changeQuantumISR(params) {
            this.krnTrace(`Quantum ISR- Quatum was: ${oldDecimalQuanta}, Quantum now: ${_Scheduler.quanta}`);
            var oldDecimalQuanta = params[0];
            var newQuanta = params[1];
            _Scheduler.quanta = newQuanta;
            _StdOut.putText(`Quatum was: ${oldDecimalQuanta}, Quantum now: ${_Scheduler.quanta}`);
            _StdOut.advanceLine();
            _OsShell.putPrompt();
        } /// changeQuantumISR
        runProcessISR(params) {
            /// Arguments: params [curr, args[0]];
            ///     params[0]: is the current position in the resident list the process
            ///                the user specified to "run" was found.
            ///     params[1]: is the pid of the process the user specified to "run"
            ///
            /// TODO: Move if-else to _Schedule.scheduleProcess()
            ///
            /// Process is already running!
            if (_ResidentList.residentList[params[0]].processState === "Running") {
                _StdOut.putText(`Process with pid: ${parseInt(params[1])} is already running!`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            } /// if
            /// Process is already "Terminated"!
            else if (_ResidentList.residentList[params[0]].processState === "Terminated") {
                _StdOut.putText(`Process with pid: ${parseInt(params[1])} already terminated!`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            } /// else-if
            /// Process is already scheduled... "Ready"!
            else if (_ResidentList.residentList[params[0]].processState === "Ready") {
                _StdOut.putText(`Process with pid: ${parseInt(params[1])} is already scheduled!`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            } /// else-if
            /// Schedule the new process
            else {
                /// Schedule the process using round robin
                _Scheduler.scheduleProcess(_ResidentList.residentList[params[0]]);
                /// Now we run it...
                _Scheduler.runSchedule();
            } /// else
        } /// runProcessISR
        runAllProcesesISR() {
            var processWasLoaded = false;
            /// Load the Ready Queue with ALL Loaded Processes so...
            /// Enqueue all NON-TERMINATED, Non-Running, Non-Waiting Processes from the Resident List
            for (var processID = 0; processID < _ResidentList.residentList.length; ++processID) {
                /// Only get Non-Terminated Processes
                if (_ResidentList.residentList[processID].processState === "Resident") {
                    var temp = _Scheduler.scheduleProcess(_ResidentList.residentList[processID]);
                } /// if 
                if (processWasLoaded === false && temp === true) {
                    processWasLoaded = true;
                } /// if
            } /// for
            _Scheduler.runSchedule(processWasLoaded);
        } /// runAllProcessISR
        terminateProcessISR() {
            /// Set current process state to "Terminated" for clean up
            _Scheduler.currentProcess.processState === "Terminated";
            if (_Scheduler.currentProcess.processState === "Terminated" && _Scheduler.readyQueue.getSize() === 0) {
                /// Remove the last process from the Ready Queue
                /// by removing the last process from current process
                _Scheduler.currentProcess = null;
                /// "Turn Off" CPU
                _CPU.isExecuting = false;
                /// Turn "off Single Step"
                _SingleStepMode = false;
                _NextStep = false;
                /// Reset visuals for Single Step
                document.getElementById("btnNextStep").disabled = true;
                document.getElementById("btnSingleStepMode").value = "Single Step ON";
                /// Prompt for more input
                _StdOut.advanceLine();
                _OsShell.putPrompt();
                TSOS.Control.updateVisualPcb();
            } /// if
        } /// terminateProcessISR
        killProcessISR(params) {
            /// Apparently Javascripts tolerance of NaN completly defeats the purpose of using this 
            /// try catch... nice!
            try {
                /// Check if the process exists with basic linear search
                var curr = 0;
                var found = false;
                while (curr < _ResidentList.residentList.length && !found) {
                    if (_ResidentList.residentList[curr].processID == parseInt(params[0][0])) {
                        found = true;
                    } /// if
                    else {
                        curr++;
                    } /// else
                } /// while
                if (!found) {
                    _StdOut.putText(`No process control blocks found with pid: ${parseInt(params[0][0])}.`);
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                } /// if
                /// Process exists in the resident queue
                else {
                    /// Use interrupt to allow for seemless killing of process
                    /// For example:
                    ///     > kill 0
                    ///     ...
                    ///     > kill 2
                    ///     > kill 1
                    /// No matter what order, should still kill process, finishing the schedule...
                    /// Use Single Step to see what's "really" happening...
                    switch (_ResidentList.residentList[curr].processState) {
                        case "Terminated":
                            _StdOut.putText("Process is already Terminated!");
                            _StdOut.advanceLine();
                            break;
                        case "Ready":
                            _StdOut.putText("Ready process removed from Ready Queue!");
                            _StdOut.advanceLine();
                            _ResidentList.residentList[curr].processState = "Terminated";
                            break;
                        case "Running":
                            _StdOut.putText("Running process is now terminated!");
                            _StdOut.advanceLine();
                            _ResidentList.residentList[curr].processState = "Terminated";
                            break;
                        default:
                            _StdOut.putText("Process was not scheduled to run yet!");
                            _StdOut.advanceLine();
                            break;
                    } /// switch
                } /// else
            } /// try
            catch (e) {
                _StdOut.putText(`${e}`);
                _StdOut.putText(`Usage: run <int> please supply a process id.`);
                _OsShell.putPrompt();
            } /// catch
        } /// killProcessISR
        killAllProcessesISR() {
            /// There are scheduled processes to kill
            if (_Scheduler.readyQueue.getSize() > 0 || _Scheduler.currentProcess !== null) {
                /// Mark all process in the schedule queue as terminated
                _Scheduler.currentProcess.processState = "Terminated";
                for (var i = 0; i < _Scheduler.readyQueue.getSize(); ++i) {
                    _Scheduler.readyQueue.getIndex(i).processState = "Terminated";
                } /// for
                // _Scheduler.terminatedAllProcess();
            } /// if
            /// There are no scheduled processes to kill
            else {
                _StdOut.putText("No Proceses were scheduled to run yet!");
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            } /// else
        } /// runAllProcessISR
        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        /// Ahh Now this makes sense...
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile
        ///////////////////////////
        /// OS Utility Routines ///
        ///////////////////////////
        krnTrace(msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would quickly lag the browser quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    } /// if
                } /// if 
                else {
                    TSOS.Control.hostLog(msg, "OS");
                } /// else
            } /// if
        } /// krnTrace
        krnTrapError(msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);
            // TODO: Display error on console, perhaps in some sort of colored screen. (Maybe blue?)
            document.getElementById('bsod').style.visibility = "visible"; /// Making layered image visible
            this.krnShutdown();
        } /// krnTrapError
    } /// Kernel
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {})); /// TSOS
//# sourceMappingURL=kernel.js.map