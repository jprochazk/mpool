export class Pool<T> {
    private _pool: Array<T | null>;
    private _count: number;

    constructor(
        public readonly init: () => T,
        public readonly free: (item: T) => void = () => {},
        /**
         * The preferred size of the pool.
         * When you call `.fit()` on a pool, it shrinks to this size.
         */
        public preferredSize = 100
    ) {
        this._pool = Array(this.preferredSize);
        for (let i = 0; i < this.preferredSize; ++i) {
            this._pool[i] = this.init();
        }
        this._count = this.preferredSize;
    }

    /**
     * Returns the pool's storage.
     * 
     * This should not be modified, do so at your own risk.
     */
    get inner(): readonly T[] {
        return this._pool as T[];
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
            return this.init();
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
     * Calls the provided `free(object)` for every discarded object.
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
            for (let i = this.preferredSize; i < this._count; ++i) {
                this.free(oldPool[i] as T /* never null */);
                oldPool[i] = null;
            }
            this._count = this.preferredSize;
        }
    }
}