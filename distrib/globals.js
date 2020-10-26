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
const APP_NAME = "TSOS";
const APP_VERSION = "0.07";
// This is in ms (milliseconds) so 1000 = 1 second.
const CPU_CLOCK_INTERVAL = .000000001;
// Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const TIMER_IRQ = 0;
/// Hardware Interrupt
const KEYBOARD_IRQ = 1;
/// Read/Write Console Interrupts
const SYS_CALL_IRQ = 2;
const PS_IRQ = 3;
/// Single Step Interrupts
const SINGLE_STEP_IRQ = 4;
const NEXT_STEP_IRQ = 5;
/// Scheduling Interrupts
const CONTEXT_SWITCH_IRQ = 6;
const CHANGE_QUANTUM_IRQ = 7;
/// Create Process Interrupts
const RUN_PROCESS_IRQ = 8;
const RUN_ALL_PROCESSES_IRQ = 9;
/// Exit Process Interrupts
///
/// When a process ends, it sends its own termination interrupt
const TERMINATE_PROCESS_IRQ = 10;
/// This is the user "killing" the process,
/// NOT the process sending its own termination interrupt
const KILL_PROCESS_IRQ = 11;
const KILL_ALL_PROCESSES_IRQ = 12;
/// Priority Queue Constants
const ROOT_NODE = 0;
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _CPU_BURST; /// Keep track of the number of bursts the CPU has performed
/// Step -1: Learn from past mistakes and READ the fudgin' HINTS...
///
/// Hardware (host)
var _Memory;
var _MemoryAccessor;
var _Dispatcher;
var _Scheduler;
/// Software (OS)
var _MemoryManager = null;
var _ResidentList;
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _SingleStepMode = false;
var _NextStep = false;
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _taProgramInput;
var _visualMemory; /// global variable for the memory table
var _visualCpu; /// global variable for the CPU table
var _visualPcb; /// global variable for the PCB table
var _visualResidentList; /// global variable for the residentlis
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptPriorityQueue = null;
var _KernelInputQueue = null;
var _KernelBuffers = null;
// Standard input and output
var _StdIn = null;
var _StdOut = null;
// UI
var _Console;
var _OsShell;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;
var _hardwareClockID = null;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados-ip*.js http://alanclasses.github.io/TSOS/test/ .
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
/// Define max number of volumes and their max size
var MAX_NUMBER_OF_VOlUMES = 3;
var MAX_SIMPLE_VOLUME_CAPACITY = 256;
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
//# sourceMappingURL=globals.js.map