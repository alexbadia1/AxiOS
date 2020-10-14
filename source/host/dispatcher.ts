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

        constructor(
            public releasedProcess: ProcessControlBlock = null
        ) {}/// constructor

        public attachNewPcbToCPU() {
            /// Grab the released process from the CPU
            ///
            /// Will be "NULL" if there wasn't a process already in the CPU
            this.releasedProcess = this.releasePcbFromCPU();
    
            /// Load CPU context with new PCB context
            this.loadNewContextToCPU();

            /// Handle the released process, if there was one
            if (this.releasedProcess !== null) {
                if (this.releasedProcess.processState !== "Terminated") {
                    /// Put released process back into end of the Ready Queue ONLY IF it is NOT TERMINATED.
                    _Scheduler.readyQueue.push(this.releasedProcess);
                }/// if
            }/// if
            // else {
            //     if (_Scheduler.currentProcessControlBlock !== null){
            //         if(_Scheduler.currentProcessControlBlock.processState !== "Terminated"){
            //             /// Take currently running process and put it back into the end of the Ready Queue
            //             _Scheduler.currentProcessControlBlock.processState = "Ready";
            //             _Scheduler.readyQueue.push(_Scheduler.currentProcessControlBlock);
            //         }/// if
            //     }/// if
            // }
        }/// attachPcbToCPU

        public releasePcbFromCPU() {
            if (_CPU.localPCB !== null) {
                this.saveOldContextFromCPU();
            }/// if
            return _CPU.localPCB;
        }/// releasePcbFromCPU

        public loadNewContextToCPU() {
            _CPU.PC = _Scheduler.currentProcessControlBlock.programCounter;
            _CPU.IR = _Scheduler.currentProcessControlBlock.instructionRegister;
            _CPU.Acc = _Scheduler.currentProcessControlBlock.accumulator;
            _CPU.Xreg = _Scheduler.currentProcessControlBlock.xRegister;
            _CPU.Yreg = _Scheduler.currentProcessControlBlock.yRegister;
            _CPU.Zflag = _Scheduler.currentProcessControlBlock.zFlag;

            /// Since the PCB is passed by reference, the local PCB
            /// and it's contents are still located somewhere..
            ///
            /// Perhaps in the Ready Queue or Process Queue...
            ///
            /// TODO: Hunt It Down. Dead OR Alive....
            _CPU.localPCB = _Scheduler.currentProcessControlBlock;
        }/// contextSwitch

        public saveOldContextFromCPU() {
            _CPU.localPCB.programCounter = _CPU.PC;
            _CPU.localPCB.instructionRegister = _CPU.IR;
            _CPU.localPCB.accumulator = _CPU.Acc;
            _CPU.localPCB.xRegister = _CPU.Xreg;
            _CPU.localPCB.yRegister = _CPU.Yreg;
            _CPU.localPCB.zFlag = _CPU.Zflag;
        }/// saveContextFromCPU
    }/// class
}/// module