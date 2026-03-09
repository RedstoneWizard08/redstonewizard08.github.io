# BrainF\*\*k Compiler

More than anything, this is an experiment in code golf. My friend [@rhysdh540](https://rdh540.dev/) and I are sort of "competing" to
make the fastest BrainF\*\*k compiler and interpreter.

Mine uses [Cranelift](https://docs.rs/cranelift) to compile directly to machine code, and supports AOT and JIT compilation. There's
also a lot of optimizations I'm doing on the BrainF**k code before compilation in order to make it faster.

The code can be found here: https://git.thebrokenscript.net/RedstoneWizard08/BrainFuck

## Benchmarks

On my terrible laptop, I've run a few benchmarks:

<details>
<summary>Hardware</summary>

- **CPU:** Intel Core i7-1165G7 @ 4.7 GHz
- **RAM:** 16 GB LPDDR4 @ 4267 MT/s
- **Kernel:** Linux 6.18.2-2-cachyos

</details>

```ansi
// tests/fixtures/basic/Hello.b
[1mBenchmark [0m[1m1[0m: ./a.out
  Time ([1;32mmean[0m ± [32mσ[0m):     [1;32m367.8 µs[0m ± [32m325.6 µs[0m    [User: [34m238.3 µs[0m, System: [34m441.9 µs[0m]
  Range ([36mmin[0m … [35mmax[0m):   [36m  0.0 µs[0m … [35m1946.9 µs[0m    [2m1018 runs[0m
```

```ansi
// tests/fixtures/basic/Mandelbrot.b
[1mBenchmark [0m[1m1[0m: ./a.out
  Time ([1;32mmean[0m ± [32mσ[0m):     [1;32m936.8 ms[0m ± [32m 28.0 ms[0m    [User: [34m928.4 ms[0m, System: [34m1.2 ms[0m]
  Range ([36mmin[0m … [35mmax[0m):   [36m893.8 ms[0m … [35m979.0 ms[0m    [2m10 runs[0m
```
