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
        constructor() {}/// constructor
        init() {
            /// Create each block in the 16KB Disk
            for (var trackNum: number = 0; trackNum < TRACK_LIMIT; ++trackNum) {
                for (var sectorNum: number  = 0; sectorNum < SECTOR_LIMIT; ++sectorNum) {
                    for (var blockNum: number = 0; blockNum < BLOCK_LIMIT; ++blockNum) {
                        this.createSessionBlock(`(${trackNum}, ${sectorNum}, ${blockNum})`);
                    }/// for
                }/// for
            }/// for

            this.createMasterBootRecord();
        }/// init

        public createSessionBlock (key: string) {
            /// First byte = availability flag
            ///     1 means available
            ///     0 means NOT available because 0 is falsey
            var inUseFlag: string = "00";

            /// Second Bytes = nextTrack,
            /// Third Byte = nextSector,
            /// Fourth Bytes = nextBlock,
            /// Initiliizing to 0 points to the master boot record, 
            /// ff's is techninally could be an address, so... maybe "--"?
            var nextBlockPointer: string = "------";
            
            /// Remaining 60 Bytes are for the raw data
            var data: string;
            for (var byte = 0; byte < BLOCK_SIZE_LIMIT; ++byte) {
                data += "00";
            }// for
            
            /// Value part of key|value in session storage
            var value = [inUseFlag, nextBlockPointer, data];

            /// Actually "create" the block, by saving in Key|Value storage
            /// _krnFileSystemDriver.krnFsdWrite(key, value);
        }

        private createMasterBootRecord () {
            var availabilityFlag: string = "00";
            var nextBlockPointer: string = "------";
            
            /// Remaining 60 Bytes are for the raw data
            var data: string = "Master Partition Table, Master Signature, Master Boot Code"
            
            /// Value part of key|value in session storage
            var value = [availabilityFlag, nextBlockPointer, data];

            /// Actually "create" the first master boot block, by saving in Key|Value storage
            /// _krnFileSystemDriver.krnFsdWrite("(0, 0, 0)", value);
        }/// createMasterBootRecord
    }
}