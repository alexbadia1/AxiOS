/* ------------
     memoryAccessor.ts
     
    Hopefully read and write are the only thing we'll need...

    TBH, anythin' low-level OS, Compilers, anything CPU invloving "x86 [insert jargon]" 
    is a nightmare for me and that is exactly why I will be in your compilers class next semester
    as well...
     ------------ */

module TSOS {

    export class MemoryAccessor {

        constructor() { }

        read(newVolume, newLogicalAddress) {
            var data = null;

            /// Step 1: Translate the logical address to the physical address in memory
            ///
            /// Should be: logical address + base of partition
            /// I'm pretty sure I'm not off by one....
            var physicalAddress: number = newLogicalAddress + newVolume.physicalBase;

            /// Using said "physical address",
            /// Make sure I can't overflow into other parts of memory
            /// I am very paranoid...
            if ((physicalAddress >= newVolume.limit) || (newLogicalAddress > 255)) {
                _StdOut.putText("Memory Upper Bound Limit Reached, Cannot Read Out of Bounds Address!");
                /// Terminate Program (don't forget to update the PCB process state)
            }///else-if
            else if ((physicalAddress < newVolume.base) || (newLogicalAddress < 0)) {
                _StdOut.putText("Memory Lower Bound Limit Reached, Cannot Read Out of Bounds Address!");
                /// Terminate Program (don't forget to update the PCB process state)
            }///else-if
            else {
                data = _Memory.getAddress(physicalAddress).read();
            }///else
            return data; /// null means an error, anything non-null means it worked (hopefully)
        }/// read


        write(newVolume, newLogicalAddress, newData) {
            var success: number = 0;

            /// Step 1 (Again): Translate the logical address to the physical address in memory
            ///
            /// Should be: logical address + base of partition
            /// I'm pretty sure I'm not off by one....
            var physicalAddress: number = newLogicalAddress + newVolume.physicalBase;

            /// Using said "physical address",
            /// Make sure I can't overflow into other parts of memory
            /// I am very paranoid...

            if ((physicalAddress >= newVolume.physialLimit) || (newLogicalAddress > 255)) {
                _StdOut.putText("Memory Upper Bound Limit Reached, Cannot Write Out of Bounds Address!");
                /// Terminate Program (don't forget to update the PCB process state)
            }///else-if
            else if ((physicalAddress < newVolume.physicalBase) || (newLogicalAddress < 0)) {
                _StdOut.putText("Memory Lower Bound Limit Reached, Cannot Write Out of Bounds Address!");
                /// Terminate Program (don't forget to update the PCB process state)
            }///else-if
            else {
                _Memory.getAddress(physicalAddress).write(newData);
                success = 1;
            }///else
            return success; ///returns 1 if successful, 0 if not successful
        }/// write

        mainMemorySize() {
            return _Memory.size();
        }/// mainMemorySize

        createVisualMemory() {
            /// Increment by 8 on order to create a row every 8 bytes
            for (var physicalAddressRow: number = 0; physicalAddressRow < this.mainMemorySize() / 8; ++physicalAddressRow) {
                var row = _visualMemory.insertRow(physicalAddressRow); /// This multiplication works since all volumes are the cam size

                /// Write to 8 cells
                for (var cellInRow: number = 0; cellInRow < 8; ++cellInRow) {
                    row.insertCell(cellInRow).innerHTML = _Memory.getAddress(physicalAddressRow + cellInRow).read();
                }/// for
            }/// for
        }/// createVisualMemory

        updateVisualMemory() {
            var physicalAddress: number = 0;
            /// Increment by 8 on order to create a row every 8 bytes
            for (var currentRow: number = 0; currentRow < this.mainMemorySize() / 8; ++currentRow) {
                /// Write to 8 cells
                for (var cellInRow: number = 0; cellInRow < 8; ++cellInRow) {
                    _visualMemory.rows[currentRow].cells[cellInRow].innerHTML = _Memory.getAddress(physicalAddress).read();
                    physicalAddress++;
                }/// for
            }/// for
        }/// createVisualMemory
    }
}
