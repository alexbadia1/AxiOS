# Axios

AxiOS - a browser-based virtual Operating System in TypeScript

This was Alan's Operating Systems class initial project. See https://www.labouseur.com/courses/os/ for details. 
It was originally developed by Alan and then enhanced by Bob Nisco and Rebecca Murphy over the years. 

Contributions made by me:

- Console/CLI
  - Allow keyboard character input, (scrolling and line-wrap)
  - Defined console commands
    - run/stop process commands
    - Program scheduling commands such as round robin, priority, first come first serve, etc.
    - CRUD File System commands along with Defrag and chkdsk commands.
    - Other fun commands too!
- Simulated memory using a memory manager and memeory accessor, process control blocks, 
- Implemeneted 6502a machine language op codes to run on the simulated CPU
- Developed a CPU scheduler and tracked schedule turnaround time, wait time, and execution time
- Implemented context switching
- Developed a Disk System Device Driver to allow for File System siumulation

## Getting Started

Instructions to run the project on your local machine.

### Prerequisites

First you'll need to setup typescript

1. Install the [npm](https://www.npmjs.org/) package manager if you don't already have it.
2. Run `npm install -g typescript` to get the TypeScript Compiler. (You may need to do this as root.)

#### IDE SUPPORT

IDE's like Visual Studio Code, IntelliJ and probably others already support TypeScript-to-JavaScript compilation.
Make sure you have the necessary plugins installed for your IDE.

#### NO IDE SUPPORT

You'll need to automate the compilation process with something like Gulp.

- Setup Gulp
1. `npm install -g gulp` to get the Gulp Task Runner.
1. `npm install -g gulp-tsc` to get the Gulp TypeScript plugin.

Run `gulp` at the command line in the root directory of this project.
Edit your TypeScript files in the source/scripts directory.

### Installing

1. Clone the remote branch to your local machine.
2. Open a cmd and navigate the the /docs folder of the local project
3. Run the command `tsc` to compile typescript to javascript
4. Open the index.html file in a browser of your choice (preferably, Chrome or Firefox)

## Running the tests

All tests are located in the /docs/test and are implemented as javascript scripts. These tests are called GlaDos, do not break them! These scripts will use 
a combination of the DOM and the KernelInputQueue to automate typing keyboard characters into the OS.

### How to run a test

To enable GlaDos for tests:

1. Navigate to the index.html
2. In index.html there will be: `<!-- <script type = "text/javascript" src = "test\glados-ip4.js"> <script> --!>` around line 52. This is GlaDos, our test file.
3. Uncomment the line. There is no need to compile issue `tsc` in the terminal, since you modified an html file.
5. GlaDos, our test scripts, should now run.

You can easily change which script is run by modifying the 'src' of `<script type = "text/javascript" src = "test\glados-ip4.js"> <script>`.
it is recommended keeping all of you test files in the /docs/test and maintain the GlaDos naming conventions.

All tests are located in the /docs/test and are implemented as javascript scripts.

### Creating your own test

```
/// Greet the user
///
/// This init() function is called immediately on start up as this test is called in index.html
/// and describes what this test actually, well, tests.
this.init() = function () {
alert('[Insert your message here. Try to make this message describe what the test is doing]')
}// function


/// Tests are performed here
this.afterStartup = function() {

/// Input text into the console
///
/// Here, I authomatically type the word "apple" into the console.
///
/// Note: Letters must be inputted one character at a time!
/// Multiple characters are used to represent special user keyboard input and may cause unforseeable issues.
_KernelInputQueue.enqueue('a');
_KernelInputQueue.enqueue('p');
_KernelInputQueue.enqueue('p');
_KernelInputQueue.enqueue('l');
_KernelInputQueue.enqueue('e');

/// Note even spaces must be loaded as such 
_KernelInputQueue.enqueue(' ');

/// To simulate the 'enter' key use
TSOS.Kernel.prototype.krninterruptHandler(Keyboard_IRQ, [13, false]);

/// Load a program 
///
/// To enter data into the program text box 
/// Use simple DOM manipulation and set the text equal to whatever string input you want
document.getElementById("taProgramInput).value = "[String value here]"
}

```

### Sample test

```
/// Sample test
/// 
/// Loads a simple program and runs it.
this.init() = function () {
alert('This test loads a simple program and runs it');
}// function


/// Tests are performed here
this.afterStartup = function() {

/// Load a program 
document.getElementById("taProgramInput).value = "A9 00";

/// Input 'load' command to console
_KernelInputQueue.enqueue('l');
_KernelInputQueue.enqueue('o');
_KernelInputQueue.enqueue('a');
_KernelInputQueue.enqueue('d');

/// "Press" 'enter' to run load command
TSOS.Kernel.prototype.krninterruptHandler(Keyboard_IRQ, [13, false]);
}
```

## Built With

- IDE: Visual Code Studio.
- Languages: Typescript, javascript, html, css.
- Package manager: node.

## Authors
- Alan Labouseur -Initial Work-
  - see https://www.labouseur.com/courses/os/ for details.
- Bob Nisco -enhancments-
- Rebecca Murphy -enhancments-
- Alex Badia -implemented new features-

## Oh and yeah, Grading **rolls eyes**
(isn't just building this enough?)

Grade branch iProject 1 for iProject 1, branch iProject2 for iProject2, iProject3 for iProject3, iLabs for Labs etc.

Master:
- [Origin Master (Up to Date as of December 17, 2020)](https://github.com/alexbadia1/myAlanClasses/tree/master)

Branches: 
- [iProject1](https://github.com/alexbadia1/myAlanClasses/tree/iProject1)
- [iProject2](https://github.com/alexbadia1/myAlanClasses/tree/iProject2)
- [iProject3](https://github.com/alexbadia1/myAlanClasses/tree/iPorject3)
- [iProject4](https://github.com/alexbadia1/myAlanClasses/tree/iProject4)

Labs:
- [iLabs](https://github.com/alexbadia1/myAlanClasses/tree/iLabs)
