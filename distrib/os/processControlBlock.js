/*
processControlBlock.ts

zmight include:
    - Process ID
    - Process State
    - Program Counter
    - CPU registers
    - CPU scheduling
    - Memory-management information
    - Input/output information
    - List of open files

*/
var TSOS;
(function (TSOS) {
    class ProcessControlBlock {
        constructor(processState = 'NEW', processID = 0, programCounter = _CPU.PC, xRegister = _CPU.Xreg, yRegister = _CPU.Yreg) {
            this.processState = processState;
            this.processID = processID;
            this.programCounter = programCounter;
            this.xRegister = xRegister;
            this.yRegister = yRegister;
        }
        init() {
        } /// init
    }
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map