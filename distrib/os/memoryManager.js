/* ------------
     memoryManager.ts
     
     Hopefully, this code models a memory manager in the OS.
     For now I'm gonna add...
     - partitions
    
     Well after class on Monday September 14, 2020, apparently al we need is a constructor so yeah...
     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor(simpleVolumes = []) {
            this.simpleVolumes = simpleVolumes;
            this.init();
        }
        init() {
            /// Generate Memory Volumes
            ///
            /// While there is room in memory for more volumes, keep making volumes
            ///
            /// Calculate how many partitions you can make from memory
            var memorySize = _MemoryAccessor.mainMemorySize();
            while (memorySize > 0) {
                var temp = memorySize;
                /// Well now we effectively lost the volume's capacity worth of memory
                memorySize -= MAX_SIMPLE_VOLUME_CAPACITY;
                /// Create new volume
                /// setting the physical base and physical limit as well
                var newVolume = new SimpleVolume(memorySize, temp - 1, MAX_SIMPLE_VOLUME_CAPACITY);
                /// Make sure the volume is writeable too
                newVolume.writeUnlock();
                this.simpleVolumes.push(new SimpleVolume(memorySize, temp - 1, MAX_SIMPLE_VOLUME_CAPACITY));
            } ///while
        } /// init
        worstFit() {
            /// Loop through the entire list and find the biggest volume...
            ///
            /// O(n) time complexity?
            var maxVol = this.simpleVolumes[0].capacity;
            var maxVolIndex = -1;
            /// Simple find max (Schwartz taught me this one)
            for (var pos = 0; pos < this.simpleVolumes.length; ++pos) {
                if (this.simpleVolumes[pos].getWriteEnabled()) {
                    if (this.simpleVolumes[pos].capacity > maxVol) {
                        maxVol = this.simpleVolumes[pos].capacity;
                        maxVolIndex = pos;
                    } /// if
                } /// if
            } ///for
            return maxVolIndex;
        } /// worstFit
        bestFit() {
            /// Loop through the entire list and find the smallest volume...
            ///
            /// Also O(n) time complexity?
            var minVol = this.simpleVolumes[0].capacity;
            var minVolIndex = -1;
            /// Simple find min (Schwartz taught me this one too)
            for (var pos = 0; pos < this.simpleVolumes.length; ++pos) {
                if (this.simpleVolumes[pos].getWriteEnabled()) {
                    if (this.simpleVolumes[pos].capacity < minVol) {
                        minVol = this.simpleVolumes[pos].capacity;
                        minVolIndex = pos;
                    } /// if
                } /// if
            } ///for
            return minVolIndex;
        } /// bestFit
        firstFit() {
            /// Loop through the entire list and find the first Write Enabled file...
            ///
            /// Also O(n) time complexity?
            var pos = this.simpleVolumes.length - 1;
            var found = false;
            while (pos >= 0 && !found) {
                if (this.simpleVolumes[pos].getWriteEnabled()) {
                    found = true;
                } /// if
                else {
                    pos--;
                } /// else
            } /// while
            return pos; ///First write enabled volume's position in the list
        } /// firstFit
    } /// class
    TSOS.MemoryManager = MemoryManager;
    /// Brought to you by Microsoft
    class SimpleVolume {
        constructor(
        /// Put the required stuff first, sometimes this matters in other languages, I suck at typescript
        physicalBase, physicalLimit, capacity, readEnabled = true, writeEnabled = true, ExecuteEnabled = false, layout = "Simple", /// Serves allusionary purpose to MS only
        type = 'Basic') {
            this.physicalBase = physicalBase;
            this.physicalLimit = physicalLimit;
            this.capacity = capacity;
            this.readEnabled = readEnabled;
            this.writeEnabled = writeEnabled;
            this.ExecuteEnabled = ExecuteEnabled;
            this.layout = layout;
            this.type = type;
        }
        getWriteEnabled() {
            return this.writeEnabled;
        } /// getWriteEnabled
        writeLock() {
            this.writeEnabled = false;
            /// write lock each individual address
            for (var logicalAddress = 0; logicalAddress < MAX_SIMPLE_VOLUME_CAPACITY; ++logicalAddress) {
                _Memory.getAddress(logicalAddress + this.physicalBase).writeLock();
            } /// for
        } /// writeLock
        writeUnlock() {
            this.writeEnabled = true;
            /// write unlock each individual address
            for (var logicalAddress = 0; logicalAddress < MAX_SIMPLE_VOLUME_CAPACITY; ++logicalAddress) {
                _Memory.getAddress(logicalAddress + this.physicalBase).writeUnlock();
            } /// for
        }
    } /// class
    TSOS.SimpleVolume = SimpleVolume;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map