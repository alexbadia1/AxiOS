/**
 * CPU SCHEDULER: Whenever the CPU becomes idle, the OS must select one of the processes 
 *                in the READY QUEUE to be executed.
 * READY QUEUE: All the processes are "lined-up" waiting for a chance to run on the CPU. 
 *      Various Implementations: 
 *          0.) First-in, Last-out (FIFO)
 *          1.) Priority Queue
 *          2.) Tree
 *          3.) Unordered Linked 
 *      Having a Ready Queue and Resident List should make calculating the AWT much easier 
 *      later... *Cough* *Cough* time spent in the ready queue *Cough* *Cough*
 * 
 * Why Did I Implement them all? 
 * 
 *      If you noticed when I (redundantly) implemeneted the Segmentation algorithms: First-Fit, Worst-Fit, Best-Fit
 *      I aced it on the midterm (not like it was suppose to be hard, these are very simple concepts). BUT...
 * 
 *      I learn best through "doing". The only reason why I still remember half of Gormanly's and Schwartz's information
 *      from Org and Arch and Database is, well, I remember explaining all the concepts to a friend of mine (Brian, who will 
 *      probably have you next semester), stuff with the Arduinos (rolling averages), atomicity and all that jazz.
 *      
 *      Otherwise, teaching me theory from a book is the equivalent to throwing a bunch of mud at a wall and seeing what sticks
 *      (I know. I'm far from the sharpest tool in the shed). This is why I'm glad we're actually coding this...
 *      
 *      So yeah, I implemented them all except SJF, cause well I don't think I can make that graph thing, at least not yet
 *      (again not like this is suppose to be a "hard" class, this is an introductory class to OS's anyway
 *      and like with everything else we're only scraping the surface).
 * 
 */

module TSOS {

    export class Scheduler {

        constructor(
            public quanta: number = 6,
            public startBurst: number = 0,
            public processesMetaData: any[] = [],
            public unInterleavedOutput: string[] = [],
            public processTurnaroundTime: number[] = [],
            public readyQueue: ProcessControlBlock[] = [],
            public currentProcess: ProcessControlBlock = null,
        ) { }/// constructor

        public init() {
            this.startBurst = 0;
            this.readyQueue = [];
            this.currentProcess = null;
            this.processesMetaData = [];
            this.unInterleavedOutput = [];
        }/// init

        public scheduleProcess(newProcess: ProcessControlBlock): boolean {
            /// Give feedback if the process was successfuly scheduled or not
            var success = false;

            /// Kernel mode to schedule processes
            _Mode = 0;

            /// Ensure a new process is passed
            if (newProcess !== null) {
                /// Round Robin Scheduling allows us to just keep enqueueing processes
                newProcess.processState = "Ready";

                /// Put the first process in the current process "slot"
                if (this.currentProcess === null) {
                    _Kernel.krnTrace(`Process ${newProcess.processID} set as first process`);
                    this.currentProcess = newProcess;
                    _Dispatcher.setNewProcessToCPU( this.currentProcess);
                }/// if

                /// Put the remaining process in the ready queue
                else {
                    _Kernel.krnTrace(`Process ${newProcess.processID} added to ready queue`);
                    this.readyQueue.push(newProcess);
                }/// else

                /// Process scheduled successfully
                success = true;
            }/// if

            return success;
            /// More...?
            /// TODO: Implement the other types of scheuling...
            // public firstComeFirstServeSchedule() { }
            // public preEmptivePriority() { }
            // public prioritySchedule() { }
        }/// scheduleProcess

        public runSchedule(aNewProcessWasLoaded: boolean = true) {
            /// Kernel Mode
            _Mode = 0;
            /// Make sure there are process loaded in the ready queue or
            /// in the current process slot
            if (this.readyQueue.length === 0 && this.currentProcess === null) {
                /// Don't stop the cpu from executing, as it may already be executing other process
                _StdOut.putText("No process found either loaded or not already terminated, running, scheduled.");
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            }/// if
            else if (!aNewProcessWasLoaded) {
                _StdOut.putText("No new process found to run!");
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            }/// else 
            else {
                _CPU.isExecuting = true;
                /// Program is running so User Mode
                _Mode = 1;
            }/// else
        }/// runSchedule

