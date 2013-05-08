var assert = require("assert");
var diff = require("../lib/diff");

describe("diff", function() {

	describe("#diffChars", function() {

		it("returns an empty array for two blank strings", function() {
			assert.deepEqual([], diff.diffChars("", ""));
		});
		
		it("returns a no-change diff when inputs are equal", function() {
			assert.deepEqual([["a", 0]], diff.diffChars("a", "a"));
		});	

	});

	describe("#splitChars", function() {

		it("returns an empty array for blank string", function() {
			assert.deepEqual([], diff.splitChars(""));
		});

		it("returns a single char in an array for a one char string", function() {
			assert.deepEqual(["a"], diff.splitChars("a"));
		});
		
		it("returns an array of the chars in the input string", function() {
			assert.deepEqual(["a", "b"], diff.splitChars("ab"));
		});
		
		it("retuns space as a single character", function() {
			assert.deepEqual([" "], diff.splitChars(" "));
		});
		
		it("preserves whitespace characters", function() {
			assert.deepEqual([" ", "\r", "\n", "\t"], diff.splitChars(" \r\n\t"));
		});

	});
	
	describe("#mapArray", function() {
		
		it("returns an empty map for an empty array", function() {
			assert.deepEqual({}, diff.mapArray([]));
		});
		
		it("returns a map containing the value.toString() as a key and an array of indexes as the value", function() {
			assert.deepEqual({"a":[0]}, diff.mapArray(["a"]));
		});
		
	});
	
	describe("#pairArrays", function() {
		
		it("returns an empty array for two empty arrays", function() {
			assert.deepEqual([], diff.pairArrays([], []));
		});
		
		it("returns an array containing a pair of indexes for a matche where a match is: a[i].toString() === b[j].toString()", function() {
			assert.deepEqual([[0, 0]], diff.pairArrays(["a"], ["a"]));
		});
		
		it("returns an empty array for two arrays with no matches", function() {
			assert.deepEqual([], diff.pairArrays(["a"], ["b"]));
		});
		
	});
	
	describe("#groupPairs", function() {
		
		it("returns an empty array for an empty array of pairs", function() {
			assert.deepEqual([], diff.groupPairs([]));
		})
		
		it("returns a single sequence of pairs for a single pair", function() {
			assert.deepEqual([[[0, 0]]], diff.groupPairs([[0, 0]]));
		});
		
		it("returns a single sequence of pairs for successive pairs", function() {
			assert.deepEqual([[[0, 0], [1, 1]]], diff.groupPairs([[0, 0], [1, 1]]));
		});
		
		it("returns sequences for each set of successive pairs", function() {
			assert.deepEqual([[[0, 0], [1, 1]], [[2, 0], [3, 1]], [[4, 4]]], diff.groupPairs([[0, 0], [1, 1], [2, 0], [3, 1], [4, 4]]));
		});
		
	});

});