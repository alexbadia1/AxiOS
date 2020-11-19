/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */

module TSOS {
    // Extends DeviceDriver
    export class DeviceDriverDisk extends DeviceDriver {
        constructor(
            public hiddenFilePrefix: string = '.',
            public swapFilePrefix: string = '!',
            public dirBlock: Partition = new Partition(
                'File Header', /// File Entries
                0, 0, 1, /// base = (0, 0, 1)
                0, 7, 7, /// limit = (0, 7, 7)
            ), /// new Directory
            public fileDataBlock: Partition = new Partition(
                'File Body', /// File Data
                1, 0, 0, /// base = (1, 0, 0)
                3, 7, 7, /// limit = (3, 7, 7)
            ),/// new Block
            public formatted: boolean = false,
            public diskBase: string = "000000",
            public diskLimit: string = "030707",
        ) {
            /// Override the base method pointers
            /// The code below cannot run because "this" can only be accessed after calling super.
            /// super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();
            this.driverEntry = this.krnDiskDriverEntry;
            this.isr = this.krnDiskDispatchFunctions;
        }/// constructor

        public krnDiskDriverEntry() {
            /// Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
            /// More...?
        }/// krnDiskDriverEntry

        public krnDiskDispatchFunctions(params) {
            var result: string = '';
            var diskOperation: string = params[0];
            switch (diskOperation) {
                case 'create':
                    /// params[1] = filename
                    result = this.create(params[1]);
                    break;
                case 'write':
                    /// params[1][0] = filename
                    /// params[1][1] = file text
                    this.write(params[1][0], params[1][1]);
                    break;
                case 'read':
                    /// params[1] = filename
                    result = this.read(params[1]);
                    break;
                case 'delete':
                    /// params[1] = filename
                    result = this.deleteFile(params[1]);
                    break;
                case 'list':
                    /// params[1] = 'no-arg' || params[1] = '-l'
                    this.list(params[1]);
                    break;
                default:
                    _Kernel.krnTrace(`Failed to perform disk ${params[0]} operation`);
                    _StdOut.putText(`Failed to perform disk ${params[0]} operation`);
                    break;
            }/// switch

            /// Show results denoting the success or failure of the driver operation on disk
            if (result !== '') {
                _StdOut.putText(`${result}`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            }
        }/// krnDiskDispatchFunctions

        ///////////////////////////////
        ////// Format Operations //////
        ///////////////////////////////

        public format(type: string): void {
            var success: boolean = false;
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
            }/// switch 

            if (success) {
                _StdOut.putText(`Hard drive successfully formatted!`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            }/// if

            // else {
            //     _StdOut.putText(`Failed to format (Type: ${type.replace('-', '').trim()})`);
            //     _StdOut.advanceLine();
            //     _OsShell.putPrompt();
            // }// else
        }/// format

        private fullFormat(): boolean {
            if (this.formatted) {
                /// Same as Disk.init() except skip the master boot record
                for (var trackNum: number = 0; trackNum < TRACK_LIMIT; ++trackNum) {
                    for (var sectorNum: number = 0; sectorNum < SECTOR_LIMIT; ++sectorNum) {
                        for (var blockNum: number = 0; blockNum < BLOCK_LIMIT; ++blockNum) {
                            _Disk.createSessionBlock(trackNum, sectorNum, blockNum);
                        }/// for
                    }/// for
                }/// for
                _Kernel.krnTrace(`Disk formatted (Type: Full Format)`);
                this.formatted = true;
                return true;
            }/// if
            else {
                _Kernel.krnTrace(`Failed disk format (Type: Full Format), missing master boot record`);
                _StdOut.putText(`Full Format can only be used to REFORMAT the drive, please initially format the drive.`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
                return false;
            }/// else
        }/// fullFormat

        private quickFormat(): boolean {
            /// Disk must be "fully" formatted first, otherwise, the rest of the 4-63 bytes 
            /// of data could possibly be null if '-quick' format is called as the "first" format...
            if (this.formatted) {
                /// Change the first four bytes back to 00's
                for (var trackNum: number = 0; trackNum < TRACK_LIMIT; ++trackNum) {
                    for (var sectorNum: number = 0; sectorNum < SECTOR_LIMIT; ++sectorNum) {
                        for (var blockNum: number = 0; blockNum < BLOCK_LIMIT; ++blockNum) {

                            var currentKey: string = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;

                            /// Skip already quick formatted blocks
                            if (sessionStorage.getItem(currentKey).substring(0, 8) === "00000000") {
                                continue;
                            }/// if

                            /// Skip master boot record
                            if (trackNum === 0 && sectorNum === 0 && blockNum === 0) {
                                continue;
                            }///if

                            /// Reset the first 8 nums to zero
                            else {
                                /// Get session value
                                var value: string = sessionStorage.getItem(currentKey);

                                /// Replace the first 4 bytes (8 characters) with 00's
                                value = "00000000" + value.substring(8, value.length);

                                /// Write the change back to the list
                                sessionStorage.setItem(currentKey, value);
                            }/// else
                        }/// for
                    }/// for
                }/// for
                _Kernel.krnTrace(`Disk formatted (Type: Quick Format)`);
                this.formatted = true;
                return true;
            }/// if

            else {
                _Kernel.krnTrace(`Failed disk format (Type: Quick Format), missing master boot record`);
                _StdOut.putText(`Quick Format can only be used to REFORMAT the drive, please initially format the drive.`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
                return false;
            }/// else
        }/// quickFormat

        /// Create File should be all or nothing...No partial creations of files
        public create(fileName: string = ''): string {
            var msg: string = 'File creation failed';

            // File does NOT exist
            if (this.fileNameExists(fileName) === '') {

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
                        /// Set is occupied to true
                        var data: string = '';
                        var zeros: string = '';
                        for (var byte = 0; byte < BLOCK_DATA_LIMIT; ++byte) {
                            data += "00";
                            zeros += "00"
                        }// for
                        /// Replace the first 4 bytes (8 characters) with 00's
                        data = this.englishToHex(fileName) + data.substring(fileName.length, data.length);

                        var value = "01" + availableFileDataKey + data;

                        /// Write to the directory block
                        sessionStorage.setItem(availableDirKey, value);

                        /// Update the first data block to be in use so all new files won't point to the same first directory block
                        this.setBlockFlag(availableFileDataKey, "01");

                        /// Reset the data back to zero's
                        this.setBlockData(availableFileDataKey, zeros);

                        _Kernel.krnTrace('File sucessfully created!');
                        msg = `C:\\AXIOS\\${fileName} sucessfully created!`;

                    }/// if
                    else {
                        _Kernel.krnTrace(`Cannot create C:\\AXIOS\\${fileName}, all file data blocks are in use!`);
                        msg = `Cannot create C:\\AXIOS\\${fileName}, all file data blocks are in use!`;
                    }/// else
                }/// if
                else {
                    _Kernel.krnTrace(`Cannot create C:\\AXIOS\\${fileName}, all file header blocks are in use!`);
                    msg = `Cannot create C:\\AXIOS\\${fileName}, all file header blocks are in use!`;
                }/// else
            }/// if

            else {
                _Kernel.krnTrace(`Cannot create C:\\AXIOS\\${fileName}, filename is already in use!`);
                msg = `Cannot create C:\\AXIOS\\${fileName}, filename already in use!`;
            }/// else

            return msg;
        }/// createFile

        public list(type: string): void {
            var isEmpty: boolean = true;
            _StdOut.advanceLine();
            /// Only need to search the "file header" portion of the disk
            for (var trackNum: number = this.dirBlock.baseTrack; trackNum <= this.dirBlock.limitTrack; ++trackNum) {
                for (var sectorNum: number = this.dirBlock.baseSector; sectorNum <= this.dirBlock.limitSector; ++sectorNum) {
                    for (var blockNum: number = this.dirBlock.baseBlock; blockNum <= this.dirBlock.limitBlock; ++blockNum) {
                        var currentKey: string = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
                        /// Don't want to list deleted files (files that have data with a low availabiliy flag)
                        /// Availabiliy flag is high, meaning the block is in use and has data
                        if (this.getBlockFlag(sessionStorage.getItem(currentKey)) === "01") {

                            /// Not a hidden file
                            if (!this.hexToEnglish(this.getBlockData(sessionStorage.getItem(currentKey))).startsWith('.')) {
                                /// Print out file name
                                ///: _StdOut.putText(`${INDENT_STRING}${INDENT_STRING}${sessionStorage.getItem(currentKey).substring(8)}.txt`);
                                _StdOut.putText(`${INDENT_STRING}${INDENT_STRING}${this.hexToEnglish(this.getBlockData(sessionStorage.getItem(currentKey)))}`);
                                _StdOut.advanceLine();
                                isEmpty = false;
                            }/// if

                            /// Hidden file
                            else {
                                /// Only show hidden file if "-l" argument was used
                                if (type === '-l') {
                                    /// Print out file name, with proper file extension
                                    ///sessionStorage.getItem(currentKey).substring(8).startsWith(".!") ?
                                    ///_StdOut.putText(`${INDENT_STRING}${INDENT_STRING}${sessionStorage.getItem(currentKey).substring(8)}.swp`)
                                    ///: _StdOut.putText(`${INDENT_STRING}${INDENT_STRING}${sessionStorage.getItem(currentKey).substring(8)}.txt`);
                                    _StdOut.putText(`${INDENT_STRING}${INDENT_STRING}${this.hexToEnglish(this.getBlockData(sessionStorage.getItem(currentKey)))}`)
                                    _StdOut.advanceLine();
                                    isEmpty = false;
                                }/// if
                            }/// else
                        }/// if
                    }/// for
                }/// for
            }/// for

            if (isEmpty) {
                _StdOut.putText(`  No files found`);
                _StdOut.advanceLine();
            }/// if
            _OsShell.putPrompt();
        }/// list

        public read(fileName: string): string {
            var isSwapFile: boolean = this.isSwapFile(fileName);

            /// Create the illusion of file names...
            // fileName = isTxt ?fileName.replace(new RegExp('.txt' + '$'), '')
            // : fileName.replace(new RegExp('.swp' + '$'), '');
            /// See if file exists...
            /// If Not:
            ///     targetFileKey === ''
            /// If Exists
            ///     targetFileKey === the sessionStorage() Key
            var targetFileKey = this.fileNameExists(fileName);

            /// File found
            if (targetFileKey !== '') {
                var fileContents: string = '';

                /// Start at first file block
                var currentPointer: string = this.getBlockNextPointer(sessionStorage.getItem(targetFileKey));

                /// Keep following the links from block to block until the end of the file
                while (currentPointer !== BLOCK_NULL_POINTER) {
                    /// Since i haven't made the table yet...
                     _StdOut.advanceLine();
                     _StdOut.putText(`Pointer: ${currentPointer}`);
                     _StdOut.advanceLine();
                     _StdOut.putText(`Session Storage: ${sessionStorage.getItem(currentPointer)}`);
                     _StdOut.advanceLine();

                    /// Get block
                    var currentBlockValue = sessionStorage.getItem(currentPointer);

                    /// Translate non-swap files only
                    fileContents += isSwapFile ? this.getBlockData(currentBlockValue) : this.hexToEnglish(this.getBlockData(currentBlockValue));

                    /// get next block
                    currentPointer = this.getBlockNextPointer(currentBlockValue);
                }/// while

                return fileContents;
            }/// if

            /// File does not exist
            else {
                return `Cannot access C:\\AXIOS\\${fileName}`;
                /// return `Cannot access C:\\AXIOS\\${fileName}.${isSwapFile ? 'txt' : 'swp'}`;
            }/// else 
        }/// read

        public write(fileName: string, data: string): string {
            var dataInHex: string = data;

            /// Translate non-swap files into hex
            if (!this.isSwapFile(fileName)) {
                dataInHex = this.englishToHex(data);
            }/// if

            /// See if file exists again...
            var targetFileKey = this.fileNameExists(fileName);

            if (targetFileKey !== '') {
                /// Delete file contents if already written too...
                /// Start from the first file block...
                var currentPointer: string = this.getBlockNextPointer(sessionStorage.getItem(targetFileKey));

                /// Delete all following blocks
                while (currentPointer != BLOCK_NULL_POINTER) {
                    /// Get current block value
                    var currentBlockValue = sessionStorage.getItem(currentPointer);

                    var blockData: string = '00';
                    for (var byte = 0; byte < BLOCK_DATA_LIMIT - 1; ++byte) {
                        blockData += "00";
                    }// for
        
                    /// Value part of key|value in session storage
                    /// Actually "create" the block, by saving in Key|Value storage
                    sessionStorage.setItem(currentPointer, (`${"00"}${BLOCK_NULL_POINTER}${blockData}`));

                    /// Get next block by using pointer from current block
                    currentPointer = this.getBlockNextPointer(currentBlockValue);
                }/// while

                /// Begin writing to the file
                ///
                /// Split the data up into groups of 60 Bytes or less...
                /// It's Bytes * 2 since a byte is a pair of 00's
                var chunks: string[] = dataInHex.match(new RegExp('.{1,' + (2 * BLOCK_DATA_LIMIT) + '}', 'g'));

                /// Start at first file block again
                var targetFilePointerToFirstFreeBlock: string = this.getBlockNextPointer(sessionStorage.getItem(targetFileKey));

                /// Write to the first free data block
                var firstChunk: string = chunks.shift();
                var firstBlockValue: string = sessionStorage.getItem(targetFilePointerToFirstFreeBlock);
                firstBlockValue = "01" + this.getBlockNextPointer(firstBlockValue) + firstChunk + firstBlockValue.substring((7 + firstChunk.length));
                sessionStorage.setItem(targetFilePointerToFirstFreeBlock, firstBlockValue);

                /// Find more free space
                if (chunks.length > 0) {
                    /// Find the required number of blocks needed
                    var freeSpaceKeys: string[] = this.getAvailableBlocksFromDataPartition(chunks.length);
                    var previousBlockKey = targetFilePointerToFirstFreeBlock;

                    /// Enough available blocks were found
                    if (freeSpaceKeys !== null) {

                        while (chunks.length > 0) {
                            /// Grab next free block
                            var currentBlockKey: string = freeSpaceKeys.shift();

                            /// Grab next free chunk
                            var currentChuck: string = chunks.shift();

                            /// Set previous block to point to this current free block
                            /// Don't forget the previous block is now "in use" as well
                            var previousBlockValue: string = sessionStorage.getItem(previousBlockKey);
                            previousBlockValue = "01" + currentBlockKey + this.getBlockData(previousBlockValue);
                            sessionStorage.setItem(previousBlockKey, previousBlockValue);

                            /// Fill the currentBlock with the user data
                            /// Don't forget the current block is now "in use" as well
                            var currentBlockValue: string = sessionStorage.getItem(currentBlockKey);
                            currentBlockValue = "01" + this.getBlockNextPointer(currentBlockValue) + currentChuck + currentBlockValue.substring((7 + currentChuck.length + 1));
                            sessionStorage.setItem(currentBlockKey, currentBlockValue);

                            /// Update the previous block
                            previousBlockKey = currentBlockKey;
                        }/// while

                        return (`Wrote to: C:\\AXIOS\\${fileName}`);
                    }/// if

                    /// Not enough room, fail to enforce Atomicity!
                    else {
                        return `Cannot write to C:\\AXIOS\\${fileName}, not enough file data blocks available!`;
                    }/// else
                }/// if
            }/// if

            /// File not found
            else {
                return `Cannot write to C:\\AXIOS\\${fileName}, file not found!`;
            }/// else
        }/// write

        public deleteFile(fileName) {
            var isSwapFile: boolean = this.isSwapFile(fileName);

            /// See if file exists...
            /// If Not:
            ///     targetFileKey === ''
            /// If Exists
            ///     targetFileKey === the sessionStorage() Key
            var targetFileKey = this.fileNameExists(fileName);

            /// File found
            if (targetFileKey !== '') {

                /// "Delete" by making the directory block available, hopefully this will
                /// make recovering the files easier or at least partial recovery...
                this.setBlockFlag(targetFileKey, "00");

                /// Find where file content starts...
                var currentPointer: string = this.getBlockNextPointer(sessionStorage.getItem(targetFileKey));

                /// Keep following the links from block to block until the end of the file
                while (currentPointer != BLOCK_NULL_POINTER) {
                    /// Get current block
                    var currentBlockValue = sessionStorage.getItem(currentPointer);

                    /// Make current block available
                    this.setBlockFlag(currentPointer, "00");

                    /// Get next block
                    currentPointer = this.getBlockNextPointer(currentBlockValue);
                }/// while

                return `Deleted C:\\AXIOS\\${fileName}`;
            }/// if

            /// File NOT found
            else {
                _Kernel.krnTrace(`Cannot delete C:\\AXIOS\\${fileName}`);
                return `Cannot delete C:\\AXIOS\\${fileName}`;
            }/// else
        }/// delete



        public getFirstAvailableBlock(directory: string): string {

            if (directory === "File Body") {
                /// Only need to search the "file data" portion of the disk
                for (var trackNum: number = this.fileDataBlock.baseTrack; trackNum <= this.fileDataBlock.limitTrack; ++trackNum) {
                    for (var sectorNum: number = this.fileDataBlock.baseSector; sectorNum <= this.fileDataBlock.limitSector; ++sectorNum) {
                        for (var blockNum: number = this.fileDataBlock.baseBlock; blockNum <= this.fileDataBlock.limitBlock; ++blockNum) {
                            var currentKey: string = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
                            /// Availabiliy flag is low, meaning the block is free
                            if (this.getBlockFlag(sessionStorage.getItem(currentKey)) === "00") {
                                /// Return the location (the key) where the block is available
                                return currentKey;
                            }/// if
                        }/// for
                    }/// for
                }/// for
            }/// if

            else if (directory === "File Header") {
                /// Only need to search the "file header" portion of the disk
                for (var trackNum: number = this.dirBlock.baseTrack; trackNum <= this.dirBlock.limitTrack; ++trackNum) {
                    for (var sectorNum: number = this.dirBlock.baseSector; sectorNum <= this.dirBlock.limitSector; ++sectorNum) {
                        for (var blockNum: number = this.dirBlock.baseBlock; blockNum <= this.dirBlock.limitBlock; ++blockNum) {
                            var currentKey: string = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
                            /// Availabiliy flag is low, meaning the block is free
                            if (this.getBlockFlag(sessionStorage.getItem(currentKey)) === "00") {
                                /// Return the location (the key) where the block is available
                                return currentKey;
                            }/// if
                        }/// for
                    }/// for
                }/// for
            }/// if

            /// No available blocks were found
            return null;
        }/// getFirstAvailableBlock

        public getAvailableBlocksFromDirectoryPartition(numBlocksNeeded: number): string[] {
            var availableBlocks: string[] = [];
            for (var trackNum: number = this.dirBlock.baseTrack; trackNum <= this.dirBlock.limitTrack; ++trackNum) {
                for (var sectorNum: number = this.dirBlock.baseSector; sectorNum <= this.dirBlock.limitSector; ++sectorNum) {
                    for (var blockNum: number = this.dirBlock.baseBlock; blockNum <= this.dirBlock.limitBlock; ++blockNum) {
                        var currentKey: string = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
                        /// Availabiliy flag is low, meaning the block is free
                        if (this.getBlockFlag(sessionStorage.getItem(currentKey)) === "00") {
                            /// Block is free
                            availableBlocks.push(currentKey);
                        }/// if
                    }/// for
                }/// for
            }/// for

            return availableBlocks.length >= numBlocksNeeded ? availableBlocks : null;
        }/// getAvailableBlocksFromDirectoryPartition


        public getAvailableBlocksFromDataPartition(numBlocksNeeded: number): string[] {
            var availableBlocks: string[] = [];

            /// Only need to search the "file data" portion of the disk
            for (var trackNum: number = this.fileDataBlock.baseTrack; trackNum <= this.fileDataBlock.limitTrack; ++trackNum) {
                for (var sectorNum: number = this.fileDataBlock.baseSector; sectorNum <= this.fileDataBlock.limitSector; ++sectorNum) {
                    for (var blockNum: number = this.fileDataBlock.baseBlock; blockNum <= this.fileDataBlock.limitBlock; ++blockNum) {
                        var currentKey: string = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
                        /// Block is free
                        if (this.getBlockFlag(sessionStorage.getItem(currentKey)) === "00") {
                            /// Return the location (the key) where the block is available
                            availableBlocks.push(currentKey);
                        }/// if
                    }/// for
                }/// for
            }/// for

            return availableBlocks.length >= numBlocksNeeded ? availableBlocks : null;
        }/// getAvailableBlocksFromDataPartition

        public fileNameExists(targetFileNameInEnglish: string): string {
            /// Only need to search the "file names" portion of the disk
            for (var trackNum: number = this.dirBlock.baseTrack; trackNum <= this.dirBlock.limitTrack; ++trackNum) {
                for (var sectorNum: number = this.dirBlock.baseSector; sectorNum <= this.dirBlock.limitSector; ++sectorNum) {
                    for (var blockNum: number = this.dirBlock.baseBlock; blockNum <= this.dirBlock.limitBlock; ++blockNum) {
                        var currentKey: string = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
                        if (
                            this.hexToEnglish(
                                /// The data while stored in disk will be padded with 00's
                                this.getBlockData(sessionStorage.getItem(currentKey))
                            ) === targetFileNameInEnglish && this.getBlockFlag(sessionStorage.getItem(currentKey)) === '01'
                        ) {
                            return currentKey;
                        }/// if
                    }/// for
                }/// for
            }/// for
            return '';
        }/// searchDirectory

        private isSwapFile(fileName: string): boolean {
            return fileName.startsWith('.!');
        }/// isSwapFile

        private setBlockFlag(sessionStorageKey: string, flag: string): void {
            var sessionStorageValue: string = sessionStorage.getItem(sessionStorageKey);
            sessionStorageValue = flag + sessionStorageValue.substring(2);
            sessionStorage.setItem(sessionStorageKey, sessionStorageValue);
        }/// setBlockFlag

        private getBlockFlag(sessionStorageValue: string): string {
            return sessionStorageValue.substring(0, 2);
        }/// getBlockFlag

        private getBlockNextPointer(sessionStorageValue: string): string {
            return sessionStorageValue.substring(2, 8);
        }/// getBlockNextPointer

        private getBlockData(sessionStorageValue: string): string {
            /// hmm...
            /// How do you know when a program ends in memory...
            /// return isSwapFile ? sessionStorageValue.substring(8) : sessionStorageValue.substring(8).replace('00', '');

            /// Return this for now..
            return sessionStorageValue.substring(8);
        }/// getBlockData

        private setBlockData(sessionStorageKey: string, newBlockData: string): boolean {
            /// .substring(8);
            if (newBlockData.length <= BLOCK_DATA_LIMIT*2) {
                var sessionStorageValue = sessionStorage.getItem(sessionStorageKey);
                sessionStorageValue = sessionStorageValue.substring(0, 8) + newBlockData;
                sessionStorage.setItem(sessionStorageKey, sessionStorageValue);
                return true;
            }/// if
            return false;
        }/// getBlockData

        public englishToHex(englishWord: string): string {
            var englishWordInHex = '';
            for (var letter: number = 0; letter < englishWord.length; ++letter) {

                /// Add left 0 padding
                var paddedhexNumber: string = "00" + englishWord[letter].charCodeAt(0).toString(16);
                paddedhexNumber = paddedhexNumber.substr(paddedhexNumber.length - 2).toUpperCase();

                /// Get Ascii value from english letter and convert to a single hex character string
                englishWordInHex += paddedhexNumber;
            }/// for

            return englishWordInHex;
        }/// englishToHex

        public hexToEnglish(hexWord: string): string {
            var englishWord = '';
            for (var hexLetterPair: number = 0; hexLetterPair < hexWord.length; hexLetterPair += 2) {
                if (hexWord.substring(hexLetterPair, hexLetterPair + 2) === "00") {
                    break;
                }///
                else {
                    englishWord += String.fromCharCode(
                        parseInt(
                            /// Read hex digits in pairs
                            hexWord.substr(hexLetterPair, 2),
                            16 /// To decimal from base 16
                        )/// parseInt
                    );/// String.fromCharCode
                }/// else
            }/// for
            return englishWord;
        }/// hexToEnglish
    }/// class

