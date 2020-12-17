var TSOS;
(function (TSOS) {
    /*
     * I might be making this up but I thought there were physical lights and "lock gates"
     * in memory that would represent read, write, etc access...
     * Am I delusional for doing this?
    */
    class Address {
        constructor(physicalAddress, data = '00', wLock = true, xLock = false) {
            this.physicalAddress = physicalAddress;
            this.data = data;
            this.wLock = wLock;
            this.xLock = xLock;
        }
        writeLock() { this.wLock = false; }
        writeUnlock() { this.wLock = true; }
        executeLock() { this.xLock = false; }
        executeUnlock() { this.xLock = true; }
        getWriteLock() { return this.wLock; }
        getExecuteLock() { return this.xLock; }
        read() { return this.data; }
        write(newData) {
            if (this.getWriteLock) {
                this.data = newData;
            }
            else {
                _Kernel.krnTrapError(`Place: ${this.physicalAddress} is WRITE Protected`);
            }
        }
    }
    TSOS.Address = Address;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=addressBlock.js.map