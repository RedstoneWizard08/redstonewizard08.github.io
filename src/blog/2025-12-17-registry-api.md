---
title: Writing a Kotlin-first Registry API for Minecraft
author: RedstoneWizard08
date: 2025-12-17
---

## Writing a Kotlin-first Registry API for Minecraft

Hi there! This is my first real blog post, so let's hope it's ok! :P

Okay.

So, I make Minecraft mods. This is a well-known fact. And one of the issues I run into a lot is that registering things (making it so the game actually knows that my stuff exists) and generating data files (models, block states, etc...) is very annoying to do. In vanilla Minecraft, without any libraries, it takes quite a lot to do all of this.

And then, a SAVIOR emerged from the darkness! [Registrate](https://github.com/tterrag1098/Registrate)! A library promising to make registering things WITH their datagen much easier! With just a few lines of code, you could register a block, its items, and generate models and blockstates! It was amazing! But, it did have several issues.

Namely, Registrate was only built for Forge. Using it on something like Fabric was a no-go[^1]. This was a BIG limiting factor for using it in larger projects intended to support multiple mod loaders. Also, it was quite verbose, and didn't have much of a DSL-like even for Java.

All of these factors combined with the fact that I wanted to simplify the way we registered things in The Broken Script caused me to make my own, powerful, kotlin-first, DSL-driven API for registering anything. So here we go.

### How... do you even do this?

Well, that's a great question! How *do* you make an entire registration API from scratch that works on multiple modloaders and requires minimal action from the user to do anything they want with a nice DSL? (Take a deep breath, you've earned it.)

The short answer is: you don't.

But to explain that, let me explain a little bit about Kotlin.

### Very Specific Kotlin Features Crash Course

So Kotlin has a LOT of very nice features. One of which is the ability to specify callbacks without using parameters traditionally, and having callbacks with only one argument be automatically defined. Let's look at this way:

Callbacks (technically called lambdas, but whatever) in Kotlin are represented by curly braces. For example:

```kt
// the argument `func` here is a lambda that takes an int and returns an int
fun callWithSomeInt(func: (Int) -> Int): Int { .. }

val myData = callWithSomeInt({ it ->
//                          ^^ Right here, the lambda is defined, taking one argument (`it`, which is inferred to be an int.)
    it + 1
    // ^^ This just adds 1 to `it` and returns that value.
    // No `return` statement is needed.
})
```

Now, this, on its own, is extremely nice. We have a very clean way of defining callbacks. But! It can get cleaner.

First, let's remove the explicit `it` parameter. Since this callback takes only one argument, Kotlin will automatically define an argument named `it` if it is omitted. So that's one step for cleanliness.

```kt
val myData = callWithSomeInt({ it -> // [!code --]
val myData = callWithSomeInt({ // [!code ++]
    it + 1
})
```

Second, since the last argument that `callWithSomeInt` takes is a callback, it doesn't actually need the parenthesis. We can call it like this:

```kt
val myData = callWithSomeInt({ // [!code --]
val myData = callWithSomeInt { // [!code ++]
    it + 1
}) // [!code --]
} // [!code ++]
```

Then, making the expresion stay on one line, we can have it look like this:

```kt
val myData = callWithSomeInt { it + 1 }
```

Much cleaner, right? But what about clearer?

The code being clear is a disadvantage of this. It's not immediately obvious to the reader where the `it` parameter comes from, and the whole syntax looks ambiguous with defining a class. These are very real critiques. But for the scope of this post, that's not something I'm going to worry about here.

For this post, let's just accept this as the norm.

### Kotlin Features Part 2

There's one more feature I want to touch on. Callbacks with receivers.

This is gonna look weird, so bear with me.

Let's look at our original function:

```kt
fun callWithSomeInt(func: (Int) -> Int): Int { .. }
```

This function takes a callback that recieves an int and returns an int. But, what if we have some larger context class? Let's take this example:

```kt
fun demoForBlog(func: (SomeContext) -> Int): Int { .. }

val num = demoForBlog { it.field + 1 }
```

Here, we retrieve the value of the `SomeContext`'s `field` and add `1`. Simple enough, right? But what if we could just put `field`? That's where this magic comes in.

What if we instead defined the function like this:

```kt
fun demoForBlog(func: SomeContext.() -> Int): Int { .. }
```

This looks a little weird. But what this actually is is a sort of inline extension function. It would compile down to the same code, but for users, it's much faster to access things. Let's look at the call site now.

```kt
val num = demoForBlog { field + 1 }
```

