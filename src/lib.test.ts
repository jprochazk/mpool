
import { greet } from "./index";

describe("library", function () {
    it("greets", function () {
        expect(greet("John")).toEqual("Hello, John!");
    });
});