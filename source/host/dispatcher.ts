/**
 * Now that I've found a free pdf version of the textbook, everything makes a little more sense...
 * 
 * 5.1.4 Dispatcher
 * Another component involved in the CPU-scheduling function is the dispatcher. The dispatcher 
 * is the module that gives control of the CPU to the process selected by the short-term scheduler. 
 * This function involves the following:
 * 
 *      1.) Switching context
 * 
 *      2.) Switching to user mode
 *          var _Mode: number = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
 * 
 *      3.) Jumping to the proper location in the user program to restart that program
 * 
 * The dispatcher should be as fast as possible, since it is invoked during every
 * process switch. 
 * 
 * DISPATCH LATENCY: The time it takes for the dispatcher to stop one process and
 * start another running is known as the dispatch latency. 
 * 
 * We want to MINIMIZE dispatch latency!
 */

module TSOS {

    export class Dispatcher {

        constructor() {}/// constructor

        public contextSwitch() {
            /// Move current process to end of ready queue
            if (_Scheduler.getCurrentProcessState() !== "Terminated") {
                /// Put the current process in the end
                this.saveOldContextFromCPU(_Scheduler.getCurrentProcess());
                _Scheduler.setCurrentProcessState("Ready");
                _Scheduler.readyQueueEnqueue(_Scheduler.getCurrentProcess());
            }/// if

            if (_Scheduler.readyQueueLength() > 0) {
                /// Grab the process at the front of the queue
                _Scheduler.setCurrentProcess(_Scheduler.readyQueueDequeue());

                /// Load CPU context with new process context
                if (_Scheduler.getCurrentProcessState() !== "Terminated") {
                    _Scheduler.setCurrentProcessState("Running");
                }/// if
                this.setNewProcessToCPU(_Scheduler.getCurrentProcess());
            }/// if
        }/// contextSwitch

        public setNewProcessToCPU(newPcb) {
            _CPU.PC = newPcb.programCounter;
            _CPU.IR = newPcb.instructionRegister;
            _CPU.Acc = newPcb.accumulator;
            _CPU.Xreg = newPcb.xRegister;
            _CPU.Yreg = newPcb.yRegister;
            _CPU.Zflag = newPcb.zFlag;
            _CPU.localPCB = _Scheduler.getCurrentProcess();
        }/// contextSwitch

        public saveOldContextFromCPU(pcb) {
            pcb.programCounter = _CPU.PC;
            pcb.instructionRegister = _CPU.IR;
            pcb.accumulator = _CPU.Acc;
            pcb.xRegister = _CPU.Xreg;
            pcb.yRegister = _CPU.Yreg;
            pcb.zFlag = _CPU.Zflag;
        }/// saveContextFromCPU
    }/// class
}/// module