Because `SomeContext` is now the receiver instead of an argument, the implicit `this` of the callback is actually the `SomeContext`! We can use fields, methods, and properties of `SomeContext` like it was a method inside the class itself[^2].

It's extremely cool, and good for concise code. Kotlin also lets you do this on any object easily, too, with the `apply` extension:

```kt
val cx = SomeContext()

cx.apply {
    // Call SomeContext::sayHello
    sayHello()
}
```

It's very cool. So, anyways, what does this have to do with registration?

### Finally, back to the topic at hand.

Okay, so we want to make a registration API. For the example, I'll be using the code responsible for registering the block known internally as `all_dead` in The Broken Script. Here's the code with registrate:

```kt
@JvmField
val ALL_DEAD: BlockEntry<AllDeadBlock> = TBSRegistrate.block("all_dead", ::AllDeadBlock)
    .lang("431434")
    .properties {
        it.sound(SoundType.GLASS)
          .strength(-1.0f, 3600000.0f)
          .noCollission()
    }
    .blockstate { cx, prov ->
        prov.simpleBlock(
            cx.entry,
            prov.models()
                .cubeAll(cx.name, prov.modTex("nullvoid"))
                .renderType("cutout")
        )
    }
    .item()
    .tab(TBSCreativeTabs.BLOCKS_TAB.key!!)
    .model { cx, prov -> }
    .build()
    .register()
```

Okay. This is quite messy. Let's break it down:

```kt {17-20}
@JvmField
val ALL_DEAD: BlockEntry<AllDeadBlock> = TBSRegistrate.block("all_dead", ::AllDeadBlock)
    .lang("431434") // Sets the generated user-facing name (in language files) to be "431434"
    .properties { // Adds properties to the block
        it.sound(SoundType.GLASS) // Sound type -> GLASS
          .strength(-1.0f, 3600000.0f) // Strength -> INSANE
          .noCollission() // Disables collision
    }
    .blockstate { cx, prov -> // Creates a block state definition & model
        prov.simpleBlock( // A simple block model
            cx.entry, // Add the entry (kind of redundant but necessary I guess)
            prov.models() // Get the model provider (loader-specific)
                .cubeAll(cx.name, prov.modTex("nullvoid")) // Create a cube model with all sides set to the same texture
                .renderType("cutout") // Set the render type to cutout
        )
    }
    .item() // Register a BlockItem
    .tab(TBSCreativeTabs.BLOCKS_TAB.key!!) // Set the creative tab for the item
    .model { cx, prov -> } // Set the item model to nothing
    .build() // Build the item
    .register() // Register the block
```

Oh, and that highlighted part? That creates a new builder entirely, and then builds it, returning the original one. The types aren't hard coded either - it's generic. This is, for all intents and purposes, very messy.

> [!note]
> This is NOT intended to throw shade at Registrate. It's a great library and provides a TON of useful features, many of which I am pulling on. Huge props to @tterrag1098, they did an amazing job making it.

So, how do we even go about this, then?

### Minecraft Registration

Minecraft can only register things at certain times. Once the game is done loading, registries are "frozen", and made read-only. If you want to modify them, you're gonna end up doing some extremely cursed things, and usually it ends up crashing the game because of some data sync error or `ConcurrentModificationException`.

So, the easy solution is a queue. Our shiny new registration system is backed by several queues, and elements get registered whenever the loader is ready to register them. I like to call it lazy registration. The cool thing is the way we initialize elements, too, which ensures nothing gets missed.

```kt
/**
 * A registrate-like system for easily building and registering objects.
 */
open class BrokenReg(val modId: String) {
    /**
     * The queue of objects to be registered.
     */
    private val registrationQueue = mutableListOf<BuiltObject<*, *, *>>()
```

*Hey, look, it's our queue!*

### "Lazy" Initialization

