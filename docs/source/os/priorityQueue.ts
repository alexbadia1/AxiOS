/**
 * 
 * Changing the quantum mid-cyle is not easy...
 * 
 * Yeah request an change_quantum_irq, but what if there's a 
 * context_switch_irq, or termination_queued? 
 * 
 * The quantum change should probably take lower priority (higher number),
 * even though implementing a priority queue may not be fully necessary.
 * 
 */
module TSOS {

    export class Node {
        constructor(
            public data: any = null,
            public priority: number = 1) {
                this.data = data;
        }/// constructor
    }/// class

    export class PriorityQueue {
        constructor(
            public nodes: Node[] = [],
        ) { }

        public getSize(): number {
            return this.nodes.length;
        }
        /// Put on end of queue and bubble it up to correct spot
        public enqueue(newValue: Node): void {
            /// Technically doesn't belong here
            ///
            /// Make sure quantum changes happen last by giving a higher number for priority
            /// All other interrupts have a default priority of 1, as you can see in the Node class constructor
            if (newValue.data.irq === CHANGE_QUANTUM_IRQ) {
                newValue.priority = 2;
            }/// if
        
            /// Put value on the "bottom-left" most part of the heap...
            this.nodes.push(newValue)

            /// Bubble to proper spot
            this.bubbleUp();
        }/// enqueue

        /// Remove the highest priority (the root node)
        public dequeue(): Node {

            /// Swap the root node with the bottom most left node (last node)
            this.swapNodes(ROOT_NODE, this.nodes.length - 1);

            /// Remove the last node, that is now the highest priority node
            var node = this.nodes.pop();

            /// Now bubble down the root node (that is most likely not the highest priority node)
            if (this.nodes.length > 1) {
                this.bubbleDown();
            }/// if

            return node;
        }/// dequeue

        private bubbleDown(): void {
            var swapsNeeded: boolean = true;
            var parentIndex: number = ROOT_NODE;
            var nodePriority: number = this.nodes[ROOT_NODE].priority;
            //loop breaks if no swaps are needed
            while (swapsNeeded) {
                /// Work our way to the "top"/"front" of the list, while we 
                /// keep swapping.
                ///
                /// Note we are indexing from 0, so account for offset by 1:
                ///     LEFT Child of Parent Node at Index, parentIndex:
                ///         lChildIndex = 2(parentiIndex) + 1
                ///
                ///     RIGHT Child of Parent Node at Index, parentIndex:
                ///         rChildIndex = 2(parentiIndex) + 2
                ///     
                ///     Parent Index location relative to both children indexes is:
                ///         parentIndex = floor( (lChildIndex-1) / 2 );
                ///         parentIndex = floor( (rChildIndex - 1) / 2 );
                var lChildIndex: number = (2 * parentIndex) + 1;
                var rChildIndex: number = (2 * parentIndex) + 2;
                var indexToSwap: number = -1;

                /// Check if there are any more bubble down swaps to perform
                if (indexToSwap !== -1) {
                    /// Left child exists?
                    if (lChildIndex < this.nodes.length) {

                        /// Set swap to bubble down left
                        if (this.nodes[lChildIndex].priority < nodePriority) {
                            indexToSwap = this.nodes[lChildIndex].priority;
                        }/// if
                    }/// if

                    /// Right child exists?
                    if (rChildIndex < this.nodes.length) {

                        /// Left child was not a candidate
                        /// Check if the right child has a lower priority
                        /// and if so bubble down right child
                        if (indexToSwap === -1) {
                            if (this.nodes[rChildIndex].priority < nodePriority) {
                                indexToSwap = rChildIndex;
                            }/// if
                        }/// if

                        /// Left Child Index was a potential candidate
                        /// Swap to right if the difference in priority is bigger
                        else {
                            if (this.nodes[rChildIndex].priority < this.nodes[lChildIndex].priority) {
                                indexToSwap = rChildIndex;
                            }/// if
                        }/// else
                    }/// if
                }/// if
                else {
                    swapsNeeded = false;
                }/// else

                if (swapsNeeded) {
                    /// Actually bubble/swap down the chosen child side
                    this.swapNodes(parentIndex, indexToSwap);

                    /// Update parent index in order to keep bubbling down
                    parentIndex = indexToSwap;
                }/// if
            }/// while
        }/// bubbleDown

        /// New element must be bubbled up into a correct position
        private bubbleUp(): void {
            /// Variable to signify to stop bubbling
            var inPlace: boolean = false;

            /// Grab last element index
            var childIndex = this.nodes.length - 1;

            /// Work our way to the "top"/"front" of the list, while we 
            /// keep swapping.
            ///
            /// Note we are indexing from 0, so account for offset by 1:
            ///     LEFT Child of Parent Node at Index, parentIndex:
            ///         lChildIndex = 2(parentiIndex) + 1
            ///
            ///     RIGHT Child of Parent Node at Index, parentIndex:
            ///         rChildIndex = 2(parentiIndex) + 2
            ///     
            ///     Parent Index location relative to both children indexes is:
            ///         parentIndex = floor( (lChildIndex-1) / 2 );
            ///         parentIndex = floor( (rChildIndex - 1) / 2 );
            while (childIndex > 0 && !inPlace) {
                /// Parent index location based off of child
                var parentIndex = (childIndex - 1) / 2;

                /// If the childs priority is greater than the parents priority, keep bubbling
                /// (remember lower number for priority is higher priority)
                if (this.nodes[childIndex].priority < this.nodes[parentIndex].priority) {

                    /// Swap child with parent
                    this.swapNodes(childIndex, parentIndex);

                    /// Child is now parent, which is technically a child of the parent's parent...
                    childIndex = parentIndex;
                }/// if 

                /// Parent has a higher priority than the child, so stop
                else {
                    inPlace = true;
                }/// else
            }/// while
        }/// bubbleUp

        /// Swaps 2 nodes in the Max/Min-Heap Implementation of this priority queue
        private swapNodes(index1, index2): void {
            var temp = this.nodes[index1];
            this.nodes[index1] = this.nodes[index2];
            this.nodes[index2] = temp;
        }/// swapNode
    }/// class
}/// module

/// TODO: move out of data structure
// switch (newValue.data.irq) {
//     case TIMER_IRQ:
//         newValue.priority = 1;
//         break;
//     case KEYBOARD_IRQ:
//         newValue.priority = 1;
//         break;
//     case SYS_CALL_IRQ:
//         newValue.priority = 1;
//         break;
//     case PS_IRQ:
//         newValue.priority = 1;
//         break;
//     case SINGLE_STEP_IRQ:
//         newValue.priority = 1;
//         break;
//     case NEXT_STEP_IRQ:
//         newValue.priority = 1;
//         break;
//     case CONTEXT_SWITCH_IRQ:
//         newValue.priority = 1;
//         break;
//     case CHANGE_QUANTUM_IRQ:
//         newValue.priority = 2;
//         break;
//     case RUN_PROCESS_IRQ:
//         newValue.priority = 1;
//         break;
//     case RUN_ALL_PROCESSES_IRQ:
//         newValue.priority = 1;
//         break;
//     case TERMINATE_PROCESS_IRQ:
//         newValue.priority = 1;
//         break;
//     case KILL_PROCESS_IRQ:
//         newValue.priority = 1;
//         break;
//     case KILL_ALL_PROCESSES_IRQ:
//         newValue.priority = 1;
//         break;
//     default:
//         newValue.priority = 1;
//         break;
// }/// switch