        public roundRobinCheck(): void {
            /// Back to kernel mode for quantum and termination check
            _Kernel.krnTrace(`Kernel Mode Activated...`);
            _Kernel.krnTrace(`Round Robin Qunatum Check!`);
            _Mode = 0;

            /// Current Process has terminated either Right On or Before quanta limit:
            if (this.currentProcess.processState === "Terminated") {
                _Kernel.krnTrace(`Current process ${this.currentProcess.processID} terminated.`);

                /// Context Switch but don't put current process back in process queue
                if (this.readyQueue.length > 0) {
                    _Kernel.krnTrace(`Another process was found in Ready Queue, issuing context switch...`);

                    /// Queue interrupt for context switch
                    _KernelInterruptPriorityQueue.enqueue(new Node (new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [])));
                    
                    /// Grab the procress' output, time spent executing, time spent waiting, turnaround time
                    _Kernel.krnTrace(`Collecting process ${this.currentProcess.processID} metadata before context switch.`);
                    var turnAroundTime = (this.currentProcess.timeSpentExecuting + this.currentProcess.waitTime);
                    this.unInterleavedOutput.push(`Pid ${this.currentProcess.processID}: ${this.currentProcess.outputBuffer}`); 
                    this.processesMetaData.push([
                        this.currentProcess.processID, 
                        this.currentProcess.timeSpentExecuting,
                        this.currentProcess.waitTime, 
                        turnAroundTime,
                    ]);

                    /// Reset the starting burst for the next new process
                    _Kernel.krnTrace(`Updating relative starting burst...`);
                    this.startBurst = _CPU_BURST;

                    /// Back to running programs
                    _Kernel.krnTrace(`User Mode Activated`);
                    _Mode = 1;
                }/// if

                /// Final process terminated!
                /// Stop the CPU, grab scedule metadata and show it to the user and reset the scheduler
                ///
                /// TODO: Implement as an interrupt
                else {
                    _Kernel.krnTrace(`No more process found in Ready Queue, preparing to clear scheduler...`);
                    /// Stay in Kernel Mode
                    _Mode = 0;
                    
                    /// Stop CPU execution since all processe are terminated
                    _CPU.isExecuting = false;

                    /// Grab the final procresses' output, time spent executing, time spent waiting, turnaround time
                    _Kernel.krnTrace(`Collecting final process ${this.currentProcess.processID} metadata.`);
                    var turnAroundTime = (this.currentProcess.timeSpentExecuting + this.currentProcess.waitTime);
                    this.unInterleavedOutput.push(`Pid ${this.currentProcess.processID}: ${this.currentProcess.outputBuffer}`);
                    this.processesMetaData.push([
                        this.currentProcess.processID, 
                        this.currentProcess.timeSpentExecuting,
                        this.currentProcess.waitTime, 
                        turnAroundTime,
                    ]);

                    /// Show user schedule metadata
                    _Kernel.krnTrace(`Dumping all processes metadata...`);
                    TSOS.Control.dumpScheduleMetaData();

                    /// Clear scheduling metadata
                    _Kernel.krnTrace(`Clearing Scheduler...`);
                    _CPU_BURST = 0;
                    this.init();
                }/// else
            }/// if

            /// Current process has not terminated but the quantum was reached:
            else if ((_CPU_BURST - this.startBurst) >= this.quanta) {
                /// Context Switch but put process back in process queue
                if (this.readyQueue.length > 0) {
                    _Kernel.krnTrace(`Process ${this.currentProcess.processID} quantum reached, issuing context switch...`);
                    /// Queue interrupt for context switch
                    _KernelInterruptPriorityQueue.enqueue(new Node(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [])));

                    /// Reset the starting burst for the next new process
                    this.startBurst = _CPU_BURST;

                }/// if
                else {
                    _Kernel.krnTrace(`Process ${this.currentProcess.processID} is the final process, renewing quantum...`);
                    /// There is one process left "in" the scheduler so keep renewing
                    /// its quantum to let the process run as it will termination.
                    this.startBurst = _CPU_BURST;
                }///else

                /// Back to running programs
                _Kernel.krnTrace(`User Mode Activated!`);
                _Mode = 0;
            }/// if
        }/// roundRobinCheck
    }/// class
}/// module