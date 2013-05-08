/**
 * @param a The first string to diff (old)
 * @param b The second string to diff (new)
 * @returns An array containing the characters and
 *          a flag, 0 no change, 1 addition, -1
 *          subtraction
 */
function diffChars(a, b, l) {
	
	var arr = splitChars(a);
	var brr = splitChars(b);
	
	return diff(arr, brr);
}

function diffWords(a, b) {

	var arr = splitWords(a);
	var brr = splitWords(b);

	return diff(arr, brr);
}

function diff(arr, brr) {

	var pairs = pairArrays(arr, brr);
	var sequences = groupPairs(pairs);
	
	var top = topSequences(sequences);
	
	var pairs = [];
	top.forEach(function(sequence) {
		sequence.forEach(function(pair) {
			pairs.push(pair);
		});
	});
	
	var result = [];
	var i = 0;
	var j = 0;
	var next;
	var pair;
	
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
	var items = [];
	var space = true;
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
	
	var sequences = [];
	var visited = {};
	
	pairs.forEach(function(pair) {
		visited[pair.join(",")] = false;
	});	
	
	pairs.forEach(function(pair) {
	
		var id = pair.join(",");
	
		if(!visited[id]) {
			
			var sequence = [];
			var next = pair;
			
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
	return (a[0][0] <= b[b.length - 1][0] && a[a.length - 1][0] >= b[0][0])
	    || (a[0][1] <= b[b.length - 1][1] && a[a.length - 1][1] >= b[0][1])
		|| (a[0][0] <= b[0][1] && a[0][1] >= b[0][0]);
}

/**
 * @param sequences The sequences to score
 * @param scores    The basic scores
 * @returns         An array of the scores
 */
function scoreSequences(scores, collisions) {

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
 * Returns the best matches of sequences that 
 * do not collide
 * @param sequences The sequences to match
 * @returns         The non colliding sequences
 */
function topSequences(sequences) {
	
	var collisions = mapSequenceCollisions(sequences);
	var scores = scoreSequences(sequences.map(function(sequence) {
		return sequence.length;
	}), collisions);
	
	var result = [];
	var excluded = [];
	var filtered = scores.map(function(score, index) {
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
	
	return filtered;
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
exports.scoreSequences = scoreSequences;
exports.topSequences = topSequences;