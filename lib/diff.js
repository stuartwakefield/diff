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

exports.diffChars = diffChars;
exports.splitChars = splitChars;
exports.mapArray = mapArray;
exports.pairArrays = pairArrays;