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
            /// Almost forgot Strict comparisons is a thing, says a lot about me (I 
            /// haven't touched python since Into to Programming, I SWEAR)
            ///
            /// TODO: Google frequency of keys and organize based on said frequency:
            /// Check for the UP arrow or DOWN arrow
            /// UP = 38
            /// Down = 40
            if (keyCode === 38 || keyCode === 40) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            } /// else-if
            /// Check for the delete button 
            else if (keyCode === 8) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            } /// else-if
            /// Check for the tab button
            else if (keyCode === 9) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            } ///else-if
            /// Check for english alphabet, upper and lower case
            else if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) {
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                }
                else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } /// else-if
            /// Check for numbers, space or 
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
            } /// else-if
            /// Dealing with shifted special punctuation characters in a specified range
            else if (((keyCode >= 186) && (keyCode <= 191))) {
                /// The normal keycode in range 186-191 was being recognized String.fromCharCode(keyCode)
                /// I'm probably (no, definitely) doing something stupid...
                ///
                /// TODO: Figure out why String.fromKeyCode(); was not working in these higher ranges:
                var specialPunctuations = [':', '+', '<', '_', '>', '?'];
                var normalPunctuations = [';', '=', ',', '-', '.', '/'];
                chr = isShifted ? specialPunctuations[keyCode - 186] : normalPunctuations[keyCode - 186];
                _KernelInputQueue.enqueue(chr);
            } /// else-if
            /// More special punctuation chracters in a slightly different range
            else if ((keyCode >= 219) && (keyCode <= 222)) {
                /// The normal keycode in range 219-222 wasn't being recognized by String.fromCharCode(keyCode)
                /// I'm probably (no, definitely) doing something stupid...
                ///
                /// TODO: Figure out why String.fromKeyCode(); was not working in these higher ranges:
                var moreSpecialPunctuations = ['{', '|', '}', '"'];
                var moreNormalPunctuaions = ['[', '\\', ']', '\''];
                chr = isShifted ? moreSpecialPunctuations[keyCode - 219] : moreNormalPunctuaions[keyCode - 219];
                _KernelInputQueue.enqueue(chr);
            } /// else-if
        } /// krnKbdDispatchKeyPress
    } /// class
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {})); /// module
//# sourceMappingURL=deviceDriverKeyboard.js.map