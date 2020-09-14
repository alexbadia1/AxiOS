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
        constructor(PC = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, isExecuting = false) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            // var addressData: Address = this.fetch();
            // this.decode(addressData.read());
        }
        /// LMC Style...?
        ///
        /// Fetch data from memory using the program counter
        fetch() {
            return _Memory.getAddress(this.PC);
        } ///fetch
        /// Decode the instruction...
        decode(newAddressData) {
            switch (newAddressData) {
                /// Load Accumulator with a constant
                case 'A9':
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
            }
        } ///decode
        /// Execute the instruction
        execute() {
        } ///execute
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map