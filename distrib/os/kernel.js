/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        krnBootstrap() {
            TSOS.Control.hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.
            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.
            // Initialize the console.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.
            _Console.init();
            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;
            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard(); // Construct it.
            _krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);
            //
            // ... more?
            //
            _MemoryManager = new TSOS.MemoryManager();
            /// Visualize Memory...
            TSOS.Control.initializeVisualMemory();
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();
            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }
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
        }
        krnOnCPUClockPulse() {
            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.
            */
            // Check for an interrupt, if there are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO (maybe): Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            }
            else if (_CPU.isExecuting) {
                /// Perform One Single Step
                if (_SingleStepMode) {
                    if (_NextStep) {
                        _CPU.cycle();
                        TSOS.Control.updateVisualMemory();
                        TSOS.Control.updateVisualCpu();
                        TSOS.Control.updateVisualPcb();
                        _NextStep = false;
                    } /// if
                } /// if
                else {
                    /// Run normally
                    _CPU.cycle();
                    TSOS.Control.updateVisualMemory();
                    TSOS.Control.updateVisualCpu();
                    TSOS.Control.updateVisualPcb();
                } /// else
                this.getCurrentDateTime();
            }
            else {
                /// If there are no interrupts and there is nothing being executed then just be idle.
                this.getCurrentDateTime();
                this.krnTrace("Idle");
            }
        }
        /// Hopefully Updates the Date and Time
        getCurrentDateTime() {
            var current = new Date();
            var day = String(current.getDate()).padStart(2, '0');
            var month = String(current.getMonth()).padStart(2, '0');
            var year = String(current.getFullYear()).padStart(2, '0');
            var hours = String(current.getHours()).padStart(2, '0');
            var minutes = String(current.getMinutes()).padStart(2, '0');
            var seconds = String(current.getSeconds()).padStart(2, '0');
            document.getElementById('divLog--date').innerText = `${month}/${day}/${year}/`;
            document.getElementById('divLog--time').innerText = `${hours}:${minutes}:${seconds}`;
        } /// getCurrentDateTime
        //
        // Interrupt Handling
        //
        krnEnableInterrupts() {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }
        krnDisableInterrupts() {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }
        krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);
            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR(); // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case TERMINATE_PROCESS_IRQ:
                    this.terminateProcessISR();
                    break;
                case SYS_CALL_IRQ:
                    this.sysCallISR();
                    break;
                case SINGLE_STEP:
                    this.singleStepISR();
                    break;
                case NEXT_STEP:
                    this.nextStepISR();
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            } /// switch
        } /// krnInterruptHandler
        singleStepISR() {
            /// Enter Single step mode...
            /// Or out of single step mode
            _SingleStepMode = !_SingleStepMode;
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
        terminateProcessISR() {
            /// TDOO: "Turn off" cpu
            _CPU.isExecuting = false;
            /// TODO: Update PCB State
            _CPU.localPCB.processState = "Terminated";
            TSOS.Control.updateVisualPcb();
            /// TODO: Turn "off Single Step"
            _SingleStepMode = false;
            _NextStep = false;
            /// Reset visuals for Single Step
            document.getElementById("btnNextStep").disabled = true;
            document.getElementById("btnSingleStepMode").value = "Single Step OFF";
            document.getElementById("btnSingleStepMode").innerHTML = "Single Step ON";
            /// TODO: Prompt for more input
            _StdOut.advanceLine();
            _OsShell.putPrompt();
        } /// terminateProcessISR
        sysCallISR() {
            /// Print out the Y-reg if X-reg has 01
            if (parseInt(_CPU.Xreg, 16) === 1) {
                _StdOut.putText(` ${_CPU.Yreg} `);
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
            } /// if
        } /// sysCallISR
        krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
            // Or do it elsewhere in the Kernel. We don't really need this.
        }
        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
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
        //
        // OS Utility Routines
        //
        krnTrace(msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would quickly lag the browser quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    }
                }
                else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        }
        krnTrapError(msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);
            // TODO: Display error on console, perhaps in some sort of colored screen. (Maybe blue?)
            document.getElementById('bsod').style.visibility = "visible"; /// Making layered image visible
            this.krnShutdown();
        }
    }
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=kernel.js.map