
// ls	
// read	alan

//
// glados.js - It's for testing. And enrichment.
//

function Glados() {
    this.version = 2112;
    this.delay = 1000;

    this.init = function () {
        var msg = "Hello [subject name here]. Let's test our File System...\n";
        alert(msg);
    };

    this.afterStartup = function () {

        /// format
        _KernelInputQueue.enqueue('f');
        _KernelInputQueue.enqueue('o');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('m');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

        setTimeout(function () { }, this.delay);

        /// create alan
        _KernelInputQueue.enqueue('c');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

        /// write alan "this is a test"
        _KernelInputQueue.enqueue('w');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('\"');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('h');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('\"');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

        // ls
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('s');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);


        // read alan
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('d');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

        /// write alan "this"	
        _KernelInputQueue.enqueue('w');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('\"');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('h');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('\"');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);




        /// read alan
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('d');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);



        /// write alan <random string of 70 numbers [0-9]	
        _KernelInputQueue.enqueue('w');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('\"');
        var min = 0;
        var max = 9;
        for (var i = 0; i < 70; ++i) {
            var randomNum = Math.floor(Math.random() * (max - min + 1) + min);
            _KernelInputQueue.enqueue(`${randomNum}`);
        }/// for
        _KernelInputQueue.enqueue('\"');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);



        // read alan
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('d');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);



        // delete alan... mwuhaha
        _KernelInputQueue.enqueue('d');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);


        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('s');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);


        // read alan
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('d');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

    };

}