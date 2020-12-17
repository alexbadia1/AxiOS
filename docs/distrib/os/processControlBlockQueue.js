/*
processControlBlock.ts

Keeps track of queued ProcessControlBlocks

*/
var TSOS;
(function (TSOS) {
    class ProcessControlBlockQueue {
        constructor(pcbsQueue = []) {
            this.pcbsQueue = pcbsQueue;
        }
        init() {
            this.pcbsQueue = [];
        } /// init
    } /// ProcessControlBlockQueue
    TSOS.ProcessControlBlockQueue = ProcessControlBlockQueue;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlockQueue.js.map