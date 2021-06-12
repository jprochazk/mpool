export class Pool<T> {
    private _pool: Array<T | null>;
    private _count: number;
    private _create: () => T;
    /**
     * The preferred size of the pool.
     * When you call `.fit()` on a pool, it shrinks to this size.
     */
    public preferredSize: number;

    constructor(
        create: () => T,
        preferredSize = 100
    ) {
        this.preferredSize = preferredSize;
        this._create = create;
        this._pool = Array(this.preferredSize);
        for (let i = 0; i < this.preferredSize; ++i) {
            this._pool[i] = this._create();
        }
        this._count = this.preferredSize;
    }

    /**
     * The amount of objects currently in the pool.
     */
    get length() { return this._count; }

    /**
     * Get an object.
     * If there are objects in the pool, this returns one of them, 
     * otherwise, it allocates a new object.
     */
    get(): T {
        if (this._count !== 0) {
            this._count -= 1;
            const object = this._pool[this._count] as T /* never null */;
            this._pool[this._count] = null;
            return object;
        } else {
            return this._create();
        }
    }

    /**
     * Return an object to the pool.
     */
    put(object: T) {
        this._pool[this._count] = object;
        this._count += 1;
    }

    /**
     * Shrinks the pool to `pool.preferredSize` objects, discarding any extras. 
     * Does nothing if there aren't more than `pool.preferredSize` objects in the pool.
     * 
     * Internally, this moves the pool's elements into a new, smaller array.
     */
    fit() {
        if (this._count > this.preferredSize) {
            const oldPool = this._pool;
            this._pool = Array(this.preferredSize);
            for (let i = 0; i < this.preferredSize; ++i) {
                this._pool[i] = oldPool[i];
                oldPool[i] = null;
            }
            this._count = this.preferredSize;
        }
    }
}