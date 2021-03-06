/*
processControlBlock.ts

Might include:
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
        constructor(processID = 0, programCounter = 0, instructionRegister = "00", accumulator = "00", xRegister = "00", yRegister = "00", zFlag = 0, priority = 1, defaultPriority = 1, isDefaultPriorityInUse = false, processState = 'New', volumeIndex = -1, outputBuffer = "", timeSpentExecuting = 0, waitTime = 0, swapFileName = null) {
            this.processID = processID;
            this.programCounter = programCounter;
            this.instructionRegister = instructionRegister;
            this.accumulator = accumulator;
            this.xRegister = xRegister;
            this.yRegister = yRegister;
            this.zFlag = zFlag;
            this.priority = priority;
            this.defaultPriority = defaultPriority;
            this.isDefaultPriorityInUse = isDefaultPriorityInUse;
            this.processState = processState;
            this.volumeIndex = volumeIndex;
            this.outputBuffer = outputBuffer;
            this.timeSpentExecuting = timeSpentExecuting;
            this.waitTime = waitTime;
            this.swapFileName = swapFileName;
        }
        init() { } /// init
        swapToDefaultPriority() {
            if (!this.isDefaultPriorityInUse) {
                var temp = this.priority;
                this.priority = this.defaultPriority;
                this.defaultPriority = temp;
                this.isDefaultPriorityInUse = true;
            } /// if
        } /// getRoundRobinPriority
        swapToUserPriority() {
            if (this.isDefaultPriorityInUse) {
                var temp = this.defaultPriority;
                this.defaultPriority = this.priority;
                this.priority = temp;
                this.isDefaultPriorityInUse = false;
            } /// if
        } /// getRoundRobinPriority
    } /// ProcessControlBlock
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {})); /// TSOS
//# sourceMappingURL=processControlBlock.js.map