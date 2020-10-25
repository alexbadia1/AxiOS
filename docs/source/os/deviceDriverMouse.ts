/* ----------------------------------
   DeviceDriverMouse.ts

   The Kernel Mouse Device Driver.
   My -um- clumsy attempt at capturing mouse input.
   ---------------------------------- */

   module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverMouse extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnMouseDriverEntry, this.krnMouseScroll);
            // So instead...
            super();
            this.driverEntry = this.krnMouseDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnMouseDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
        }/// krnKbdDispatchKeyPress
    }/// class
}/// module
