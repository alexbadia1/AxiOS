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

module TSOS {
    export class ProcessControlBlock {
        constructor(
            public processID: number = 0,
            public programCounter = _CPU.PC,
            public instructionRegister = _CPU.IR,
            public accumulator = _CPU.Acc,
            public xRegister = _CPU.Xreg,
            public yRegister = _CPU.Yreg,
            public zFlag = _CPU.Zflag,
            public priority: number = 0,
            public processState: string = 'NEW',
            public volumeIndex: number = -1,
        ) { }

        public init(): void {
        } /// init

        public getLocation() {
            if (this.volumeIndex !== -1){
                var locations: string[] = ["Simple Volume 1", "Simple Volume 2", "Simple Volume 3"];
                return locations[this.volumeIndex];
            }
            else return "ERR: Vol Index: -1";
        }
    }/// ProcessControlBlock
}