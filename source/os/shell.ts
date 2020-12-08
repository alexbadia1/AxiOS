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
        public promptStr = "C:\\AxiOS>"; /// Ohhhh [*lightbulb* ], to bad we don't have a multi-level file system...
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
            iProject4 Commands: 
            Disk Operations
                create <filename>: Create the file [filename] and display a message denoting success or failure
                read <filename>: Read and display the contents of [filename] or display an error if something went wrong
                write <filename> "data": Write data inside the quotes to [filename] and display a message denoting success or failure
                delete <filename>: Remove [filename] from storage and display a message denoting success or failure
                format: Initialize all blocks in all sectors in all tracks and display a message denoting success or failure
                ls: List files currently stored on the disk
                format -quick: initialize the first four bytes of every directory and data block
                format -full: same as quick and also initializes bytes 4-63 in directory and data blocks too.
                ls -l: lists all filenames [even hidden ones] as well as their size and create date.
            Scheduling
                setSchedule <rr, fcfs, priority> - selects a CPU scheduling algorithm
                getSchedule - returns the current CPU scheduling program
            ***************************************************************************************/

            /// format - Initialize all blocks in all sectors in all tracks and display a message denoting success or failure
            /// Optional parameters: 
            ///     format -quick: initialize the first four bytes of every directory and data block
            ///     format -full: same as quick and also initializes bytes 4-63 in directory and data blocks too.
            sc = new ShellCommand(this.shellFormat,
                'format',
                'Initialize blocks, sectors and tracks in disk');
            this.commandList[this.commandList.length] = sc;

            /// create <filename>: Create the file [filename] and display a message denoting success or failure
            sc = new ShellCommand(this.shellCreate,
                'create',
                'Create the file [filename]');
            this.commandList[this.commandList.length] = sc;

            /// ls - List files currently stored on the disk
            /// Optional parameters: 
            ///     ls -l: lists all filenames [even hidden ones] as well as their size and create date.
            sc = new ShellCommand(this.shellList,
                'ls',
                'List files currently stored on the disk');
            this.commandList[this.commandList.length] = sc;

            /// read <filename>: Read and display the contents of [filename] or display an error if something went wrong
            sc = new ShellCommand(this.shellRead,
                'read',
                'Read and display the contents of [filename]');
            this.commandList[this.commandList.length] = sc;

            /// write <filename> "data": Write data inside the quotes to [filename] and display a message denoting success or failure
            sc = new ShellCommand(this.shellWrite,
                'write',
                'Write data inside the quotes to [filename]');
            this.commandList[this.commandList.length] = sc;

            /// delete <filename>: Remove [filename] from storage and display a message denoting success or failure
            sc = new ShellCommand(this.shellDelete,
                'delete',
                'Remove [filename] from storage');
            this.commandList[this.commandList.length] = sc;

            /// defrag: defragment disk drive and display a message denoting success or failure
            sc = new ShellCommand(this.shellDefrag,
                'defrag',
                'defragment disk drive');
            this.commandList[this.commandList.length] = sc;

            /// getSchedule: returns currently selected sheduling algorithm
            sc = new ShellCommand(this.shellGetSchedule,
                'getschedule',
                'returns currently selected sheduling algorithm');
            this.commandList[this.commandList.length] = sc;

            /// setSchedule: defragment disk drive and display a message denoting success or failure
            sc = new ShellCommand(this.shellSetSchedule,
                'setschedule',
                'sets the currently selected scheduling algorithm');
            this.commandList[this.commandList.length] = sc;

            /// rename: defragment disk drive and display a message denoting success or failure
            sc = new ShellCommand(this.shellRename,
                'rename',
                'changes the filename to the new name specified');
            this.commandList[this.commandList.length] = sc;


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
        
        iProject4 Commands: 
            Disk Operations
                create <filename>: Create the file [filename] and display a message denoting success or failure
                read <filename>: Read and display the contents of [filename] or display an error if something went wrong
                write <filename> "data": Write data inside the quotes to [filename] and display a message denoting success or failure
                delete <filename>: Remove [filename] from storage and display a message denoting success or failure
                format: Initialize all blocks in all sectors in all tracks and display a message denoting success or failure
                ls: List files currently stored on the disk
                format -quick: initialize the first four bytes of every directory and data block
                format -full: same as quick and also initializes bytes 4-63 in directory and data blocks too.
                ls -l: lists all filenames [even hidden ones] as well as their size and create date.
            Scheduling
                setSchedule <rr, fcfs, priority> - selects a CPU scheduling algorithm
                getSchedule - returns the current CPU scheduling program
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
                    case "format":
                        _StdOut.putText("format <-quick|-full> - Initialize all blocks in all sectors in all tracks in disk.");
                        break;
                    case "create":
                        _StdOut.putText("create <filename>: Create the file [filename] in disk");
                        break;
                    case "ls":
                        _StdOut.putText("ls <-l> - List files currently stored on the disk.");
                        break;
                    case "read":
                        _StdOut.putText("read <filename>: Read and display the contents of [filename].");
                        break;
                    case "write":
                        _StdOut.putText("write <filename> 'data': Write data inside the quotes to [filename].");
                        break;
                    case "delete":
                        _StdOut.putText("delete <filename>: Remove [filename] from storage.");
                        break;
                    case "defrag":
                        _StdOut.putText("defrag: defragments disk drive.");
                        break;
                    case "setschedule":
                        _StdOut.putText("setschedule: sets the current scheduling algorithm");
                        break;
                    case "getschedule":
                        _StdOut.putText("getschedule: gets the current scheduling algorithm");
                        break;
                    case "rename":
                        _StdOut.putText("rename <file> <new filename>: changes the filename to the new name specified");
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
        ///
        /// In hindsight, creating the process and all should not be in the shell...
        public shellLoad(args: string[]) {

            if (args.length <= 1 && args.length >= 0) {
                /// Getting and cleansing input
                var userInput: string = _taProgramInput.value.trim();
                userInput = userInput.toUpperCase().replace(/\s/g, '');

                /// Test for hexadecimal characters using regular expression...
                if (/^[A-F0-9]+$/i.test(userInput)) {

                    /// Making sure there are no incomplete hex data pairs
                    if (userInput.length % 2 === 0) {

                        /// Memory is full...
                        if (_MemoryManager.firstFit() === -1) {

                            /// Try to write to the disk instead, remember it must be formatted first!
                            if (_krnDiskDriver.formatted) {
                                /// Create a Process Control Block
                                var newProcessControlBlock: ProcessControlBlock = new ProcessControlBlock();

                                /// Assign continuosly growing list of process id's and add to list of processes
                                ///
                                /// This is TEMPORARY and may need to be rolled back if no room on the disk
                                /// Thus we will wait to actually push the pcb onto the resident list
                                newProcessControlBlock.processID = _ResidentList.size;
                                _ResidentList.size++;

                                /// Create a swap file for said pcb
                                newProcessControlBlock.swapFileName = `${_krnDiskDriver.hiddenFilePrefix}${_krnDiskDriver.swapFilePrefix}${newProcessControlBlock.processID}`;

                                /// Now try to actually create the swap file and write to it if there's enough room
                                ///
                                /// Asyncronously...
                                ///     Future<void> shellLoad() async {
                                ///         Future<boolean> result = await _KernelInterruptPriorityQueue.enqueue(new TSOS.Interrupt(DISK_IRQ, ['create', args[0]]));
                                ///         return result;
                                ///     }/// shellLoad
                                /// 
                                /// Ya know, I might actually try to re do this in an asyncronous fashion in Dart and create a fultter app for it...
                                var diskDriverResult: string = '';
                                diskDriverResult = _krnDiskDriver.create(newProcessControlBlock.swapFileName);
                                _StdOut.putText(`  ${diskDriverResult}`);
                                _StdOut.advanceLine();
                                /// File created for program
                                if (!diskDriverResult.startsWith('Cannot create')) {
                                    diskDriverResult = _krnDiskDriver.write(newProcessControlBlock.swapFileName, userInput);
                                    _StdOut.putText(`  Program Succesfully ${diskDriverResult}`);
                                    _StdOut.advanceLine();

                                    /// Program succesfully written to file
                                    if (!diskDriverResult.startsWith('Cannot write')) {
                                        newProcessControlBlock.volumeIndex = -1;

                                        if (args.length === 1) {
                                            /// Getting and cleansing input
                                            var trimmedStringPriority: string = args[0].trim();
                                            trimmedStringPriority = trimmedStringPriority.toUpperCase().replace(/\s/g, '');
                                            if (/^[0-9]+$/i.test(trimmedStringPriority)) {
                                                newProcessControlBlock.priority = parseInt(trimmedStringPriority);
                                            }/// if
                                        }/// if

                                        /// Can safely add process to the resident queue
                                        _ResidentList.residentList.push(newProcessControlBlock);

                                        /// Update pcb state to resident as the process is now in the resident list
                                        newProcessControlBlock.processState = "Resident";
                                    }/// if

                                    /// Not enough room to write to the file so roll back process control block changes
                                    else {
                                        /// Undo the increase to resident list size
                                        _ResidentList.size--;
                                    }/// else
                                }/// if

                                /// Not enough room to create the file so roll back process control block changes
                                else {
                                    /// Undo the increase to resident list size
                                    _ResidentList.size--;
                                }
                            }/// if

                            /// Disk ain't formatted doofus!
                            else {
                                _Kernel.krnTrace("Disk is not yet formatted!");
                                _StdOut.putText("You must format the drive disk before use!");
                            }/// else
                        } ///if

                        /// Memory not full...
                        else {
                            /// Free Simple Volume was found
                            var freeSpot: number = _MemoryManager.firstFit();
                            var freeSimpleVolume: SimpleVolume = _MemoryManager.simpleVolumes[freeSpot];

                            /// Create a Process Control Block
                            /// State is "New" until put in resident list
                            var newProcessControlBlock: ProcessControlBlock = new ProcessControlBlock();
                            newProcessControlBlock.processState = "New";

                            /// Set location of the new process in memory segment
                            newProcessControlBlock.volumeIndex = freeSpot;

                            /// Set Priority
                            if (args.length === 1) {
                                /// Getting and cleansing input
                                var trimmedStringPriority: string = args[0].trim();
                                trimmedStringPriority = trimmedStringPriority.toUpperCase().replace(/\s/g, '');
                                if (/^[0-9]+$/i.test(trimmedStringPriority)) {
                                    newProcessControlBlock.priority = parseInt(trimmedStringPriority);
                                }/// if
                            }/// if

                            /// Assign continuosly growing list of process id's and add to list of processes
                            newProcessControlBlock.processID = _ResidentList.size;
                            _ResidentList.size++;
                            _ResidentList.residentList.push(newProcessControlBlock);

                            /// Show user said process id...
                            _StdOut.putText(`Process ID: ${newProcessControlBlock.processID}`);
                            _StdOut.advanceLine();

                            var hexPair: string = '';
                            var logicalAddress: number = 0;
                            for (var pos: number = 0; pos < MAX_SIMPLE_VOLUME_CAPACITY * 2; pos += 2) {

                                /// Read two characters at a time...
                                if (userInput[pos] + userInput[pos + 1]) {
                                    hexPair = userInput[pos] + userInput[pos + 1];
                                }/// if
                                else {
                                    hexPair = '00';
                                }/// else

                                _MemoryAccessor.write(_MemoryManager.simpleVolumes[freeSpot], logicalAddress, hexPair)

                                logicalAddress++;
                            }/// for

                            /// Protect volumes from being written into by accident...
                            /// Each individual address at the memory level will be locked to to prevent such overflow issues
                            freeSimpleVolume.writeLock();

                            /// Nothing went wrong, update pcb state to resident as the process is now in the resident list
                            newProcessControlBlock.processState = "Resident";
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
            }/// if

            /// Too many arguments
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: load <int> Expected 0 or 1 arguments, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else

            /// Update Visual Memory
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
                _StdOut.putText(`${INDENT_STRING}Usage: magic eightball <string>  Please supply a string.`);
            }//if-else
        }/// shellMagicEightball


        /*************************************************************************************
        iProject2 Commands: 
            run <int> - Executes a program in memory
        ***************************************************************************************/

        /// run <int> - Executes a program in memory
        public shellRun(args: string[]) {

            if (args.length === 1) {
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
                        _StdOut.putText(`${INDENT_STRING}No process control blocks found with pid: ${parseInt(args[0])}.`);
                        _StdOut.advanceLine();
                    }/// if

                    /// Process exists in the resident queue
                    else {
                        /// Use interrupt to allow for seemless integration of scheduling
                        /// For example:
                        ///     > run 0
                        ///     ...
                        ///     > run 2
                        ///     > run 1
                        /// No matter what order, should still schedule the processes in round robin fashion...
                        /// Use Single Step to see what's "really" happening...
                        _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(RUN_PROCESS_IRQ, [curr, args[0]]));
                    }/// else
                }/// try
                catch (e) {
                    _StdOut.putText(`${e}`);
                    _StdOut.putText(`${INDENT_STRING}Usage: run <int> please supply a process id.`);
                    _StdOut.advanceLine();
                }/// catch
            }/// if

            /// Not only 1 argument was given
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: run <int> Expected 1 arguments, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
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
        public shellClearMem() {
            /// Processes are NOT running, safe to clear memory
            if (!_CPU.isExecuting || (_Scheduler.currentProcess === null && _Scheduler.readyQueue.getSize() === 0)) {
                /// Grab each volume and write "unlock" them
                for (var vol: number = 0; vol < _MemoryManager.simpleVolumes.length; ++vol) {
                    _MemoryManager.simpleVolumes[vol].writeUnlock();

                    /// Write in 00's for the entire volume
                    for (var logicalAddress: number = 0; logicalAddress < MAX_SIMPLE_VOLUME_CAPACITY; ++logicalAddress) {
                        _MemoryAccessor.write(_MemoryManager.simpleVolumes[vol], logicalAddress, "00");
                    }/// for
                }/// for

                /// Remove processes from the Resident List that were stored in these volumes
                _ResidentList.residentList = _ResidentList.residentList.filter(pcb => (pcb.volumeIndex > 2));

                // words.filter(word => word.length > 6);
                _StdOut.putText(`${INDENT_STRING}Memory Cleared`);
                _StdOut.advanceLine();
            }/// if

            else {
                _StdOut.putText(`${INDENT_STRING}Cannot clear memory while processes running!`);
                _StdOut.advanceLine();
            }/// else

            TSOS.Control.updateVisualMemory();
        }/// clearmem

        /// runall - execute all programs at once
        public shellRunAll() {
            /// Check if the resident queue is full or not...
            if (_ResidentList.residentList.length === 0) {
                _StdOut.putText(`${INDENT_STRING}No process control blocks found.`);
                _StdOut.advanceLine();
            }/// if
            else {
                /// Use interrupt to allow for seemless integration of scheduling
                /// For example:
                ///     > run 0
                ///     ...
                ///     > runall
                /// No matter what order, should still schedule the processes in round robin fashion...
                /// Use Single Step to see what's "really" happening...
                _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(RUN_ALL_PROCESSES_IRQ, []));
            }/// else
        }/// runall

        /// ps - display the PID and state of all processes
        public shellPs() {
            _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(PS_IRQ, []));
        }///ps

        /// kill <pid> - kills one process (specified by process ID)
        public shellKill(args: string[]) {
            if (args.length === 1) {

                /// Check if the resident queue is full or not...
                if (_ResidentList.residentList.length === 0) {
                    _StdOut.putText(`${INDENT_STRING}No process control blocks found.`);
                    _StdOut.advanceLine();
                }/// if
                else {
                    /// Use interrupt to allow for seemless integration of scheduling
                    /// For example:
                    ///     > kill 0
                    ///     ...
                    ///     > killall
                    /// No matter what order, should still kill the processes
                    /// Use Single Step to see what's "really" happening...
                    _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(KILL_PROCESS_IRQ, [args]));
                }/// else
            }/// if

            /// More than one argument was given
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: kill <int> Expected 1 argument, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
        }/// kill

        /// killall - kill all processes
        public shellKillAll() {
            _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(KILL_ALL_PROCESSES_IRQ, []));
        }/// kill all processes

        /// quantum <int> - let the user set the Round Robin Quantum (measured in CPU cycles)
        public shellQuantum(args: string[]) {
            if (_Scheduler.schedulingMethod !== "Round Robin") {
                _StdOut.putText(`${INDENT_STRING}Quantum cannot be changed while using ${_Scheduler.schedulingMethod} schheduling!`);
                _StdOut.advanceLine();
                return;
            }/// if

            /// Check for one argmument
            if (args.length === 1) {
                /// Getting and cleansing input
                var trimmedStringQuanta: string = args[0].trim();
                trimmedStringQuanta = trimmedStringQuanta.toUpperCase().replace(/\s/g, '');

                /// Make sure quantum is in positive decimal
                if (/^[0-9]+$/i.test(trimmedStringQuanta)) {

                    /// Save old quanta
                    var oldDecimalQuanta = _Scheduler.quanta;

                    /// Set the new quantum...
                    /// New quanta must be a positive integer
                    if (parseInt(trimmedStringQuanta, 10) > 0) {
                        /// Could process as interrupt to allow for changing the quantum mid cycle...
                        /// Actually just don't allow it, too much brain damage already...
                        /// interrupt it is
                        _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(CHANGE_QUANTUM_IRQ, [oldDecimalQuanta, parseInt(trimmedStringQuanta, 10)]));
                    }/// else-if

                    /// Invalid Quantum
                    else {

                        _StdOut.putText(`${INDENT_STRING}Usage: quantum <int>  Please supply a positive, non-zero, decimal integer only.`);
                        _StdOut.advanceLine();
                    }/// else
                }/// if

                /// Error, a character other than [0-9] was detected
                else {
                    _StdOut.putText(`${INDENT_STRING}Usage: quantum <int>  Please supply a positive decimal number only.`);
                    _StdOut.advanceLine();
                }/// else
            }/// if 

            /// ERROR, More than one argument given
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: quantum <int> Expected 1 arguments, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
        }/// shellQuantum

        /*****************************************************************************************************
        iProject4 Commands: 
            Disk Operations
                create <filename>: Create the file [filename] and display a message denoting success or failure
                read <filename>: Read and display the contents of [filename] or display an error if something went wrong
                write <filename> "data": Write data inside the quotes to [filename] and display a message denoting success or failure
                delete <filename>: Remove [filename] from storage and display a message denoting success or failure
                format: Initialize all blocks in all sectors in all tracks and display a message denoting success or failure
                ls: List files currently stored on the disk
                format -quick: initialize the first four bytes of every directory and data block
                format -full: same as quick and also initializes bytes 4-63 in directory and data blocks too.
                ls -l: kists all filenames [even hidden ones] as wella s their size and create date.
            Scheduling
                setSchedule <rr, fcfs, priority> - selects a CPU scheduling algorithm
                getSchedule - returns the current CPU scheduling program
        *****************************************************************************************************/

        /// format -full: same as quick and also initializes bytes 4-63 in directory and data blocks too.
        public shellFormat(args) {
            /// No arguments === Normal Format
            /// OR
            /// 1 argument === -quick || -full format
            if (args.length === 0) {
                _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(DISK_IRQ, ['format', 'no-arg']));
            }/// if

            else if (args.length === 1) {
                if (args[0] === '-full' || args[0] === '-quick') {
                    _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(DISK_IRQ, ['format', args[0].toLowerCase()]));
                }/// if

                else {
                    _StdOut.putText(`${INDENT_STRING}Invalid argument: ${args[0]} try instead...`);
                    _StdOut.advanceLine();
                    _StdOut.putText(`${INDENT_STRING}${INDENT_STRING}format`);
                    _StdOut.advanceLine();
                    _StdOut.putText(`${INDENT_STRING}${INDENT_STRING}format -quick`);
                    _StdOut.advanceLine();
                    _StdOut.putText(`${INDENT_STRING}${INDENT_STRING}format -full`);
                    _StdOut.advanceLine();
                }/// else
            }/// else-if

            /// Either negative arguments were (imposibly) given
            /// OR more than 1 arg was given, so complain...
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: format <string> Expected 0 or 1 arguments, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
        }/// shellFormat

        /// create <filename>: Create the file [filename] and display a message denoting success or failure
        public shellCreate(args: string[]) {
            /// Make sure filename.length <= 60 Bytes
            if (args.length === 1) {

                /// no empty file names
                if (args[0].trim().replace(" ", "").length === 0) {
                    _StdOut.putText(`${INDENT_STRING}Usage: create <filename> Expected 1 arguments, but got 0`);
                }/// if

                else {
                    /// Prevent swap file names and hidden file names from being used
                    if (!args[0].startsWith(`${_krnDiskDriver.hiddenFilePrefix}${_krnDiskDriver.swapFilePrefix}`)) {
                        /// Minus 4 Bytes of the block metadata (containing the pointer and what not)
                        if (args[0].length < BLOCK_SIZE_LIMIT - FILE_META_DATA_LENGTH) {
                            _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(DISK_IRQ, ['create', args[0]]));
                        }/// if

                        else {
                            _StdOut.putText(`${INDENT_STRING}Usage: create <filename> Expected <= 60 Bytes, but got ${args.length} Bytes`);
                            _StdOut.advanceLine();
                        }/// else
                    }/// if

                    else {
                        _StdOut.putText(`${INDENT_STRING}Usage: <filename> cannot start with ".!"`);
                        _StdOut.advanceLine();
                    }/// else
                }/// else
            }/// if

            /// More than one argument was given
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: create <filename> Expected 1 arguments, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
        }/// shelCreate

        /// ls: List files currently stored on the disk
        public shellList(args) {
            /// No arguments given so skip hidden files
            if (args.length === 0) {
                /// TODO: create disk interrupt to list files
                _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(DISK_IRQ, ['list', 'no-arg']));
            }/// if

            /// Make sure only one argument is given
            else if (args.length === 1) {

                /// Make sure one arg is "-l" for hidden files
                if (args[0] === "-l") {
                    /// TODO: create disk interrupt to list files
                    _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(DISK_IRQ, ['list', args[0]]));
                }/// if

                else {
                    _StdOut.putText(`${INDENT_STRING}Usage: ls <-l> Expected 0 or 1 arguments, but got ${args.length}`);
                    _StdOut.advanceLine();
                }/// else
            }/// if

            /// More than one argument was given
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: ls <-l> Expected 0 or 1 arguments, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
        }/// shellList

        /// read <filename>: Read and display the contents of [filename] or display an error if something went wrong
        public shellRead(args) {

            /// Make sure only one argument is given
            if (args.length === 1) {

                /// Create read interrupt
                _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(DISK_IRQ, ['read', args[0]]));
            }/// if

            /// More than or less than one argument was given
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: read <filename> Expected 1 argument, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
        }/// read

        public shellWrite(args: string[]) {

            /// At least two args were given...
            if (args.length > 1) {
                var fileName = args.shift();

                /// Concatenate list of args into one string separated by spaces...
                var formattedArgs: string = args.join(' ');

                /// Make sure more than one arg was given
                if (formattedArgs.startsWith('"') && formattedArgs.endsWith('"')) {

                    /// Not a swap file, safe to write too
                    if (!fileName.startsWith('.!')) {
                        /// Create write interrupt
                        _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(DISK_IRQ, ['write', [fileName, formattedArgs.replace(/["]/g, "").trim()]]));
                    }/// if

                    /// Swap file
                    else {
                        _StdOut.putText(`${INDENT_STRING}Cannot write to a swap file!`);
                    }/// else
                }/// if

                /// Text must be in quotes
                else {
                    _StdOut.putText(`${INDENT_STRING}Usage: write <filename> <"[text]"> Expected 2 arguments, but got ${args.length}`);
                    _StdOut.advanceLine();
                }/// else
            }/// if
            /// More than or less than one argument was given
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: write <filename> <"[text]"> Expected 2 arguments, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
        }/// shellWrite

        /// delete <filename>: Remove [filename] from storage
        public shellDelete(args: string[]) {
            /// Make sure only one argument is given
            if (args.length === 1) {

                /// Not a swap file, safe to delete
                if (!args[0].startsWith('.!')) {
                    /// Create delete interrupt
                    _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(DISK_IRQ, ['delete', args[0]]));
                }/// if

                /// Swap file
                else {
                    /// TODO: kill process on disk
                }/// else
            }/// if

            /// More than or less than one argument was given
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: delete <filename> Expected 1 argument, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
        }/// shellDelete

        public shellDefrag(args) {
            if (args.length === 0) {
                _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(DISK_IRQ, ['defrag']));
            }/// else 
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: defrag Expected 0 arguments, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
        }/// shellDefrag

        public shellGetSchedule(args: string[]) {
            if (args.length === 0) {
                _StdOut.putText(`${INDENT_STRING}Current Scheduling Algorithm: ${_Scheduler.schedulingMethod}`);
            }/// if
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: getscedule Expected 0 arguments, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
        }///

        public shellSetSchedule(args: string[]) {
            if (args.length === 1) {
                switch (args[0]) {
                    case ROUND_ROBIN:
                        _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(SET_SCHEDULE_ALGORITHM, [ROUND_ROBIN]));
                        break;
                    case FIRST_COME_FIRST_SERVE:
                        _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(SET_SCHEDULE_ALGORITHM, [FIRST_COME_FIRST_SERVE]));
                        break;
                    case PRIORITY:
                        _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(SET_SCHEDULE_ALGORITHM, [PRIORITY]));
                        break;
                    default:
                        _StdOut.putText(`${INDENT_STRING}Invalid Schedulng Algorithm, try:`);
                        _StdOut.advanceLine();
                        _StdOut.putText(`${INDENT_STRING}${INDENT_STRING}${ROUND_ROBIN}`);
                        _StdOut.advanceLine();
                        _StdOut.putText(`${INDENT_STRING}${INDENT_STRING}${FIRST_COME_FIRST_SERVE}`);
                        _StdOut.advanceLine();
                        _StdOut.putText(`${INDENT_STRING}${INDENT_STRING}${PRIORITY}`);
                        _StdOut.advanceLine();
                        break;
                }/// switch
            }/// if
            else {
                _StdOut.putText(`${INDENT_STRING}Usage: setscedule Expected 1 argument, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
        }/// shellSetSchedule

        public shellRename(args: string[]) {
            if (args.length === 2) {
                var oldFileName: string = args[0].trim().replace(" ", "");
                var newFileName: string = args[1].trim().replace(" ", "");

                /// Don't allow swap files to be renamed
                if (!oldFileName.startsWith(`${_krnDiskDriver.hiddenFilePrefix}${_krnDiskDriver.swapFilePrefix}`)) {
                    var newFileNameInHex: string = _krnDiskDriver.englishToHex(newFileName).toUpperCase();
                    /// make sure data is not too big
                    if (newFileNameInHex.length < 100) {

                        /// New name is not a swap file name
                        if (!newFileName.startsWith(`${_krnDiskDriver.hiddenFilePrefix}${_krnDiskDriver.swapFilePrefix}`)) {

                            /// Interrupt not necessary, unless anyone other than the user is renaming the file...
                            _StdOut.putText(`${INDENT_STRING}${_krnDiskDriver.rename(oldFileName, newFileNameInHex)}`);
                        }/// if

                        /// New filename cannot be a swap file name
                        else {
                            _StdOut.putText(`${INDENT_STRING}New filename cnnot start with${_krnDiskDriver.hiddenFilePrefix}${_krnDiskDriver.swapFilePrefix}`);
                            _StdOut.advanceLine();
                        }/// else
                    }/// if

                    /// new name too big... No Buffer Overflows here!
                    else {
                        _StdOut.putText(`${INDENT_STRING}New filename is too long!`);
                        _StdOut.advanceLine();
                    }/// else

                }/// if

                /// Cannot rename a swap file
                else {
                    _StdOut.putText(`${INDENT_STRING}Cannot rename swap files!`);
                    _StdOut.advanceLine();
                }/// else
            }/// if

            else {
                _StdOut.putText(`${INDENT_STRING}Usage: rename <file> <newname> Expected 2 argument, but got ${args.length}`);
                _StdOut.advanceLine();
            }/// else
        }/// shellRenam

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

            // var q = new PriorityQueue();

            // _StdOut.putText("Testing the priority queue");
            // _StdOut.advanceLine();

            // var z = 10;
            // for (var j = 0; j < 10; ++j) {
            //     q.enqueueInterruptOrPcb({data: `Node: ${j.toString()} | Priority: ${z}`, priority: z});
            //     z--;
            // }/// for

            // _StdOut.putText(`${q.print()}`);
            // _StdOut.advanceLine();

            // for (var g = 0; g < 10; ++g) {
            //     _StdOut.putText(`${q.print()}`);
            // _StdOut.advanceLine();
            //     _StdOut.putText(q.dequeueInterruptOrPcb().data);
            //     _StdOut.advanceLine();
            // }/// for
            /// Onwards to putPrompt();!
        }/// blackLivesMatter
    }/// class
}/// shell
