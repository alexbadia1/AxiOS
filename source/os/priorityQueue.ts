/**
 * 
 * Changing the quantum mid-cyle is not easy...
 * 
 * Yeah request an change_quantum_irq, but what if there's a 
 * context_switch_irq, or termination_queued? 
 * 
 * The quantum change should probably take lower priority (higher number).
 * Implementing a priority queue may not be fully necessary, but it'll make project 4 
 * a little bit easier...
 * 
 */
module TSOS {

    export class PriorityQueue {
        constructor(
            public nodes: any[] = [],
        ) { }

        public getSize(): number {
            return this.nodes.length;
        }/// getSize

        /// TODO: Add protection
        public getIndex(index: number = 0) {
            return this.nodes[index];
        }/// getIndex

        /// Put on end of queue and bubble it up to correct spot
        public enqueue(newValue: any): void {
            /// Put value on the "bottom-left" most part of the heap...
            this.nodes.push(newValue)

            /// Bubble to proper spot
            this.bubbleUp();
        }/// enqueue

        /// Remove the highest priority (the root node)
        public dequeue(): any {

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

                /// Left child exists?
                if (lChildIndex < this.nodes.length) {

                    /// Set swap to bubble down left
                    if (this.nodes[lChildIndex].priority <= nodePriority) {
                        indexToSwap = lChildIndex;
                    }/// if
                }/// if

                /// Right child exists?
                if (rChildIndex < this.nodes.length) {

                    /// Left child was not a candidate
                    /// Check if the right child has a lower priority
                    /// and if so bubble down right child
                    if (indexToSwap === -1) {
                        if (this.nodes[rChildIndex].priority <= nodePriority) {
                            indexToSwap = rChildIndex;
                        }/// if

                        /// Left Child Index was a potential candidate
                        /// Swap to right if the difference in priority is bigger
                        if (this.nodes[rChildIndex].priority <= this.nodes[lChildIndex].priority) {
                            indexToSwap = rChildIndex;
                        }/// if
                    }/// if
                }/// if

                if (indexToSwap === -1) {
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
                var parentIndex = Math.floor((childIndex - 1) / 2);

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