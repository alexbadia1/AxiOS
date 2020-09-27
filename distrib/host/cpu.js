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
        constructor(PC = 0, IR = "00", Acc = "00", Xreg = "00", Yreg = "00", Zflag = "00", isExecuting = false, 
        /// So far it's either make a global reference
        /// or pass the reference
        localPCB = null) {
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
            this.Zflag = "00";
            this.isExecuting = false;
            this.localPCB = null;
        } /// init
        cycle() {
            /// Add delay to synchronize host log and cpu other wise the cpu just go brrrrrrrrrrrrrrr
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            ///
            /// Classic fetch(), decode(), execute()...
            var addressData = this.fetch();
            /// Decode using a giant switch case
            this.decode(addressData);
            /// TODO: Move definitions into Control.ts and call methods in Kernel.OnClockPulse(); or something....
            ///
            /// They are here for now cause by "program logic" this makes sense...
            /// Clearly, they do not belong here as we are trying to model a cpu as close as possible.
            this.updateVisualCpu();
            this.updatePcb();
            _MemoryAccessor.updateVisualMemory();
            this.isExecuting = false;
            /// Call clock pulse
            // Increment the hardware (host) clock
        }
        setLocalProcessControlBlock(newProcessControlBlock) {
            this.localPCB = newProcessControlBlock;
        } /// setLocalProcessControlBlock
        /// Fetch data from memory using the program counter
        fetch() {
            /// Get Data which is already in a hex string...
            var data = "00";
            data = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC);
            /// Put data into the instruction register... just to log what's going on right now
            /// Obviously b/c of the shared stored program concept we won't know that this is necessarily
            /// an instruction or not until it's decoded... 
            ///
            /// Hopefully i rememebr to move this
            this.IR = data;
            this.localPCB.instructionRegister = data;
            return data;
        } ///fetch
        /// Decode the instruction...
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
                    break;
                /// No Operation
                case 'EA':
                    break;
                /// Break (which is really a system call)
                case '00':
                    break;
                /// Compare a byte in memory to the X register
                ///
                /// Sets the Z(zero) flag if equal
                case 'EC':
                    break;
                /// Branch n bytes if z flag = 0
                case 'D0':
                    break;
                /// Increment the value of a byte
                case 'EE':
                    break;
                /// System Call
                case 'FF':
                    /// 
                    break;
                default:
                    /// Throw error
                    _StdOut.putText(`Data: ${newAddressData} could not be decoded into an instruction!`);
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    this.isExecuting = false;
                    break;
            } /// switch
        } ///decode
        /// Load the accumulator with a constant.
        ldaAccConstant() {
            this.visualizeInstructionRegister('A9');
            /// Increase the accumulator to read data argument of the constructor
            this.PC += 1;
            /// Read data from memory 
            ///
            /// Should already be stored in memory as Hex from Shell...
            ///
            /// Read from process control block queue
            this.Acc = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC);
            /// Increase the program counter to the next instruction
            ///
            /// I could probably call this after the switch case, but I rather each
            /// instruction method be stand alone.
            this.PC += 1;
        } /// ldaAccConstant
        /// Load the accumulator from memory.
        ldaAccMemory() {
            this.visualizeInstructionRegister('AD');
            /// Adjust for inversion and wrapping
            var wrapAdjustedLogicalAddress = this.getWrapAdjustedLogicalAddress();
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            this.Acc = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], wrapAdjustedLogicalAddress);
            /// Increment program counter as usual
            this.PC += 1;
        } /// ldaAccMem
        /// Store the accumulator in memory
        staAccMemory() {
            this.visualizeInstructionRegister('8D');
            /// Adjust for inversion and wrapping
            var wrapAdjustedLogicalAddress = this.getWrapAdjustedLogicalAddress();
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            _MemoryAccessor.write(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], wrapAdjustedLogicalAddress, this.Acc);
            /// Increment program counter as usual
            this.PC += 1;
        } /// staAccMemory
        /// Load the X register with a constant
        ldaXConst() {
            this.visualizeInstructionRegister('A2');
            /// Increase the accumulator to read data argument of the constructor
            this.PC += 1;
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            this.Xreg = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC);
            /// Increment program counter as usual
            this.PC += 1;
        } /// loadXConstant
        /// Load the X register from memory
        ldaXMemory() {
            this.visualizeInstructionRegister('AE');
            /// Adjust for inversion and wrapping
            var wrapAdjustedLogicalAddress = this.getWrapAdjustedLogicalAddress();
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            this.Xreg = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], wrapAdjustedLogicalAddress);
            /// Increment program counter as usual
            this.PC += 1;
        } /// LoadXMemory
        /// Load the Y register with a constant
        ldaYConst() {
            this.visualizeInstructionRegister('A0');
            /// Increase the accumulator to read data argument of the constructor
            this.PC += 1;
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            this.Yreg = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC);
            /// Increment program counter as usual
            this.PC += 1;
        } /// loadXConstant
        /// Load the Y register from memory
        ldaYMemory() {
            this.visualizeInstructionRegister('AC');
            /// Adjust for inversion and wrapping
            var wrapAdjustedLogicalAddress = this.getWrapAdjustedLogicalAddress();
            /// Actually read from memory using the wrapped logical address that is also adjusted for inversion
            this.Yreg = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], wrapAdjustedLogicalAddress);
            /// Increment program counter as usual
            this.PC += 1;
        } /// LoadXMemory
        // //Adds a value to the accumulator. If the value is greater than 255, it 'rolls over' to 0 + remainder.
        // addWCarry() {
        //     let locationOfValue1 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 1);
        //     let locationOfValue2 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 2);
        //     let newValue = parseInt(locationOfValue2 + locationOfValue1, 16);
        //     let toAdd = parseInt(_MemoryAccessor.read(_CurrentPCB.segment, newValue), 16);
        //     this.Acc += toAdd;
        //     if (this.Acc >= 256)
        //         this.Acc %= 256;
        //     this.PC += 3;
        // }
        // //Loads the Y register with a constant.
        // loadYConst() {
        //     this.Yreg = parseInt(_MemoryAccessor.read(_CurrentPCB.segment, this.PC + 1), 16);
        //     this.PC += 2;
        // }
        // //Loads the Y register from memory.
        // loadYMem() {
        //     let locationOfValue1 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 1);
        //     let locationOfValue2 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 2);
        //     let newValue = parseInt(locationOfValue2 + locationOfValue1, 16);
        //     this.Yreg = parseInt(_MemoryAccessor.read(_CurrentPCB.segment, newValue), 16);
        //     this.PC += 3;
        // }
        // //Compares a value in memory with the X register. If it's true, set the Zflag.
        // compXMem() {
        //     let locationOfValue1 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 1);
        //     let locationOfValue2 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 2);
        //     let newValue = parseInt(locationOfValue2 + locationOfValue1, 16);
        //     let toCompare = parseInt(_MemoryAccessor.read(_CurrentPCB.segment, newValue), 16);
        //     if (this.Xreg == toCompare)
        //         this.Zflag = 1;
        //     else
        //         this.Zflag = 0;
        //     this.PC += 3;
        // }
        // //Branches to a value in memory if the Zflag is false (0).
        // branchOnZ() {
        //     if (this.Zflag == 0) {
        //         this.PC += parseInt(_MemoryAccessor.read(_CurrentPCB.segment, this.PC + 1), 16);
        //         this.PC += 2;
        //         this.PC %= 256;
        //     }
        //     else
        //         this.PC += 2;
        // }
        // //Increment the value of a byte in memory by 1.
        // incByte() {
        //     let locationOfValue1 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 1);
        //     let locationOfValue2 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 2);
        //     let newValue = parseInt(locationOfValue2 + locationOfValue1, 16);
        //     let toIncrement = parseInt(_MemoryAccessor.read(_CurrentPCB.segment, newValue), 16) + 1;
        //     _MemoryAccessor.write(_CurrentPCB.segment, (toIncrement.toString(16).toUpperCase() + "").padStart(2, "0"), newValue);
        //     this.PC += 3;
        // }
        getWrapAdjustedLogicalAddress() {
            /// Read the "first" argument which is really the second
            this.PC += 1;
            var secondArg = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC);
            /// Read the "second" argument which is really the first
            this.PC += 1;
            var firstArg = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC);
            /// Deal with the inversion
            var reversedArgs = parseInt(firstArg + secondArg, 16);
            /// I'm assuming these are logical addresses being passed in...
            ///
            /// If I remember you want a wrap around effect so use modulo then...
            return reversedArgs % MAX_SIMPLE_VOLUME_CAPACITY;
        }
        //////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////// TODO: Move UI methods to Control.ts /////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////
        updateVisualCpu() {
            _visualCpu.rows[1].cells[0].innerHTML = this.PC;
            _visualCpu.rows[1].cells[1].innerHTML = this.IR;
            _visualCpu.rows[1].cells[2].innerHTML = this.Acc;
            _visualCpu.rows[1].cells[3].innerHTML = this.Xreg;
            _visualCpu.rows[1].cells[4].innerHTML = this.Yreg;
            _visualCpu.rows[1].cells[5].innerHTML = this.Zflag;
        } /// createVisualMemory
        updatePcb() {
            _visualPcb.rows[1].cells[0].innerHTML = this.localPCB.processID;
            _visualPcb.rows[1].cells[1].innerHTML = this.localPCB.programCounter;
            _visualPcb.rows[1].cells[2].innerHTML = this.localPCB.instructionRegister;
            _visualPcb.rows[1].cells[3].innerHTML = this.localPCB.accumulator;
            _visualPcb.rows[1].cells[4].innerHTML = this.localPCB.xRegister;
            _visualPcb.rows[1].cells[5].innerHTML = this.localPCB.yRegister;
            _visualPcb.rows[1].cells[6].innerHTML = this.localPCB.zFlag;
            _visualPcb.rows[1].cells[7].innerHTML = this.localPCB.priority;
            _visualPcb.rows[1].cells[8].innerHTML = this.localPCB.processState;
            _visualPcb.rows[1].cells[9].innerHTML = `Vol ${this.localPCB.volumeIndex}`;
        } /// createVisualMemory
        visualizeInstructionRegister(newInsruction) {
            this.IR = newInsruction;
            this.localPCB.instructionRegister = newInsruction;
        } /// visualizeInstructionRegiste
    } /// Class
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {})); /// Module
//# sourceMappingURL=cpu.js.map