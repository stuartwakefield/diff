/**
 * @param a The first string to diff (old)
 * @param b The second string to diff (new)
 * @returns An array containing the characters and
 *          a flag, 0 no change, 1 addition, -1
 *          subtraction
 */
function diffChars(a, b, l) {
	
	var arr = splitChars(a)
	  , brr = splitChars(b);
	
	return diff(arr, brr);
}

/**
 * @param a The first string to diff (old)
 * @param b The second string to diff (new)
 * @returns An array containing the words and
 *          a flag, 0 no change, 1 addition, -1
 *          subtraction
 */
function diffWords(a, b) {

	var arr = splitWords(a)
	  , brr = splitWords(b);

	return diff(arr, brr);
}

/**
 * @param arr The first array of units to diff
 * @param brr The second array of units to diff
 * @returns   An array containing the units and
 *            a flag, 0 no change, 1 addition, -1
 *            subtraction
 */
function diff(arr, brr) {

	var pairs = topPairs(pairArrays(arr, brr))
	  , result = []
	  , i = 0
	  , j = 0
	  , next
	  , pair;
	
	while(i < arr.length || j < brr.length) {
	
		if(next == null) {
			if(pairs.length) {
				next = pairs.shift();
				pair = next;
			} else {
				next = [arr.length, brr.length];
				pair = null;
			}
		}
		
		if(i < next[0]) {
			result.push([arr[i], -1]);
			++i
		} else if(j < next[1]) {
			result.push([brr[j], 1]);
			++j;
		} else {
			result.push([arr[pair[0]], 0]);
			++i;
			++j;
			next = null;
		}
		
	}

	return result;
}

/**
 * @param str The string to split into an array
 * @returns   The array of characters
 */
function splitChars(str) {
	return str.split("");
}

function splitWords(str) {
	
	var items = []
	  , space = true;
	  
	str = str.replace(/(\s*)(\S+)/g, function(full, space, word) {
	
		if(space.length)
			items.push(space);

		items.push(word);
	
		return "";
	});
	
	if(str.length) 
		items.push(str);
		
	return items;
}

/**
 * @param arr The array to map
 * @returns   The map of the values.toString() as
 *            the keys and an array of indices as
 *            the value
 */
function mapArray(arr) {

	var map = {};
	
	arr.forEach(function(item, index) {
	
		var key = item.toString();
		
		if(map[key] == null)
			map[key] = [];
			
		map[key].push(index);
	});
	
	return map;
}

/**
 * @param a The first array to pair
 * @param b The second array to pair
 * @returns An array containing pairs of indices
 */
function pairArrays(a, b) {

	var pairs = []
	  , map = mapArray(a);
	  
	b.forEach(function(item, j) {
	
		var key = item.toString();
		
		if(map[key] != null)
			map[key].forEach(function(i) {
				pairs.push([i, j]);
			});
	});
	
	return pairs;
}

/**
 * @param pairs The pairs to group
 * @returns     An array containing pair sequences
 */
function groupPairs(pairs) {
	
	var sequences = []
	  , visited = {};
	
	pairs.forEach(function(pair) {
		visited[pair.join(",")] = false;
	});	
	
	pairs.forEach(function(pair) {
	
		var id = pair.join(",");
	
		if(!visited[id]) {
			
			var sequence = []
			  , next = pair;
			
			while(visited[id] != null) {
				visited[id] = true;
				sequence.push(next);
				next = [next[0] + 1, next[1] + 1];
				id = next.join(",");
			}
			
			sequences.push(sequence);
		}
	});
	
	return sequences;
}

/**
 * @param sequences The list of sequences to map
 * @returns         An array whose indices match the
 *                  indices of the sequence list and
 *                  the value is an array containing
 *                  the indices of sequences that
 *                  collide
 */
function mapSequenceCollisions(sequences) {
	
	var collisions = [];
	
	sequences.forEach(function(a) {
		
		var arr = [];

		sequences.forEach(function(b, i) {
		
			if(a !== b && doSequencesCollide(a, b))
				arr.push(i);
			
		});
		
		collisions.push(arr);
	
	});
	
	return collisions;
}

/**
 * @param a The first sequence to check
 * @param b The second sequence to check
 * @returns A boolean representing whether there was
 *          a collision (true) or not (false)
 */
function doSequencesCollide(a, b) {

	var a1 = a[0]
	  , an = a[a.length - 1]
	  , b1 = b[0]
	  , bn = b[b.length - 1];

	return (a1[0] <= bn[0] && an[0] >= b1[0])
	    || (a1[1] <= bn[1] && an[1] >= b1[1])
	    || (a1[0] < b1[0] != a1[1] < b1[1]);
}

/**
 * @param scores     The basic scores
 * @param collisions The collisions to score
 * @returns          An array of the scores
 */
function scoreCollisions(scores, collisions) {
	return scoreCollisionsLCS(scores, collisions);
}

/**
 * This method of scoring sequence will always result
 * in the most optimal sequences where the maximum
 * number of characters are matched. However, it is
 * prohibitively slow, scaling exponentially with the
 * number of sequences.
 *
 * @param scores     The basic scores (sequence lengths)
 * @param collisions The collisions to use for cumulative 
 *                   scoring
 * @returns          An array of the scores
 */
