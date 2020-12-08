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
 */
var TSOS;
(function (TSOS) {
    class Scheduler {
        constructor(quanta = 6, fcfsQuanta = Number.MAX_SAFE_INTEGER, isFcFcQuantaInUse = false, startBurst = 0, processesMetaData = [], unInterleavedOutput = [], processTurnaroundTime = [], readyQueue = new TSOS.PriorityQueue(), currentProcess = null, schedulingMethod = ROUND_ROBIN) {
            this.quanta = quanta;
            this.fcfsQuanta = fcfsQuanta;
            this.isFcFcQuantaInUse = isFcFcQuantaInUse;
            this.startBurst = startBurst;
            this.processesMetaData = processesMetaData;
            this.unInterleavedOutput = unInterleavedOutput;
            this.processTurnaroundTime = processTurnaroundTime;
            this.readyQueue = readyQueue;
            this.currentProcess = currentProcess;
            this.schedulingMethod = schedulingMethod;
            /// this.readyQueue = this.schedulingMethod === 'Round Robin'? new Queue() : new PriorityQueue();
        } /// constructor
        init() {
            this.startBurst = 0;
            /// this.readyQueue = this.schedulingMethod === 'Round Robin'? new Queue() : new PriorityQueue();
            this.readyQueue = new TSOS.PriorityQueue();
            this.currentProcess = null;
            this.processesMetaData = [];
            this.unInterleavedOutput = [];
        } /// init
        scheduleProcess(newPcb) {
            var success = false;
            switch (this.schedulingMethod) {
                case ROUND_ROBIN:
                    this.swapToUserQuantum();
                    success = this.scheduleAsRoundRobin(newPcb);
                    break;
                case FIRST_COME_FIRST_SERVE:
                    /// FCFS is basically round robin with an infinite quantum...
                    this.swapToFcFsQuantum();
                    success = this.scheduleAsRoundRobin(newPcb);
                    break;
                case PRIORITY:
                    success = this.scheduleAsPriority(newPcb);
                    break;
                default:
                    break;
            } /// switch
            return success;
        } /// scheduleProcess
        runSchedule(aNewProcessWasLoaded = true) {
            /// Kernel Mode
            _Mode = 0;
            /// Make sure there are process loaded in the ready queue or
            /// in the current process slot
            if (this.readyQueue.getSize() === 0 && this.currentProcess === null) {
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
                /// Set first process and update pcb
                if (this.currentProcess === null) {
                    this.currentProcess = this.readyQueue.dequeueInterruptOrPcb();
                    this.currentProcess.processState === "Running";
                    _Dispatcher.setNewProcessToCPU(this.currentProcess);
                    TSOS.Control.updateVisualPcb();
                } /// if
                _CPU.isExecuting = true;
                /// Program is running so User Mode
                _Mode = 1;
            } /// else
        } /// runSchedule
        checkSchedule() {
            var success = false;
            switch (this.schedulingMethod) {
                case ROUND_ROBIN:
                    this.roundRobinCheck();
                    break;
                case FIRST_COME_FIRST_SERVE:
                    this.roundRobinCheck();
                    break;
                case PRIORITY:
                    this.priorityCheck();
                    break;
                default:
                    _Kernel.krnTrace(`Scheduling Method ${this.schedulingMethod} not recognized!`);
                    break;
            } /// switch
            return success;
        } /// checkSchedule
        scheduleAsPriority(newProcess) {
            /// Give feedback if the process was successfuly scheduled or not
            var success = false;
            /// Kernel mode to schedule processes
            _Mode = 0;
            /// Ensure a new process was passed 
            if (newProcess !== null) {
                /// Enqueue the process
                newProcess.processState = "Ready";
                newProcess.swapToUserPriority();
                this.readyQueue.enqueueInterruptOrPcb(newProcess);
                /// Process scheduled successfully
                _Kernel.krnTrace(`Process ${newProcess.processID} added to ready queue`);
                success = true;
            } /// if
            return success;
        } /// public
        priorityCheck() {
            /// Current Process Terminated...
            if (this.currentProcess.processState === "Terminated") {
                _Kernel.krnTrace(`Current process ${this.currentProcess.processID} terminated.`);
                /// Context Switch
                this.attemptContextSwitch();
            } /// if
        } /// piorityCheck()
        scheduleAsRoundRobin(newProcess) {
            /// Give feedback if the process was successfuly scheduled or not
            var success = false;
            /// Kernel mode to schedule processes
            _Mode = 0;
            /// Ensure a new process is passed
            if (newProcess !== null) {
                /// Enqueue the process
                newProcess.processState = "Ready";
                newProcess.swapToDefaultPriority();
                this.readyQueue.enqueueInterruptOrPcb(newProcess);
                /// Process scheduled successfully
                _Kernel.krnTrace(`Process ${newProcess.processID} added to ready queue`);
                success = true;
            } /// if
            return success;
        } /// scheduleAsRoundRobin
        roundRobinCheck() {
            /// Back to kernel mode for quantum and termination check
            _Kernel.krnTrace(`Kernel Mode Activated...`);
            _Kernel.krnTrace(`Round Robin Quantum Check!`);
            _Mode = 0;
            /// Current Process has terminated either Right On or Before quanta limit:
            if (this.currentProcess.processState === "Terminated") {
                _Kernel.krnTrace(`Current process ${this.currentProcess.processID} terminated.`);
                /// Context Switch
                this.attemptContextSwitch();
            } /// if
            /// Current process has not terminated but the quantum was reached:
            else if ((_CPU_BURST - this.startBurst) >= this.quanta) {
                /// Context Switch but put process back in process queue
                if (this.readyQueue.getSize() > 0) {
                    _Kernel.krnTrace(`Process ${this.currentProcess.processID} quantum reached, issuing context switch...`);
                    /// Queue interrupt for context switch
                    _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, []));
                    /// Reset the starting burst for the next new process
                    this.startBurst = _CPU_BURST;
                } /// if
                else {
                    _Kernel.krnTrace(`Process ${this.currentProcess.processID} is the final process, renewing quantum...`);
                    /// There is one process left "in" the scheduler so keep renewing
                    /// its quantum to let the process run as it will termination.
                    this.startBurst = _CPU_BURST;
                } ///else
                /// Back to running programs
                _Kernel.krnTrace(`User Mode Activated!`);
                _Mode = 0;
            } /// if
        } /// roundRobinCheck
        attemptContextSwitch() {
            /// Context Switch but don't put current process back in process queue
            if (this.readyQueue.getSize() > 0) {
                _Kernel.krnTrace(`Another process was found in Ready Queue, issuing context switch...`);
                /// Queue interrupt for context switch
                _KernelInterruptPriorityQueue.enqueueInterruptOrPcb(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, []));
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
            } /// if
            /// Final process terminated!
            /// Stop the CPU, grab scedule metadata and show it to the user and reset the scheduler
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
                TSOS.Control.updateVisualPcb();
            } /// else
        } /// requestContextSwitch
        swapToFcFsQuantum() {
            if (!this.isFcFcQuantaInUse) {
                var temp = this.quanta;
                this.quanta = this.fcfsQuanta;
                this.fcfsQuanta = temp;
                this.isFcFcQuantaInUse = true;
            } /// if
        } ///swapToFcFsQuantum
        swapToUserQuantum() {
            if (this.isFcFcQuantaInUse) {
                var temp = this.fcfsQuanta;
                this.fcfsQuanta = this.quanta;
                this.quanta = temp;
                this.isFcFcQuantaInUse = false;
            } /// if
        } ///swapToUserQuantum
    } /// class
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {})); /// module
//# sourceMappingURL=scheduler.js.map