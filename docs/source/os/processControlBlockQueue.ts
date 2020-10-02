/*
processControlBlock.ts

Keeps track of queued ProcessControlBlocks

*/

module TSOS {
    export class ProcessControlBlockQueue {
        constructor(
            public pcbsQueue: ProcessControlBlock[] = []
        ) { }

        public init(): void {
            this.pcbsQueue = [];
        } /// init
    }/// ProcessControlBlockQueue
}