function scoreCollisionsGraph(scores, collisions) {

	var result = [];

	collisions.forEach(function(arr, start) {
		
		var score = 0
		  , current = [start, 0]
		  , visited = [] // Make sure no cycles
		  , trail = [];
		visited[start] = true;
		
		while(true) {
		
			var i = current[0]
			  , j = current[1];
		
			if(collisions[i].length > j) {
				var k = collisions[i][j];
				
				if(!visited[k]) {
					visited[k] = true;
					trail.push(current);
					current = [k, 0];
					score *= -1;
				} else {
					++current[1];
				}
				
			} else {
				score = scores[i] - score;
				
				if(trail.length) {
					current = trail.pop();
				} else {
					break;
				}
			}
		}
		
		result.push(score);
	});
	
	return result;
}

/**
 * The basic approach favours the longest sequences;
 * the scores are simply the length of the sequence
 *
 * @param scores     The basic scores (sequence lengths)
 * @param collisions The collisions to use for cumulative 
 *                   scoring
 * @returns          An array of the scores
 */
function scoreCollisionsLCS(scores, collisions) {
	return scores;
}

/**
 * Returns the best matches of sequences that 
 * do not collide
 * @param sequences The sequences to match
 * @returns         The non colliding sequences
 */
function topSequences(sequences) {
	
	var collisions = mapSequenceCollisions(sequences)
	  , scores = scoreCollisions(sequences.map(function(sequence) {
			return sequence.length;
		}), collisions)
	
	  , result = []
	  , excluded = [];
	  
	return scores.map(function(score, index) {
		return [score, index];
		
	// Sort the array on the scores descending
	}).sort(function(a, b) {
		return b[0] - a[0];
		
	// Filter out the low scoring excluded sequences
	}).filter(function(item) {
		var include = !excluded[item[1]];
		if(include)
			collisions[item[1]].forEach(function(exclude) {
				excluded[exclude] = true;
			});
		return include;
		
	// Map the score, index pairs to indexes
	}).map(function(item) {
		return item[1];
		
	// Sort the indexes back
	}).sort(function(a, b) {
		return a - b;
		
	// Map the indexes to the sequences
	}).map(function(index) {
		return sequences[index];
	});
}

/**
 * @param pairs The pairs to filter
 * @returns     The filtered pairs
 */
function topPairs(pairs) {

	var result = [];
	
	topSequences(groupPairs(pairs)).forEach(function(sequence) {
		Array.prototype.push.apply(result, sequence);
	});
	
	return result;
}

// TODO Add unit tests for the following
/**
 * @param diff The diff to serialize as a 
 *             HTML fragment
 * @returns    The HTML fragment
 */
function formatDiff(diff) {
	
	var last
	  , result = []
	  , chunk = []
	  , i = 0;
	
	while(true) {
		if(i === diff.length || (last != null && last != diff[i][1])) {
			var tag = last === 1 ? "ins" : last === -1 ? "del" : ""
			  , otag = tag.length ? "<" + tag + ">" : ""
			  , ctag = tag.length ? "</" + tag + ">" : "";
			
			result.push(otag + chunk.join("") + ctag);
			
			chunk = [];
		}
		
		if(i === diff.length) 
			break;
			
		last = diff[i][1];
		chunk.push(diff[i][0]);
		
		++i;
	}
	
	return result.join("");
}

// Based on algorithm defined in:
// P. Heckel, A technique for isolating differences between files
// Comm. ACM, 21, (4), 264–268 (1978).
// Borrows from http://ejohn.org/projects/javascript-diff-algorithm/

/**
 * @param arr The first array to pair 
 * @param brr The second array to pair
 * @returns   The unique pairs
 */
function pairMutuallyUniqueArrayItems(arr, brr) {
	
	var amap = mapArray(arr)
	  , bmap = mapArray(brr)
	  , pairs = [];
	
	for(var value in bmap) {
		if(bmap[value].length === 1 && amap[value] != null && amap[value].length === 1) {
			pairs.push([amap[value][0], bmap[value][0]]);
		}
	}
	
	return pairs;
}

/**
 * @param arr The first array to pair
 * @param brr The second array to pair
 * @returns   The pairs
 */
function expandPairs(arr, brr) {
	
	var pairs = pairMutuallyUniqueArrayItems(arr, brr)
	  , result = [];
	
	pairs.forEach(function(pair) {
		result.push(pair);
		
		var ai = pair[0]
		  , bi = pair[1]
		  , al = arr.length
		  , bl = brr.length;
		
		// Forward
		for(var i = 1; ai + i < al && bi + i < bl && arr[ai + i] === brr[bi + i]; ++i) {
			result.push([ai + i, bi + i]);
		}
		
		// Rewind
		for(var i = 1; ai - i >= 0 && bi - i >= 0 && arr[ai - i] === brr[bi - i]; ++i) {
			result.push([ai - i, bi - i]);
		}
		
	});
	
	return result.sort(function(a, b) {
		var s = a[0] - b[0];
		return s !== 0 ? s : a[1] - b[1];
	});
}

exports.diffChars = diffChars;
exports.diffWords = diffWords;
exports.splitChars = splitChars;
exports.splitWords = splitWords;
exports.mapArray = mapArray;
exports.pairArrays = pairArrays;
exports.groupPairs = groupPairs;
exports.mapSequenceCollisions = mapSequenceCollisions;
exports.doSequencesCollide = doSequencesCollide;
exports.scoreCollisions = scoreCollisions;
exports.scoreCollisionsGraph = scoreCollisionsGraph;
exports.topSequences = topSequences;
exports.topPairs = topPairs;