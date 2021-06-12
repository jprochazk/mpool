# mpool

This library provides a simple object pool implementation.

### Usage

```ts
import { Pool } from "mpool";

class Thing {}
const pool = new Pool(() => new Thing);

const obj = pool.get();
use(obj);
pool.put(obj);
```

Why does the `Pool` accept a callback? It greatly simplifies the library's role: It doesn't have to handle pooled object initialization. Here is the recommended approach in case your objects require initialization:

```ts
import { Pool } from "mpool";

class Thing {
    public value!: number;

    init(value: number): this {
        this.value = value;
        return this;
    }
}

const pool = new Pool(() => new Thing);
// When acquiring an object, explicitly initialize it:
const obj = pool.get().init(100);
use(obj);
pool.put(obj);
```

It's a little more boilerplate, but it ensures that your objects are easily reusable. The library *could* handle this for you, but it wouldn't be as versatile and could potentially cause some uncomfortable limitations, such as requiring `init` and `free` functions to exist.

The pool is unbounded, meaning that the pool *never* discards objects. Every object you `.put()` into the pool is stored there until you `.get()` it again. This does mean that memory usage will only ever go up. However, the pool also contains a `.fit()` method, which shrinks the pool to `pool.preferredSize` objects, if there are more than `pool.preferredSize` objects in the pool.

```ts
import { Pool } from "mpool";

class Thing {}

const pool = new Pool(() => new Thing, /* preferred pool size */ 5);
console.log(pool.length); // 5
pool.put(new Thing);
console.log(pool.length); // 6
pool.fit();
console.log(pool.length); // 5 <- pool has shrunk to our preferred pool size
```

The shrinking happens by creating a new internal storage and moving all the objects into it. This means that the old array is free for garbage collection, so it does *truly* lead to a memory usage decrease, whenever a GC cycle happens.