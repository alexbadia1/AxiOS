/* ------------
   Interrupt.ts
   ------------ */
var TSOS;
(function (TSOS) {
    class Interrupt {
        constructor(irq, params, priority = 1) {
            this.irq = irq;
            this.params = params;
            this.priority = priority;
            switch (irq) {
                case TIMER_IRQ:
                    this.priority = 1;
                    break;
                case KEYBOARD_IRQ:
                    this.priority = 1;
                    break;
                case SYS_CALL_IRQ: /// Maybe should have a higher priority (lower number)?
                    this.priority = 1;
                    break;
                case PS_IRQ:
                    this.priority = 1;
                    break;
                case SINGLE_STEP_IRQ:
                    this.priority = 1;
                    break;
                case NEXT_STEP_IRQ:
                    this.priority = 1;
                    break;
                case CONTEXT_SWITCH_IRQ:
                    this.priority = 1;
                    break;
                case CHANGE_QUANTUM_IRQ:
                    this.priority = 2;
                    break;
                case RUN_PROCESS_IRQ:
                    this.priority = 1;
                    break;
                case RUN_ALL_PROCESSES_IRQ:
                    this.priority = 1;
                    break;
                case TERMINATE_PROCESS_IRQ:
                    this.priority = 1;
                    break;
                case KILL_PROCESS_IRQ:
                    this.priority = 1;
                    break;
                case KILL_ALL_PROCESSES_IRQ:
                    this.priority = 1;
                    break;
                default:
                    this.priority = 1;
                    break;
            } /// switch
        } /// constructor
    } /// class
    TSOS.Interrupt = Interrupt;
})(TSOS || (TSOS = {})); /// module
//# sourceMappingURL=interrupt.js.map