---
title: BrainF**k Shenanigans
author: RedstoneWizard08
date: 2026-03-09
---

## BrainF\*\*k Shenanigans

So, a while ago, me and my friend, [@rdh](https://rdh540.dev/), unofficially
started competing to make the fastest BrainF\*\*k compiler/interpreter. His
language of choice for doing this is Kotlin, and mine is Rust. This post details
how I've been doing this, what I learned, and why this is so incredibly hard.

### Intro to BrainF\*\*k

So, you might be asking, "what the hell even is BrainF\*\*k?"

BrainF\*\*k is an esoteric programming language - it's not intended to make
sense. It's intended to, well, f\*\*k with your brain. It's confusing and weird,
and that's the point.

Essentially, you get a big (near-infinite in theory) tape of zeros (bytes), and
you can manipulate the position of the cursor, and whatever the data is at that
position.

The language consists of 8 valid characters, and anything else is a comment and
therefore ignored:

1. `>`: Move the cursor right by one cell.
2. `<`: Move the cursor left by one cell.
3. `+`: Increment the current cell's value by one.
4. `-`: Decrement the current cell's value by one.
5. `.`: Print the value of the current cell as a character.
6. `,`: Read a character from the user and place it in the current cell.
7. `[`: Begin a loop, repeatedly execute the contents until the cell it ends up
   on is zero.
8. `]`: End a loop.

Pretty simple, right? The only thing I should clarify is loops - the content of
a `[...]` block is whatever gets repeatedly executed, and whatever the current
cell is after that executes is checked for a non-zero value to repeat. It's
weird, it's not checking a single constant cell.

#### A Toy Interpreter

A very simple BrainF\*\*k interpreter implemented in pseudo-python could look
like this:

```py
class Tape:
    def __init__(self, cells: int):
        self.buf = bytes(cells)
        self.pos = 0

    def move(self, amount: int):
        self.pos += amount

    def add(self, amount: int):
        self.buf[self.pos] = wrapping_add(self.buf[self.pos], amount)

    def get(self):
        return self.buf[self.pos]

    def set(self, value: int):
        self.buf[self.pos] = value

tape = Tape(cells = 65536) # It's common to have 65536 cells in many BrainF**k interpreters.

def bf_eval(code: str):
    it = iter(code)

    for char in it:
        if char == '>':
            tape.move(1)
        elif char == '<':
            tape.move(-1)
        elif char == '+':
            tape.add(1)
        elif char == '-':
            tape.add(-1)
        elif char == '.':
            print(byte_to_ascii_char(tape.get()))
        elif char == ',':
            tape.set(ascii_char_to_byte(input()))
        elif char == '[':
            buf = it.consume_until(']')

            while tape.get() != 0:
                bf_eval(buf)

bf_eval(read_input_code())
```

It's pretty simple, only 42 lines of code (though there are a couple of
functions used that don't actually exist).

### Why is this so hard?

So, yeah, why _is_ this so hard? Let's start with the beginning.

#### Code Generation

I am using Rust and [Cranelift](https://docs.rs/cranelift) to do this. What this
allows me to do is not build an interpreter, but a compiler, which will take the
BrainF\*\*k code and turn it into machine code.

The parser was really easy to make, literally just this:

```rs
// A simple action enum to make it easier to work with in code.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize)]
pub enum Action {
    Right,
    Left,
    Inc,
    Dec,
    Output,
    Input,
    Loop(Vec<Action>),
}

// Parse the code into a list of Actions.
pub fn parse(input: &str) -> Vec<Action> {
    // Why use a stack? It makes working with loops easier.
    let mut stack: Vec<Vec<Action>> = Vec::new();

    // Put the first buffer in the stack, this is where the main code is.
    stack.push(Vec::new());

    for ch in input.chars() {
        // Get the last buffer, this is where we put new actions.
        let cur = stack.last_mut().unwrap();

        match ch {
            // All the basic operations.
            '>' => cur.push(Action::Right),
            '<' => cur.push(Action::Left),
            '+' => cur.push(Action::Inc),
            '-' => cur.push(Action::Dec),
            '.' => cur.push(Action::Output),
            ',' => cur.push(Action::Input),

            // This is a loop, so we add a new buffer to the stack.
            '[' => stack.push(Vec::new()),

            // Loop has ended, pop the last buffer and add it as an action to loop.
            ']' => {
                let last = stack.pop().unwrap();
                let cur = stack.last_mut().unwrap();

                cur.push(Action::Loop(last));
            }

            // As per the BrainF**k language description, anything else is a comment.
            _ => (),
        }
    }

    // Quick sanity/syntax check
    if stack.len() != 1 {
        panic!("Stack length was {} when it should be 1!", stack.len());
    }

    // Pop the initial buffer and return it
    stack.remove(0)
}
```

But compiling... that's a bit more complicated. I started by making a JIT
compiler, something that will take the parsed code and compile it at runtime,
then execute it. Cranelift actually makes this pretty simple, there's only a few
moving parts:

1. Flags - just some basic options for Cranelift's post-processing steps
2. The ISA - targeting stuff, tells Cranelift what we're compiling for
3. The module - holds the code, establishes scope, where instructions are placed
4. The function builder - this is where the code goes

If you've ever experimented with JVM bytecode, the process of turning our
`Action`s into Cranelift instructions is actually pretty straightforward. You
just have to think about the stack (somewhat).

To start, the tape has to be created:

```rs
// Get the pointer type and the byte data type.
let ptr = module.target_config().pointer_type();
let byte = types::I8;

// Create a new slot on the stack for the tape.
let tape_data = StackSlotData::new(StackSlotKind::ExplicitSlot, TAPE_SIZE as u32, 0);
let tape = fb.create_sized_stack_slot(tape_data);

// Push an instruction to fetch the address of the stack slot we've just created.
let tape_addr = fb.ins().stack_addr(types::I64, tape, 0);

// Push instructions to create constants for zero and the size of the tape.
let zero = fb.ins().iconst(byte, 0);
let size = fb.ins().iconst(types::I64, TAPE_SIZE as i64);

// Call memset on the tape so we can zero it out.
fb.call_memset(module.target_config(), tape_addr, zero, size);

// Declare a variable for the tape pointer.
let tape_ptr = fb.declare_var(ptr);

// Set the tape pointer variable's value to the address of the tape.
fb.def_var(tape_ptr, tape_addr);
```

From there, doing value operations is pretty straightforward, like this for
adding to a slot:

```rs
// Get the current address of the tape from the tape pointer variable
let base_addr = self.b.use_var(self.tape_ptr);

// Load the current value from the tape
let value = self.b.ins().load(self.byte, MemFlags::new(), base_addr, 0);

// Add to the value
let value = self.b.ins().iadd_imm(value, amount);

// Store the new value in the tape
self.b.ins().store(MemFlags::new(), value, base_addr, 0);
```

> [!note] Safety This is wildly unsafe! My implementation performs no bounds
> checking on the tape pointer to achieve high performance, and the stuff I do
> at compile-time helps prevent any issues that may arise from this.

Other things can be done in a similar manner, like setting the value of a cell.

Moving the cursor is also pretty easy:

```rs
// Get the current value of the tape pointer
let base_addr = self.b.use_var(self.tape_ptr);

// Add the needed offset to the value
let new_addr = self.b.ins().iadd_imm(base_addr, amount);

// Set the value of the tape pointer
self.b.def_var(self.tape_ptr, new_addr);
```

And while this is quite unsafe, it does work. But there's a problem.

### Performance

This stuff is really fast. Like, _really_ fast. But the issue is: it's still
very slow. My test case for benchmarking has been Erik Bosman's Mandelbrot
implementation in BrainF\*\*k.

<details>
<summary>Expand</summary>

```bf
      A mandelbrot set fractal viewer in brainf*** written by Erik Bosman
+++++++++++++[->++>>>+++++>++>+<<<<<<]>>>>>++++++>--->>>>>>>>>>+++++++++++++++[[
>>>>>>>>>]+[<<<<<<<<<]>>>>>>>>>-]+[>>>>>>>>[-]>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>[-]+
<<<<<<<+++++[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>>>>+>>>>>>>>>>>>>>>>>>>>>>>>>>
>+<<<<<<<<<<<<<<<<<[<<<<<<<<<]>>>[-]+[>>>>>>[>>>>>>>[-]>>]<<<<<<<<<[<<<<<<<<<]>>
>>>>>[-]+<<<<<<++++[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>>>+<<<<<<+++++++[-[->>>
>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>>>+<<<<<<<<<<<<<<<<[<<<<<<<<<]>>>[[-]>>>>>>[>>>>>
>>[-<<<<<<+>>>>>>]<<<<<<[->>>>>>+<<+<<<+<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>
[>>>>>>>>[-<<<<<<<+>>>>>>>]<<<<<<<[->>>>>>>+<<+<<<+<<]>>>>>>>>]<<<<<<<<<[<<<<<<<
<<]>>>>>>>[-<<<<<<<+>>>>>>>]<<<<<<<[->>>>>>>+<<+<<<<<]>>>>>>>>>+++++++++++++++[[
>>>>>>>>>]+>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+[
>+>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>[-<<<<+>>>>]<<<<[->>>>+<<<<<[->>[
-<<+>>]<<[->>+>>+<<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>>>>>>>>]<<<<<<<
<<[>[->>>>>>>>>+<<<<<<<<<]<<<<<<<<<<]>[->>>>>>>>>+<<<<<<<<<]<+>>>>>>>>]<<<<<<<<<
[>[-]<->>>>[-<<<<+>[<->-<<<<<<+>>>>>>]<[->+<]>>>>]<<<[->>>+<<<]<+<<<<<<<<<]>>>>>
>>>>[>+>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>>[-<<<<<+>>>>>]<<<<<[->>>>>+
<<<<<<[->>>[-<<<+>>>]<<<[->>>+>+<<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>
>>>>>>>]<<<<<<<<<[>>[->>>>>>>>>+<<<<<<<<<]<<<<<<<<<<<]>>[->>>>>>>>>+<<<<<<<<<]<<
+>>>>>>>>]<<<<<<<<<[>[-]<->>>>[-<<<<+>[<->-<<<<<<+>>>>>>]<[->+<]>>>>]<<<[->>>+<<
<]<+<<<<<<<<<]>>>>>>>>>[>>>>[-<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>]>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>+++++++++++++++[[>>>>
>>>>>]<<<<<<<<<-<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+>>>>>>>>>>>>>>>>>>>>>+<<<[<<<<<<
<<<]>>>>>>>>>[>>>[-<<<->>>]+<<<[->>>->[-<<<<+>>>>]<<<<[->>>>+<<<<<<<<<<<<<[<<<<<
<<<<]>>>>[-]+>>>>>[>>>>>>>>>]>+<]]+>>>>[-<<<<->>>>]+<<<<[->>>>-<[-<<<+>>>]<<<[->
>>+<<<<<<<<<<<<[<<<<<<<<<]>>>[-]+>>>>>>[>>>>>>>>>]>[-]+<]]+>[-<[>>>>>>>>>]<<<<<<
<<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]<<<<<<<[->+>>>-<<<<]>>>>>>>>>+++++++++++++++++++
+++++++>>[-<<<<+>>>>]<<<<[->>>>+<<[-]<<]>>[<<<<<<<+<[-<+>>>>+<<[-]]>[-<<[->+>>>-
<<<<]>>>]>>>>>>>>>>>>>[>>[-]>[-]>[-]>>>>>]<<<<<<<<<[<<<<<<<<<]>>>[-]>>>>>>[>>>>>
[-<<<<+>>>>]<<<<[->>>>+<<<+<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>>[-<<<<<<<<
<+>>>>>>>>>]>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>+++++++++++++++[[>>>>>>>>>]+>[-
]>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+[>+>>>>>>>>]<<<
<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>>[-<<<<<+>>>>>]<<<<<[->>>>>+<<<<<<[->>[-<<+>>]<
<[->>+>+<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>>>>>>>>]<<<<<<<<<[>[->>>>
>>>>>+<<<<<<<<<]<<<<<<<<<<]>[->>>>>>>>>+<<<<<<<<<]<+>>>>>>>>]<<<<<<<<<[>[-]<->>>
[-<<<+>[<->-<<<<<<<+>>>>>>>]<[->+<]>>>]<<[->>+<<]<+<<<<<<<<<]>>>>>>>>>[>>>>>>[-<
<<<<+>>>>>]<<<<<[->>>>>+<<<<+<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>+>>>>>>>>
]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>>[-<<<<<+>>>>>]<<<<<[->>>>>+<<<<<<[->>[-<<+
>>]<<[->>+>>+<<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>>>>>>>>]<<<<<<<<<[>
[->>>>>>>>>+<<<<<<<<<]<<<<<<<<<<]>[->>>>>>>>>+<<<<<<<<<]<+>>>>>>>>]<<<<<<<<<[>[-
]<->>>>[-<<<<+>[<->-<<<<<<+>>>>>>]<[->+<]>>>>]<<<[->>>+<<<]<+<<<<<<<<<]>>>>>>>>>
[>>>>[-<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
]>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>>>[-<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<+>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>]>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>++++++++
+++++++[[>>>>>>>>>]<<<<<<<<<-<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+[>>>>>>>>[-<<<<<<<+
>>>>>>>]<<<<<<<[->>>>>>>+<<<<<<+<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>>>>>>[
-]>>>]<<<<<<<<<[<<<<<<<<<]>>>>+>[-<-<<<<+>>>>>]>[-<<<<<<[->>>>>+<++<<<<]>>>>>[-<
<<<<+>>>>>]<->+>]<[->+<]<<<<<[->>>>>+<<<<<]>>>>>>[-]<<<<<<+>>>>[-<<<<->>>>]+<<<<
[->>>>->>>>>[>>[-<<->>]+<<[->>->[-<<<+>>>]<<<[->>>+<<<<<<<<<<<<[<<<<<<<<<]>>>[-]
+>>>>>>[>>>>>>>>>]>+<]]+>>>[-<<<->>>]+<<<[->>>-<[-<<+>>]<<[->>+<<<<<<<<<<<[<<<<<
<<<<]>>>>[-]+>>>>>[>>>>>>>>>]>[-]+<]]+>[-<[>>>>>>>>>]<<<<<<<<]>>>>>>>>]<<<<<<<<<
[<<<<<<<<<]>>>>[-<<<<+>>>>]<<<<[->>>>+>>>>>[>+>>[-<<->>]<<[->>+<<]>>>>>>>>]<<<<<
<<<+<[>[->>>>>+<<<<[->>>>-<<<<<<<<<<<<<<+>>>>>>>>>>>[->>>+<<<]<]>[->>>-<<<<<<<<<
<<<<<+>>>>>>>>>>>]<<]>[->>>>+<<<[->>>-<<<<<<<<<<<<<<+>>>>>>>>>>>]<]>[->>>+<<<]<<
<<<<<<<<<<]>>>>[-]<<<<]>>>[-<<<+>>>]<<<[->>>+>>>>>>[>+>[-<->]<[->+<]>>>>>>>>]<<<
<<<<<+<[>[->>>>>+<<<[->>>-<<<<<<<<<<<<<<+>>>>>>>>>>[->>>>+<<<<]>]<[->>>>-<<<<<<<
<<<<<<<+>>>>>>>>>>]<]>>[->>>+<<<<[->>>>-<<<<<<<<<<<<<<+>>>>>>>>>>]>]<[->>>>+<<<<
]<<<<<<<<<<<]>>>>>>+<<<<<<]]>>>>[-<<<<+>>>>]<<<<[->>>>+>>>>>[>>>>>>>>>]<<<<<<<<<
[>[->>>>>+<<<<[->>>>-<<<<<<<<<<<<<<+>>>>>>>>>>>[->>>+<<<]<]>[->>>-<<<<<<<<<<<<<<
+>>>>>>>>>>>]<<]>[->>>>+<<<[->>>-<<<<<<<<<<<<<<+>>>>>>>>>>>]<]>[->>>+<<<]<<<<<<<
<<<<<]]>[-]>>[-]>[-]>>>>>[>>[-]>[-]>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>>>>>[-<
<<<+>>>>]<<<<[->>>>+<<<+<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>+++++++++++++++[
[>>>>>>>>>]+>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+
[>+>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>[-<<<<+>>>>]<<<<[->>>>+<<<<<[->>
[-<<+>>]<<[->>+>+<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>>>>>>>>]<<<<<<<<
<[>[->>>>>>>>>+<<<<<<<<<]<<<<<<<<<<]>[->>>>>>>>>+<<<<<<<<<]<+>>>>>>>>]<<<<<<<<<[
>[-]<->>>[-<<<+>[<->-<<<<<<<+>>>>>>>]<[->+<]>>>]<<[->>+<<]<+<<<<<<<<<]>>>>>>>>>[
>>>[-<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>]>
>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>[-]>>>>+++++++++++++++[[>>>>>>>>>]<<<<<<<<<-<<<<<
<<<<[<<<<<<<<<]>>>>>>>>>-]+[>>>[-<<<->>>]+<<<[->>>->[-<<<<+>>>>]<<<<[->>>>+<<<<<
<<<<<<<<[<<<<<<<<<]>>>>[-]+>>>>>[>>>>>>>>>]>+<]]+>>>>[-<<<<->>>>]+<<<<[->>>>-<[-
<<<+>>>]<<<[->>>+<<<<<<<<<<<<[<<<<<<<<<]>>>[-]+>>>>>>[>>>>>>>>>]>[-]+<]]+>[-<[>>
>>>>>>>]<<<<<<<<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>[-<<<+>>>]<<<[->>>+>>>>>>[>+>>>
[-<<<->>>]<<<[->>>+<<<]>>>>>>>>]<<<<<<<<+<[>[->+>[-<-<<<<<<<<<<+>>>>>>>>>>>>[-<<
+>>]<]>[-<<-<<<<<<<<<<+>>>>>>>>>>>>]<<<]>>[-<+>>[-<<-<<<<<<<<<<+>>>>>>>>>>>>]<]>
[-<<+>>]<<<<<<<<<<<<<]]>>>>[-<<<<+>>>>]<<<<[->>>>+>>>>>[>+>>[-<<->>]<<[->>+<<]>>
>>>>>>]<<<<<<<<+<[>[->+>>[-<<-<<<<<<<<<<+>>>>>>>>>>>[-<+>]>]<[-<-<<<<<<<<<<+>>>>
>>>>>>>]<<]>>>[-<<+>[-<-<<<<<<<<<<+>>>>>>>>>>>]>]<[-<+>]<<<<<<<<<<<<]>>>>>+<<<<<
]>>>>>>>>>[>>>[-]>[-]>[-]>>>>]<<<<<<<<<[<<<<<<<<<]>>>[-]>[-]>>>>>[>>>>>>>[-<<<<<
<+>>>>>>]<<<<<<[->>>>>>+<<<<+<<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>+>[-<-<<<<+>>>>
>]>>[-<<<<<<<[->>>>>+<++<<<<]>>>>>[-<<<<<+>>>>>]<->+>>]<<[->>+<<]<<<<<[->>>>>+<<
<<<]+>>>>[-<<<<->>>>]+<<<<[->>>>->>>>>[>>>[-<<<->>>]+<<<[->>>-<[-<<+>>]<<[->>+<<
<<<<<<<<<[<<<<<<<<<]>>>>[-]+>>>>>[>>>>>>>>>]>+<]]+>>[-<<->>]+<<[->>->[-<<<+>>>]<
<<[->>>+<<<<<<<<<<<<[<<<<<<<<<]>>>[-]+>>>>>>[>>>>>>>>>]>[-]+<]]+>[-<[>>>>>>>>>]<
<<<<<<<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>[-<<<+>>>]<<<[->>>+>>>>>>[>+>[-<->]<[->+
<]>>>>>>>>]<<<<<<<<+<[>[->>>>+<<[->>-<<<<<<<<<<<<<+>>>>>>>>>>[->>>+<<<]>]<[->>>-
<<<<<<<<<<<<<+>>>>>>>>>>]<]>>[->>+<<<[->>>-<<<<<<<<<<<<<+>>>>>>>>>>]>]<[->>>+<<<
]<<<<<<<<<<<]>>>>>[-]>>[-<<<<<<<+>>>>>>>]<<<<<<<[->>>>>>>+<<+<<<<<]]>>>>[-<<<<+>
>>>]<<<<[->>>>+>>>>>[>+>>[-<<->>]<<[->>+<<]>>>>>>>>]<<<<<<<<+<[>[->>>>+<<<[->>>-
<<<<<<<<<<<<<+>>>>>>>>>>>[->>+<<]<]>[->>-<<<<<<<<<<<<<+>>>>>>>>>>>]<<]>[->>>+<<[
->>-<<<<<<<<<<<<<+>>>>>>>>>>>]<]>[->>+<<]<<<<<<<<<<<<]]>>>>[-]<<<<]>>>>[-<<<<+>>
>>]<<<<[->>>>+>[-]>>[-<<<<<<<+>>>>>>>]<<<<<<<[->>>>>>>+<<+<<<<<]>>>>>>>>>[>>>>>>
>>>]<<<<<<<<<[>[->>>>+<<<[->>>-<<<<<<<<<<<<<+>>>>>>>>>>>[->>+<<]<]>[->>-<<<<<<<<
<<<<<+>>>>>>>>>>>]<<]>[->>>+<<[->>-<<<<<<<<<<<<<+>>>>>>>>>>>]<]>[->>+<<]<<<<<<<<
<<<<]]>>>>>>>>>[>>[-]>[-]>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>[-]>[-]>>>>>[>>>>>[-<<<<+
>>>>]<<<<[->>>>+<<<+<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>>>>>>[-<<<<<+>>>>>
]<<<<<[->>>>>+<<<+<<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>+++++++++++++++[[>>>>
>>>>>]+>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]>[-]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+[>+>>
>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>[-<<<<+>>>>]<<<<[->>>>+<<<<<[->>[-<<+
>>]<<[->>+>>+<<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>>>>>>>>]<<<<<<<<<[>
[->>>>>>>>>+<<<<<<<<<]<<<<<<<<<<]>[->>>>>>>>>+<<<<<<<<<]<+>>>>>>>>]<<<<<<<<<[>[-
]<->>>>[-<<<<+>[<->-<<<<<<+>>>>>>]<[->+<]>>>>]<<<[->>>+<<<]<+<<<<<<<<<]>>>>>>>>>
[>+>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>->>>>>[-<<<<<+>>>>>]<<<<<[->>>>>+<<<<
<<[->>>[-<<<+>>>]<<<[->>>+>+<<<<]+>>>>>>>>>]<<<<<<<<[<<<<<<<<<]]>>>>>>>>>[>>>>>>
>>>]<<<<<<<<<[>>[->>>>>>>>>+<<<<<<<<<]<<<<<<<<<<<]>>[->>>>>>>>>+<<<<<<<<<]<<+>>>
>>>>>]<<<<<<<<<[>[-]<->>>>[-<<<<+>[<->-<<<<<<+>>>>>>]<[->+<]>>>>]<<<[->>>+<<<]<+
<<<<<<<<<]>>>>>>>>>[>>>>[-<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>]>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>+++++++++++++++[[>>>>>>>>
>]<<<<<<<<<-<<<<<<<<<[<<<<<<<<<]>>>>>>>>>-]+>>>>>>>>>>>>>>>>>>>>>+<<<[<<<<<<<<<]
>>>>>>>>>[>>>[-<<<->>>]+<<<[->>>->[-<<<<+>>>>]<<<<[->>>>+<<<<<<<<<<<<<[<<<<<<<<<
]>>>>[-]+>>>>>[>>>>>>>>>]>+<]]+>>>>[-<<<<->>>>]+<<<<[->>>>-<[-<<<+>>>]<<<[->>>+<
<<<<<<<<<<<[<<<<<<<<<]>>>[-]+>>>>>>[>>>>>>>>>]>[-]+<]]+>[-<[>>>>>>>>>]<<<<<<<<]>
>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>->>[-<<<<+>>>>]<<<<[->>>>+<<[-]<<]>>]<<+>>>>[-<<<<
->>>>]+<<<<[->>>>-<<<<<<.>>]>>>>[-<<<<<<<.>>>>>>>]<<<[-]>[-]>[-]>[-]>[-]>[-]>>>[
>[-]>[-]>[-]>[-]>[-]>[-]>>>]<<<<<<<<<[<<<<<<<<<]>>>>>>>>>[>>>>>[-]>>>>]<<<<<<<<<
[<<<<<<<<<]>+++++++++++[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>+>>>>>>>>>+<<<<<<<<
<<<<<<[<<<<<<<<<]>>>>>>>[-<<<<<<<+>>>>>>>]<<<<<<<[->>>>>>>+[-]>>[>>>>>>>>>]<<<<<
<<<<[>>>>>>>[-<<<<<<+>>>>>>]<<<<<<[->>>>>>+<<<<<<<[<<<<<<<<<]>>>>>>>[-]+>>>]<<<<
<<<<<<]]>>>>>>>[-<<<<<<<+>>>>>>>]<<<<<<<[->>>>>>>+>>[>+>>>>[-<<<<->>>>]<<<<[->>>
>+<<<<]>>>>>>>>]<<+<<<<<<<[>>>>>[->>+<<]<<<<<<<<<<<<<<]>>>>>>>>>[>>>>>>>>>]<<<<<
<<<<[>[-]<->>>>>>>[-<<<<<<<+>[<->-<<<+>>>]<[->+<]>>>>>>>]<<<<<<[->>>>>>+<<<<<<]<
+<<<<<<<<<]>>>>>>>-<<<<[-]+<<<]+>>>>>>>[-<<<<<<<->>>>>>>]+<<<<<<<[->>>>>>>->>[>>
>>>[->>+<<]>>>>]<<<<<<<<<[>[-]<->>>>>>>[-<<<<<<<+>[<->-<<<+>>>]<[->+<]>>>>>>>]<<
<<<<[->>>>>>+<<<<<<]<+<<<<<<<<<]>+++++[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>+<<<
<<[<<<<<<<<<]>>>>>>>>>[>>>>>[-<<<<<->>>>>]+<<<<<[->>>>>->>[-<<<<<<<+>>>>>>>]<<<<
<<<[->>>>>>>+<<<<<<<<<<<<<<<<[<<<<<<<<<]>>>>[-]+>>>>>[>>>>>>>>>]>+<]]+>>>>>>>[-<
<<<<<<->>>>>>>]+<<<<<<<[->>>>>>>-<<[-<<<<<+>>>>>]<<<<<[->>>>>+<<<<<<<<<<<<<<[<<<
<<<<<<]>>>[-]+>>>>>>[>>>>>>>>>]>[-]+<]]+>[-<[>>>>>>>>>]<<<<<<<<]>>>>>>>>]<<<<<<<
<<[<<<<<<<<<]>>>>[-]<<<+++++[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>-<<<<<[<<<<<<<
<<]]>>>]<<<<.>>>>>>>>>>[>>>>>>[-]>>>]<<<<<<<<<[<<<<<<<<<]>++++++++++[-[->>>>>>>>
>+<<<<<<<<<]>>>>>>>>>]>>>>>+>>>>>>>>>+<<<<<<<<<<<<<<<[<<<<<<<<<]>>>>>>>>[-<<<<<<
<<+>>>>>>>>]<<<<<<<<[->>>>>>>>+[-]>[>>>>>>>>>]<<<<<<<<<[>>>>>>>>[-<<<<<<<+>>>>>>
>]<<<<<<<[->>>>>>>+<<<<<<<<[<<<<<<<<<]>>>>>>>>[-]+>>]<<<<<<<<<<]]>>>>>>>>[-<<<<<
<<<+>>>>>>>>]<<<<<<<<[->>>>>>>>+>[>+>>>>>[-<<<<<->>>>>]<<<<<[->>>>>+<<<<<]>>>>>>
>>]<+<<<<<<<<[>>>>>>[->>+<<]<<<<<<<<<<<<<<<]>>>>>>>>>[>>>>>>>>>]<<<<<<<<<[>[-]<-
>>>>>>>>[-<<<<<<<<+>[<->-<<+>>]<[->+<]>>>>>>>>]<<<<<<<[->>>>>>>+<<<<<<<]<+<<<<<<
<<<]>>>>>>>>-<<<<<[-]+<<<]+>>>>>>>>[-<<<<<<<<->>>>>>>>]+<<<<<<<<[->>>>>>>>->[>>>
>>>[->>+<<]>>>]<<<<<<<<<[>[-]<->>>>>>>>[-<<<<<<<<+>[<->-<<+>>]<[->+<]>>>>>>>>]<<
<<<<<[->>>>>>>+<<<<<<<]<+<<<<<<<<<]>+++++[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>>
+>>>>>>>>>>>>>>>>>>>>>>>>>>>+<<<<<<[<<<<<<<<<]>>>>>>>>>[>>>>>>[-<<<<<<->>>>>>]+<
<<<<<[->>>>>>->>[-<<<<<<<<+>>>>>>>>]<<<<<<<<[->>>>>>>>+<<<<<<<<<<<<<<<<<[<<<<<<<
<<]>>>>[-]+>>>>>[>>>>>>>>>]>+<]]+>>>>>>>>[-<<<<<<<<->>>>>>>>]+<<<<<<<<[->>>>>>>>
-<<[-<<<<<<+>>>>>>]<<<<<<[->>>>>>+<<<<<<<<<<<<<<<[<<<<<<<<<]>>>[-]+>>>>>>[>>>>>>
>>>]>[-]+<]]+>[-<[>>>>>>>>>]<<<<<<<<]>>>>>>>>]<<<<<<<<<[<<<<<<<<<]>>>>[-]<<<++++
+[-[->>>>>>>>>+<<<<<<<<<]>>>>>>>>>]>>>>>->>>>>>>>>>>>>>>>>>>>>>>>>>>-<<<<<<[<<<<
<<<<<]]>>>]
```

</details>

As you can see, this is a **_lot_** of code. Like, a LOT of code. And the issue
is - while the instructions may be executed extremely quickly, it's still
executing _ALL_ of the instructions. And this many instructions can become quite
slow.

So, we need to optimize the BrainF\*\*k before it gets sent to Cranelift to
compile.

### Optimization

There are many optimizations you can do on BrainF\*\*k programs, and they all
pretty much just boil down to pattern analysis and rewriting parts of the code.
Here's the ones I implemented.

#### Chaining

Some long chains of operations (`+`, `-`, `>`, `<`) can all be collapsed into a
single instruction.

This code:

```bf
++++++++++
```

Increments the value of the same cell 10 times. After parsing, it'd look like
this:

```ron
[Inc, Inc, Inc, Inc, Inc, Inc, Inc, Inc, Inc, Inc]
```

But... doesn't this seem wasteful? Can't we just represent it like this:

```ron
[Add(10)]
```

Wouldn't that make more sense?

The answer is: Yes!

There are a bunch of optimizations I can make like this, so I made a second
enum:

```rs
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub enum ValueAction {
    Output,
    Input,
    AddValue(i64),
    SetValue(i64),
    BulkPrint(i64),
}

#[derive(Debug, PartialEq, Eq, Serialize)]
pub enum OptAction {
    Noop,
    Value(ValueAction),
    MovePtr(i64),
    Loop(Vec<OptAction>),

    ...
}
```

And with this in place, I implemented chaining rules for the add (`+`), sub
(`-`), print (`.`), and move (`><`) operations, all handled by this code:

```rs
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Serialize)]
pub enum ChainType {
    // Add/subtract from the current cell.
    Add(i64),

    // Move the cell pointer.
    Move(i64),

    // Print the current cell N times.
    Print(i64),
}

impl ChainType {
    // Turn this chain into an action.
    #[inline(always)]
    pub fn action(&self) -> OptAction {
        match self {
            Self::Add(value) => OptAction::Value(ValueAction::AddValue(*value)),
            Self::Move(value) => OptAction::MovePtr(*value),
            Self::Print(value) => OptAction::Value(ValueAction::BulkPrint(*value)),
        }
    }

    // Attempt to merge with another chain.
    // Return false if it cannot be merged (it's not the same type).
    #[inline(always)]
    pub fn merge(&mut self, other: &ChainType) -> bool {
        match self {
            ChainType::Add(me) => {
                if let ChainType::Add(it) = other {
                    *me = *me + *it;
                    true
                } else {
                    false
                }
            }

            ChainType::Move(me) => {
                if let ChainType::Move(it) = other {
                    *me = *me + *it;
                    true
                } else {
                    false
                }
            }

            ChainType::Print(me) => {
                if let ChainType::Print(it) = other {
                    *me = *me + *it;
                    true
                } else {
                    false
                }
            }
        }
    }
}

impl OptAction {
    // Convert this action into a chain.
    #[inline(always)]
    pub fn as_chain(&self) -> Option<ChainType> {
        match self {
            // Adding a value -> Add chain
            Self::Value(ValueAction::AddValue(v)) => Some(ChainType::Add(*v)),

            // Moving the pointer -> Move chain
            Self::MovePtr(v) => Some(ChainType::Move(*v)),

            // Printing a value -> Print chain
            Self::Value(ValueAction::Output) => Some(ChainType::Print(1)),

            // Otherwise, nothing.
            _ => None,
        }
    }
}
```

And then I made a little optimizer for it:

```rs
impl<'a> Optimizer<'a> {
    fn chains(&mut self) {
        // Make a new list of actions
        let mut actions = Vec::new();

        // Swap that new list with the existing ones - this is for ownership reasons.
        // Essentially, the `actions` Vec here will now contain all the actions that
        // were given to the optimizer to... well... optimize. `self.actions` will
        // be a fresh Vec, empty.
        std::mem::swap(&mut actions, &mut self.actions);

        // Establish a current chain rule.
        let mut chain: Option<ChainType> = None;

        // Go through all the actions:
        for action in actions {
            // If the action can be chained:
            if let Some(cur) = action.as_chain() {
                // If there is currently a chain going on:
                if let Some(chain) = &mut chain {
                    // Attempt to merge it, otherwise push the current chain
                    // to the action list, and replace the chain.
                    if !chain.merge(&cur) {
                        self.actions.push(chain.action());
                        *chain = cur;
                    }
                } else {
                    // If there was no chain going on already, start a new chain.
                    chain = Some(cur);
                }
            } else {
                // If the action can't be chained, check for an existing chain, push it,
                // and clear it.
                if let Some(cur) = chain {
                    self.actions.push(cur.action());
                    chain = None;
                }

                // For loops, go through the loop and attempt to optimize inside of it.
                if let OptAction::Loop(it) = action {
                    let mut opt = self.sub(it);

                    opt.chains();

                    self.actions.push(OptAction::Loop(opt.finish()));
                } else {
                    // If it isn't a loop, then just push it directly, since it can't be processed
                    // and can't be chained.
                    self.actions.push(action);
                }
            }
        }

        // Before we finish, make sure to catch any stragglers!
        if let Some(cur) = chain {
            self.actions.push(cur.action());
        }
    }
}
```

The whole point of this is to collapse those chains into single instructions.

The result: without optimization, the mandelbrot script takes close to 1.3
seconds, and with, it takes... about 1.3 seconds? What's going on here?

This optimization didn't do that much. Turns out that accessing values and
moving pointers is already extremely fast. We're going to have to think a little
harder if we want to make this faster.

#### Loops

Okay, well, what about loops? Something like `[+]` or `[-]` will just end up
setting the cell to zero, so why don't we do that?

Well, doing that brings it down to roughly 1.28 seconds. Not much better, but
still an improvement! Where else can we look?

#### Useless Operations

Doing something like `++--+++---[-]` will end up literally just setting the cell
to `0` anyway, so why not just skip all of that extra stuff?

This should ideally also remove any `Add(0)` or `Move(0)` operations.

Doing this produces even better performance - coming in at around 1.233 seconds.
Still, though, this isn't great. What else can we do?

#### Dead Code Elimination

Any loops at the very start of a program will never run - the cells are already
at zero. So, let's skip those.

Again, not much improvement. Still, it got us down to 1.22 seconds.

#### Copy Loops

Probably the largest optimization.

There's a well-established technique in BrainF\*\*k programs where people will
copy values to other cells. For example:

```bf
+++ // Set the current cell to 3

[ // loop 3 times
    > // move 1 cell right
    ++ // add 2
    < // move back
]
```

This code will essentially copy the value 3 into the cell just to the right of
it, twice. Resulting in the program adding 6 to whatever was already there.

If we can detect this, and replace it with an instruction that does this
directly instead of going through the whole loop, we can make this MUCH faster.

And indeed it did! It dropped the time down to 918 ms! That's a 33% improvement!

#### Set & Move

It's very common to set a value and then move the pointer, so if we can combine
this into a single instruction, it can help reduce the number of times we have
to read the pointer variable.

Doing this brings the time down to 907 ms.

#### Useless End

Once a program has no more print statements, we can safely ignore the rest of
the program. For example:

```bf
+++++++[->++<]..+-+-+-+-
```

This is a really stupid example, but that `+-+-+-+-` at the end can be safely
ignored, since it won't affect the final output.

Doing this in our mandelbrot test actually makes no difference, since everything
is used, but it's good to have this anyway.

#### Simplification

Just simplifies things like `Add(1)` into a single `Inc` instruction.

This makes no difference in our application, as our other optimizations take
care of this already, but it could in others.

#### SIMD

This stands for Single Instruction Multiple Data. The idea here is that for some
things, like adding to multiple cells in a row, this can be done in one
instruction instead of many.

This seems like a great idea, but this actually made things slower. I'm not
super sure why, but my guess is that vector operations are quite a bit slower
than reading a couple of registers.

## Final Thoughts

This has been quite the journey! And it's been really fun to try to figure out.
If you want to see the code, you can find it here:
https://git.thebrokenscript.net/RedstoneWizard08/BrainFuck

Thanks, and see you in the next one!
