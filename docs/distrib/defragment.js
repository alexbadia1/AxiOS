/* ------------
     defragment.ts

     Defragmentation is implemented with quicksort. Think similar to the Dutch National Flag problem...
     though solved with a 3-way partition (which Professor Bowu did have us implement) a two-way in place partition
     is sufficient (...and easier...) which, convienently, Professor Bowu also taught us.
        
     Since all disk blocks (implemented with HTML Session Storage key|value pairs)
     have a unique 2 Byte ID we can quicksort by ID'sallocated by an ID Manager.
     
     The only real challenege is translating our HTML 5 Session Storage Keys (that are in Octal) to the decimal indexes
     used in a traditional quicksort. (there's probably some Javascript trick that let's me count in octal, whatever...)
     
     Why? Quicksort with ID's is "okay"...
        - ID's are scalable for every byte allocated in to them.
        - ID's in terms of a larger OS system can store more metadata
          (opposed to my OS where, conceptually, ID's represent "in-use", "free", "deleted, but overwrite-able")
        - ID manager can be loaded in O(n) time while allocating ID's in O(1) time. If done clever enough (probably using mathematical "tricks"),
          the ID manager won't take up much space (I did not do the latter...)
          ~ May not even need an ID manager, as a checksum may suffice for the file if we stored more metadata (as we learned from Tokash), oh well...
     ------------ */
var TSOS;
(function (TSOS) {
    class Defragment {
        constructor() { } /// consturctor
        static defragment(start = 64, end = 255) {
            var sizeInDecimal = end - start;
            this.quickSort(start, end, sizeInDecimal);
        } /// defragment
        static quickSort(leftInDecimal, rightInDecimal, size) {
            var pivotInDecimal;
            if (size > 1) {
                pivotInDecimal = this.partition(leftInDecimal, rightInDecimal);
                if (leftInDecimal < pivotInDecimal - 1) {
                    this.quickSort(leftInDecimal, pivotInDecimal - 1, size);
                } /// if
                if (pivotInDecimal < rightInDecimal) {
                    this.quickSort(pivotInDecimal, rightInDecimal, size);
                } /// if
            }
            return;
        } /// quicksort
        static partition(left, right) {
            /// Do a shit ton of conversions
            var midInOctal = this.decimalToOctal(Math.floor((right + left) / 2));
            var formattedMidIntOctal = this.formatOctal(midInOctal);
            var pivotInHex = _krnDiskDriver.getBlockFlag(formattedMidIntOctal);
            var pivotInDecimal = parseInt(pivotInHex, 16);
            /// Convert the start
            var startInDecimal = left;
            var startInOctal = this.decimalToOctal(startInDecimal);
            var formattedStartInOctal = this.formatOctal(startInOctal);
            /// Covert the end
            var endInDecimal = right;
            var endInOctal = this.decimalToOctal(endInDecimal);
            var formattedEndInOctal = this.formatOctal(endInOctal);
            /// start <= end
            while (startInDecimal <= endInDecimal) {
                /// while (A[start] < pivot)
                while (parseInt(_krnDiskDriver.getBlockFlag(formattedStartInOctal), 16) < pivotInDecimal) {
                    startInDecimal++;
                    startInOctal = this.decimalToOctal(startInDecimal);
                    formattedStartInOctal = this.formatOctal(startInOctal);
                } /// while
                /// while (A[end] > pivot)
                while (parseInt(_krnDiskDriver.getBlockFlag(formattedEndInOctal), 16) > pivotInDecimal) {
                    endInDecimal--;
                    endInOctal = this.decimalToOctal(endInDecimal);
                    formattedEndInOctal = this.formatOctal(endInOctal);
                } /// while
                if (startInDecimal <= endInDecimal) {
                    this.swap(startInDecimal, endInDecimal); //sawpping two elements
                    startInDecimal++;
                    startInOctal = this.decimalToOctal(startInDecimal);
                    formattedStartInOctal = this.formatOctal(startInOctal);
                    endInDecimal--;
                    endInOctal = this.decimalToOctal(endInDecimal);
                    formattedEndInOctal = this.formatOctal(endInOctal);
                } /// if
            } /// while
            return startInDecimal;
        } /// twoWayPartition
        /// Swap two items in session storage
        static swap(left, right) {
            /// Reformat left to index the session storage
            var leftInOctal = this.decimalToOctal(left);
            var formattedLeftInOctal = this.formatOctal(leftInOctal);
            /// Reformat right to indecimalToOctalx the session storage
            var rightIntOctal = this.decimalToOctal(right);
            var formattedRightInOctal = this.formatOctal(rightIntOctal);
            /// Find previous blocks and update their pointers BEFORE SWAPPING
            /// If done after swapping, there will be infinite loops... many, many infinite loops
            var previousLeftBlock = _krnDiskDriver.findPreviousBlock(formattedLeftInOctal);
            var previousRightBlock = _krnDiskDriver.findPreviousBlock(formattedRightInOctal);
            if (previousLeftBlock !== null) {
                _krnDiskDriver.setBlockForwardPointer(previousLeftBlock, formattedRightInOctal);
            } /// if
            if (previousRightBlock !== null) {
                _krnDiskDriver.setBlockForwardPointer(previousRightBlock, formattedLeftInOctal);
            } /// if
            /// Swap session storage values
            var temp = sessionStorage.getItem(formattedLeftInOctal);
            sessionStorage.setItem(formattedLeftInOctal, sessionStorage.getItem(formattedRightInOctal));
            sessionStorage.setItem(formattedRightInOctal, temp);
        } /// swap
        static decimalToOctal(decimal) {
            var octalNum = 0;
            var place = 1;
            while (decimal > 0) {
                // Find remainder
                var remainder = decimal % 8;
                /// Take the remainder and put it in the correct place...
                /// place = 1 for one's 
                /// place = 10 for 10's (which is reall the 8th's place)
                /// place = 100 for 100th's palace (which is reall the 64th's place)
                octalNum += remainder * place;
                /// Shift to place to the "left"
                place = place * 10;
                decimal = Math.floor(decimal / 8);
            } /// while
            return octalNum.toString();
        } /// decimalToOCtal
        static formatOctal(octal) {
            if (octal.length === 3) {
                return octal[0].padStart(2, '0') + octal[1].padStart(2, '0') + octal[2].padStart(2, '0');
            } /// if
            else if (octal.length === 2) {
                return octal[0].padStart(4, '0') + octal[1].padStart(2, '0');
            } /// else-if
            else if (octal.length === 1) {
                return octal[0].padStart(5, '0');
            } /// else-if
        } ///
    } /// export
    TSOS.Defragment = Defragment;
})(TSOS || (TSOS = {})); /// TSOS
//# sourceMappingURL=defragment.js.map