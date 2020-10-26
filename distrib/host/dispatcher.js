/**
 * Now that I've found a FREE PDF version of the textbook, everything makes a little more sense...
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
        constructor() { } /// constructor
        contextSwitch() {
            _Kernel.krnTrace("Switching context...");
            /// if (current process isn't terminated)
            ///     put the process back at the end of the ready queue
            ///
            /// else (current process is terminated)
            ///     let the terminated current process get overwritten by the next process
            ///     dequeud from the ready queue, WITHOUT re-queueing the terminated current process
            ///     effectivley "removing" the terminated current process
            if (_Scheduler.currentProcess.processState !== "Terminated") {
                /// Save current process cpu context
                this.saveOldContextFromCPU(_Scheduler.currentProcess);
                _Kernel.krnTrace(`Releasing process ${_Scheduler.currentProcess.processID} to cpu.`);
                /// Enqueue the current process to end of Ready Queue
                _Scheduler.currentProcess.processState = "Ready";
                _Scheduler.readyQueue.enqueue(_Scheduler.currentProcess);
            } /// if
            /// if (there are more processes)
            ///     dequeue a process from the ready queue and set it as the new "current process"
            ///
            /// else (no more process)
            ///     don't try to deqeueue and process from the ready queue, instead let the current
            ///     process keep running until termination.
            if (_Scheduler.readyQueue.getSize() > 0) {
                /// Dequeue process from front of ready queue
                _Scheduler.currentProcess = _Scheduler.readyQueue.dequeue();
                /// Load CPU context with new process context
                if (_Scheduler.currentProcess.processState !== "Terminated") {
                    _Scheduler.currentProcess.processState = "Running";
                } /// if
                this.setNewProcessToCPU(_Scheduler.currentProcess);
            } /// if
        } /// contextSwitch
        setNewProcessToCPU(newPcb) {
            _Kernel.krnTrace(`Attaching process ${newPcb.processID} to cpu.`);
            _CPU.PC = newPcb.programCounter;
            _CPU.IR = newPcb.instructionRegister;
            _CPU.Acc = newPcb.accumulator;
            _CPU.Xreg = newPcb.xRegister;
            _CPU.Yreg = newPcb.yRegister;
            _CPU.Zflag = newPcb.zFlag;
            _CPU.localPCB = _Scheduler.currentProcess;
        } /// setNewProcessToCPU
        saveOldContextFromCPU(pcb) {
            _Kernel.krnTrace(`Saving process ${pcb.processID} context from cpu.`);
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