/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Cpu {
        constructor(PC = 0, IR = "00", Acc = "00", Xreg = "00", Yreg = "00", Zflag = 0, isExecuting = false, localPCB = null) {
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.localPCB = localPCB;
        }
        init() {
            this.PC = 0;
            this.IR = "00";
            this.Acc = "00";
            this.Xreg = "00";
            this.Yreg = "00";
            this.Zflag = 0;
            this.isExecuting = false;
            this.localPCB = null;
        } /// init
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            ///
            /// For Now just wrap the program counter
            /// this.PC = this.PC % MAX_SIMPLE_VOLUME_CAPACITY;
            ///
            /// Only wrap the program counter in the branch
            /// Classic LMC
            var addressData = this.fetch(); /// Fetch()
            this.decode(addressData); ///Decode() and Execute()
        } /// cycle
        /// So far it's either make a global reference or pass the reference for now...
        // public setLocalProcessControlBlock(newProcessControlBlock: ProcessControlBlock) {
        //     this.localPCB = newProcessControlBlock;
        // }/// setLocalProcessControlBlock
        /// Fetch data from memory using the program counter
        fetch() {
            /// Get Data which is already in a hex string...
            var data = "00";
            data = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC);
            /// Put data into the instruction register... just to log what's going on right now
            /// Obviously b/c of the shared stored program concept we won't know that this is necessarily
            /// an instruction or not until it's decoded... 
            ///
            /// Hopefully I rememebr to do this cleaner...
            this.IR = data;
            this.localPCB.instructionRegister = data;
            return data;
        } ///fetch
        /// Decode the instruction... and then execute
        decode(newAddressData) {
            switch (newAddressData) {
                /// Load Accumulator with a constant
                case 'A9':
                    this.ldaAccConstant();
                    break;
                /// Load Accumulator from memory
                case 'AD':
                    this.ldaAccMemory();
                    break;
                /// Store the accumulator in memory
                case '8D':
                    this.staAccMemory();
                    break;
                /// Load X-register with a constant
                case 'A2':
                    this.ldaXConst();
                    break;
                /// Load X-register from memory
                case 'AE':
                    this.ldaXMemory();
                    break;
                /// Load the Y-register with a constant
                case 'A0':
                    this.ldaYConst();
                    break;
                /// Load the Y-register from memory
                case 'AC':
                    this.ldaYMemory();
                    break;
                /// Add with carry
                case '6D':
                    this.addWithCarry();
                    break;
                /// No Operation
                case 'EA':
                    this.nOp();
                    break;
                /// Break (which is really a system call)
                case '00':
                    this.break();
                    break;
                /// Compare a byte in memory to the X register
                ///
                /// Sets the Z(One) flag if equal
                case 'EC':
                    this.cpx();
                    break;
                /// Branch n bytes if z flag = 0
                case 'D0':
                    this.branchZero();
                    break;
                /// Increment the value of a byte
                case 'EE':
                    this.incrementByte();
                    break;
                /// System Call
                case 'FF':
                    this.sysCall();
                    break;
                default:
                    /// Throw error
                    /// Should I crash the OS instead with FATAL Error?
                    _StdOut.putText(`Data: ${newAddressData} could not be decoded into an instruction!`);
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    this.isExecuting = false;
                    break;
            } /// switch
            TSOS.Control.visualizeInstructionRegister(newAddressData);
        } ///decode
        /// My Strategy:
        ///     Go literal line-by-line in a procedural fashion, this
        ///     way no fancy one-liners, it's self documenting
        ///     and hopefully this makes it impossible to mess up...
        /// Load the accumulator with a constant.
        ldaAccConstant() {
            /// Increase the accumulator to read data argument of the constructor
            this.PC++;
            /// Read data from memory 
            ///
            /// Should already be stored in memory as Hex from Shell...
            ///
            /// Read from process control block queue
            this.Acc = TSOS.Control.formatToHexWithPadding(parseInt(_MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC), 16));
            /// Increase the program counter to the next instruction
            ///
            /// I could probably call this after the switch case, but I rather each
            /// instruction method be stand alone.
            this.PC++;
        } /// ldaAccConstant
        /// Load the accumulator from memory.
        ldaAccMemory() {
            /// Adjust for inversion and wrapping
            var wrapAdjustedLogicalAddress = this.getWrapAdjustedLogicalAddress();
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            this.Acc = TSOS.Control.formatToHexWithPadding(parseInt(_MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], wrapAdjustedLogicalAddress), 16));
            /// Increment program counter as usual
            this.PC++;
        } /// ldaAccMem
        /// Store the accumulator in memory
        staAccMemory() {
            /// Adjust for inversion and wrapping
            var wrapAdjustedLogicalAddress = this.getWrapAdjustedLogicalAddress();
            /// This would be too long of a one liner to do
            var formattedHex = TSOS.Control.formatToHexWithPadding(parseInt(this.Acc, 16));
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            _MemoryAccessor.write(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], wrapAdjustedLogicalAddress, formattedHex);
            /// Increment program counter as usual
            this.PC++;
        } /// staAccMemory
        /// Load the X register with a constant
        ldaXConst() {
            /// Increase the accumulator to read data argument of the constructor
            this.PC++;
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            this.Xreg = TSOS.Control.formatToHexWithPadding(parseInt(_MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC), 16));
            /// Increment program counter as usual
            this.PC++;
        } /// loadXConstant
        /// Load the X register from memory
        ldaXMemory() {
            /// Adjust for inversion and wrapping
            var wrapAdjustedLogicalAddress = this.getWrapAdjustedLogicalAddress();
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            this.Xreg = TSOS.Control.formatToHexWithPadding(parseInt(_MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], wrapAdjustedLogicalAddress), 16));
            /// Increment program counter as usual
            this.PC++;
        } /// LoadXMemory
        /// Load the Y register with a constant
        ldaYConst() {
            /// Increase the accumulator to read data argument of the constructor
            this.PC++;
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            this.Yreg = TSOS.Control.formatToHexWithPadding(parseInt(_MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC), 16));
            /// Increment program counter as usual
            this.PC++;
        } /// loadXConstant
        /// Load the Y register from memory
        ldaYMemory() {
            /// Adjust for inversion and wrapping
            var wrapAdjustedLogicalAddress = this.getWrapAdjustedLogicalAddress();
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            this.Yreg = TSOS.Control.formatToHexWithPadding(parseInt(_MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], wrapAdjustedLogicalAddress), 16));
            /// Increment program counter as usual
            this.PC++;
        } /// LoadXMemory
        /// Add with carry
        /// 
        /// Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
        addWithCarry() {
            /// Adjust for inversion and wrapping
            var wrapAdjustedLogicalAddress = this.getWrapAdjustedLogicalAddress();
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            var numberToBeAdded = parseInt(_MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], wrapAdjustedLogicalAddress), 16);
            /// Convert Numbers to decimal for addition
            var accNum = parseInt(this.Acc, 16);
            /// Add numbers
            var ans = numberToBeAdded + accNum;
            /// Conert answer back to hex string
            /// Apply to the calculator
            /// Remeber to formatt though
            this.Acc = TSOS.Control.formatToHexWithPadding(ans);
            /// Increment program counter as usual
            this.PC++;
        } /// addWithCarry
        /// No operation
        nOp() { this.PC++; } /// nOp
        /// Break
        break() {
            /// Process break as an interrupt as well.
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_PROCESS_IRQ, []));
            /// Update the local process state that each
            /// 
            /// The local PCB really just refernces the global PCB in the global PCB queue
            /// So updating the local PCB state is sufficent
            _CPU.localPCB.processState = "Terminated";
            _Scheduler.currentProcess.processState = "Terminated";
        } /// break
        /// Compare a byte in memory to the X reg EC CPX EC $0010 EC 10 00
        /// Sets the Z (zero) flag if equal...
        cpx() {
            /// Adjust for inversion and wrapping
            var wrapAdjustedLogicalAddress = this.getWrapAdjustedLogicalAddress();
            /// Number is converted to decimal
            var memoryNum = parseInt(_MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], wrapAdjustedLogicalAddress), 16);
            var xRegNum = parseInt(this.Xreg, 16);
            /// Set z flag... don't have to worry about the -stupid- conversion
            this.Zflag = xRegNum === memoryNum ? 1 : 0;
            /// OP code was exected, increment program counter as usual
            ///
            /// Again this COULD be done after the switch case in cpu.fetch()
            /// but would rather have each OP Code be self contained.
            this.PC++;
        } ///cpx
        /// Branch n bytes if Z flag = 0
        branchZero() {
            /// Increment the program counter by one to read argument
            this.PC++;
            /// Get n address units to branch by
            ///
            /// Must parse from hex to decimal since everything is stored as hexidecimal strings in memory.
            var nUnits = parseInt(_MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC), 16);
            /// Check if Z-flag is zero
            if (this.Zflag === 0) {
                /// Branch "n" specified addresses units (logical is assumed) in memory.
                this.PC = this.PC + nUnits;
                /// Wrap around memory instead of overflowing for branches
                this.PC = this.PC % MAX_SIMPLE_VOLUME_CAPACITY;
            } /// if
            /// OP code was exected, increment program counter as usual
            /// Regardless of a succesful branch or not,
            ///
            /// Again this COULD be done after the switch case in cpu.fetch()
            /// but would rather have each OP Code be self contained.
            this.PC++;
        } ///branchZero
        /// Increment the value of a byte
        incrementByte() {
            /// Adjust for inversion and wrapping by using getWrapAhjustedLogicalAddress() helper method
            var wrapAdjustedLogicalAddress = this.getWrapAdjustedLogicalAddress();
            /// Actually increment the data by one
            var incrementedNumber = parseInt(_MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], wrapAdjustedLogicalAddress), 16) + 1;
            /// Reformat to Hex
            var paddedFormattedIncrementedNumber = TSOS.Control.formatToHexWithPadding(incrementedNumber);
            /// Take the incremented by one data and write to memory.
            ///
            /// Check [_MemoryAcessor.write()] method for memory boundary protection...
            _MemoryAccessor.write(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], wrapAdjustedLogicalAddress, paddedFormattedIncrementedNumber);
            /// OP code was exected, increment program counter as usual
            ///
            /// Again this COULD be done after the switch case in cpu.fetch()
            /// but would rather have each OP Code be self contained.
            this.PC++;
        } //incrementByte
        sysCall() {
            /// Process handling Y register as an interrupt
            if (parseInt(this.Xreg, 16) === 1) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYS_CALL_IRQ, [1]));
            } /// if
            else if (parseInt(this.Xreg, 16) === 2) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYS_CALL_IRQ, [2]));
            } /// else if
            this.PC++;
        } /// sysCall
        getWrapAdjustedLogicalAddress() {
            /// Read the "first" argument which is really the second
            this.PC++;
            var secondArg = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC);
            /// Read the "second" argument which is really the first
            this.PC++;
            var firstArg = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC);
            /// Deal with the inversion
            var reversedArgs = parseInt(firstArg + secondArg, 16);
            /// I'm assuming these are logical addresses being passed in...
            return reversedArgs;
        } /// getWrapAdjustedLogicalAddress
    } /// Class
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {})); /// Module
//# sourceMappingURL=cpu.js.map