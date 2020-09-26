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

module TSOS {

    export class Cpu {

        constructor(
            public PC: number = 0,
            public IR: string = "00",
            public Acc: string = "00",
            public Xreg: number = 0,
            public Yreg: number = 0,
            public Zflag: number = 0,
            public isExecuting: boolean = false,

            /// So far it's either make a global reference
            /// or pass the reference
            private localPCB: ProcessControlBlock = null) {
        }

        public init(): void {
            this.PC = 0;
            this.IR = "00";
            this.Acc = "00";
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.localPCB = null;
        }/// init

        public cycle(): void {
            /// Add delay to synchronize host log and cpu other wise the cpu just go brrrrrrrrrrrrrrr
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            ///
            /// Classic fetch(), decode(), execute()...
            this.fetch();
            // this.decode(addressData.read());

            /// TODO: Move definitions into Control.ts and call methods in Kernel.OnClockPulse(); or something....
            ///
            /// They are here for now cause by "program logic" this makes sense...
            /// Clearly, they do not belong here as we are trying to model a cpu as close as possible.
            this.updateVisualCpu();
            this.updatePcb();
        }

        public setLocalProcessControlBlock(newProcessControlBlock: ProcessControlBlock) {
            this.localPCB = newProcessControlBlock;
        }/// setLocalProcessControlBlock

        /// Fetch data from memory using the program counter
        public fetch() {
            /// Get Data which is already in a hex string...
            var data: string = "00";
            data = _MemoryAccessor.read(_MemoryManager.simpleVolumes[this.localPCB.volumeIndex], this.PC);

            /// Put data into the instruction register... just to log what's going on right now
            /// Obviously b/c of the shared stored program concept we won't know that this is necessarily
            /// an instruction or not until it's decoded... 
            ///
            /// Hopefully i rememebr to move this
            this.IR = data;
            this.localPCB.instructionRegister = data;

            return data;
        }///fetch

        /// Decode the instruction...
        public decode(newAddressData: string) {
            switch (newAddressData) {
                /// Load Accumulator with a constant
                case 'A9':
                    this.ldaAccConstant();
                    break;

                /// Load Accumulator from memory
                case 'AD':
                    break;

                /// Take what's in the accumulator and put it in memory
                case '8D':
                    break;

                /// Load X-register with a constant
                case 'A2':
                    break;

                /// Load X-register from memory
                case 'AE':
                    break;

                /// Load the Y-register with a constant
                case 'A0':
                    break;

                /// Load the Y-register from memory
                case 'AC':
                    break;

                /// Store the accumulator in memory
                case '8D':
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
                    break;
            }/// switch
        }///decode

        // Loads the accumulator with a constant.
        ldaAccConstant() {
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
        }/// ldaAccConstant


        // //Loads the accumulator with a value from memory.
        // loadAccMem() {
        //     let locationOfValue1 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 1);
        //     let locationOfValue2 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 2);
        //     let newValue = parseInt(locationOfValue2 + locationOfValue1, 16);
        //     this.Acc = parseInt(_MemoryAccessor.read(_CurrentPCB.segment, newValue), 16);
        //     this.PC += 3;
        // }
        // //Stores the accumulator's value in memory.
        // /*The padStart ensures exactly two (2) digits are stored since the accumulator uses number variables (and I did not want to change this in the spirit thereof).
        //     For example, the accumulator only stores '1', but memory needs '01' since the program length matters. The CPU display of '01' is strictly graphical.*/
        // storeInMem() {
        //     let locationOfValue1 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 1);
        //     let locationOfValue2 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 2);
        //     let newValue = parseInt(locationOfValue2 + locationOfValue1, 16);
        //     _MemoryAccessor.write(_CurrentPCB.segment, (this.Acc).toString(16).toUpperCase().padStart(2, "0"), newValue);
        //     this.PC += 3;
        // }
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
        // //Loads the X register with a constant.
        // loadXConst() {
        //     this.Xreg = parseInt(_MemoryAccessor.read(_CurrentPCB.segment, this.PC + 1), 16);
        //     this.PC += 2;
        // }
        // //Loads the X register from memory.
        // loadXMem() {
        //     let locationOfValue1 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 1);
        //     let locationOfValue2 = _MemoryAccessor.read(_CurrentPCB.segment, this.PC + 2);
        //     let newValue = parseInt(locationOfValue2 + locationOfValue1, 16);
        //     this.Xreg = parseInt(_MemoryAccessor.read(_CurrentPCB.segment, newValue), 16);
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

        updateVisualCpu() {
            _visualCpu.rows[1].cells[0].innerHTML = this.PC;
            _visualCpu.rows[1].cells[1].innerHTML = this.IR;
            _visualCpu.rows[1].cells[2].innerHTML = this.Acc;
            _visualCpu.rows[1].cells[3].innerHTML = this.Xreg;
            _visualCpu.rows[1].cells[4].innerHTML = this.Yreg;
            _visualCpu.rows[1].cells[5].innerHTML = this.Zflag;
        }/// createVisualMemory

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
        }/// createVisualMemory

    }/// Class
}/// Module
