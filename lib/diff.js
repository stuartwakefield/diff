function diffChars(a, b) {
	return [];
}

function splitChars(str) {
	return str.split("");
}

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

function pairArrays(a, b) {
	var pairs = [];
	var map = mapArray(a);
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