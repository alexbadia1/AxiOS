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

module TSOS {
    export class ProcessControlBlock {
        constructor(
            public processID: number = 0,
            public programCounter: number = 0,
            public instructionRegister: string = "00",
            public accumulator: string = "00",
            public xRegister: string = "00",
            public yRegister: string = "00",
            public zFlag: number = 0,
            public priority: number = 0,
            public processState: string = 'New',
            public volumeIndex: number = -1,
            public outputBuffer: string = "",
            public timeSpentExecuting: number = 0,
            public waitTime: number = 0,
        ) { }

        public init(): void {} /// init

        // public getVolumeLocation() {
        //     if (this.volumeIndex !== -1){
        //         var locations: string[] = ["Simple Volume 1", "Simple Volume 2", "Simple Volume 3"];
        //         return locations[this.volumeIndex];
        //     }/// if
        //     else return "ERR: Vol Index: -1";
        // }///getVolumeLocation
    }/// ProcessControlBlock
}/// TSOS