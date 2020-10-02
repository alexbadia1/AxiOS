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
        constructor(processID = 0, programCounter = _CPU.PC, instructionRegister = _CPU.IR, accumulator = _CPU.Acc, xRegister = _CPU.Xreg, yRegister = _CPU.Yreg, zFlag = _CPU.Zflag, priority = 0, processState = 'NEW', volumeIndex = -1) {
            this.processID = processID;
            this.programCounter = programCounter;
            this.instructionRegister = instructionRegister;
            this.accumulator = accumulator;
            this.xRegister = xRegister;
            this.yRegister = yRegister;
            this.zFlag = zFlag;
            this.priority = priority;
            this.processState = processState;
            this.volumeIndex = volumeIndex;
        }
        init() {
        } /// init
        getLocation() {
            if (this.volumeIndex !== -1) {
                var locations = ["Simple Volume 1", "Simple Volume 2", "Simple Volume 3"];
                return locations[this.volumeIndex];
            }
            else
                return "ERR: Vol Index: -1";
        }
    } /// ProcessControlBlock
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map