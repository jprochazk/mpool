
import { Pool } from "./index";

describe("library", function () {
    it("Doesn't allocate extra objects", function () {
        let count = 0;
        const pool = new Pool(() => {
            count += 1;
            return {};
        }, 100);
        for (let i = 0; i < 100; ++i) {
            pool.put(pool.get());
        }
        expect(count).toEqual(100);
    });

    it("Doesn't shrink", function () {
        const pool = new Pool(() => ({}), 100);

        const startRef = (pool as any)._pool;
        pool.fit();
        const endRef = (pool as any)._pool;
        expect(startRef === endRef).toEqual(true);
    });

    it("Shrinks", function () {
        const pool = new Pool(() => ({}), 100);
        expect(pool.length).toEqual(100);
        for (let i = 0; i < 100; ++i) {
            pool.put({});
        }
        expect(pool.length).toEqual(200);
        const startRef = (pool as any)._pool;
        pool.fit();
        const endRef = (pool as any)._pool;
        expect(pool.length).toEqual(100);
        expect(startRef !== endRef).toEqual(true);
    });

    it("Re-uses objects", function () {
        const pool = new Pool(() => ({}), 1);
        const obj = pool.get();
        pool.put(obj);
        expect(pool.get() === obj).toEqual(true);
    })
})