    export class Partition {
        constructor(
            public name,
            public baseTrack,
            public baseSector,
            public baseBlock,
            public limitTrack,
            public limitSector,
            public limitBlock,
        ) { }/// constructor
    }
}/// TSOS

        // public updateFreeSpaceLinkedList() {
        //     /// Start off at the MBR, to have it hold the pointer to the first free block
        //     /// 
        //     /// If the MBR points to a block in use, then we ran out of storage
        //     var previousBlockKey: string = "000000";
        //     var previousBlockValue: string = '';
        //     var currentBlockKey: string = "000000";
        //     var currentBlockValue: string = '';

        //      for (var trackNum: number = this.fileDataBlock.baseTrack; trackNum <= this.fileDataBlock.limitTrack; ++trackNum) {
        //         for (var sectorNum: number = this.fileDataBlock.baseSector; sectorNum <= this.fileDataBlock.limitSector; ++sectorNum) {
        //             for (var blockNum: number = this.fileDataBlock.baseBlock; blockNum <= this.fileDataBlock.limitBlock; ++blockNum) {
        //                 currentBlockKey = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
        //                 currentBlockValue = sessionStorage.getItem(currentBlockKey).substring(0, 2);

        //                 /// Block is free
        //                 if (currentBlockValue === "00") {

        //                     /// Update previous blocks pointer to point to the current free block
        //                     previousBlockValue = sessionStorage.getItem(previousBlockKey);
        //                     previousBlockValue = "00" + currentBlockKey + previousBlockValue.substring(8, previousBlockValue.length);
        //                     sessionStorage.setItem(previousBlockKey, previousBlockValue);

        //                     previousBlockKey = currentBlockKey;
        //                 }/// if
        //             }/// for
        //         }/// for
        //     }/// for
        // }/// updateFreeSpaceLinkedList