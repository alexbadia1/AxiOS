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
            public quantum: number = 1,
            public currentProcessControlBlock: ProcessControlBlock = null,
            public relativeStartingBurst: number = 0,
            public readyQueue: ProcessControlBlock[] = [],
        ) { }/// constructor

        public scheduleProcess(newPcb: ProcessControlBlock) { 
            /// Round Robin Scheduling allows us to just keep enqueing processes
            newPcb.processState = "Ready";
            this.readyQueue.push(newPcb);
            /// More...?
        }/// loadReadyQueue

        public quantumCheck(baseCase: boolean = false) {
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
            }///if

            /// This is NOT the FIRST quantum check, meaning there is already a relative base
            /// or "first" burst count to reference our counting from.
            ///
            /// Quantum expires when the CPU Burst is the: (Starting CPU Burst + Quantum)
            else if ((this.relativeStartingBurst + this.quantum) === _CPU_BURST) {
                /// Check if there is another process to grab from the Ready Queue
                if (this.readyQueue.length > 0) {
                    /// Grab the another process from the Ready Queue
                    this.currentProcessControlBlock = _Scheduler.readyQueue.shift();

                    /// Attach the process to the CPU
                    _Dispatcher.attachNewPcbToCPU();

                    /// Before we begin CPU execution, Update Relative Starting Burst
                    this.relativeStartingBurst = _CPU_BURST;
                }/// if
            }/// if

            /// Context Swich Complete Continue CPU Execution
            this.currentProcessControlBlock.processState = "Running";
            _CPU.isExecuting = true;
        }/// roundRobin

        /// TODO: Implement the other types of scheuling...
        // public firstComeFirstServeSchedule() { }
        // public preEmptivePriority() { }
        // public prioritySchedule() { }
    }/// class
}/// module