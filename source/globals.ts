/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in our text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
// 'cause Bob and I were at a loss for a better name. What did you expect?
const APP_NAME: string    = "TSOS";
const APP_VERSION: string = "0.07";

/// Console Constants
const INDENT_STRING = '  ';
const INDENT_NUMBER = 16;

// This is in ms (milliseconds) so 1000 = 1 second.
const CPU_CLOCK_INTERVAL: number = 100;

// Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const TIMER_IRQ: number = 0;

/// Hardware Interrupt
const KEYBOARD_IRQ: number = 1;
const DISK_IRQ: number = 13; /// uh oh, unlucky 13...

/// Read/Write Console Interrupts
const SYS_CALL_IRQ: number = 2;
const PS_IRQ: number = 3;

/// Single Step Interrupts
const SINGLE_STEP_IRQ: number = 4;
const NEXT_STEP_IRQ: number = 5;

/// Scheduling Interrupts
const CONTEXT_SWITCH_IRQ: number = 6;
const CHANGE_QUANTUM_IRQ: number = 7;

/// Create Process Interrupts
const RUN_PROCESS_IRQ: number = 8;
const RUN_ALL_PROCESSES_IRQ: number = 9;

/// Exit Process Interrupts
///
/// When a process ends, it sends its own termination interrupt
const TERMINATE_PROCESS_IRQ: number = 10;

/// This is the user "killing" the process,
/// NOT the process sending its own termination interrupt
const KILL_PROCESS_IRQ: number = 11;
const KILL_ALL_PROCESSES_IRQ: number = 12;

/// Priority Queue Constants
const ROOT_NODE = 0;

/// Disk Constants
///
/// 16KB limit means 4 tracks, 8 sectors, 8 blocks (each 64 Bytes)
const TRACK_LIMIT = 4;
const SECTOR_LIMIT = 8;
const BLOCK_LIMIT = 8;
const BLOCK_SIZE_LIMIT = 64;
const DATA_BLOCK_DATA_LIMIT = 59;
const DIRECTORY_BLOCK_DATA_LIMIT = 50;
const METADATA_BYTE_SIZE = 13;
const FLAG_INDEXES = {start: 0, end: 3};
const POINTER_INDEXES = {start: 4, end: 9};
const DATE_INDEXES = {start: 10, end: 23};
const FILE_SIZE_INDEXES = {start: 24, end: 27};
const DIRECTORY_DATA_INDEXES = {start: 28, end: 128};
const DATA_DATA_INDEXES= {start: 10, end: 128}
const BLOCK_NULL_POINTER = "FFFFFF";
const NEGATIVE_ZERO = 32_768;
const FILE_META_DATA_LENGTH = 15;

//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _CPU_BURST: number; /// Keep track of the number of bursts the CPU has performed

/// Step -1: Learn from past mistakes and READ the fudgin' HINTS...
///
/// Hardware (host)
var _Memory: TSOS.Memory;
var _MemoryAccessor: TSOS.MemoryAccessor;

var _Dispatcher: TSOS.Dispatcher;
var _Swapper: TSOS.Swapper;
var _Scheduler: TSOS.Scheduler;

var _Disk: TSOS.Disk;

/// Software (OS)
var _MemoryManager: any = null;
var _ResidentList: TSOS.ResidentList;

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _SingleStepMode: boolean = false;
var _NextStep: boolean = false;

var _Canvas: HTMLCanvasElement;          // Initialized in Control.hostInit().
var _DrawingContext: any;                // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _taProgramInput: any;
var _visualMemory: any;         /// global variable for the memory table
var _visualCpu: any; /// global variable for the CPU table
var _visualPcb: any; /// global variable for the PCB table
var _visualResidentList: any; /// global variable for the residentlis
var _DefaultFontFamily: string = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;       // Additional space added to font size when advancing a line.

var _Trace: boolean = true;              // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptPriorityQueue: TSOS.PriorityQueue = null;
var _KernelInputQueue: TSOS.Queue = null; 
var _KernelBuffers = null; 

// Standard input and output
var _StdIn:  TSOS.Console = null; 
var _StdOut: TSOS.Console = null;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;
var _TwentyFourHourClock: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver: TSOS.DeviceDriverKeyboard  = null;
var _krnDiskDriver: TSOS.DeviceDriverDisk = null;

var  _hardwareClockID: any = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados-ip*.js http://alanclasses.github.io/TSOS/test/ .
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

/// Define max number of volumes and their max size
var MAX_NUMBER_OF_VOlUMES: number = 3;
var MAX_SIMPLE_VOLUME_CAPACITY: number = 256;

var onDocumentLoad = function() {
   TSOS.Control.hostInit();
};
