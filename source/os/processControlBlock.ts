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
            public processState: string = 'NEW',
            public processID: number = 0,
            public programCounter = _CPU.PC,
            public xRegister = _CPU.Xreg,
            public yRegister = _CPU.Yreg,
        ) {}

        public init(): void {
        } /// init
    }
}
