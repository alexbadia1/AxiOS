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
                _Scheduler.readyQueue.enqueueInterruptOrPcb(_Scheduler.currentProcess);
            } /// if
            /// if (there are more processes)
            ///     dequeue a process from the ready queue and set it as the new "current process"
            ///
            /// else (no more process)
            ///     don't try to deqeueue and process from the ready queue, instead let the current
            ///     process keep running until termination.
            if (_Scheduler.readyQueue.getSize() > 0) {
                /// Dequeue process from front of ready queue
                _Scheduler.currentProcess = _Scheduler.readyQueue.dequeueInterruptOrPcb();
                /// Load CPU context with new process context
                if (_Scheduler.currentProcess.processState !== "Terminated") {
                    _Scheduler.currentProcess.processState = "Running";
                } /// if
                this.setNewProcessToCPU(_Scheduler.currentProcess);
            } /// if
        } /// contextSwitch
        setNewProcessToCPU(newPcb) {
            var segment = -1;
            /// Make sure the process is in memory
            /// I wonder how many people actually write out (pseudocode for) their ideas before programming away...
            /// if (current process is on disk)
            ///     if (ready queue length > 1)
            ///         roll out the process at the end of the ready queue (ready queue length - 1)
            ///     else if (this is the last process)
            ///         roll out any terminated process in memory... maybe automatically roll out processes they terminate?
            ///     Roll in process to memory segment that was rolled out
            if (newPcb.volumeIndex === -1) {
                if (_Scheduler.readyQueue.getSize() > 1) {
                    /// Of the three processes on the disk, choose the one that is closest to the end of the ready queue
                    segment = _Swapper.rollOut(this.victim());
                    /// _StdOut.putText(`Roll Out Segment number: ${segment}`);
                } /// if
                else {
                    var pos = 0;
                    var found = false;
                    while (pos < _ResidentList.residentList.length && !found) {
                        if (_ResidentList.residentList[pos].volumeIndex !== -1 && _ResidentList.residentList[pos].processState === "Terminated") {
                            found = true;
                            segment = _Swapper.rollOut(_ResidentList.residentList[pos]);
                            ///_StdOut.putText(`Roll Out Segment number: ${segment}`);
                        } /// if
                        else {
                            pos++;
                        } /// else
                    } /// while
                    /// If no terminated processes, roll out the first segment
                    if (!found) {
                        var i = 0;
                        var firstProcessFound = false;
                        while (i < _ResidentList.residentList.length && !firstProcessFound) {
                            if (_ResidentList.residentList[i].volumeIndex === 1) {
                                firstProcessFound = true;
                                segment = _Swapper.rollOut(_ResidentList.residentList[i]);
                                ///_StdOut.putText(`Roll Out Segment number: ${segment}`);
                            } /// if
                            else {
                                i++;
                            } /// else
                        } /// while
                    } /// if
                } /// else
                _Swapper.rollIn(newPcb, segment);
                _Swapper.init();
            } /// if
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
        victim() {
            var pos = _Scheduler.readyQueue.getSize() - 1;
            while (pos > 0) {
                var nestedPos = _Scheduler.readyQueue.queues[pos].getSize() - 1;
                while (nestedPos > 0) {
                    if (_Scheduler.readyQueue.queues[pos][nestedPos].volumeIndex != -1) {
                        return _Scheduler.readyQueue.queues[pos][nestedPos];
                    } /// if
                    else {
                        nestedPos--;
                    } /// else
                } /// while
                pos--;
            } /// while
            return null;
        } /// victim
    } /// class
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {})); /// module
//# sourceMappingURL=dispatcher.js.map