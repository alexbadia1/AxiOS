/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        constructor(lineWrapPadding = new Array(), olderCommands = new Array(), newerCommands = new Array(), olderImages = new Array(), newerImages = new Array(), currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 0, currentYPosition = _DefaultFontSize, buffer = "") {
            this.lineWrapPadding = lineWrapPadding;
            this.olderCommands = olderCommands;
            this.newerCommands = newerCommands;
            this.olderImages = olderImages;
            this.newerImages = newerImages;
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
        } /// constructor
        init() {
            this.clearScreen();
            this.resetXY();
        } /// init
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        } /// clearScreen
        resetXY() {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        } /// resetXY
        putX(position = 0) {
            this.currentXPosition = position;
        } /// This is getting to tiring
        handleInput() {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                ///
                /// Pause the cpu
                if (chr === 'alt-H') {
                    TSOS.Control.hostLog("Emergency halt", "host");
                    TSOS.Control.hostLog("Attempting Kernel shutdown.", "host");
                    // Call the OS shutdown routine.
                    _Kernel.krnShutdown();
                    // Stop the interval that's simulating our clock pulse.
                    clearInterval(_hardwareClockID);
                } /// if
                else if (chr === '^C') {
                    if (_CPU.isExecuting) {
                        /// Queue an interrupt for termination of the program
                        _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(KILL_ALL_PROCESSES_IRQ, []));
                        this.eraseText();
                        this.putText("^c");
                    } /// if
                    else {
                        /// Just do what MS does
                        this.eraseText();
                        this.putText("^c");
                        this.advanceLine();
                        _OsShell.putPrompt();
                    } /// else
                } /// else-if
                else if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    //Store whatever the user typed in a stack of "commands"
                    this.olderCommands.push(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                } /// else- if
                /// Handle Tab
                else if (chr === String.fromCharCode(9)) {
                    /// Use something advanced like a trie...?
                    /// I'm just gonna loop through a list...
                    ///
                    /// Rather not include "bsod", yah know... the command that crashes the OS.
                    var cmds = [
                        'ver',
                        'help',
                        'shutdown',
                        'cls',
                        'man',
                        'trace',
                        'rot13',
                        'prompt',
                        'date',
                        'whereami',
                        'eightball',
                        'status',
                        'load',
                        'run',
                        'clearmem',
                        'runall',
                        'ps',
                        'kill',
                        'killall',
                        'quantum',
                        'format'
                    ];
                    var matches = [];
                    for (var pos = 0; pos < cmds.length; ++pos) {
                        if (cmds[pos].startsWith(this.buffer)) {
                            matches.push(cmds[pos]);
                        } /// if
                    } /// for
                    /// If there's only one matching command, replace current buffer
                    /// and text with the new command
                    if (matches.length === 1) {
                        this.eraseText();
                        this.putText(matches[0]);
                        this.buffer = matches[0];
                    } /// if
                    /// If there's multiple matching commands print out said matching commands
                    else {
                        this.eraseText();
                        this.advanceLine();
                        this.putText("The most similar command is:");
                        this.advanceLine();
                        for (var num = 0; num < matches.length; ++num) {
                            this.putText(`  ${matches[num]}`);
                            this.advanceLine();
                        } /// for
                        _OsShell.putPrompt();
                    } /// else
                } /// else-if
                /// Basically have one stack hold the old commands, LIFO is important to keep the order of commands correct
                else if (chr === String.fromCharCode(38)) {
                    /// Arrow UP so start getting the the older commands
                    if (this.olderCommands.length > 0) {
                        if (this.newerCommands.length > 10) {
                            this.newerCommands.unshift();
                        } /// if
                        /// Step 1: Push whatever is typed so far (the current buffer) to the "newer" commands stack.
                        this.newerCommands.push(this.buffer);
                        /// Step 2: Pop whateverver command is in the "older" command stack.
                        var olderCommand = this.olderCommands.pop();
                        /// Step 3: Update the buffer and Canvas with the old command
                        ///
                        /// Must do this before we lose what was in the buffer
                        this.eraseText();
                        /// Don't forget to OVER WRITE what you need
                        this.putText("" + olderCommand);
                        this.buffer = olderCommand;
                    } //if
                } /// else-if
                /// Have this stack hold the newer commands, keep the order of commands correct
                else if (chr === String.fromCharCode(40)) {
                    /// Arrow DOWN so start getting the more recent commands
                    if (this.newerCommands.length > 0) {
                        if (this.olderCommands.length > 10) {
                            this.olderCommands.unshift();
                        } /// if
                        /// Step 1: Push whatever is typed so far (the current buffer) to the "older" commands stack.
                        this.olderCommands.push(this.buffer);
                        /// Step 2: Pop whateverver command is in the "newer" command stack.
                        var newerCommand = this.newerCommands.pop();
                        /// Step 3: Update the buffer and Canvas with the old command
                        ///
                        /// Must do this before we lose what was in the buffer
                        this.eraseText();
                        /// TODO: Don't forget to OVER WRITE what you need
                        this.putText("" + newerCommand);
                        this.buffer = newerCommand;
                    } //if
                } ///else-if
                /// Erase Character
                else if (chr === String.fromCharCode(8)) {
                    this.eraseChar();
                } ///else-if
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    if (chr === String.fromCharCode(32)) {
                        this.putText(" ");
                    } /// if
                    else {
                        this.putText(chr.trim());
                    } /// else
                    // ... and add it to our buffer.
                    this.buffer += chr;
                } /// else
            } /// while
        } /// handleInput
        eraseChar() {
            if (this.buffer.length > 0) {
                /// Check for line wrap,
                /// Chose 4 as the threshold to give room for rounding errors when deleting letters.
                ///
                /// Why 4? 
                /// Because it's my lucky number! (And the smallest letter is 8 pixels long)
                ///
                /// This prevents me from deleting the last letter on the line but the X position is still not
                /// of the canvas yet.
                ///
                /// Length of a space is...
                if (this.currentXPosition <= 4 + INDENT_NUMBER) {
                    this.reverseLineWrap();
                } /// if
                /// Instead of using text, just want to measure a single character from my buffer
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.slice(this.buffer.length - 1)); /// Can I use negative indexes...?. PLEASE.... YES!
                /// Must move the X and Y positions back and up
                var moveXback = this.currentXPosition - offset;
                var moveYback = this.currentYPosition - (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin) + 4;
                /// Hopefully this will be a big enough box to delete the character
                ///
                /// Dunno why the 4 works, but 4 works (probably because of the screen resolution or dpi) and like that's the biggest letter you made so far...
                /// Was really hoping to make it font dependent only, and not hard code it...
                _DrawingContext.clearRect(moveXback, moveYback, this.currentXPosition, 4 + (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin));
                /// Remove the last character
                /// Ok now i'm starting to like this...
                this.buffer = this.buffer.substr(0, this.buffer.length - 1);
                /// Move X position backward
                this.currentXPosition -= offset;
            }
        } /// eraseChar
        eraseText() {
            /// Visually delete characters as the buffer is "shrinking"
            for (var h = this.buffer.length - 1; h >= 0; --h) {
                /// Step 1: Delete a character
                this.eraseChar();
            } /// for
            /// Buffer should be "empty" by now so let's actually empty it
            this.buffer = "";
        }
        putText(text, indent = INDENT_NUMBER) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                /// Split text into a list and each letter one at a time.
                /// 
                /// Might be wierd if "chunks" of letters and words started appearing on the screen at a time
                ///
                /// Simplifies the implementation as there's no need to do weird math on strings
                /// and comparing them to the Canvas Width and blah blah blah.
                var sentence = text.split("", text.length);
                for (var pos = 0; pos < sentence.length; ++pos) {
                    text = sentence[pos];
                    /// Measure the width of the letter
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    /// Advance the X position forward based on the letter width
                    var nextXPositon = this.currentXPosition + offset;
                    /// Check for a line-wrap
                    if ((nextXPositon >= _Canvas.width * .99)) {
                        this.lineWrapPadding.push(this.currentXPosition);
                        this.lineWrap(text, indent, offset);
                    } /// if
                    else {
                        // Draw the text at the current X and Y coordinates.
                        _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                        // Move the current X position.
                        this.currentXPosition = nextXPositon;
                    } /// if-else
                } /// for
            } ///if
        } /// This is tiresome
        reverseLineWrap() {
            /// Move to the previous line by changing Y position.
            this.currentXPosition = Math.ceil(this.lineWrapPadding.pop());
            /* (copy-pasted)
            * Font size measures from the baseline to the highest point in the font.
            * Font descent measures from the baseline to the lowest point in the font.
            * Font height margin is extra spacing between the lines.
            */
            /// Move to the previous line by changing Y position.
            this.currentYPosition -= _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            /// TODO: Handle reverse scrolling? Wait...
            ///     Probably add some mouse driver first (by capping a scroll up and scroll down event in jQuery)
            ///     then a two stack to hold forward and backward states if we go with the image thing...
            /// Back to where I came from, eraseChar() I think?
        }
        lineWrap(myText, myIndent, myOffset) {
            /// Move to the next line by changing Y position, which scrolls forward need be.
            this.advanceLine();
            /// Resetting the X postion moves us to the beiginning of the left side of the screen.
            ///
            /// We COULD add an abstracted version of an indent, but our master MS DOS doesn't so why should I?
            this.currentXPosition = myIndent;
            /// Drawing the remaining letters after the line-wrap.
            /// this.putText("  ");
            _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, myText);
            /// Move the current X position (copy-pasted).
            this.currentXPosition = this.currentXPosition + myOffset;
        }
        advanceLine() {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            /// Move the current Y position down one line
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
            /// If the Y position goes off the screen...
            if (this.currentYPosition > _Canvas.height) {
                /// Snapshot the current screen
                var img = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
                /// Clear everything off the screen
                this.clearScreen();
                /// Put the snapshot back but shifted up one light
                _DrawingContext.putImageData(img, 0, -(_DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin));
                /// Move the current Y position down another line
                this.currentYPosition = _Canvas.height - this.currentFontSize;
            }
        }
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map