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
var TSOS;
(function (TSOS) {
    class Memory {
        constructor(memorySize = 768, addressBlock = []) {
            this.memorySize = memorySize;
            this.addressBlock = addressBlock;
        }
        init() {
            /// Initialize 256 bytes of empty data in memory;
            for (var i = 0; i < this.memorySize; i++) {
                this.addressBlock.push(new TSOS.Address(i));
            } /// for
        } /// init
        /// Returns the address in memory requested by the memoryAccessor
        ///
        /// This is because we need to know if the memory is read enabled,
        /// write enabled, and run enabled, as there is a physical lock in memory
        /// if i remember correctly from gormanly's class
        getAddress(newAddress) {
            return this.addressBlock[newAddress];
        } ///read
        size() { return this.memorySize; }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map