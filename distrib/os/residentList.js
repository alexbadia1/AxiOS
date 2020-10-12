/*
processControlBlock.ts

Keeps track of queued ProcessControlBlocks

*/
var TSOS;
(function (TSOS) {
    class ResidentList {
        constructor(residentList = []) {
            this.residentList = residentList;
        }
        init() {
            this.residentList = [];
        } /// init
    } /// ProcessControlBlockQueue
    TSOS.ResidentList = ResidentList;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=residentList.js.map