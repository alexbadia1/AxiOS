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
        constructor(simpleVolumes = [], pcbs = []) {
            this.simpleVolumes = simpleVolumes;
            this.pcbs = pcbs;
        }
        init() {
            /// Generate Memory Volumes
            ///
            /// While there is room in memory for more volumes, keep making volumes
            ///
            /// Calculate how many partitions you can make from memory
            var memorySize = _MemoryAccessor.mainMemorySize();
            var simpleVolumeCapacity = 256;
            while (memorySize > 0) {
                var temp = memorySize;
                /// Well now we effectively lost the volume's capacity worth of memory
                memorySize -= simpleVolumeCapacity;
                /// Create new volume
                /// setting the physical base and physical limit as well
                var newVolume = new SimpleVolume(memorySize, temp - 1, simpleVolumeCapacity);
                newVolume.writeEnabled = true;
                this.simpleVolumes.push(new SimpleVolume(memorySize, temp - 1, simpleVolumeCapacity));
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
                if (this.simpleVolumes[pos].capacity > maxVol) {
                    maxVol = this.simpleVolumes[pos].capacity;
                    maxVolIndex = pos;
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
                if (this.simpleVolumes[pos].capacity < minVol) {
                    minVol = this.simpleVolumes[pos].capacity;
                    minVolIndex = pos;
                } /// if
            } ///for
            return minVolIndex;
        } /// bestFit
        firstFit() {
            /// Loop through the entire list and find the first Write Enabled file...
            ///
            /// Also O(n) time complexity?
            var pos = -1;
            var found = false;
            while (pos < this.simpleVolumes.length && !found) {
                if (this.simpleVolumes[pos].writeEnabled) {
                    found = true;
                } /// if
                else {
                    pos++;
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
        physicalBase, physicalLimit, capacity, readEnabled = true, writeEnabled = true, ExecuteEnabled = false, layout = "Simple", type = 'Basic') {
            this.physicalBase = physicalBase;
            this.physicalLimit = physicalLimit;
            this.capacity = capacity;
            this.readEnabled = readEnabled;
            this.writeEnabled = writeEnabled;
            this.ExecuteEnabled = ExecuteEnabled;
            this.layout = layout;
            this.type = type;
        }
    } /// class
    TSOS.SimpleVolume = SimpleVolume;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map