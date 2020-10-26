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

module TSOS {

    export class Scheduler {

        constructor(
            public quanta: number = 6,
            public startBurst: number = 0,
            public processesMetaData: any[] = [],
            public unInterleavedOutput: string[] = [],
            public processTurnaroundTime: number[] = [],
            public readyQueue = new PriorityQueue(),
            public currentProcess: ProcessControlBlock = null,
            public schedulingMethod = "Round Robin",
        ) { }/// constructor

        public init() {
            this.startBurst = 0;
            this.readyQueue = new PriorityQueue();
            this.currentProcess = null;
            this.processesMetaData = [];
            this.unInterleavedOutput = [];
        }/// init

        public scheduleProcess(newPcb: ProcessControlBlock): boolean {
            var success: boolean = false;
            switch (this.schedulingMethod) {
                case "Round Robin":
                    success = this.scheduleAsRoundRobin(newPcb);
                    break;
                case "First Come First Serve":
                    /// FCFS is basically round robin with an infinite quantum...
                    this.quanta = Number.MAX_SAFE_INTEGER;
                    success = this.scheduleAsRoundRobin(newPcb);
                    break;
                /// Make this extra credit and I'll do it...
                /// I already have a priority queue implemented
                /// case "Non-Preemptive Priority":
                    /// break;
                /// case "Preemptive Priority":
                    /// break;
                default: 
                    break;
            }/// switch

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
            if (this.readyQueue.getSize() === 0 && this.currentProcess === null) {
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

        public checkSchedule() {
            var success: boolean = false;
            switch (this.schedulingMethod) {
                case "Round Robin":
                    this.roundRobinCheck();
                    break;
                case "First Come First Serve":
                    this.roundRobinCheck();
                    break;
                /// Make this extra credit and I'll do it...
                /// I already have a priority queue implemented
                /// case "Non-Preemptive Priority":
                    /// break;
                /// case "Preemptive Priority":
                    /// break;
                default: 
                    break;
            }/// switch

            return success;
            /// More...?
            /// TODO: Implement the other types of scheuling...
            // public firstComeFirstServeSchedule() { }
            // public preEmptivePriority() { }
            // public prioritySchedule() { }
        }/// checkSchedule

        public scheduleAsRoundRobin(newProcess: ProcessControlBlock): boolean {
             /// Give feedback if the process was successfuly scheduled or not
             var success = false;

             /// Kernel mode to schedule processes
             _Mode = 0;

             /// Ensure a new process is passed
             if (newProcess !== null) {
                 /// Put the first process in the current process "slot"
                 if (this.currentProcess === null) {
                     /// Round Robin Scheduling allows us to just keep enqueueing processes
                     newProcess.processState = "Running";
                     _Kernel.krnTrace(`Process ${newProcess.processID} set as first process`);
                     this.currentProcess = newProcess;
                     _Dispatcher.setNewProcessToCPU(this.currentProcess);
                 }/// if

                 /// Put the remaining process in the ready queue
                 else {
                     /// Round Robin Scheduling allows us to just keep enqueueing processes
                     newProcess.processState = "Ready";
                     _Kernel.krnTrace(`Process ${newProcess.processID} added to ready queue`);
                     this.readyQueue.enqueue(newProcess);
                 }/// else

                 /// Process scheduled successfully
                 success = true;
             }/// if

             return success;
        }/// scheduleAsRoundRobin

        public roundRobinCheck(): void {
            /// Back to kernel mode for quantum and termination check
            _Kernel.krnTrace(`Kernel Mode Activated...`);
            _Kernel.krnTrace(`Round Robin Qunatum Check!`);
            _Mode = 0;

            /// Current Process has terminated either Right On or Before quanta limit:
            if (this.currentProcess.processState === "Terminated") {
                _Kernel.krnTrace(`Current process ${this.currentProcess.processID} terminated.`);

                /// Context Switch but don't put current process back in process queue
                if (this.readyQueue.getSize() > 0) {
                    _Kernel.krnTrace(`Another process was found in Ready Queue, issuing context switch...`);

                    /// Queue interrupt for context switch
                    _KernelInterruptPriorityQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, []));

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
                if (this.readyQueue.getSize() > 0) {
                    _Kernel.krnTrace(`Process ${this.currentProcess.processID} quantum reached, issuing context switch...`);
                    /// Queue interrupt for context switch
                    _KernelInterruptPriorityQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, []));

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