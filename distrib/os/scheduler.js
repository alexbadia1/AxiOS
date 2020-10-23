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
 *      from Org and Arch and Database is well, I remember explaining all the concepts to a friend of mine (Brian, who will
 *      probably have you next semester). Stuff with the Arduinos (rolling averages), Atomicity and all that jazz.
 *
 *      Otherwise, teaching me theory from a book is the equivalent to throwing a bunch of mud at a wall and seeing what sticks
 *      (I know, I'm not the sharpest tool in the shed). This is why I'm glad we're actually coding this...
 *
 *      So yeah, I implemented them all (again not like this is suppose to be a "hard" class, this is an introductory class to OS's anyway
 *         and like with everything else we're only scraping the surface).
 *
 */
var TSOS;
(function (TSOS) {
    class Scheduler {
        constructor(quanta = 6, startBurst = 0, processesMetaData = [], unInterleavedOutput = [], processTurnaroundTime = [], readyQueue = [], currentProcess = null) {
            this.quanta = quanta;
            this.startBurst = startBurst;
            this.processesMetaData = processesMetaData;
            this.unInterleavedOutput = unInterleavedOutput;
            this.processTurnaroundTime = processTurnaroundTime;
            this.readyQueue = readyQueue;
            this.currentProcess = currentProcess;
        } /// constructor
        init() {
            this.startBurst = 0;
            this.readyQueue = [];
            this.currentProcess = null;
            this.processesMetaData = [];
            this.unInterleavedOutput = [];
        } /// init
        scheduleProcess(newProcess) {
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
                    this.currentProcess = newProcess;
                    _Dispatcher.setNewProcessToCPU(this.currentProcess);
                } /// if
                /// Put the remaining process in the ready queue
                else {
                    this.readyQueue.push(newProcess);
                } /// else
                /// Process scheduled successfully
                success = true;
            } /// if
            return success;
            /// More...?
            /// TODO: Implement the other types of scheuling...
            // public firstComeFirstServeSchedule() { }
            // public preEmptivePriority() { }
            // public prioritySchedule() { }
        } /// scheduleProcess
        runSchedule(aNewProcessWasLoaded = true) {
            /// Kernel Mode
            _Mode = 0;
            /// Make sure there are process loaded in the ready queue or
            /// in the current process slot
            if (this.readyQueue.length === 0 && this.currentProcess === null) {
                /// Don't stop the cpu from executing, as it may already be executing other process
                _StdOut.putText("No process found either loaded or not already terminated, running, scheduled.");
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            } /// if
            else if (!aNewProcessWasLoaded) {
                _StdOut.putText("No new process found to run!");
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            } /// else 
            else {
                _CPU.isExecuting = true;
                /// Program is running so User Mode
                _Mode = 0;
            } /// else
        } /// runSchedule
        roundRobinCheck() {
            /// Back to kernel mode for quantum and termination check
            _Mode = 0;
            /// Current Process has terminated either Right On or Before quanta limit:
            if (this.currentProcess.processState === "Terminated") {
                /// Context Switch but don't put current process back in process queue
                if (this.readyQueue.length > 0) {
                    /// Queue interrupt for context switch
                    _KernelInterruptPriorityQueue.enqueue(new TSOS.Node(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [])));
                    /// Grab the procress' output, time spent executing, time spent waiting, turnaround time
                    var turnAroundTime = (this.currentProcess.timeSpentExecuting + this.currentProcess.waitTime);
                    this.unInterleavedOutput.push(`Pid ${this.currentProcess.processID}: ${this.currentProcess.outputBuffer}`);
                    this.processesMetaData.push([
                        this.currentProcess.processID,
                        this.currentProcess.timeSpentExecuting,
                        this.currentProcess.waitTime,
                        turnAroundTime,
                    ]);
                    /// Reset the starting burst for the next new process
                    this.startBurst = _CPU_BURST;
                    /// Back to running programs
                    _Mode = 0;
                } /// if
                /// Final process terminated!
                /// Stop the CPU, grab scedule metadata and show it to the user and reset the scheduler
                ///
                /// TODO: Implement as an interrupt
                else {
                    /// Stay in Kernel Mode
                    _Mode = 0;
                    /// Stop CPU execution since all processe are terminated
                    _CPU.isExecuting = false;
                    /// Grab the final procresses' output, time spent executing, time spent waiting, turnaround time
                    var turnAroundTime = (this.currentProcess.timeSpentExecuting + this.currentProcess.waitTime);
                    this.unInterleavedOutput.push(`Pid ${this.currentProcess.processID}: ${this.currentProcess.outputBuffer}`);
                    this.processesMetaData.push([
                        this.currentProcess.processID,
                        this.currentProcess.timeSpentExecuting,
                        this.currentProcess.waitTime,
                        turnAroundTime,
                    ]);
                    /// Show user schedule metadata
                    TSOS.Control.dumpScheduleMetaData();
                    /// Clear scheduling metadata
                    _CPU_BURST = 0;
                    this.init();
                } /// else
            } /// if
            /// Current process has not terminated but the quantum was reached:
            else if ((_CPU_BURST - this.startBurst) >= this.quanta) {
                /// Context Switch but put process back in process queue
                if (this.readyQueue.length > 0) {
                    /// Queue interrupt for context switch
                    _KernelInterruptPriorityQueue.enqueue(new TSOS.Node(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [])));
                    /// Reset the starting burst for the next new process
                    this.startBurst = _CPU_BURST;
                } /// if
                else {
                    /// There is one process left "in" the scheduler so keep renewing
                    /// its quantum to let the process run as it will termination.
                    this.startBurst = _CPU_BURST;
                } ///else
                /// Back to running programs
                _Mode = 0;
            } /// if
        } /// roundRobinCheck
    } /// class
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {})); /// module
//# sourceMappingURL=scheduler.js.map