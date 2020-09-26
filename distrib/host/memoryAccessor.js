/* ------------
     memoryAccessor.ts
     
    Hopefully read and write are the only thing we'll need...

    TBH, anythin' low-level OS, Compilers, anything CPU invloving "x86 [insert jargon]"
    is a nightmare for me and that is exactly why I will be in your compilers class next semester
    as well...
     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() { }
        read(newVolume, newLogicalAddress = -1) {
            var myData = null;
            /// Step 1: Translate the logical address to the physical address in memory
            ///
            /// Should be: logical address + base of partition
            /// I'm pretty sure I'm not off by one....
            var physicalAddress = newLogicalAddress + newVolume.physicalBase;
            /// Using said "physical address",
            /// Make sure I can't overflow into other parts of memory
            /// I am very paranoid...
            if ((physicalAddress >= newVolume.physicalLimit) || (newLogicalAddress > 255)) {
                _StdOut.putText("Memory Upper Bound Limit Reached, Cannot Read Out of Bounds Address!");
                /// Terminate Program (don't forget to update the PCB process state)
            } ///else-if
            else if ((physicalAddress < newVolume.physicalBase) || (newLogicalAddress < 0)) {
                _StdOut.putText("Memory Lower Bound Limit Reached, Cannot Read Out of Bounds Address!");
                /// Terminate Program (don't forget to update the PCB process state)
            } ///else-if
            else {
                myData = _Memory.getAddress(physicalAddress).read();
            } ///else
            return myData; /// null means an error, anything non-null means it worked (hopefully)
        } /// read
        write(newVolume, newLogicalAddress, newData) {
            var success = 0;
            /// Step 1 (Again): Translate the logical address to the physical address in memory
            ///
            /// Should be: logical address + base of partition
            /// I'm pretty sure I'm not off by one....
            var physicalAddress = newLogicalAddress + newVolume.physicalBase;
            /// Using said "physical address",
            /// Make sure I can't overflow into other parts of memory
            /// I am very paranoid...
            if ((physicalAddress >= newVolume.physialLimit) || (newLogicalAddress > 255)) {
                _StdOut.advanceLine();
                _StdOut.putText("Memory Upper Bound Limit Reached, Cannot Write Out of Bounds Address!");
                _OsShell.putPrompt();
                /// Terminate Program (don't forget to update the PCB process state)
            } ///else-if
            else if ((physicalAddress < newVolume.physicalBase) || (newLogicalAddress < 0)) {
                _StdOut.advanceLine();
                _StdOut.putText("Memory Lower Bound Limit Reached, Cannot Write Out of Bounds Address!");
                _OsShell.putPrompt();
                /// Terminate Program (don't forget to update the PCB process state)
            } ///else-if
            else {
                _Memory.getAddress(physicalAddress).write(newData);
                success = 1;
            } ///else
            return success; ///returns 1 if successful, 0 if not successful
        } /// write
        mainMemorySize() {
            return _Memory.size();
        } /// mainMemorySize
        initializeVisualMemory() {
            /// Increment by 8 on order to create a row every 8 bytes
            for (var physicalAddressRow = 0; physicalAddressRow < this.mainMemorySize() / 8; ++physicalAddressRow) {
                var row = _visualMemory.insertRow(physicalAddressRow); /// This multiplication works since all volumes are the cam size
                /// Write to 8 cells
                for (var cellInRow = 0; cellInRow < 9; ++cellInRow) {
                    if (cellInRow === 0) {
                        /// Add the row header
                        /// Formating the row headers
                        ///
                        /// Using 8 to calculate the correct decimal starting value of the row
                        var decimalTemp = physicalAddressRow * 8;
                        /// Convert decimal number to a hex base decimal string
                        var hexTemp = decimalTemp.toString(16);
                        /// Add left 0 padding
                        var formattedHexTemp = "000" + hexTemp;
                        formattedHexTemp = formattedHexTemp.substr(formattedHexTemp.length - 3).toUpperCase();
                        /// Add the '0x' universal prefix for base 16 numbers
                        formattedHexTemp = `0x${formattedHexTemp}`;
                        /// Finally put memory into it
                        row.insertCell(cellInRow).innerHTML = formattedHexTemp;
                    } /// if
                    else {
                        /// Add the actual data
                        row.insertCell(cellInRow).innerHTML = _Memory.getAddress(physicalAddressRow + cellInRow).read();
                    } /// else
                } /// for
            } /// for
        } /// intializeVisualMemory
        updateVisualMemory() {
            var physicalAddress = 0;
            /// Increment by 8 on order to create a row every 8 bytes
            for (var currentRow = 0; currentRow < this.mainMemorySize() / 8; ++currentRow) {
                /// Write to 8 cells
                for (var cellInRow = 0; cellInRow < 8; ++cellInRow) {
                    /// Plus one because we don't want to overwrite the row header
                    _visualMemory.rows[currentRow].cells[cellInRow + 1].innerHTML = _Memory.getAddress(physicalAddress).read();
                    physicalAddress++;
                } /// for
            } /// for
        } /// createVisualMemory
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map