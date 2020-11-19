/** 
 * AxiOS is browser based, so naturally, session storage will be used meaning,
 * Our disk filesystem is implemented with a Key|Value pairs...
 * 
 * Quick Notes on Disk:
 *      Structure
 *          Tracks > Sectors > Blocks
 *          In analogy think of an olympic track...
 *              Each "lane" = track
 *              Every say 100 meters = section
 *      - Ours will be 16 KB so...
 *          - 4 Tracks
 *          - 8 Sectors
 *          - 8 Blocks (each 64 Bytes)
 * 
 * 
 * Quick Notes on HTML5 Session Storage:
 *      - Implemented via Key|Value pairs
 *      - Each Key represents a location on the "disk":
 *          -"(track, sector, block)"
 *          -
 * 
 * 
*/


module TSOS {
    export class Disk {
        constructor() { }/// constructor
        init() {
            /// Create each block in the 16KB Disk
            for (var trackNum: number = 0; trackNum < TRACK_LIMIT; ++trackNum) {
                for (var sectorNum: number = 0; sectorNum < SECTOR_LIMIT; ++sectorNum) {
                    for (var blockNum: number = 0; blockNum < BLOCK_LIMIT; ++blockNum) {
                        this.createSessionBlock(trackNum, sectorNum, blockNum);
                    }/// for
                }/// for
            }/// for

            this.createMasterBootRecord();
        }/// init

        public createSessionBlock(newTrackNum: number, newSectorNum: number, newBlockNum: number) {
            var key = `${TSOS.Control.formatToHexWithPadding(newTrackNum)}${TSOS.Control.formatToHexWithPadding(newSectorNum)}${TSOS.Control.formatToHexWithPadding(newBlockNum)}`;
            var forwardPointer = BLOCK_NULL_POINTER;
            /// First byte = availability flag
            ///     1 means available
            ///     0 means NOT available because 0 is falsey
            var isOccupied: string = "00";

            /// Remaining 60 Bytes are for the raw data
            ///
            /// Be careful with "+=", you don't want to append strings to null, make sure data is initialized to ''.
            /// You'll end up getting [flag][pointer]undefined00000000000000000000...
            var data: string = '00';
            for (var byte = 0; byte < BLOCK_DATA_LIMIT - 1; ++byte) {
                data += "00";
            }// for

            /// Value part of key|value in session storage
            var value = isOccupied + forwardPointer + data;

            /// Actually "create" the block, by saving in Key|Value storage
            sessionStorage.setItem(key, value);
        }/// createSessionBlock

        private createMasterBootRecord() {
            var key: string = "000000";
            var isOccupied: string = "01";
            var nextBlockPointer: string = BLOCK_NULL_POINTER;

            /// Remaining 60 Bytes are for the raw data
            var data: string = _krnDiskDriver.englishToHex("Master Partition Table, Master Signature, Master Boot Code");

            /// Value part of key|value in session storage
            var value = isOccupied + nextBlockPointer + data;

            /// Actually "create" the first master boot block, by saving in Key|Value storage
            sessionStorage.setItem(key, value);
        }/// createMasterBootRecord
    }/// class
}/// module

/// Alternative default pointer, to have a linkecd list of available blocks...
///
/// var forwardPointer = `${TSOS.Control.formatToHexWithPadding(newTrackNum + 1)}${TSOS.Control.formatToHexWithPadding(newSectorNum + 1)}${TSOS.Control.formatToHexWithPadding(newBlockNum + 1)}`;   
/// if (newTrackNum === TRACK_LIMIT - 1 && newSectorNum === SECTOR_LIMIT - 1 && newBlockNum === BLOCK_LIMIT - 1) {
    /// forwardPointer = `
        /// ${TSOS.Control.formatToHexWithPadding(newTrackNum)}
        /// ${TSOS.Control.formatToHexWithPadding(newSectorNum)}
        /// ${TSOS.Control.formatToHexWithPadding(newBlockNum)}`;
/// }/// if