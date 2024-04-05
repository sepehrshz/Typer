import { expect, test, it } from "vitest";
import { sum } from "../sum";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("adds 1 + 3 to equal 4", () => {
  expect(sum(1, 3)).toBe(4);
});

test("adds 1 + 4 to equal 5", () => {
  expect(sum(1, 4)).toBe(5);
});

it("should become UpperCase", () => {
  const result = "sepehr".toUpperCase();
  expect(result).toMatchInlineSnapshot(`"SEPEHR"`);
});
