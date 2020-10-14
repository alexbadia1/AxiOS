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
 */
var TSOS;
(function (TSOS) {
    class Scheduler {
        constructor(quantum = 1, currentProcessControlBlock = null, relativeStartingBurst = 0, readyQueue = []) {
            this.quantum = quantum;
            this.currentProcessControlBlock = currentProcessControlBlock;
            this.relativeStartingBurst = relativeStartingBurst;
            this.readyQueue = readyQueue;
        } /// constructor
        scheduleProcess(newPcb) {
            /// Round Robin Scheduling allows us to just keep enqueing processes
            newPcb.processState = "Ready";
            this.readyQueue.push(newPcb);
            /// More...?
        } /// loadReadyQueue
        quantumCheck(baseCase = false) {
            /// Stop CPU for Context Switch
            _CPU.isExecuting = false;
            // _StdOut.putText("Quantum Check!");
            /// This IS the FIRST quantum check initialize the relative starting burst
            /// and attach the very first process from the Ready Queue to the CPU.
            if (baseCase === true) {
                /// Set relative starting burst to count from
                this.relativeStartingBurst = _CPU_BURST;
                /// Grab the process from the Ready Queue
                this.currentProcessControlBlock = _Scheduler.readyQueue.shift();
                /// Attach the process to the CPU
                _Dispatcher.attachNewPcbToCPU();
            } ///if
            /// This is NOT the FIRST quantum check, meaning there is already a relative base
            /// or "first" burst count to reference our counting from.
            ///
            /// Quantum expires when the CPU Burst is the: (Starting CPU Burst + Quantum)
            else if ((this.relativeStartingBurst + this.quantum) === _CPU_BURST) {
                /// Grab the another process from the Ready Queue
                this.currentProcessControlBlock = _Scheduler.readyQueue.shift();
                /// Attach the process to the CPU
                _Dispatcher.attachNewPcbToCPU();
                /// Before we begin CPU execution, Update Relative Starting Burst
                this.relativeStartingBurst = _CPU_BURST;
            } /// if
            /// Context Swich Complete Continue CPU Execution
            this.currentProcessControlBlock.processState = "Running";
            _CPU.isExecuting = true;
        } /// roundRobin
    } /// class
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {})); /// module
//# sourceMappingURL=scheduler.js.map