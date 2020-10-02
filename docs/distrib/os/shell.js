/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        constructor() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running. Add the new features as specified in your Issues and iProject 1. Demonstrate programming best practices or Alan will get bitchy.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date <string>
            sc = new TSOS.ShellCommand(this.shellDate, 'date', '<string> - Current date and time.');
            this.commandList[this.commandList.length] = sc;
            // location <string>
            sc = new TSOS.ShellCommand(this.shellLocation, 'whereami', 'Current location.');
            this.commandList[this.commandList.length] = sc;
            // eightball <String>
            sc = new TSOS.ShellCommand(this.shellMagicEightball, 'eightball', '<string> - Ask me anything...');
            this.commandList[this.commandList.length] = sc;
            // status <String>
            sc = new TSOS.ShellCommand(this.shellStatus, 'status', '<string> - message as specified by the user.');
            this.commandList[this.commandList.length] = sc;
            // bsod
            sc = new TSOS.ShellCommand(this.shellBSOD, 'bsod', 'Forces a kernel error');
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, 'load', 'Loads user HEX code');
            this.commandList[this.commandList.length] = sc;
            // Run
            sc = new TSOS.ShellCommand(this.shellRun, 'run', 'Runs process id in cpu');
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            /// 
            /// I may or may not have been mentally impaired while doing this...
            ///
            /// However, if I somehow make it into the "Hall of Fame" I may as well do something memorable. Cause, you know...
            /// I *Start Emphasis* doubt *End Emphasis* anyone's ever done this in the Hall of Fame *Avoids making Eye Contact*...
            this.blackLivesMatter();
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        blackLivesMatter() {
            /// I may be a computer scientist... but I'm also a progressive!
            ///
            /// Does this automatically get me a 100?
            /// BLACK
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" ### ");
            _StdOut.putX(90);
            _StdOut.putText(" # ");
            _StdOut.putX(150);
            _StdOut.putText("  ## ");
            _StdOut.putX(225);
            _StdOut.putText(" ## ");
            _StdOut.putX(295);
            _StdOut.putText("#   #");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" #   #");
            _StdOut.putX(90);
            _StdOut.putText(" # ");
            _StdOut.putX(150);
            _StdOut.putText(" #   #");
            _StdOut.putX(225);
            _StdOut.putText("#  #");
            _StdOut.putX(295);
            _StdOut.putText("#  #");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" #   #");
            _StdOut.putX(90);
            _StdOut.putText(" # ");
            _StdOut.putX(150);
            _StdOut.putText(" #   # ");
            _StdOut.putX(225);
            _StdOut.putText("#");
            _StdOut.putX(295);
            _StdOut.putText("##  ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" ####");
            _StdOut.putX(90);
            _StdOut.putText(" # ");
            _StdOut.putX(150);
            _StdOut.putText(" #### ");
            _StdOut.putX(225);
            _StdOut.putText("#");
            _StdOut.putX(295);
            _StdOut.putText("##  ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" #   #");
            _StdOut.putX(90);
            _StdOut.putText(" # ");
            _StdOut.putX(150);
            _StdOut.putText(" #   # ");
            _StdOut.putX(225);
            _StdOut.putText("#");
            _StdOut.putX(295);
            _StdOut.putText("# # ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" #   #");
            _StdOut.putX(90);
            _StdOut.putText(" # ");
            _StdOut.putX(150);
            _StdOut.putText(" #   # ");
            _StdOut.putX(225);
            _StdOut.putText("#  #");
            _StdOut.putX(295);
            _StdOut.putText("#  # ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" ### ");
            _StdOut.putX(90);
            _StdOut.putText(" #### ");
            _StdOut.putX(150);
            _StdOut.putText(" #   # ");
            _StdOut.putX(225);
            _StdOut.putText(" ## ");
            _StdOut.putX(295);
            _StdOut.putText("#   #");
            _StdOut.advanceLine();
            /// LIVES
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" # ");
            _StdOut.putX(90);
            _StdOut.putText(" ### ");
            _StdOut.putX(150);
            _StdOut.putText("#     # ");
            _StdOut.putX(225);
            _StdOut.putText(" #### ");
            _StdOut.putX(295);
            _StdOut.putText("  ### ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" # ");
            _StdOut.putX(90);
            _StdOut.putText("  # ");
            _StdOut.putX(150);
            _StdOut.putText("#     # ");
            _StdOut.putX(225);
            _StdOut.putText(" # ");
            _StdOut.putX(295);
            _StdOut.putText(" # ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" # ");
            _StdOut.putX(90);
            _StdOut.putText("  # ");
            _StdOut.putX(150);
            _StdOut.putText("#     # ");
            _StdOut.putX(225);
            _StdOut.putText(" # ");
            _StdOut.putX(295);
            _StdOut.putText(" # ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" # ");
            _StdOut.putX(90);
            _StdOut.putText("  # ");
            _StdOut.putX(150);
            _StdOut.putText("#     # ");
            _StdOut.putX(225);
            _StdOut.putText(" ### ");
            _StdOut.putX(295);
            _StdOut.putText("  ## ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" # ");
            _StdOut.putX(90);
            _StdOut.putText("  # ");
            _StdOut.putX(150);
            _StdOut.putText("#     # ");
            _StdOut.putX(225);
            _StdOut.putText(" # ");
            _StdOut.putX(295);
            _StdOut.putText("    # ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" # ");
            _StdOut.putX(90);
            _StdOut.putText("  # ");
            _StdOut.putX(150);
            _StdOut.putText(" #   # ");
            _StdOut.putX(225);
            _StdOut.putText(" # ");
            _StdOut.putX(295);
            _StdOut.putText("    # ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" #### ");
            _StdOut.putX(90);
            _StdOut.putText(" ### ");
            _StdOut.putX(150);
            _StdOut.putText("   #  ");
            _StdOut.putX(225);
            _StdOut.putText(" #### ");
            _StdOut.putX(295);
            _StdOut.putText(" ###  ");
            _StdOut.advanceLine();
            /// MATTER
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" #    # ");
            _StdOut.putX(100);
            _StdOut.putText("  ## ");
            _StdOut.putX(160);
            _StdOut.putText(" ##### ");
            _StdOut.putX(225);
            _StdOut.putText(" ##### ");
            _StdOut.putX(295);
            _StdOut.putText(" #### ");
            _StdOut.putX(365);
            _StdOut.putText(" ###  ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" ## ## ");
            _StdOut.putX(100);
            _StdOut.putText(" #   # ");
            _StdOut.putX(160);
            _StdOut.putText("   # ");
            _StdOut.putX(225);
            _StdOut.putText("   # ");
            _StdOut.putX(295);
            _StdOut.putText(" # ");
            _StdOut.putX(365);
            _StdOut.putText(" #  # ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" # # # ");
            _StdOut.putX(100);
            _StdOut.putText(" #   # ");
            _StdOut.putX(160);
            _StdOut.putText("   # ");
            _StdOut.putX(225);
            _StdOut.putText("   # ");
            _StdOut.putX(295);
            _StdOut.putText(" # ");
            _StdOut.putX(365);
            _StdOut.putText(" #  # ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" # # # ");
            _StdOut.putX(100);
            _StdOut.putText(" #### ");
            _StdOut.putX(160);
            _StdOut.putText("   # ");
            _StdOut.putX(225);
            _StdOut.putText("   # ");
            _StdOut.putX(295);
            _StdOut.putText(" ### ");
            _StdOut.putX(365);
            _StdOut.putText(" ###  ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" #   # ");
            _StdOut.putX(100);
            _StdOut.putText(" #   # ");
            _StdOut.putX(160);
            _StdOut.putText("   # ");
            _StdOut.putX(225);
            _StdOut.putText("   # ");
            _StdOut.putX(295);
            _StdOut.putText(" # ");
            _StdOut.putX(365);
            _StdOut.putText(" # #  ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" #   # ");
            _StdOut.putX(100);
            _StdOut.putText(" #   # ");
            _StdOut.putX(160);
            _StdOut.putText("   # ");
            _StdOut.putX(225);
            _StdOut.putText("   # ");
            _StdOut.putX(295);
            _StdOut.putText(" # ");
            _StdOut.putX(365);
            _StdOut.putText(" #  # ");
            _StdOut.advanceLine();
            _StdOut.putX(30);
            _StdOut.putText(" #   # ");
            _StdOut.putX(100);
            _StdOut.putText(" #   # ");
            _StdOut.putX(160);
            _StdOut.putText("   # ");
            _StdOut.putX(225);
            _StdOut.putText("   # ");
            _StdOut.putX(295);
            _StdOut.putText(" ####  ");
            _StdOut.putX(365);
            _StdOut.putText(" #  # ");
            /// You gotta admit this is still pretty cool...
            /// OKAY, so now to the ACTUAL porgram
            _StdOut.advanceLine();
            _StdOut.advanceLine();
            /// Onwards to putPrompt();
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                } /// if
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                } /// else-if
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                } /// else
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }
        /// Thank you for this (seriously) makes our life a bit easier.
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION + " Iteration Alex Badia's");
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                var words = "  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description;
                _StdOut.putText(words);
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            this.shellStatus(['Shutdown']);
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "date":
                        _StdOut.putText("Date displays the current date and time.");
                        break;
                    case "whereami":
                        _StdOut.putText("Location displays the approximate current location.");
                        break;
                    case "eightball":
                        _StdOut.putText("Eightball will answer all of your questions.");
                        break;
                    case "status":
                        _StdOut.putText("Status will recieve a message as specified by the user.");
                        break;
                    case "bsod":
                        _StdOut.putText("BSOD- forces a kernel error.");
                        break;
                    case "load":
                        _StdOut.putText("Load- loads user HEX code.");
                        break;
                    case "run":
                        _StdOut.putText("Run- runs process id in cpu.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellDate() {
            var myDate = new Date();
            _StdOut.putText("" + myDate);
        }
        shellLocation() {
            var myLocation = "Whiterun";
            _StdOut.putText("Approximate location: " + myLocation);
        }
        shellStatus(args) {
            var ans = "";
            for (var h = 0; h < args.length; ++h) {
                ans += " " + args[h];
            }
            if (args.length > 0) {
                document.getElementById('divLog--status').innerText = ans;
                _StdOut.putText("status changed to: " + ans);
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellBSOD() {
            _Kernel.krnTrapError("I've failed you Alan :(");
        } /// shellBSOD
        shellLoad() {
            ///Regular expressions, smh.
            ///
            /// Getting and cleansing input
            var userInput = _taProgramInput.value.trim();
            userInput = userInput.toUpperCase().replace(/\s/g, '');
            var hexPairList = new Array();
            /// Test for hexadecimal characters using regular expression...
            /// Learning hurts, ugh...
            if (/^[A-F0-9]+$/i.test(userInput)) {
                /// Making sure there are no incomplete hex data pairs
                if (userInput.length % 2 === 0) {
                    /// 1.) Find a free simple volume
                    ///
                    /// May as well use first fit since the volumes are all the same fixed size...
                    if (_MemoryManager.firstFit() === -1) {
                        /// Memory is full
                        _StdOut.putText("Memory is full!");
                        _StdOut.advanceLine();
                    } ///if
                    else {
                        /// Free Simple Volume was found
                        var freeSpot = _MemoryManager.firstFit();
                        var freeSimpleVolume = _MemoryManager.simpleVolumes[freeSpot];
                        /// Create a Process Control BLock
                        var newProcessControlBlock = new TSOS.ProcessControlBlock();
                        /// Set state to new process as new until it is a resident
                        newProcessControlBlock.processState = "NEW";
                        /// Set location of the new process in memory segment
                        newProcessControlBlock.volumeIndex = freeSpot;
                        /// Assign continuosly growing list of process id's
                        newProcessControlBlock.processID = _ProcessControlBlockQueue.pcbsQueue.length;
                        /// Add to list of processes
                        _ProcessControlBlockQueue.pcbsQueue.push(newProcessControlBlock);
                        /// Show user said process id...
                        ///
                        /// What's this?! Temperate Literals? fancy... eh?
                        /// (*whispers* Wow, I'm actually learning...)
                        _StdOut.putText(`Process ID: ${newProcessControlBlock.processID}`);
                        _StdOut.advanceLine();
                        /// 2.) Load user input into free memory segment
                        ///
                        /// 2.1) Split the input into pairs of 2
                        for (var pos = 0; pos < userInput.length; pos += 2) {
                            /// List splits into pairs nicely
                            hexPairList.push("" + userInput[pos] + userInput[pos + 1]);
                        } /// for
                        for (var logicalAddress = 0; logicalAddress < hexPairList.length; ++logicalAddress) {
                            /// Write to memory from hex pair list
                            if (_MemoryAccessor.write(freeSimpleVolume, logicalAddress, hexPairList[logicalAddress])) {
                                TSOS.Control.hostLog(`Command ${hexPairList[logicalAddress]}: SUCCESSFUL WRITE to logical memory location: ${logicalAddress}!`);
                            } /// if 
                            else {
                                TSOS.Control.hostLog(`Command ${hexPairList[logicalAddress]}: FAILED to WRITE to logical memory location: ${logicalAddress}!`);
                            } /// else
                            /// console.log(_MemoryAccessor.read(freeSimpleVolume, logicalAddress));
                        } /// for
                        /// Protect volumes from being written into by accident...
                        ///
                        /// Each individual address at the memory level will be locked to to prevent such overflow issues
                        freeSimpleVolume.writeLock();
                        ///
                        /// 3.) If the program is properly loaded into memory... 
                        /// Update the process control block state to show it is loaded in memory
                        newProcessControlBlock.processState = "Residient";
                    } ///else
                } /// if 
                /// The user inputted an odd amount of hex characters meaning there is an unmatched pair, so 
                /// print out to the console that is ain't gonna work.
                else {
                    _StdOut.putText("Invalid Hex Data.");
                    _StdOut.advanceLine();
                    _StdOut.putText("Hex Command or Hex Data is incomplete.");
                    _StdOut.advanceLine();
                    _StdOut.putText("Type \'help\' for, well... help.");
                    _StdOut.advanceLine();
                }
            } /// if
            else {
                _StdOut.putText("Invalid Hex Data.");
                _StdOut.advanceLine();
                _StdOut.putText("Type \'help\' for, well... help.");
                _StdOut.advanceLine();
            } /// else
            /// Update Visual Memory
            ///
            /// Regardless of success or fail, just cause I want to be able to make sure memory
            /// ain't doin anything funky...
            TSOS.Control.updateVisualMemory();
        } /// shellLoad
        shellRun(args) {
            /// Apparently Javascripts tolerance of NaN completly defeats the purpose of using this 
            /// try catch... nice!
            try {
                /// Check if the process exists with basic linear search
                var curr = 0;
                var found = false;
                while (curr < _ProcessControlBlockQueue.pcbsQueue.length && !found) {
                    if (_ProcessControlBlockQueue.pcbsQueue[curr].processID == parseInt(args[0])) {
                        found = true;
                    } /// if
                    else {
                        curr++;
                    } /// else
                } /// while
                if (!found) {
                    _StdOut.putText(`No process control blocks found with pid: ${parseInt(args[0])}.`);
                } /// if
                else {
                    /// Run the process
                    ///
                    /// Update the proces state
                    _ProcessControlBlockQueue.pcbsQueue[curr].processState = "Running";
                    /// Set the local pcb in the cpu
                    _CPU.setLocalProcessControlBlock(_ProcessControlBlockQueue.pcbsQueue[curr]);
                    /// "Turn on" the cpu
                    /// WAIT, but Single step mode
                    _CPU.isExecuting = true;
                } /// else
            } /// try
            catch (e) {
                _StdOut.putText(`Usage: run <int> please supply a process id.`);
            } /// catch
        } /// run
        shellMagicEightball(args) {
            var min = 0;
            var max = 19;
            if (args.length > 0) {
                /// Eightball answers may be subject to copyright.
                var answers = [
                    "It is certain.",
                    "It is decidedly so.",
                    "Without a doubt.",
                    "Yes – definitely.",
                    "You may rely on it.",
                    "As I see it, yes.",
                    "Most likely.",
                    "Outlook good.",
                    "Yes.",
                    "Signs point to yes.",
                    "Reply hazy, try again.",
                    "Ask again later.",
                    "Better not tell you now.",
                    "Cannot predict now.",
                    "Concentrate and ask again.",
                    "Don't count on it.",
                    "My reply is no.",
                    "My sources say no.",
                    "Outlook not so good.",
                    "Very doubtful."
                ];
                var randomNum = Math.floor(Math.random() * (max - min + 1) + min);
                var ans = answers[randomNum];
                _StdOut.putText("" + ans);
            }
            else {
                _StdOut.putText("Usage: magic eightball <string>  Please supply a string.");
            } //if-else
        } /// shellMagicEightball
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map