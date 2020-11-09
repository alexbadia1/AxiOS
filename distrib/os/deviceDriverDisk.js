/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        constructor(hiddenFilePrefix = '.', swapFilePrefix = '!', dirBlock = new Partition('File Header', /// File Entries
        0, 0, 1, /// base = (0, 0, 1)
        0, 7, 7), /// new Directory
        fileDataBlock = new Partition('File Body', /// File Data
        1, 0, 0, /// base = (1, 0, 0)
        3, 7, 7), /// new Block
        formatted = false, diskBase = "000000", diskLimit = "030707") {
            /// Override the base method pointers
            /// The code below cannot run because "this" can only be accessed after calling super.
            /// super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();
            this.hiddenFilePrefix = hiddenFilePrefix;
            this.swapFilePrefix = swapFilePrefix;
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
            var result = '';
            var diskOperation = params[0];
            switch (diskOperation) {
                case 'create':
                    /// params[1] = filename
                    result = this.create(params[1]);
                    break;
                case 'write':
                    break;
                case 'read':
                    result = this.read(params[1]);
                    break;
                case 'delete':
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
            } /// switch
            /// Show results denoting the success or failure of the driver operation on disk
            if (result !== '') {
                _StdOut.putText(`${result}`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            }
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
                _StdOut.putText(`Hard drive successfully formatted!`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            } /// if
            // else {
            //     _StdOut.putText(`Failed to format (Type: ${type.replace('-', '').trim()})`);
            //     _StdOut.advanceLine();
            //     _OsShell.putPrompt();
            // }// else
        } /// format
        fullFormat() {
            if (this.formatted) {
                /// Same as Disk.init() except skip the master boot record
                for (var trackNum = 0; trackNum < TRACK_LIMIT; ++trackNum) {
                    for (var sectorNum = 0; sectorNum < SECTOR_LIMIT; ++sectorNum) {
                        for (var blockNum = 0; blockNum < BLOCK_LIMIT; ++blockNum) {
                            _Disk.createSessionBlock(trackNum, sectorNum, blockNum);
                        } /// for
                    } /// for
                } /// for
                _Kernel.krnTrace(`Disk formatted (Type: Full Format)`);
                this.formatted = true;
                return true;
            } /// if
            else {
                _Kernel.krnTrace(`Failed disk format (Type: Full Format), missing master boot record`);
                _StdOut.putText(`Full Format can only be used to REFORMAT the drive, please initially format the drive.`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
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
                            var currentKey = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
                            /// Skip already quick formatted blocks
                            if (sessionStorage.getItem(currentKey).substring(0, 8) === "00000000") {
                                continue;
                            } /// if
                            /// Skip master boot record
                            if (trackNum === 0 && sectorNum === 0 && blockNum === 0) {
                                continue;
                            } ///if
                            /// Reset the first 8 nums to zero
                            else {
                                /// Get session value
                                var value = sessionStorage.getItem(currentKey);
                                /// Replace the first 4 bytes (8 characters) with 00's
                                value = "00000000" + value.substring(8, value.length);
                                /// Write the change back to the list
                                sessionStorage.setItem(currentKey, value);
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
                _StdOut.putText(`Quick Format can only be used to REFORMAT the drive, please initially format the drive.`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
                return false;
            } /// else
        } /// quickFormat
        /// Create File should be all or nothing...No partial creations of files
        create(fileName = '') {
            var msg = 'File creation failed';
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
                        var data = '';
                        for (var byte = 0; byte < BLOCK_DATA_LIMIT; ++byte) {
                            data += "00";
                        } // for
                        /// Replace the first 4 bytes (8 characters) with 00's
                        data = this.englishToHex(fileName) + data.substring(fileName.length, data.length);
                        var value = "01" + availableFileDataKey + data;
                        /// Write to the block
                        sessionStorage.setItem(availableDirKey, value);
                        _Kernel.krnTrace('File sucessfully created!');
                        msg = `C:\\AXIOS\\${fileName} sucessfully created!`;
                    } /// if
                    else {
                        _Kernel.krnTrace(`Cannot create C:\\AXIOS\\${fileName}, all file data blocks are in use!`);
                        msg = `Cannot create C:\\AXIOS\\${fileName}, all file data blocks are in use!`;
                    } /// else
                } /// if
                else {
                    _Kernel.krnTrace(`Cannot create C:\\AXIOS\\${fileName}, all file header blocks are in use!`);
                    msg = `Cannot create C:\\AXIOS\\${fileName}, all file header blocks are in use!`;
                } /// else
            } /// if
            else {
                _Kernel.krnTrace(`Cannot create C:\\AXIOS\\${fileName}, filename is already in use!`);
                msg = `Cannot create C:\\AXIOS\\${fileName}, filename already in use!`;
            } /// else
            return msg;
        } /// createFile
        list(type) {
            var isEmpty = true;
            _StdOut.advanceLine();
            /// Only need to search the "file header" portion of the disk
            for (var trackNum = this.dirBlock.baseTrack; trackNum <= this.dirBlock.limitTrack; ++trackNum) {
                for (var sectorNum = this.dirBlock.baseSector; sectorNum <= this.dirBlock.limitSector; ++sectorNum) {
                    for (var blockNum = this.dirBlock.baseBlock; blockNum <= this.dirBlock.limitBlock; ++blockNum) {
                        var currentKey = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
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
                            } /// if
                            /// Hidden file
                            else {
                                /// Only show hidden file if "-l" argument was used
                                if (type === '-l') {
                                    /// Print out file name, with proper file extension
                                    ///sessionStorage.getItem(currentKey).substring(8).startsWith(".!") ?
                                    ///_StdOut.putText(`${INDENT_STRING}${INDENT_STRING}${sessionStorage.getItem(currentKey).substring(8)}.swp`)
                                    ///: _StdOut.putText(`${INDENT_STRING}${INDENT_STRING}${sessionStorage.getItem(currentKey).substring(8)}.txt`);
                                    _StdOut.putText(`${INDENT_STRING}${INDENT_STRING}${this.hexToEnglish(this.getBlockData(sessionStorage.getItem(currentKey)))}`);
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
        read(fileName) {
            var isSwapFile = this.isSwapFile(fileName);
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
                var fileContents = '';
                var currentPointer = this.getBlockNextPointer(sessionStorage.getItem(targetFileKey));
                /// Keep following the links from block to block until the end of the file
                while (currentPointer != BLOCK_NULL_POINTER) {
                    /// Get block
                    var currentBlockValue = sessionStorage.getItem(currentPointer);
                    /// Translate non-swap files only
                    fileContents += isSwapFile ? this.getBlockData(currentBlockValue) : this.hexToEnglish(this.getBlockData(currentBlockValue));
                    /// get next block
                    currentPointer = this.getBlockNextPointer(currentBlockValue);
                } /// while
                return fileContents;
            } /// if
            /// File does not exist
            else {
                return `Cannot access C:\\AXIOS\\${fileName}`;
                /// return `Cannot access C:\\AXIOS\\${fileName}.${isSwapFile ? 'txt' : 'swp'}`;
            } /// else 
        } /// read
        write(fileName, data) {
            var dataInHex = data;
            /// Translate non-swap files into hex
            if (!this.isSwapFile(fileName)) {
                dataInHex = this.englishToHex(data);
            } /// if
            /// See if file exists...
            /// If Not:
            ///     targetFileKey === ''
            /// If Exists
            ///     targetFileKey === the sessionStorage() Key
            var targetFileKey = this.fileNameExists(fileName);
            /// Delete file contents if already written too...
            /// Hint: you'll need read and delete
            if (targetFileKey !== '') {
                /// Split the data up into groups of 60 Bytes or less
                var chunks = dataInHex.match(new RegExp('.{1,' + BLOCK_DATA_LIMIT + '}', 'g'));
                /// Find file in directory and write to it's first pointer
                var targetFilePointerToFirstFreeBlock = this.getBlockNextPointer(sessionStorage.getItem(targetFileKey));
                /// Write to the first free data block
                sessionStorage.setItem(targetFilePointerToFirstFreeBlock, chunks.shift());
                /// Find more free space
                if (chunks.length > 0) {
                    /// Find the required number of blocks needed
                    var freeSpaceKeys = this.getAvailableBlocksFromDataPartition(chunks.length);
                    var previousBlockKey = targetFilePointerToFirstFreeBlock;
                    /// Enough available blocks were found
                    if (freeSpaceKeys !== null) {
                        for (var key = 0; key < freeSpaceKeys.length; ++key) {
                            /// Grab next free block
                            var currentBlockKey = freeSpaceKeys.shift();
                            /// Fill the currentBlock with the user data
                            /// Don't forget the current block is now "in use" as well
                            var currentBlockValue = sessionStorage.getItem(currentBlockKey);
                            currentBlockValue = "01" + this.getBlockNextPointer(currentBlockValue) + chunks.shift();
                            sessionStorage.setItem(currentBlockKey, currentBlockValue);
                            /// Set previous block to point to this current free block
                            /// Don't forget the previous block is now "in use" as well
                            var previousBlockValue = sessionStorage.getItem(previousBlockKey);
                            previousBlockValue = "01" + currentBlockKey + previousBlockValue.substring(8);
                            sessionStorage.setItem(previousBlockKey, previousBlockValue);
                            /// Update the previous block
                            previousBlockKey = currentBlockKey;
                        } /// for
                    } /// if
                    /// Not enough room, fail to enforce Atomicity!
                    else {
                        return `Cannot write to C:\\AXIOS\\${fileName}, not enough file data blocks available!`;
                    } /// else
                } /// if
            } /// if
        } /// write
        deleteFile(fileName) {
            var isSwapFile = this.isSwapFile(fileName);
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
                var currentPointer = this.getBlockNextPointer(sessionStorage.getItem(targetFileKey));
                /// Keep following the links from block to block until the end of the file
                while (currentPointer != BLOCK_NULL_POINTER) {
                    /// Get current block
                    var currentBlockValue = sessionStorage.getItem(currentPointer);
                    /// Make current block available
                    this.setBlockFlag(currentPointer, "00");
                    /// Get next block
                    currentPointer = this.getBlockNextPointer(currentBlockValue);
                } /// while
                return `Deleted C:\\AXIOS\\${fileName}`;
            } /// if
            /// File NOT found
            else {
                _Kernel.krnTrace(`Cannot delete C:\\AXIOS\\${fileName}`);
                return `Cannot delete C:\\AXIOS\\${fileName}`;
            } /// else
        } /// 
        getFirstAvailableBlock(directory) {
            if (directory === "File Body") {
                /// Only need to search the "file data" portion of the disk
                for (var trackNum = this.fileDataBlock.baseTrack; trackNum <= this.fileDataBlock.limitTrack; ++trackNum) {
                    for (var sectorNum = this.fileDataBlock.baseSector; sectorNum <= this.fileDataBlock.limitSector; ++sectorNum) {
                        for (var blockNum = this.fileDataBlock.baseBlock; blockNum <= this.fileDataBlock.limitBlock; ++blockNum) {
                            var currentKey = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
                            /// Availabiliy flag is low, meaning the block is free
                            if (this.getBlockFlag(sessionStorage.getItem(currentKey)) === "00") {
                                /// Return the location (the key) where the block is available
                                return currentKey;
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
                            var currentKey = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
                            /// Availabiliy flag is low, meaning the block is free
                            if (this.getBlockFlag(sessionStorage.getItem(currentKey)) === "00") {
                                /// Return the location (the key) where the block is available
                                return currentKey;
                            } /// if
                        } /// for
                    } /// for
                } /// for
            } /// if
            /// No available blocks were found
            return null;
        } /// getFirstAvailableBlock
        getAvailableBlocksFromDirectoryPartition(numBlocksNeeded) {
            var availableBlocks = [];
            for (var trackNum = this.dirBlock.baseTrack; trackNum <= this.dirBlock.limitTrack; ++trackNum) {
                for (var sectorNum = this.dirBlock.baseSector; sectorNum <= this.dirBlock.limitSector; ++sectorNum) {
                    for (var blockNum = this.dirBlock.baseBlock; blockNum <= this.dirBlock.limitBlock; ++blockNum) {
                        var currentKey = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
                        /// Availabiliy flag is low, meaning the block is free
                        if (this.getBlockFlag(sessionStorage.getItem(currentKey)) === "00") {
                            /// Block is free
                            availableBlocks.push(currentKey);
                        } /// if
                    } /// for
                } /// for
            } /// for
            return availableBlocks.length >= numBlocksNeeded ? availableBlocks : null;
        } /// getAvailableBlocksFromDirectoryPartition
        getAvailableBlocksFromDataPartition(numBlocksNeeded) {
            var availableBlocks = [];
            /// Only need to search the "file data" portion of the disk
            for (var trackNum = this.fileDataBlock.baseTrack; trackNum <= this.fileDataBlock.limitTrack; ++trackNum) {
                for (var sectorNum = this.fileDataBlock.baseSector; sectorNum <= this.fileDataBlock.limitSector; ++sectorNum) {
                    for (var blockNum = this.fileDataBlock.baseBlock; blockNum <= this.fileDataBlock.limitBlock; ++blockNum) {
                        var currentKey = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
                        /// Block is free
                        if (this.getBlockFlag(sessionStorage.getItem(currentKey)) === "00") {
                            /// Return the location (the key) where the block is available
                            availableBlocks.push(currentKey);
                        } /// if
                    } /// for
                } /// for
            } /// for
            return availableBlocks.length >= numBlocksNeeded ? availableBlocks : null;
        } /// getAvailableBlocksFromDataPartition
        fileNameExists(targetFileNameInEnglish) {
            /// Only need to search the "file names" portion of the disk
            for (var trackNum = this.dirBlock.baseTrack; trackNum <= this.dirBlock.limitTrack; ++trackNum) {
                for (var sectorNum = this.dirBlock.baseSector; sectorNum <= this.dirBlock.limitSector; ++sectorNum) {
                    for (var blockNum = this.dirBlock.baseBlock; blockNum <= this.dirBlock.limitBlock; ++blockNum) {
                        var currentKey = `${TSOS.Control.formatToHexWithPadding(trackNum)}${TSOS.Control.formatToHexWithPadding(sectorNum)}${TSOS.Control.formatToHexWithPadding(blockNum)}`;
                        if (this.hexToEnglish(
                        /// The data while stored in disk will be padded with 00's
                        this.getBlockData(sessionStorage.getItem(currentKey))) === targetFileNameInEnglish && this.getBlockFlag(sessionStorage.getItem(currentKey)) === '01') {
                            return currentKey;
                        } /// if
                    } /// for
                } /// for
            } /// for
            return '';
        } /// searchDirectory
        isSwapFile(fileName) {
            return fileName.startsWith('.!');
        } /// isSwapFile
        setBlockFlag(sessionStorageKey, flag) {
            var sessionStorageValue = sessionStorage.getItem(sessionStorageKey);
            sessionStorageValue = flag + sessionStorageValue.substring(2);
            sessionStorage.setItem(sessionStorageKey, sessionStorageValue);
        } /// setBlockFlag
        getBlockFlag(sessionStorageValue) {
            return sessionStorageValue.substring(0, 2);
        } /// getBlockFlag
        getBlockNextPointer(sessionStorageValue) {
            return sessionStorageValue.substring(2, 8);
        } /// getBlockNextPointer
        getBlockData(sessionStorageValue) {
            /// hmm...
            /// How do you know when a program ends in memory...
            /// return isSwapFile ? sessionStorageValue.substring(8) : sessionStorageValue.substring(8).replace('00', '');
            /// Return this for now..
            return sessionStorageValue.substring(8);
        } /// getBlockData
        englishToHex(englishWord) {
            var englishWordInHex = '';
            for (var letter = 0; letter < englishWord.length; ++letter) {
                /// Add left 0 padding
                var paddedhexNumber = "00" + englishWord[letter].charCodeAt(0).toString(16);
                paddedhexNumber = paddedhexNumber.substr(paddedhexNumber.length - 2).toUpperCase();
                /// Get Ascii value from english letter and convert to a single hex character string
                englishWordInHex += paddedhexNumber;
            } /// for
            return englishWordInHex;
        } /// englishToHex
        hexToEnglish(hexWord) {
            var englishWord = '';
            hexLoop: for (var hexLetterPair = 0; hexLetterPair < hexWord.length; hexLetterPair += 2) {
                if (hexWord.substring(hexLetterPair, hexLetterPair + 2) === "00") {
                    break hexLoop;
                } ///
                else {
                    englishWord += String.fromCharCode(parseInt(
                    /// Read hex digits in pairs
                    hexWord.substr(hexLetterPair, 2), 16 /// To decimal from base 16
                    ) /// parseInt
                    ); /// String.fromCharCode
                } /// else
            } /// for
            return englishWord;
        } /// hexToEnglish
    } /// class
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
    class Partition {
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
    TSOS.Partition = Partition;
})(TSOS || (TSOS = {})); /// TSOS
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
//# sourceMappingURL=deviceDriverDisk.js.map