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

module TSOS {

    export class Scheduler {

        constructor(
            public quanta: number = 6,
            public currentProcess: ProcessControlBlock = null,
            public startBurst: number = 0,
            public readyQueue: ProcessControlBlock[] = [],
        ) { }/// constructor

        public scheduleProcess(newProcess: ProcessControlBlock) { 
            /// Round Robin Scheduling allows us to just keep enqueing processes
            newProcess.processState = "Ready";
            if (this.currentProcess === null) {
                this.currentProcess = newProcess;
                _Dispatcher.setNewProcessToCPU( this.currentProcess);
            }/// if
            else {
                this.readyQueue.push(newProcess);
            }/// else
            /// More...?
        }/// scheduleProcess

        public roundRobinCheck() {
            /// Process ran out of turns so shift things around
            /// Else let the clock keep cycling...

            /// Current Process has terminated before quanta limit:
            if (this.currentProcess.processState === "Terminated") {
                /// Context Switch but don't put current process back in process queue
                if (this.readyQueue.length > 0) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH, []));
                    this.startBurst = _CPU_BURST;
                }/// if
                else {
                    /// End Scheduled Session With Interrupt
                    _CPU.isExecuting = false;
                }/// else
            }/// if
            if ((_CPU_BURST - this.startBurst) === this.quanta) {
                /// Context Switch but put process back in process queue
                if (this.readyQueue.length > 0) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH, []));
                    this.startBurst = _CPU_BURST;
                }/// if
                else {
                    this.startBurst = _CPU_BURST;
                }///else
            }/// if
            
            // if (this.currentProcess.processState === "Terminated" && this.readyQueue.length === 0) {
            //     _CPU.isExecuting = false;
            // }/// if
        }/// roundRobinCheck

        /// TODO: Implement the other types of scheuling...
        // public firstComeFirstServeSchedule() { }
        // public preEmptivePriority() { }
        // public prioritySchedule() { }
    }/// class
}/// module