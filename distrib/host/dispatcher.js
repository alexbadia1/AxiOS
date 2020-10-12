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
        constructor() { } /// constructor
        attachPcbToCPU(newPcb) {
            /// Take running process and put back into the Ready Queue, if there is one
            if (_CPU.localPCB !== null) {
                /// Release the pcb from the CPU
                this.releasePcbFromCPU();
                if (_CPU.localPCB.processState === "Terminated") {
                    /// There is a TERMINATED process in the CPU, Hmmm...
                    ///
                    /// TODO: DO NOT put the PCB into the Ready Queue!
                } /// if
                else {
                    /// There is a RUNNING process in the CPU.
                    ///
                    /// TODO: Put PCB at the end of the ready queue
                    _CPU.localPCB.processState = "Ready";
                } /// else
            } /// if
            /// Load CPU context with PCB context
            this.loadNewContextToCPU(newPcb);
            /// Only if the context switch was successful
            /// Begin CPU execution
            ///
            /// Changing Mode is pointless...
            /// _Mode = 1;
            newPcb.processState = "Running";
            _CPU.isExecuting = true;
        } /// attachPcbToCPU
        releasePcbFromCPU() {
            if (_CPU.localPCB !== null) {
                _CPU.isExecuting = false;
                this.saveOldContextFromCPU();
                if (_CPU.localPCB.processState === "Terminated") {
                    /// There is a TERMINATED process in the CPU
                    ///
                    /// DO NOT put back into Ready Queue!
                } /// if
                else {
                    /// There is a RUNNING process in the CPU.
                    _CPU.localPCB.processState = "Ready";
                } /// else
            } /// if
        } /// releasePcbFromCPU
        loadNewContextToCPU(newPcb) {
            _CPU.PC = newPcb.programCounter;
            _CPU.IR = newPcb.instructionRegister;
            _CPU.Acc = newPcb.accumulator;
            _CPU.Xreg = newPcb.xRegister;
            _CPU.Yreg = newPcb.yRegister;
            _CPU.Zflag = newPcb.zFlag;
            /// Since the PCB is passed by reference, the local PCB
            /// and it's contents are still located somewhere..
            ///
            /// Perhaps in the Ready Queue or Process Queue...
            ///
            /// TODO: Hunt It Down. Dead OR Alive....
            _CPU.localPCB = newPcb;
        } /// contextSwitch
        saveOldContextFromCPU() {
            _CPU.localPCB.programCounter = _CPU.PC;
            _CPU.localPCB.instructionRegister = _CPU.IR;
            _CPU.localPCB.accumulator = _CPU.Acc;
            _CPU.localPCB.xRegister = _CPU.Xreg;
            _CPU.localPCB.yRegister = _CPU.Yreg;
            _CPU.localPCB.zFlag = _CPU.Zflag;
        } /// saveContextFromCPU
    } /// class
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {})); /// module
//# sourceMappingURL=dispatcher.js.map