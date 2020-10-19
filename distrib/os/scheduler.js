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
        constructor(quanta = 6, startBurst = 0, unInterleavedOutput = [], processWaitTimes = [], processTimeSpentExecuting = [], processTurnaroundTime = [], readyQueue = [], currentProcess = null) {
            this.quanta = quanta;
            this.startBurst = startBurst;
            this.unInterleavedOutput = unInterleavedOutput;
            this.processWaitTimes = processWaitTimes;
            this.processTimeSpentExecuting = processTimeSpentExecuting;
            this.processTurnaroundTime = processTurnaroundTime;
            this.readyQueue = readyQueue;
            this.currentProcess = currentProcess;
        } /// constructor
        /******************************
         * Ready Queue Helper Methods *
         ******************************/
        terminatedAllProcess() {
            this.currentProcess.processState = "Terminated";
            for (var i = 0; i < this.readyQueueLength(); ++i) {
                this.readyQueue[i].processState = "Terminated";
            } /// for
        } /// terminateAllProcess
        incrementWaitTime() {
            /// Loop through Ready Queue and increment each pcb's
            /// wait time by 1
            for (var i = 0; i < this.readyQueueLength(); ++i) {
                this.readyQueue[i].waitTime += 1;
            } /// for
        } /// incrementWaitTime
        readyQueueLength() {
            return this.readyQueue.length;
        } /// getReadyQueue
        readyQueueEnqueue(newPcb) {
            return this.readyQueue.push(newPcb) > 0;
        } /// readyQueueEnqueue
        readyQueueDequeue() {
            return _Scheduler.readyQueue.shift();
        } /// readyQueueDequeue
        /**********************************
         * Current Process Helper Methods *
         **********************************/
        incrementTimeExecuting() {
            this.currentProcess.timeSpentExecuting += 1;
        } /// incrementTimeExecuting
        hasCurrentProcess() {
            return _Scheduler.currentProcess !== null;
        } /// hasCurrentProcess
        getCurrentProcess() {
            return this.currentProcess;
        } /// getCurrentProcess
        setCurrentProcess(newProcess) {
            this.currentProcess = newProcess;
        } /// getCurrentProcess
        getCurrentProcessState() {
            return this.currentProcess.processState;
        } /// getCurrentProcessState
        setCurrentProcessState(newProcessState) {
            this.currentProcess.processState = newProcessState;
        } /// setCurrentProcessState
        /*******************************
         *    Scheduling Algorithms    *
         ******************************/
        scheduleProcess(newProcess) {
            var ans = false;
            /// Round Robin Scheduling allows us to just keep enqueing processes
            newProcess.processState = "Ready";
            if (this.currentProcess === null) {
                this.currentProcess = newProcess;
                _Dispatcher.setNewProcessToCPU(this.currentProcess);
                ans = true;
            } /// if
            else {
                this.readyQueue.push(newProcess);
                ans = true;
            } /// else
            /// More...?
            return ans;
        } /// scheduleProcess
        runSchedule(aNewProcessWasLoaded = true) {
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
            } /// else
        } /// runSchedule
        roundRobinCheck() {
            /// Current Process has terminated either Right On or Before quanta limit:
            if (this.currentProcess.processState === "Terminated") {
                /// Context Switch but don't put current process back in process queue
                if (this.readyQueue.length > 0) {
                    /// Queue interrupt for context switch
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH, []));
                    /// Grab the procress' output, time spent executing, time spent waiting
                    this.unInterleavedOutput.push(`Pid ${this.currentProcess.processID}: ${this.currentProcess.outputBuffer}`);
                    this.processTimeSpentExecuting.push([this.currentProcess.timeSpentExecuting, this.currentProcess.processID]);
                    this.processWaitTimes.push([this.currentProcess.waitTime, this.currentProcess.processID]);
                    /// Reset the starting burst for the next new process
                    this.startBurst = _CPU_BURST;
                } /// if
                else {
                    /// TODO: Preferably End Scheduled Session With Interrupt
                    _CPU.isExecuting = false;
                    /// Grab the final procress' output, time spent executing, time spent waiting
                    this.unInterleavedOutput.push(`Pid ${this.currentProcess.processID}: ${this.currentProcess.outputBuffer}`);
                    this.processTimeSpentExecuting.push([this.currentProcess.timeSpentExecuting, this.currentProcess.processID]);
                    this.processWaitTimes.push([this.currentProcess.waitTime, this.currentProcess.processID]);
                    /// Print each process order in a readable fashion
                    _StdOut.advanceLine();
                    _StdOut.putText("Schedule Terminated!");
                    _StdOut.advanceLine();
                    _StdOut.putText("...");
                    _StdOut.advanceLine();
                    _StdOut.putText("Schedule Metadata:");
                    _StdOut.advanceLine();
                    _StdOut.putText(`  Quantum used: ${this.quanta}, Total CPU Bursts: ${_CPU_BURST}`);
                    _StdOut.advanceLine();
                    _StdOut.putText("...");
                    _StdOut.advanceLine();
                    /// Show scheduling and processes data
                    this.showCPUBurstUsage();
                    this.showTurnaroundTimes();
                    this.showWaitTimes();
                    this.showProcessesOutputs();
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    /// Clear scheduling metadata
                    _CPU_BURST = 0;
                    this.startBurst = 0;
                    this.unInterleavedOutput = [];
                    this.processWaitTimes = [];
                    this.processTimeSpentExecuting = [];
                    this.processTurnaroundTime = [];
                    this.readyQueue = [];
                    this.currentProcess = null;
                } /// else
            } /// if
            /// Current process has not terminated but the quanta was reached:
            else if ((_CPU_BURST - this.startBurst) === this.quanta) {
                /// Context Switch but put process back in process queue
                if (this.readyQueue.length > 0) {
                    /// Queue interrupt for context switch
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH, []));
                    /// Reset the starting burst for the next new process
                    this.startBurst = _CPU_BURST;
                } /// if
                else {
                    /// There is one process left "in" the scheduler so keep renewing
                    /// its quanta to let the process run as it will termination.
                    this.startBurst = _CPU_BURST;
                } ///else
            } /// if
        } /// roundRobinCheck
        calculateAverageWaitTime() {
            var ans = 0;
            for (var i = 0; i < this.processWaitTimes.length; ++i) {
                ans += this.processWaitTimes[i][0];
            } ///for
            return ans / this.processWaitTimes.length;
        } /// calculateAverageWaitTime
        calculateAverageTurnaroundTime() {
            var ans = 0;
            for (var i = 0; i < this.processWaitTimes.length; ++i) {
                var turnaroundTime = this.processWaitTimes[i][0] + this.processTimeSpentExecuting[i][0];
                this.processTurnaroundTime.push(turnaroundTime);
            } /// for
            for (var i = 0; i < this.processTurnaroundTime.length; ++i) {
                ans += this.processTurnaroundTime[i];
            } ///for
            return ans / this.processTurnaroundTime.length;
        } /// calculateAverageWaitTime
        showCPUBurstUsage() {
            _StdOut.putText("Scheduled Processes CPU Burst Usage (cycles):");
            _StdOut.advanceLine();
            for (var i = 0; i < this.processTimeSpentExecuting.length; ++i) {
                i === 0 ?
                    _StdOut.putText(`  Pid ${this.processTimeSpentExecuting[i][1]}: ${this.processTimeSpentExecuting[i][0]}`)
                    : _StdOut.putText(`Pid ${this.processTimeSpentExecuting[i][1]}: ${this.processTimeSpentExecuting[i][0]}`);
                if (i !== this.processTimeSpentExecuting.length - 1) {
                    _StdOut.putText(", ");
                } /// if
            } ///for
            _StdOut.advanceLine();
            _StdOut.putText("...");
            _StdOut.advanceLine();
        } /// showCPUBurstUsage
        showWaitTimes() {
            _StdOut.putText("Scheduled Processes Wait Time (cycles):");
            _StdOut.advanceLine();
            _StdOut.putText(`  AWT: ${Math.ceil(this.calculateAverageWaitTime())}, `);
            for (var i = 0; i < this.processWaitTimes.length; ++i) {
                _StdOut.putText(`Pid ${this.processWaitTimes[i][1]}: ${this.processWaitTimes[i][0]}`);
                if (i !== this.processTimeSpentExecuting.length - 1) {
                    _StdOut.putText(", ");
                } /// if
            } ///for
            _StdOut.advanceLine();
            _StdOut.putText("...");
            _StdOut.advanceLine();
        } /// showWaitTimes()
        showTurnaroundTimes() {
            _StdOut.putText("Scheduled Processes Turnaround Time (cycles):");
            _StdOut.advanceLine();
            _StdOut.putText(`  ATT: ${Math.ceil(this.calculateAverageTurnaroundTime())}, `);
            for (var i = 0; i < this.processTurnaroundTime.length; ++i) {
                var turnaroundTime = this.processWaitTimes[i][0] + this.processTimeSpentExecuting[i][0];
                _StdOut.putText(`Pid ${this.processWaitTimes[i][1]}: ${turnaroundTime}`);
                if (i !== this.processTimeSpentExecuting.length - 1) {
                    _StdOut.putText(", ");
                } /// if
            } ///for
            _StdOut.advanceLine();
            _StdOut.putText("...");
            _StdOut.advanceLine();
        } /// showTurnaroundTimes
        showProcessesOutputs() {
            _StdOut.putText("Dumping Processes Output(s):");
            _StdOut.advanceLine();
            for (var i = 0; i < this.unInterleavedOutput.length; ++i) {
                _StdOut.putText(`  ${this.unInterleavedOutput[i]}`);
                if (i !== this.unInterleavedOutput.length - 1)
                    _StdOut.advanceLine();
            } ///for
        } /// showProcessesOutputs
    } /// class
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {})); /// module
//# sourceMappingURL=scheduler.js.map