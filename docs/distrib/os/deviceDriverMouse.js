/* ----------------------------------
   DeviceDriverMouse.ts

   The Kernel Mouse Device Driver.
   My -um- clumsy attempt at capturing mouse input.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverMouse extends TSOS.DeviceDriver {
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
        krnMouseDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
        } /// krnKbdDispatchKeyPress
    } /// class
    TSOS.DeviceDriverMouse = DeviceDriverMouse;
})(TSOS || (TSOS = {})); /// module
//# sourceMappingURL=deviceDriverMouse.js.map