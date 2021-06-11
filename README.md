# mpool

This library provides a simple object pool implementation.

### Usage

```ts
import { Pool } from "mpool";

class Thing {}

// The pool receives a `create` callback, which is used to create new objects.
const pool = new Pool(() => new Thing);
for (let i = 0; i < pool.length; ++i) {
    const obj = pool.get();
    // ...
    pool.put(obj);
}
```

The pool is unbounded, meaning that the pool *never* discards objects. Every object you `.put()` into the pool is stored there until you `.get()` it again. This does mean that memory usage can only ever go up. To prevent this, the pool also contains a `.fit()` method, which shrinks the pool to `pool.preferredSize` objects, if there are more than `pool.preferredSize` objects in the pool.

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