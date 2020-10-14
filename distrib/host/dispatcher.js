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
var TSOS;
(function (TSOS) {
    class Dispatcher {
        constructor(oldProcess = null) {
            this.oldProcess = oldProcess;
        } /// constructor
        contextSwitch() {
            /// Move current process to end of ready queue
            if (_Scheduler.currentProcess.processState !== "Terminated") {
                /// Put the current process in the end
                this.saveOldContextFromCPU(_Scheduler.currentProcess);
                _Scheduler.currentProcess.processState = "Ready";
                _Scheduler.readyQueue.push(_Scheduler.currentProcess);
            } /// if
            if (_Scheduler.readyQueue.length > 0) {
                /// Grab the process at the front of the queue
                _Scheduler.currentProcess = _Scheduler.readyQueue.shift();
                /// Load CPU context with new process context
                _Scheduler.currentProcess.processState = "Running";
                this.setNewProcessToCPU(_Scheduler.currentProcess);
            } /// if
        } /// contextSwitch
        setNewProcessToCPU(newPcb) {
            _CPU.PC = newPcb.programCounter;
            _CPU.IR = newPcb.instructionRegister;
            _CPU.Acc = newPcb.accumulator;
            _CPU.Xreg = newPcb.xRegister;
            _CPU.Yreg = newPcb.yRegister;
            _CPU.Zflag = newPcb.zFlag;
            _CPU.localPCB = _Scheduler.currentProcess;
        } /// contextSwitch
        saveOldContextFromCPU(pcb) {
            pcb.programCounter = _CPU.PC;
            pcb.instructionRegister = _CPU.IR;
            pcb.accumulator = _CPU.Acc;
            pcb.xRegister = _CPU.Xreg;
            pcb.yRegister = _CPU.Yreg;
            pcb.zFlag = _CPU.Zflag;
        } /// saveContextFromCPU
    } /// class
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {})); /// module
//# sourceMappingURL=dispatcher.js.map