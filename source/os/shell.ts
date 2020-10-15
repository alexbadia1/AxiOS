/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

/// TODO: Write a base class / prototype for system services and let Shell inherit from it.

/* 
 *
 * Would you believe that comming to Marist I didn't know a single thing about programming? Everything I've learned has been from Marist and independent research
 * in between semesters (I feel like everyone else is light years ahead of me and I am playing catch up game).
 *
 * I assume everyone is getting >= 100% on these projects. And I messed up the easiest part on the Midterm
 * which at least now I will never forget. (I learn best through negative reinforcement)
 * 
 * 
*/

module TSOS {
    export class Shell {
        /// Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() { }

        public init() {
            /*************************************************************************************
            Loading the SHELL COMMAND LIST
                help - Lists all available commands
                shutdown - Shuts down AxiOS
                cls - Clears the screen
                man <string> - Displays the manual page for <string>
                trace <on | off> - Enables/disables the AxiOS trace
                rot13 <string> - Does rot13 encryption of <string>
                prompt <string> - sets the prompt
                ...
                ver - Displays the current version data
                date - Displays the current date and time
                whereami - displays the users current location (use your imagination)
                status <string> - Sets the status message
                bsod - Enables the blue screen of death
                load [<priority>] - Loads the specified user program 
                eightball <string> - Eightball will answer all of your questions
                ...
                run <int> - Executes a program in memory
                ...
                clearmem - clear all memory partitions
                runall - execute all programs at once
                ps - display the PID and state of all processes
                kill <pid> - kill one process
                killall - kill all processes
                quantum <int> - let the user set the Round Robin Quantum (measured in CPU cycles)
                ...
            ***************************************************************************************/
            var sc: ShellCommand;

            /*************************************************************************************
            Alan's Base Commands: 
                help - Lists all available commands
                shutdown - Shuts down AxiOS
                cls - Clears the screen
                man <string> - Displays the manual page for <string>
                trace <on | off> - Enables/disables the AxiOS trace
                rot13 <string> - Does rot13 encryption of <string>
                prompt <string> - sets the prompt
            ***************************************************************************************/

            /// help - Lists all available commands
            sc = new ShellCommand(this.shellHelp,
                "help",
                "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            /// shutdown - Shuts down AxiOS
            sc = new ShellCommand(this.shellShutdown,
                "shutdown",
                "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            /// cls - Clears the screen
            sc = new ShellCommand(this.shellCls,
                "cls",
                "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            /// man <string> - Displays the manual page for <string>
            sc = new ShellCommand(this.shellMan,
                "man",
                "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            /// trace <on | off> - Enables/disables the AxiOS trace
            sc = new ShellCommand(this.shellTrace,
                "trace",
                "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            /// rot13 <string> - Does rot13 encryption of <string>
            sc = new ShellCommand(this.shellRot13,
                "rot13",
                "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            /// prompt <string> - sets the prompt
            sc = new ShellCommand(this.shellPrompt,
                "prompt",
                "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;


            /*************************************************************************************
            iProject1 Commands: 
                ver - Displays the current version data
                date - Displays the current date and time
                whereami - Displays the users current location (use your imagination)
                status <string> - Sets the status message
                bsod - Enables the blue screen of death
                load [<priority>] - Loads the specified user program 
                eightball <string> - Eightball will answer all of your questions
            ***************************************************************************************/
            /// ver - Displays the current version data
            sc = new ShellCommand(this.shellVer,
                "ver",
                "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            /// date - Displays the current date and time
            sc = new ShellCommand(this.shellDate,
                'date',
                'Displays the current date and time.');
            this.commandList[this.commandList.length] = sc;

            /// whereami - displays the users current location (use your imagination)
            sc = new ShellCommand(this.shellWhereAmI,
                'whereami',
                'Displays the users current location (use your imagination.');
            this.commandList[this.commandList.length] = sc;

            /// eightball <string> - Eightball will answer all of your questions
            sc = new ShellCommand(this.shellMagicEightball,
                'eightball',
                '<string> - Ask me anything...');
            this.commandList[this.commandList.length] = sc;

            /// status <string> - Sets the status message
            sc = new ShellCommand(this.shellStatus,
                'status',
                '<string> - Sets the status message.');
            this.commandList[this.commandList.length] = sc;

            /// bsod - Enables the blue screen of death
            sc = new ShellCommand(this.shellBSOD,
                'bsod',
                'Enables the blue screen of death');
            this.commandList[this.commandList.length] = sc;

            /// load [<priority>] - Loads the specified user program
            sc = new ShellCommand(this.shellLoad,
                'load',
                'Loads the specified user program');
            this.commandList[this.commandList.length] = sc;

            /*************************************************************************************
            iProject2 Commands:
                run <int> - Executes a program in memory
            ***************************************************************************************/
            /// run <int> - Executes a program in memory
            sc = new ShellCommand(this.shellRun,
                'run',
                '<int> - Runs process id in cpu');
            this.commandList[this.commandList.length] = sc;

            /*************************************************************************************
            iProject3 Commands: 
                clearmem - Clear all memory partitions
                runall - Execute all programs at once
                ps - Display the PID and state of all processes
                kill <pid> - Kill one process
                killall - Kill all processes
                quantum <int> - Let the user set the Round Robin Quantum (measured in CPU cycles)
            ***************************************************************************************/
            /// clearmem - Clear all memory partitions
            sc = new ShellCommand(this.shellClearMem,
                'clearmem',
                'Clear all memory partitions.');
            this.commandList[this.commandList.length] = sc;

            /// runall - Execute all programs at once
            sc = new ShellCommand(this.shellRunAll,
                'runall',
                'Execute all programs at once.');
            this.commandList[this.commandList.length] = sc;

            /// ps - Display the PID and state of all processes
            sc = new ShellCommand(this.shellPs,
                'ps',
                'Display the PID and state of all processes.');
            this.commandList[this.commandList.length] = sc;

            /// kill <pid> - Kill one process
            sc = new ShellCommand(this.shellKill,
                'kill',
                'Kill one process.');
            this.commandList[this.commandList.length] = sc;

            /// killall - Kill all processes
            sc = new ShellCommand(this.shellKillAll,
                'killall',
                'Kill all processes.');
            this.commandList[this.commandList.length] = sc;

            /// quantum <int> - Let the user set the Round Robin Quantum (measured in CPU cycles)
            sc = new ShellCommand(this.shellQuantum,
                'quantum',
                'Let the user set the Round Robin Quantum (measured in CPU cycles).');
            this.commandList[this.commandList.length] = sc;

            /*************************************************************************************
            TODO: Implement iProject 4 Commands: 
                ...
            ***************************************************************************************/

            /// Display the initial prompt.
            ///
            /// If I somehow make it into the "Hall of Fame" I may as well do something memorable. Cause, you know...
            /// I *Start Emphasis* doubt *End Emphasis* anyone's ever done this in the Hall of Fame *Avoids making Eye Contact*...
            this.blackLivesMatter();
            this.putPrompt();
        }// init

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }/// putPrompt

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }/// if 
                else {
                    ++index;
                }/// else
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            }/// if 
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                }/// if
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                }/// else-if
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }/// else
            }/// else
        }/// handleInput

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }/// if
            // ... and finally write the prompt again.
            this.putPrompt();
        }/// execute

        /// Thank you for this (seriously) makes our life a bit easier.
        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.

            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }/// if
            }/// for
            return retVal;
        }/// parseInput

        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //

        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }/// if 
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }/// else
        }/// shellInvalidCommand

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }/// shellCurse

        public shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }/// if 
            else {
                _StdOut.putText("For what?");
            }/// else
        }/// shellApology

        /*************************************************************************************
        Alan's Base Commands: 
            help - Lists all available commands
            shutdown - Shuts down AxiOS
            cls - Clears the screen
            man <string> - Displays the manual page for <string>
            trace <on | off> - Enables/disables the AxiOS trace
            rot13 <string> - Does rot13 encryption of <string>
            prompt <string> - sets the prompt
        ***************************************************************************************/

        /// help - Lists all available commands
        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                var words = "  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description;
                _StdOut.putText(words);
            }/// for
        }/// shellHelp

        /// shutdown - Shuts down AxiOS
        public shellShutdown(args: string[]) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            this.shellStatus(['Shutdown']);
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }/// shellShutdown

        /// cls - Clears the screen
        public shellCls(args: string[]) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }/// shellCls

        /// trace <on | off> - Enables/disables the AxiOS trace
        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }/// if
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }/// else
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }/// switch
            }/// if 
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }/// else
        }/// shellTrace

        /// rot13 <string> - Does rot13 encryption of <string>
        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) + "'");
            }/// if
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }/// else
        }/// shellRot13

        /// prompt <string> - sets the prompt
        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }/// if 
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }/// else
        }/// shellPrompt

        /*************************************************************************************
        SHELL MANUAL

        iProject1 Commands: 
            ver - Displays the current version data
            date - Displays the current date and time
            whereami - displays the users current location (use your imagination)
            status <string> - Sets the status message
            bsod - Enables the blue screen of death
            load [<priority>] - Loads the specified user program 
            eightball <string> - Eightball will answer all of your questions

        iProject2 Commands: 
            run <int> - Executes a program in memory

        iProject3 Commands: 
            clearmem - clear all memory partitions
            runall - execute all programs at once
            ps - display the PID and state of all processes
            kill <pid> - kill one process
            killall - kill all processes
            quantum <int> - let the user set the Round Robin Quantum (measured in CPU cycles)
        
        TODO: Implement iProject 4 Commands:
        ***************************************************************************************/
        public shellMan(args: string[]) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("help - displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("ver - Displays the current version data.");
                        break;
                    case "date":
                        _StdOut.putText("date - Displays the current date and time.");
                        break;
                    case "whereami":
                        _StdOut.putText("wherami - displays the users current location (use your imagination).");
                        break;
                    case "eightball":
                        _StdOut.putText("eightball -  will answer all of your questions.");
                        break;
                    case "status":
                        _StdOut.putText("status <string> - Sets the status message.");
                        break;
                    case "bsod":
                        _StdOut.putText("bsod - Enables the blue screen of death.");
                        break;
                    case "load":
                        _StdOut.putText("load [<priority>] - Loads the specified user program.");
                        break;
                    case "run":
                        _StdOut.putText("run <int> - Executes a program in memory.");
                        break;
                    case "clearmem":
                        _StdOut.putText("clearmem - clear all memory partitions.");
                        break;
                    case "runall":
                        _StdOut.putText("runall - execute all programs at once.");
                        break;
                    case "ps":
                        _StdOut.putText("ps - display the PID and state of all processes.");
                        break;
                    case "kill":
                        _StdOut.putText("kill <pid> - kill one process.");
                        break;
                    case "killall":
                        _StdOut.putText("killall - kill all processes.");
                        break;
                    case "quantum":
                        _StdOut.putText("quantum <int> - let the user set the Round Robin Quantum (measured in CPU cycles).");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }/// switch
            }/// if 
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }/// else
        }/// shellMan

        /*************************************************************************************
        iProject1 Commands: 
            ver - Displays the current version data
            date - Displays the current date and time
            whereami - displays the users current location (use your imagination)
            status <string> - Sets the status message
            bsod - Enables the blue screen of death
            load [<priority>] - Loads the specified user program 
            eightball <string> - Eightball will answer all of your questions
        ***************************************************************************************/

        /// ver - Displays the current version data
        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION + " Iteration Alex Badia's");
        }/// shellVer

        /// date - Displays the current date and time
        public shellDate() {
            var myDate = new Date();
            _StdOut.putText("" + myDate);
        }/// shellDate

        /// whereami - displays the users current location (use your imagination)
        public shellWhereAmI() {
            var myLocation = "Whiterun";
            _StdOut.putText("Approximate location: " + myLocation);
        }///shelWhereAmI

        /// bsod - Enables the blue screen of death
        public shellBSOD() {
            _Kernel.krnTrapError("I've failed you Alan :(");
        }/// shellBSOD

        /// status <string> - Sets the status message
        public shellStatus(args: string[]) {
            var ans = "";

            /// append arguments into a single string format from list of strings format
            for (var h = 0; h < args.length; ++h) {
                ans += " " + args[h];
            }/// for

            /// If there are arguments update the status
            /// Else show the proper "usage prompt"
            if (args.length > 0) {
                document.getElementById('divLog--status').innerText = ans;
                _StdOut.putText("status changed to: " + ans);
            }// if
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }/// else
        }/// shellStatus

        /// load [<priority>] - Loads the specified user program 
        public shellLoad() {
            ///Regular expressions, smh.
            ///
            /// Getting and cleansing input
            var userInput: string = _taProgramInput.value.trim();
            userInput = userInput.toUpperCase().replace(/\s/g, '');
            var hexPairList: Array<string> = new Array();

            /// Test for hexadecimal characters using regular expression...
            /// Learning hurts, ugh...
            if (/^[A-F0-9]+$/i.test(userInput)) {

                /// Making sure there are no incomplete hex data pairs
                if (userInput.length % 2 === 0) {
                    /// Find a free simple volume
                    ///
                    /// May as well use first fit since the volumes are all the same fixed size...
                    if (_MemoryManager.firstFit() === -1) {
                        /// Memory is full
                        _StdOut.putText("Memory is full!");
                        _StdOut.advanceLine();
                    } ///if
                    else {
                        /// Free Simple Volume was found
                        var freeSpot: number = _MemoryManager.firstFit();
                        var freeSimpleVolume: SimpleVolume = _MemoryManager.simpleVolumes[freeSpot];

                        /// Create a Process Control BLock
                        var newProcessControlBlock: ProcessControlBlock = new ProcessControlBlock();

                        /// Set state to new process as new until it is a resident
                        newProcessControlBlock.processState = "NEW";

                        /// Set location of the new process in memory segment
                        newProcessControlBlock.volumeIndex = freeSpot;

                        /// Assign continuosly growing list of process id's
                        newProcessControlBlock.processID = _ResidentList.residentList.length;

                        /// Add to list of processes
                        _ResidentList.residentList.push(newProcessControlBlock);

                        /// Show user said process id...
                        ///
                        /// What's this?! Temperate Literals? fancy... eh?
                        /// (*whispers* Wow, I'm actually learning...)
                        _StdOut.putText(`Process ID: ${newProcessControlBlock.processID}`);
                        _StdOut.advanceLine();

                        /// Load user input into free memory segment
                        ///
                        /// Split the input into pairs of 2
                        for (var pos: number = 0; pos < userInput.length; pos += 2) {
                            /// List splits into pairs nicely
                            hexPairList.push("" + userInput[pos] + userInput[pos + 1]);
                        }/// for


                        for (var logicalAddress = 0; logicalAddress < hexPairList.length; ++logicalAddress) {

                            /// Write to memory from hex pair list
                            if (_MemoryAccessor.write(freeSimpleVolume, logicalAddress, hexPairList[logicalAddress])) {
                                Control.hostLog(`Command ${hexPairList[logicalAddress]}: SUCCESSFUL WRITE to logical memory location: ${logicalAddress}!`);
                            }/// if 
                            else {
                                Control.hostLog(`Command ${hexPairList[logicalAddress]}: FAILED to WRITE to logical memory location: ${logicalAddress}!`);
                            }/// else

                            /// console.log(_MemoryAccessor.read(freeSimpleVolume, logicalAddress));
                        }/// for

                        /// Protect volumes from being written into by accident...
                        ///
                        /// Each individual address at the memory level will be locked to to prevent such overflow issues
                        freeSimpleVolume.writeLock();

                        ///
                        /// If the program is properly loaded into memory... 
                        /// Update the process control block state to show it is loaded in memory
                        newProcessControlBlock.processState = "Residient";
                    } ///else
                }/// if 

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
            }/// else

            /// Update Visual Memory
            ///
            /// Regardless of success or fail, just cause I want to be able to make sure memory
            /// ain't doin anything funky...
            TSOS.Control.updateVisualMemory();
        }/// shellLoad

        /// eightball <string> - Eightball will answer all of your questions
        public shellMagicEightball(args: string[]) {
            var min = 0;
            var max = 19;
            if (args.length > 0) {
                /// Eightball answers may be subject to copyright...
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

            } else {
                _StdOut.putText("Usage: magic eightball <string>  Please supply a string.");
            }//if-else
        }/// shellMagicEightball


        /*************************************************************************************
        iProject2 Commands: 
            run <int> - Executes a program in memory
        ***************************************************************************************/

        /// run <int> - Executes a program in memory
        public shellRun(args: string[]) {
            /// Apparently Javascripts tolerance of NaN completly defeats the purpose of using this 
            /// try catch... nice!
            try {
                /// Check if the process exists with basic linear search
                var curr: number = 0;
                var found: boolean = false;
                while (curr < _ResidentList.residentList.length && !found) {
                    if (_ResidentList.residentList[curr].processID == parseInt(args[0])) {
                        found = true;
                    }/// if
                    else {
                        curr++;
                    }/// else
                }/// while

                if (!found) {
                    _StdOut.putText(`No process control blocks found with pid: ${parseInt(args[0])}.`);
                }/// if
                else {
                    /// Schedule the process

                    /// Check if the specified process is already running
                    if (_ResidentList.residentList[curr].processState === "Running") {
                        _StdOut.putText(`Process with pid: ${parseInt(args[0])} is already running!`);
                    }/// if

                    /// Specified process is not already running, so schedule it to run
                    else {
                        /// First check the process queue before schedule anything so we don't accidently
                        /// count the algorithm we are scheduling
                        var thereAreRunningProcesses: boolean = false;

                        /// There are already process running:
                        ///     1. There are any process in the ready queue (that isn't the one already scheduled)
                        ///     2. There is a current process for _Scheduler
                        thereAreRunningProcesses = (_Scheduler.readyQueueLength() > 0 || _Scheduler.hasCurrentProcess()) ? true : false;

                        /// The Scheduler will handle this depending on the algorithm used...
                        _Scheduler.scheduleProcess(_ResidentList.residentList[curr]);

                        /// Now we run it...
                        if (thereAreRunningProcesses) {
                            _StdOut.advanceLine();
                            _StdOut.putText(`The process with pid: ${curr} has been scheduled and will execute based on the current scheduling algorithm!`);
                            _StdOut.advanceLine();
                        }/// if 
                        else {
                            /// Run this as the first process
                            _Scheduler.roundRobinCheck();
                            _CPU.isExecuting = true;
                        }/// else
                    }/// else


                    /// Run the process
                    ///
                    /// Update the proces state
                    ///_ResidentList.residentList[curr].processState = "Running";

                    /// Schedule the process
                    /// Maybe do this... _Scheduler.readyQueue.push(_ResidentList.residentList[curr]);
                    /// _Scheduler.currentProcessControlBlock = _ResidentList.residentList[curr];

                    /// Set the local pcb in the cpu
                    ///_Dispatcher.attachNewPcbToCPU();

                    /// "Turn on" the cpu
                    /// WAIT, but Single step mode
                    /// _CPU.isExecuting = true;
                }/// else
            }/// try
            catch (e) {
                _StdOut.putText(`${e}`);
                _StdOut.putText(`Usage: run <int> please supply a process id.`);
            }/// catch
        }/// run


        /*************************************************************************************
        iProject3 Commands: 
            clearmem - clear all memory partitions
            runall - execute all programs at once
            ps - display the PID and state of all processes
            kill <pid> - kill one process
            killall - kill all processes
            quantum <int> - let the user set the Round Robin Quantum (measured in CPU cycles)
        ***************************************************************************************/

        /// clearmem - clear all memory partitions
        public shellClearMem() { }/// clearmem

        /// runall - execute all programs at once
        public shellRunAll() {
            /// Apparently Javascripts tolerance of NaN completly defeats the purpose of using this 
            /// try catch... nice!
            try {
                /// Check if the resident queue is full or not...
                if (_ResidentList.residentList.length === 0) {
                    _StdOut.putText(`No process control blocks found.`);
                }/// if
                else {
                    /// Load the Ready Queue with ALL Loaded Processes so...
                    /// Enqueue all NON-TERMINATED Processes from the Resident List
                    for (var processID: number = 0; processID < _ResidentList.residentList.length; ++processID) {
                        /// Only get Non-Terminated Processes
                        if (_ResidentList.residentList[processID].processState !== "Terminated") {
                            _Scheduler.scheduleProcess(_ResidentList.residentList[processID]);
                        }/// if 
                    }/// for

                    _CPU.isExecuting = true;
                }/// else
            }/// try
            catch (e) {
                _StdOut.putText(`Usage: run <int> please supply a process id.`);
            }/// catch
        }/// runall

        /// ps - display the PID and state of all processes
        public shellPs() { }///ps

        /// kill <pid> - kills one process (specified by process ID)
        public shellKill() { }/// kill

        /// killall - kill all processes
        public shellKillAll() { }/// kill all processes

        /// quantum <int> - let the user set the Round Robin Quantum (measured in CPU cycles)
        public shellQuantum(args: string[]) {
            /// Check for one argmument
            if (args.length === 1) {
                /// Getting and cleansing input
                var trimmedStringQuanta: string = args[0].trim();
                trimmedStringQuanta = trimmedStringQuanta.toUpperCase().replace(/\s/g, '');

                /// Make sure quantum is in positive decimal
                if (/^[0-9]+$/i.test(trimmedStringQuanta)) {

                    /// Save old quanta
                    var oldDecimalQuanta = _Scheduler.getQuantum();

                    /// Set new quanta...
                    ///     _Scheduler.setQuantum() method Returns:
                    ///         "True" if quantum > 0
                    ///         "False" if quantum <= 0
                    _Scheduler.setQuantum(parseInt(trimmedStringQuanta, 10)) ?
                        _StdOut.putText(`Quatum was: ${oldDecimalQuanta}, Quantum now: ${_Scheduler.getQuantum()}`)
                        : _StdOut.putText(`Usage: quantum <int>  Please supply a positive, non-zero, decimal integer only.`)
                }/// if

                /// Error, a character other than [0-9] was detected
                else {
                    _StdOut.putText("Usage: quantum <int>  Please supply a positive decimal number only.");
                }/// else
            }/// if 

            /// ERROR, More than one argument given
            else {
                _StdOut.putText("Usage: quantum <int> Expected 1 Argument.");
            }/// else
        }/// shellQuantum

        /*************************************************************************************
        TODO Implement iProject4 Commands: 
            ...
        ***************************************************************************************/

        /********************
         * ASCII art for BLM
         ********************/
        public blackLivesMatter() {
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
            /// Onwards to putPrompt();!
        }/// blackLivesMatter
    }/// class
}/// shell
