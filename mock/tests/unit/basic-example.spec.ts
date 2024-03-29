/*
  Demo: test ordinary Java/TypeScript
*/
import { describe, expect, test } from "vitest";
import { REPLInput } from "/Users/mace/Desktop/cs 32/mock-hnguy116-mmacken4/mock/src/components/REPLInput"

// all exports from main will now be available as main.X
// import * as main from '../mock/src/main';
import * as main from "../../src/main";

test("is 1 + 1 = 2?", () => {
  expect(1 + 1).toBe(2);
});

// Notice how you can test vanilla TS functions using Playwright as well!
test("main.zero() should return 0", () => {
  expect(main.zero()).toBe(0);
});

// describe ("getMockedData function", () => {
//   test("returns the correct dataset, given correct filepath", () => {
//     const filepath1 = 'file1';
//     const expectedData = [
//       ["col1", "col2", "col3"],
//       ["1", "2", "3"],
//       ["4", "1", "6"],
//       ["7", "8", "9"],
//       ["4", "2", "6"],
//     ];
//     expect(getMockedData(filepath1).toEqual(expectedData));
//   });

// });


// For more information on how to make unit tests, visit:
// https://jestjs.io/docs/using-matchers
