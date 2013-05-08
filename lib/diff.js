/**
 * @param a The first string to diff (old)
 * @param b The second string to diff (new)
 * @returns An array containing the characters and
 *          a flag, 0 no change, 1 addition, -1
 *          subtraction
 */
function diffChars(a, b) {
	return [];
}

/**
 * @param str The string to split into an array
 * @returns   The array of characters
 */
function splitChars(str) {
	return str.split("");
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
			map[key].forEach(function(other, i) {
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
 * @returns         An array of the scores
 */
function scoreSequences(sequences) {

	var scores = [];
	var collisions = mapSequenceCollisions(sequences);

	collisions.forEach(function(arr, start) {
		
		var score = 0;
		var current = [start, 0];
		var visited = []; // Make sure no cycles
		var trail = [];
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
				score = sequences[i].length - score;
				
				if(trail.length) {
					current = trail.pop();
				} else {
					break;
				}
			}
		}
		
		scores.push(score);
	});
	
	return scores;
}

exports.diffChars = diffChars;
exports.splitChars = splitChars;
exports.mapArray = mapArray;
exports.pairArrays = pairArrays;
exports.groupPairs = groupPairs;
exports.mapSequenceCollisions = mapSequenceCollisions;
exports.doSequencesCollide = doSequencesCollide;
exports.scoreSequences = scoreSequences;