/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        constructor(dirBlock = new Directory('File Header', /// File Entries
        0, 0, 1, /// base = (0, 0, 1)
        0, 7, 7), /// new Directory
        fileDataBlock = new Directory('File Body', /// File Data
        1, 0, 0, /// base = (1, 0, 0)
        3, 7, 7), /// new Block
        formatted = false, diskBase = "(0, 0, 0)", diskLimit = "(3, 7, 7)") {
            /// Override the base method pointers
            /// The code below cannot run because "this" can only be accessed after calling super.
            /// super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();
            this.dirBlock = dirBlock;
            this.fileDataBlock = fileDataBlock;
            this.formatted = formatted;
            this.diskBase = diskBase;
            this.diskLimit = diskLimit;
            this.driverEntry = this.krnDiskDriverEntry;
            this.isr = this.krnDiskDispatchFunctions;
        } /// constructor
        krnDiskDriverEntry() {
            /// Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
            /// More...?
        } /// krnDiskDriverEntry
        krnDiskDispatchFunctions(params) {
            var diskOperation = params[0];
            switch (diskOperation) {
                case 'create':
                    /// params[1] = filename
                    this.createFile(params[1]);
                    break;
                case 'write':
                    break;
                case 'read':
                    break;
                case 'delete':
                    break;
                case 'list':
                    break;
                default:
                    _Kernel.krnTrace(`Failed to perform disk ${params[0]} operation`);
                    _StdOut.putText(`Failed to perform disk ${params[0]} operation`);
                    break;
            } /// switch
        } /// krnDiskDispatchFunctions
        ///////////////////////////////
        ////// Format Operations //////
        ///////////////////////////////
        format(type) {
            var success = false;
            switch (type) {
                case '-full':
                    success = this.fullFormat();
                    break;
                case '-quick':
                    success = this.quickFormat();
                    break;
                case 'no-arg':
                    _Disk.init();
                    this.formatted = true;
                    success = true;
                    break;
                default:
                    _Kernel.krnTrace(`Failed disk format (Type: ${type.replace('-', '').trim()})`);
                    _StdOut.putText(`Cannot perform format (Type: ${type.replace('-', '').trim()})`);
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    break;
            } /// switch 
            if (success) {
                _StdOut.putText(`Hard drive successfully formatted (Type: ${type})`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            } /// if
            else {
                _StdOut.putText(`Failed to format (Type: ${type.replace('-', '').trim()})`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            } // else
        } /// format
        fullFormat() {
            if (this.formatted) {
                /// Same as Disk.init() except skip the master boot record
                for (var trackNum = 0; trackNum < TRACK_LIMIT; ++trackNum) {
                    for (var sectorNum = 0; sectorNum < SECTOR_LIMIT; ++sectorNum) {
                        for (var blockNum = 0; blockNum < BLOCK_LIMIT; ++blockNum) {
                            _Disk.createSessionBlock(`(${trackNum}, ${sectorNum}, ${blockNum})`);
                        } /// for
                    } /// for
                } /// for
                _Kernel.krnTrace(`Disk formatted (Type: Full Format)`);
                this.formatted = true;
                return true;
            } /// if
            else {
                _Kernel.krnTrace(`Failed disk format (Type: Full Format), missing master boot record`);
                return false;
            } /// else
        } /// fullFormat
        quickFormat() {
            /// Disk must be "fully" formatted first, otherwise, the rest of the 4-63 bytes 
            /// of data could possibly be null if '-quick' format is called as the "first" format...
            if (this.formatted) {
                /// Change the first four bytes back to 00's
                for (var trackNum = 0; trackNum < TRACK_LIMIT; ++trackNum) {
                    for (var sectorNum = 0; sectorNum < SECTOR_LIMIT; ++sectorNum) {
                        for (var blockNum = 0; blockNum < BLOCK_LIMIT; ++blockNum) {
                            /// Skip already quick formatted blocks
                            if (sessionStorage.getItem(`(${trackNum}, ${sectorNum}, ${blockNum})`).substring(0, 8) === "00000000") {
                                continue;
                            } /// if
                            /// Skip master boot record
                            if (trackNum === 0 && sectorNum === 0 && blockNum === 0) {
                                continue;
                            } ///if
                            /// Reset the first 8 nums to zero
                            else {
                                /// Get session value
                                var value = sessionStorage.getItem(`(${trackNum}, ${sectorNum}, ${blockNum})`);
                                /// Replace the first 4 bytes (8 characters) with 00's
                                value = "00000000" + value.substring(4, value.length);
                                /// Write the change back to the list
                                sessionStorage.setItem(`(${trackNum}, ${sectorNum}, ${blockNum})`, value);
                            } /// else
                        } /// for
                    } /// for
                } /// for
                _Kernel.krnTrace(`Disk formatted (Type: Quick Format)`);
                this.formatted = true;
                return true;
            } /// if
            else {
                _Kernel.krnTrace(`Failed disk format (Type: Quick Format), missing master boot record`);
                return false;
            } /// else
        } /// quickFormat
        /// Create File should be all or nothing...No partial creations of files
        createFile(fileName = '') {
            // File does not exist
            if (!this.filenameExists(fileName)) {
                /// Find a free space, null if there are no available blocks
                var availableDirKey = this.getFirstAvailableBlock("File Header");
                /// Find a free space, null if there are no available blocks
                var availableFileDataKey = this.getFirstAvailableBlock("File Body");
                /// Free space found in both file header and file data directories
                ///
                /// Split into multiple "if" statements for "clearer" error detection
                if (availableDirKey != null) {
                    if (availableFileDataKey != null) {
                        /// First 4 bytes (8 characters) are pointer to the free data block in the file data directory...
                        /// Remaining bytes are allocated for filename (in hex of course).
                        var value = availableFileDataKey + this.englishToHex(fileName);
                        /// Write to the block
                        sessionStorage.setItem(availableDirKey, value);
                        _Kernel.krnTrace('File sucessfully created!');
                        return true;
                    } /// if
                    else {
                        _Kernel.krnTrace('File creation failed, all file data blocks are in use!');
                    } /// else
                } /// if
                else {
                    _Kernel.krnTrace('File creation failed, all file header blocks are in use!');
                } /// else
            } /// if
            return false;
        } /// createFile
        list(type) {
            var isEmpty = true;
            /// Only need to search the "file header" portion of the disk
            for (var trackNum = this.dirBlock.baseTrack; trackNum <= this.dirBlock.limitTrack; ++trackNum) {
                for (var sectorNum = this.dirBlock.baseSector; sectorNum <= this.dirBlock.limitSector; ++sectorNum) {
                    for (var blockNum = this.dirBlock.baseBlock; blockNum <= this.dirBlock.limitBlock; ++blockNum) {
                        /// Don't want to list deleted files (files that have data with a low availabiliy flag)
                        /// Availabiliy flag is high, meaning the block is in use and has data
                        if (sessionStorage.getItem(`(${trackNum}, ${sectorNum}, ${blockNum})`).substring(0, 2) === "01") {
                            /// Not a hidden file
                            if (sessionStorage.getItem(`(${trackNum}, ${sectorNum}, ${blockNum})`).substring(7, 8) !== ".") {
                                /// Print out file name
                                _StdOut.putText(`  ${sessionStorage.getItem(`(${trackNum}, ${sectorNum}, ${blockNum})`).substring(7)}`);
                                _StdOut.advanceLine();
                                isEmpty = false;
                            } /// if
                            /// Hidden file
                            else {
                                /// Only show hidden file if "-l" argument was used
                                if (type === '-l') {
                                    /// Print out file name
                                    _StdOut.putText(`  ${sessionStorage.getItem(`(${trackNum}, ${sectorNum}, ${blockNum})`).substring(7)}`);
                                    _StdOut.advanceLine();
                                    isEmpty = false;
                                } /// if
                            } /// else
                        } /// if
                    } /// for
                } /// for
            } /// for
            if (isEmpty) {
                _StdOut.putText(`  No files found`);
                _StdOut.advanceLine();
            } /// if
            _OsShell.putPrompt();
        } /// list
        getFirstAvailableBlock(directory) {
            if (directory === "File Body") {
                /// Only need to search the "file data" portion of the disk
                for (var trackNum = this.fileDataBlock.baseTrack; trackNum <= this.fileDataBlock.limitTrack; ++trackNum) {
                    for (var sectorNum = this.fileDataBlock.baseSector; sectorNum <= this.fileDataBlock.limitSector; ++sectorNum) {
                        for (var blockNum = this.fileDataBlock.baseBlock; blockNum <= this.fileDataBlock.limitBlock; ++blockNum) {
                            /// Availabiliy flag is low, meaning the block is free
                            if (sessionStorage.getItem(`(${trackNum}, ${sectorNum}, ${blockNum})`).substring(0, 2) === "00") {
                                /// Return the location (the key) where the block is available
                                return `(${trackNum}, ${sectorNum}, ${blockNum})`;
                            } /// if
                        } /// for
                    } /// for
                } /// for
            } /// if
            else if (directory === "File Header") {
                /// Only need to search the "file header" portion of the disk
                for (var trackNum = this.dirBlock.baseTrack; trackNum <= this.dirBlock.limitTrack; ++trackNum) {
                    for (var sectorNum = this.dirBlock.baseSector; sectorNum <= this.dirBlock.limitSector; ++sectorNum) {
                        for (var blockNum = this.dirBlock.baseBlock; blockNum <= this.dirBlock.limitBlock; ++blockNum) {
                            /// Availabiliy flag is low, meaning the block is free
                            if (sessionStorage.getItem(`(${trackNum}, ${sectorNum}, ${blockNum})`).substring(0, 2) === "00") {
                                /// Return the location (the key) where the block is available
                                return `(${trackNum}, ${sectorNum}, ${blockNum})`;
                            } /// if
                        } /// for
                    } /// for
                } /// for
            } /// if
            /// No available blocks were found
            return null;
        } /// getFirstAvailableBlock
        filenameExists(targetFileNameInEnglish) {
            /// Only need to search the "file names" portion of the disk
            for (var trackNum = this.dirBlock.baseTrack; trackNum <= this.dirBlock.limitTrack; ++trackNum) {
                for (var sectorNum = this.dirBlock.baseSector; sectorNum <= this.dirBlock.limitSector; ++sectorNum) {
                    for (var blockNum = this.dirBlock.baseBlock; blockNum <= this.dirBlock.limitBlock; ++blockNum) {
                        if (this.hexToEnglish(sessionStorage.getItem(`(${trackNum}, ${sectorNum}, ${blockNum})`).substring(7) /// Skip the first 8 bytes
                        ) === targetFileNameInEnglish) {
                            return true;
                        } /// if
                    } /// for
                } /// for
            } /// for
            return false;
        } /// searchDirectory
        englishToHex(englishWord) {
            var englishWordInHex = '';
            for (var letter = 0; letter < englishWord.length; ++letter) {
                /// Get Ascii value from english letter and convert to a single hex character string
                englishWordInHex += englishWord[letter].charCodeAt(0).toString(16);
            } /// for
            return englishWordInHex;
        } /// englishToHex
        hexToEnglish(hexWord) {
            var englishWord = '';
            for (var hexLetter = 0; hexLetter < hexWord.length; ++hexLetter) {
                englishWord += String.fromCharCode(parseInt(
                /// Read hex digits in pairs
                hexWord.substr(hexLetter, 2), 16 /// To decimal from base 16
                ) /// parseInt
                ); /// String.fromCharCode
            } /// for
            return englishWord;
        } /// hexToEnglish
    } /// class
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
    class Directory {
        constructor(name, baseTrack, baseSector, baseBlock, limitTrack, limitSector, limitBlock) {
            this.name = name;
            this.baseTrack = baseTrack;
            this.baseSector = baseSector;
            this.baseBlock = baseBlock;
            this.limitTrack = limitTrack;
            this.limitSector = limitSector;
            this.limitBlock = limitBlock;
        } /// constructor
    }
    TSOS.Directory = Directory;
})(TSOS || (TSOS = {})); /// TSOS
//# sourceMappingURL=deviceDriverDisk.js.map