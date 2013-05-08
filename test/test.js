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
		
		it("returns a deletion diff when text in a is missing in b", function() {
			assert.deepEqual([["a", -1]], diff.diffChars("a", ""));
		});	
		
		it("returns an addition diff when text in b is missing in a", function() {
			assert.deepEqual([["a", 1]], diff.diffChars("", "a"));
		});
		
		it("returns a no-change diff when inputs are equal (multi-char)", function() {
			assert.deepEqual([["a", 0], ["b", 0]], diff.diffChars("ab", "ab"));
		});
		
		it("returns a mixed diff when some text is changed", function() {
			assert.deepEqual([["a", -1], ["b", 0]], diff.diffChars("ab", "b"));
		});
		
		it("returns a mixed diff when text is changed", function() {
			assert.deepEqual([["a", -1], ["b", 0], ["c", 1]], diff.diffChars("ab", "bc"));
		});
		
		it("returns a mixed diff with deletions first when text is changed", function() {
			assert.deepEqual([["a", -1], ["b", 1]], diff.diffChars("a", "b"));
		});

	});
	
	describe("#diffWords", function() {
	
		it("returns an empty array for two blank strings", function() {
			assert.deepEqual([], diff.diffWords("", ""));
		});
		
		it("returns an no-change diff when inputs are equal", function() {
			assert.deepEqual([["Hello", 0]], diff.diffWords("Hello", "Hello"));
		});
		
		it("returns a deletion diff when text in a is missing in b", function() {
			assert.deepEqual([["Hello", -1]], diff.diffWords("Hello", ""));
		});
		
		it("returns an addition diff when text in b is missing in a", function() {
			assert.deepEqual([["Hello", 1]], diff.diffWords("", "Hello"));
		});
		
		it("returns a no-change diff when inputs are equal (multi-word)", function() {
			assert.deepEqual([["Hello", 0], [" ", 0], ["World", 0]], diff.diffWords("Hello World", "Hello World"));
		});
		
		it("returns a mixed diff when some text is changed", function() {
			assert.deepEqual([["Hello", -1], [" ", -1], ["World", 0]], diff.diffWords("Hello World", "World"));
		});
		
		it("returns a mixed diff when text is changed", function() {
			assert.deepEqual([["Hello", -1], [" ", -1], ["World", 0], [" ", 1], ["Map", 1]], diff.diffWords("Hello World", "World Map"));
		});
		
		it("returns a mixed diff with deletions first when text is changed", function() {
			assert.deepEqual([["Hello", -1], ["World", 1]], diff.diffWords("Hello", "World"));
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
	
	describe("#splitWords", function() {
	
		it("returns an empty array for a blank string", function() {
			assert.deepEqual([], diff.splitWords(""));
		});
	
		it("returns a word in an array for a one word string", function() {
			assert.deepEqual(["Hello"], diff.splitWords("Hello"));
		});
		
		it("preserves whitespace characters", function() {
			assert.deepEqual(["Hello", " ", "World", "\r\n"], diff.splitWords("Hello World\r\n"));
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
		
		it("returns an array for all pairs", function() {
			assert.deepEqual([[1, 0], [0, 1]], diff.pairArrays(["a", "b"], ["b", "a"]));
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
	
	describe("#mapSequencesCollisions", function() {
	
		it("returns an empty array for an empty array of sequences", function() {
			assert.deepEqual([], diff.mapSequenceCollisions([]));
		});
		
		it("returns an array of empty arrays when there are no collisions", function() {
			assert.deepEqual([[], []], diff.mapSequenceCollisions([[[0, 0]], [[1, 1]]]));
		});
		
		it("returns an array containing arrays of indices when there are collisions", function() {
			assert.deepEqual([[1], [0]], diff.mapSequenceCollisions([[[0, 0], [1, 1]], [[1, 1], [2, 2]]]));
		});
	
	});
	
	describe("#doSequencesCollide", function() {
		
		it("returns false if sequences do no collide", function() {
			assert.equal(false, diff.doSequencesCollide([[0, 0]], [[1, 1]]));
		});
		
		it("returns true if sequences overlap for both a and b", function() {
			assert.equal(true, diff.doSequencesCollide([[0, 0], [1, 1], [2, 2]], [[1, 1], [2, 2], [3, 3]]));
		});
		
		it("returns true if sequences overlap for a only", function() {
			assert.equal(true, diff.doSequencesCollide([[0, 0], [1, 1], [2, 2]], [[1, 3], [2, 4], [3, 5]]));
		});
		
		it("returns true if sequences overlap for b only", function() {
			assert.equal(true, diff.doSequencesCollide([[0, 0], [1, 1], [2, 2]], [[3, 1], [4, 2], [5, 3]]));
		});
		
		it("returns true if sequences cross overlap", function() {
			assert.equal(true, diff.doSequencesCollide([[0, 3], [1, 4], [2, 5]], [[3, 0], [4, 1], [5, 2]]));
		});
		
		it("returns true if sequences touch for both a and b", function() {
			assert.equal(true, diff.doSequencesCollide([[0, 0], [1, 1]], [[1, 1], [2, 2]]));
		});
		
		it("returns true if sequences touch for a only", function() {
			assert.equal(true, diff.doSequencesCollide([[0, 0], [1, 1]], [[1, 2], [2, 3]]));
		});
		
		it("returns true if sequences touch for b only", function() {
			assert.equal(true, diff.doSequencesCollide([[0, 0], [1, 1]], [[2, 1], [3, 2]]));
		});
		
	});
	
	describe("#scoreSequences", function() {
	
		it("returns an empty array for an empty array of sequences", function() {
			assert.deepEqual([], diff.scoreSequences([], []));
		});
		
		it("returns an array containing the sequence length for a single sequence", function() {
			assert.deepEqual([2], diff.scoreSequences([2], [[]]));
		});
		
		it("returns an array containing the sequence lengths for sequences that do not overlap", function() {
			assert.deepEqual([2, 2], diff.scoreSequences([2, 2], [[], []]));
		});
		
		it("returns scores that reflect the sequence length minus the lengths of the excluded sequences", function() {
			assert.deepEqual([0, 0], diff.scoreSequences([2, 2], [[1], [0]]));
		});
		
		it("returns scores that reflect the sequence length minus the lengths of the excluded sequences", function() {
			assert.deepEqual([1, -1, 1], diff.scoreSequences([2, 3, 2], [[1], [0, 2], [1]]));
		});
	
	});
	
	describe("#topSequences", function() {
		
		it("returns an empty array for an empty array of sequences", function() {
			assert.deepEqual([], diff.topSequences([]));
		});
		
		it("returns the sequence passed in if there is only one", function() {
			assert.deepEqual([[[0, 0]]], diff.topSequences([[[0, 0]]]));
		});
		
		it("returns the highest scoring sequences", function() {
			assert.deepEqual([[[0, 0], [1, 1]]], diff.topSequences([[[0, 0]], [[0, 0], [1, 1]]]));
		});
		
	});

});