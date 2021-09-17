# mpool

This library provides a simple object pool implementation.

### Usage

```ts
import { Pool } from "mpool";

const pool = new Pool(() => ({ value: 0 }));

const obj = pool.get();
use(obj);
pool.put(obj);
```

The pool is unbounded, meaning that the pool never discards objects. To mitigate unbounded memory growth scenarios, the pool contains a `.fit()` method which shrinks the pool to `pool.preferredSize` objects, if there are more than `pool.preferredSize` objects in the pool. You may call this at the end of your game loop.

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

The recommended way to handle initialization + deinitialization of your objects is to implement `init` and `free`, for example:

```ts
import { Pool } from "mpool";

class Thing {
    public value!: number;

    init(value: number): this {
        this.value = value;
        return this;
    }

    free() {
        // be careful: since `init` is *not* called automatically, `this.value` may be undefined.
        // in your own code, you should provide default values and employ null checks to mitigate this.
        console.log(`freed object: Thing { value: ${this.value} }`);
        return this;
    }
}

const pool = new Pool(
    // callback used for creating new objects when there aren't any in the pool
    () => new Thing,
    // callback used for freeing objects when they are discarded after
    // a call to `.fit()`
    o => o.free(),
    // preferred size of the pool, calling `.fit()` will only leave at most
    // this many objects in the pool
    0
);
// When acquiring an object, explicitly initialize it:
const obj = pool.get().init(100);
use(obj);
// at this point you may `.free()` your object, or return it to the pool
pool.put(obj);
// if at some point you `.fit()` the pool, the `free` callback will be called with
// every object beyond capacity, and those objects will be discarded
pool.fit(); // logs 'freed object: Thing { value: 100 }'
```
