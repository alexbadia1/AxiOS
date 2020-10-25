/*
residentList.ts

Keeps track of all loaded Process Control Blocks

*/
var TSOS;
(function (TSOS) {
    class ResidentList {
        constructor(residentList = [], size = 0) {
            this.residentList = residentList;
            this.size = size;
        } /// constructor
        init() {
            this.size = 0;
            this.residentList = [];
        } /// init
    } /// ProcessControlBlockQueue
    TSOS.ResidentList = ResidentList;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=residentList.js.map