We needed a solution to make sure everything gets initialized on time and before registries get frozen. The solution was something my good friend [@rdh](https://rdh540.dev) came up with - a `ForceClassInitiailizer`.

<details>
<summary>Show code</summary>

```kt
package net.thebrokenscript.brokencore.api.util

import net.thebrokenscript.brokencore.api.platform.PlatformUtil
import net.thebrokenscript.brokencore.api.util.AsmHelper.ClassNode
import net.thebrokenscript.brokencore.api.util.AsmHelper.typeOf
import org.objectweb.asm.tree.ClassNode
import java.nio.file.Files
import kotlin.io.path.extension
import kotlin.io.path.isRegularFile
import kotlin.io.path.readBytes
import kotlin.io.path.toPath
import kotlin.reflect.KClass

/**
 * Forces all classes annotated with [net.thebrokenscript.brokencore.impl.ForceRuntimeInit] (or some other annotation) to be initialized by the specified class loader.
 */
class ForceClassInitializer(
    private val classLoader: ClassLoader, annotationClass: KClass<out Annotation>
) {
    private val annotationType = typeOf(annotationClass)

    fun run() {
        val currentSide = PlatformUtil.getSide()

        val roots = classLoader.resources("").map { it.toURI().toPath() }
            ?: throw IllegalStateException("Root path for class loader ${classLoader.name} not found")

        roots.flatMap { Files.walk(it) }.filter { it.extension == "class" && it.isRegularFile() }.forEach {
            val cn = ClassNode(it.readBytes())

            if (cn.hasAnnotation()) {
                try {
                    val className = cn.name.replace('/', '.')
                    val clazz = Class.forName(className, false, classLoader)

                    if (clazz.isAnnotationPresent(SideOnly::class.java)) {
                        if (!clazz.getAnnotation(SideOnly::class.java).side.isCompatible(currentSide)) return@forEach
                    }

                    Class.forName(className, true, classLoader)
                } catch (e: ClassNotFoundException) {
                    throw RuntimeException(
                        "Failed to initialize class ${cn.name} with annotation ${annotationType.className}", e
                    )
                }
            }
        }
    }

    private fun ClassNode.hasAnnotation(): Boolean {
        return visibleAnnotations?.any { it.desc == annotationType.descriptor } == true
    }
}

inline fun <reified T : Annotation> forceInitializeClasses(
    classLoader: ClassLoader = StackWalker.getInstance(StackWalker.Option.RETAIN_CLASS_REFERENCE).callerClass.classLoader
) = ForceClassInitializer(classLoader, T::class).run()
```
</details>

It's just a tiny annotation that you put on a class, and then it's forced to be initialized at runtime. Cool, right?

### Builders

Registrate uses a system of "builders" to accomplish its registration syntax. If you're familiar with the builder pattern in object-oriented languages, this should be pretty obvious. We do something similar, but with a larger focus on the DSL side.

Our `AbstractBuilder` class handles most of the initial stuff, like adding stuff to the queue, creating `ResourceKey`s, handling the configuration block, etc.

It's up to the inheritors to implement the actual logic for stuff.

Our builders use public fields to contain data, instead of private fields with getters and setters. This is only practical because our system is *callback-based*, instead of Registrate's builder-oriented design. In Java with our system, you can specify a callback to get the same result. Let's take some test code as an example.

```java
// [!code word:defaultBlock] defaultBlock is just an alias for `block(id, Block::new)`
public static final BlockEntry<Block> TEST_BLOCK = REG.defaultBlock("test", b -> {
    b.lang = "Test Block";

    b.props(p -> {
        p.destroyTime(20f);
        p.ignitedByLava();
        p.randomTicks();
    });

    b.item(i -> {
        i.lang = "Test Block Item";

        i.model(m -> {
            // don't worry about it, it's *totally* a stick. totally.
            m.withExistingParent("minecraft:stick");
        });
    });

    b.model(m -> {
        m.cubeAll(m.getBlock());
    });
});

```

Instead of the (in my opinion) verbose, builder pattern design of Registrate, this system is based on callbacks. I think it's much cleaner, but I'm curious to hear what you think.

In Kotlin, this is even cleaner, too. Using the example of the `all_dead` block, this is what it looks like with the new API:

```kt
@JvmField
val ALL_DEAD = TBSReg.block("all_dead", ::AllDeadBlock) {
    lang = "431434"

    props {
        sound(SoundType.GLASS)
        indestructible() // <- The library that includes this registration API contains a lot of extensions and utilities, too! :)
        noCollission()
    }

    model {
        simpleBlock(block, models().cubeAll(texture = blockTexture("nullvoid")).renderType("cutout"))
    }

    simpleItem()
}
```

This works because of the callbacks. It's really nice to be able to do stuff this quickly. And the creation of the block itself is handled automatically, too, with everything associated with it also getting registered all in one go.

### The Good, The Bad, and The Ugly

Now, this system isn't without its hacks. Whenever we need to register a client-side thing in common code, it quickly gets ugly if we want a consistent API design.

In our entity builder, we needed a way for users to provide a renderer constructor, but that class is marked as `@OnlyIn(Dist.CLIENT)` in Forge/NeoForge, and has the equivalent in Fabric. If we referenced that class at all on a dedicated server, the game would crash. So, there had to be some hacks.

First, we had to add a client-side registration callback in the builder, that is invoked only on the client-side (duh).

```kt
/**
 * A register callback for the client-side.
 * This is done to fix some fuckery because of @[net.neoforged.api.distmarker.OnlyIn].
 */
private var clientRegisterCallback: (EntityEntry<T>) -> Unit = {}
```

It gets invoked in the builder's `onRegister` method:

```kt
override fun onRegistered(entry: EntityEntry<T>) {
    PlatformUtil.runWhenOn(Side.CLIENT) { { clientRegisterCallback(entry) } }

    spawns?.let { EntityHandler.spawns[entry] = it::value }
    attrs.let { EntityHandler.attrs[entry] = it }
}
```

Did you notice that double lambda? The double callback? Ugly, right? Well, it's about to get much worse.

That's all pretty tame compared to the monster of nesting and checks I had to do in order to make a field for the renderer even remotely possible. This can be classified as a *true* hack. Viewer discretion is advised.

<details>
<summary>Warning: Cursed</summary>

```kt
/**
 * The [EntityRendererProvider] for this entity. If it is `null`, then no renderer will be registered.
 */
var renderer: (() -> (EntityRendererProvider.Context) -> EntityRenderer<T>)?
    get() = null
    set(value) {
        PlatformUtil.runWhenOn(Side.CLIENT) {
            {
                clientRegisterCallback = if (value != null) {
                    {
                        ClientEntityHandler.renderers.add(ClientEntityHandler.EntityRendererInfo(it) {
                            EntityRendererProvider<T> { cx ->
                                value()(
                                    cx
                                )
                            }
                        })
                    }
                } else {
                    {}
                }
            }
        }
    }
```
</details>

Cursed, right? I warned you. But, in the end, this allows for some very nice registration of things.

```kt
@JvmField
val CIRCUIT = TBSReg.entity("circuit", ::CircuitEntity) {
    category = MobCategory.MONSTER
    renderer = { ::CircuitRenderer } // Yes, this is a lambda that returns a constructor. Yes, this is a technical limitation of how Minecraft is built.

    props {
        updateInterval = 3
        clientTrackingRange(196)

        fireImmune()
        sized(0.4f, 1.4f)
    }

    attrs(::createMobAttributes) {
        movementSpeed = 0.4
        maxHealth = 910
        armor = 0
        attackDamage = 50
        followRange = 916
        knockbackResistance = 50
    }
}
```

Pretty sweet, huh? I think it was all worth it.

### Rapid-Fire Speedrun!

Our registry API also supports items, advancements, jukebox songs, sounds, creative tabs, chat responses[^3], random events[^3], menus, block entities, tags, spawn conditions, model layers (client-only), and particles, and more are being added. We use our own library in our own mods, so you better believe we are gonna make it as good as we can.

It's also fully extensible and fully documented, so hopefully it shouldn't be too much of a pain to extend it if it's missing a feature.

Oh, and did I mention that it works on both Forge *and* Fabric? I'd call that a win.

### Wrapping Up

This registry API is a part of the core library being built for our mod, The Broken Script, which is named BrokenCore. BrokenCore itself is intended to be used wherever people want, and is built to be embedded via Jar-in-Jar. It requires zero dependencies from users (everything it needs is bundled), and we aim to have full compatability with almost any mod out there. It's intended to be easy and fun to use.

BrokenCore will be fully open-source (under an undetermined license as of right now, right now we are thinking potentially MIT or some GPL license) following the release of The Broken Script 2.0. Right now it's being developed in-tree with the mod, so we can iterate faster. After that, it'll be separated into its own repo and made public.

But hey! Thanks for reading! This took me a little while to get set up, and I hope to make more cool posts in the future. More features are coming to this site soon™, and so are some secrets...

If you'd like to support us, you can check out our [Ko-Fi](https://ko-fi.com/thebrokenscript)!

We also have a [Discord server](https://discord.gg/nullnullnullnull) for the mod, so stop by and say hi!

I also have a [YouTube channel](https://youtube.com/@RedstoneWizard08) where I post music I make, as well as do occasional livestreams for development or just having fun. Don't be afraid to stop by!

But anyway, that's all for me. Thanks for reading, see you soon! :)

<br />

---
<br />

[^1]: Yes, I am aware that iThundxr forked Registrate and ported it to Fabric. This does not, however, allow it to be used nicely in common code - model generators are still loader-specific, so defining your own models had to be done in loader-specific code, making the common part not very useful.

[^2]: In this case, however, there are visibility restrictions - callbacks like this cannot access private/protected fields, only public ones, and same for methods/properties/etc.

[^3]: Chat responses and random events are also part of the library.
