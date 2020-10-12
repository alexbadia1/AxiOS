/*
residentList.ts

Keeps track of all loaded Process Control Blocks

*/

module TSOS {
    export class ResidentList {
        constructor(
            public residentList: ProcessControlBlock[] = []
        ) {}/// constructor

        public init(): void {
            this.residentList = [];
        } /// init
    }/// ProcessControlBlockQueue
}