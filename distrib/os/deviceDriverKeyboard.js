/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (keyCode === 38 || keyCode === 40) { /// UP arrow and DOWN arrow
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            if (keyCode === 8) {
                chr = String.fromCharCode(8);
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) {
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                }
                else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57)) || // digits
                (keyCode === 32) || // space
                (keyCode === 13)) { // enter
                var specialCharacters = [')', '!', '@', '#', '$', '%', '^', '&', '*', '('];
                if (isShifted === true && ((keyCode >= 48) && (keyCode <= 57))) {
                    chr = specialCharacters[keyCode - 48]; // Special number character from list.
                }
                else {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            }
            /// Dealing with shifted special punctuation characters in a specified range
            else if (((keyCode >= 186) && (keyCode <= 191))) {
                var specialPunctuations = [':', '+', '<', '_', '>', '?'];
                var normalPunctuations = [';', '=', ',', '-', '.', '/']; /// The normal keycode in range 186-191 was being recognized String.fromCharCode(keyCode)
                if (isShifted === true) {
                    chr = specialPunctuations[keyCode - 186]; // Special punctuation character from list.
                }
                else {
                    chr = normalPunctuations[keyCode - 186];
                }
                _KernelInputQueue.enqueue(chr);
            }
            /// More special punctuation chracters in a slightly different range
            else if ((keyCode >= 219) && (keyCode <= 222)) {
                var moreSpecialPunctuations = ['{', '|', '}', '"'];
                var moreNormalPunctuaions = ['[', '\\', ']', '\'']; /// The normal keycode in range 219-222 was being recognized by String.fromCharCode(keyCode)
                if (isShifted == true) {
                    chr = moreSpecialPunctuations[keyCode - 219]; // More Special puntuation character from list.
                }
                else {
                    chr = moreNormalPunctuaions[keyCode - 219];
                }
                _KernelInputQueue.enqueue(chr);
            }
        }
    }
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map