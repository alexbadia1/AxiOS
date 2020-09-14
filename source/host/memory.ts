/* ------------
     Memory.ts
     
     Hopefully, this code models memory at a close hardware level.
     I'm taking a minimalistic approach:
     - The address block is the physical primary memory.
     - Added an abstraction for each physical register in memory
     - Gave memory size as well
    
     Everything else will be done in  MemoryAccess.ts including but not limited to:
     - read
     - write
     - memory metadata
     ------------ */

module TSOS {

    export class Memory {

        constructor(
            public memorySize = 768,
            public addressBlock = new Array()) {}

        public init(): void {
            /// Initialize 256 bytes of empty data in memory;
            for (var i: number = 0; i < this.memorySize; i++) {
                this.addressBlock.push("00");
            }/// for
        } /// init

        /// Returns the address in memory requested by the memoryAccessor
        ///
        /// This is because we need to know if the memory is read enabled,
        /// write enabled, and run enabled, as there is a physical lock in memory
        /// if i remember correctly from gormanly's class
        public getAddress(newAddress: number) {
            return this.addressBlock[newAddress];
        }///read

        public size() { return this.memorySize; }
    }
}

// module TSOS {

//     /// I might be making this up but I thought there were physical lights and "lock gates"
//     /// in memory that would represent read, write, etc access...
//     /// Am I delusional for doing this?
//     export class Address {
//         constructor(
//             public physicalAddress,
//             public data: string = '00',
//             public wLock: boolean = true,
//             public xLock: boolean = false,
//         ) { }
//         public writeLock() { this.wLock = false; }
//         public writeUnlock() { this.wLock = true; }
//         public executeLock() { this.xLock = false; }
//         public executeUnlock() { this.xLock = true; }
//         public getWriteLock() { return this.wLock; }
//         public getExecuteLock() { return this.xLock; }
//         public read() { return this.data }

//         public write(newData: string) {
//             if (this.getWriteLock) {
//                 this.data = newData;
//             } else {
//                 _Kernel.krnTrapError(`Place: ${this.physicalAddress} is WRITE Protected`);
//             }
//         }
//     }
// }