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

module TSOS {

    export class Dispatcher {

        constructor() { }/// constructor

        public contextSwitch() {
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
            }/// if

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
                }/// if
                this.setNewProcessToCPU(_Scheduler.currentProcess);
            }/// if
        }/// contextSwitch

        public setNewProcessToCPU(newPcb) {
            var segment: number = -1;

            /// Make sure the process is in memory
            /// I wonder how many people actually write out (pseudocode for) their ideas before programming away...
            /// if (current process is on disk)
            ///     if (ready queue length > 1)
            ///         roll out the process at the end of the ready queue (ready queue length - 1)
            ///     else if (this is the last process)
            ///         roll out any terminated process in memory... maybe automatically roll out processes they terminate?
            ///     Roll in process to memory segment that was rolled out
            if (newPcb.volumeIndex === -1) {
                var numProcessesInMemory: number = 0;
                var pos: number = 0;

                /// See how many process are in memory
                while (pos < _ResidentList.residentList.length && numProcessesInMemory < 3) {
                    if (_ResidentList.residentList[pos].volumeIndex >= 0 && _ResidentList.residentList[pos].volumeIndex <= 2) {
                        numProcessesInMemory++;
                    }/// if
                    pos++;
                }/// for

                switch (numProcessesInMemory) {
                    case 0:
                        /// No processes in memory, roll into first segment
                        _Swapper.rollIn(newPcb, 0);
                        _Swapper.init();
                        break;
                    case 1:
                        /// One process in memory, roll into second segment
                        _Swapper.rollIn(newPcb, 1);
                        _Swapper.init();
                        break;
                    case 2:
                        /// Second process in memory, roll into third segment
                        _Swapper.rollIn(newPcb, 2);
                        _Swapper.init();
                        break;
                    default:
                        /// Memory is full, pick a victim
                        ///
                        /// Processes to be rolled out
                        if (_Scheduler.readyQueue.getSize() > 1) {
                            /// Of the three processes on the disk, choose the one that is closest to the end of the ready queue
                            // _StdOut.putText(`${this.victim()}`);
                            segment = _Swapper.rollOut(this.victim());
                            /// _StdOut.putText(`Roll Out Segment number: ${segment}`);
                        }/// if
                        else {
                            var pos: number = 0;
                            var found: boolean = false;
                            while (pos < _ResidentList.residentList.length && !found) {
                                if (_ResidentList.residentList[pos].volumeIndex !== -1 && _ResidentList.residentList[pos].processState === "Terminated") {
                                    found = true;
                                    segment = _Swapper.rollOut(_ResidentList.residentList[pos]);
                                    ///_StdOut.putText(`Roll Out Segment number: ${segment}`);
                                }/// if
                                else {
                                    pos++;
                                }/// else
                            }/// while

                            /// If no terminated processes, roll out the first segment
                            if (!found) {
                                var i: number = 0;
                                var firstProcessFound: boolean = false;
                                while (i < _ResidentList.residentList.length && !firstProcessFound) {
                                    if (_ResidentList.residentList[i].volumeIndex === 1) {
                                        firstProcessFound = true;
                                        segment = _Swapper.rollOut(_ResidentList.residentList[i]);
                                        ///_StdOut.putText(`Roll Out Segment number: ${segment}`);
                                    }/// if
                                    else {
                                        i++;
                                    }/// else
                                }/// while
                            }/// if
                        }/// else
                        _Swapper.rollIn(newPcb, segment);
                        _Swapper.init();
                        break;
                }/// switch
            }/// if

            _Kernel.krnTrace(`Attaching process ${newPcb.processID} to cpu.`);
            _CPU.PC = newPcb.programCounter;
            _CPU.IR = newPcb.instructionRegister;
            _CPU.Acc = newPcb.accumulator;
            _CPU.Xreg = newPcb.xRegister;
            _CPU.Yreg = newPcb.yRegister;
            _CPU.Zflag = newPcb.zFlag;
            _CPU.localPCB = _Scheduler.currentProcess;
        }/// setNewProcessToCPU

        public saveOldContextFromCPU(pcb) {
            _Kernel.krnTrace(`Saving process ${pcb.processID} context from cpu.`);
            pcb.programCounter = _CPU.PC;
            pcb.instructionRegister = _CPU.IR;
            pcb.accumulator = _CPU.Acc;
            pcb.xRegister = _CPU.Xreg;
            pcb.yRegister = _CPU.Yreg;
            pcb.zFlag = _CPU.Zflag;
        }/// saveContextFromCPU

        public victim(): ProcessControlBlock {
            var max: number = -1;
            var lastQueue: Queue = null;
            // _StdOut.putText(`Ready queue size: ${_Scheduler.readyQueue.queues.length}`)
            for (var i = 1 + Math.floor(_Scheduler.readyQueue.queues.length / 2); i < _Scheduler.readyQueue.queues.length; ++i) {
                if (_Scheduler.readyQueue.getIndex(i).priority > max) {
                    max = _Scheduler.readyQueue.getIndex(i).priority;
                    lastQueue = _Scheduler.readyQueue.getIndex(i);
                }/// if
            }/// for

            return lastQueue.getIndex(lastQueue.getSize() - 1);
        }/// victim
    }/// class
}/// module