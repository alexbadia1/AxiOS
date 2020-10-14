/*
residentList.ts

Keeps track of all loaded Process Control Blocks

*/
var TSOS;
(function (TSOS) {
    class ResidentList {
        constructor(residentList = []) {
            this.residentList = residentList;
        } /// constructor
        init() {
            this.residentList = [];
        } /// init
    } /// ProcessControlBlockQueue
    TSOS.ResidentList = ResidentList;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=residentList.js.map