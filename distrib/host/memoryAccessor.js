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
            ///
            /// Had a OFF by ONE error with physicalAddress >= newVolume.physicalLimit
            ///
            /// Thought I did the branching wrong, but the comparison should be:
            /// physicalAddress > neVolume.physicalLimit
            if ((physicalAddress > newVolume.physicalLimit) || (newLogicalAddress > 255)) {
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
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map