var diff = require("../lib/diff");

var input = 
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in " +
	"nisl a nisi porttitor tempus quis eget arcu. Quisque rutrum, tellus " +
	"ut sodales iaculis, augue lorem sagittis est, eu aliquet tellus elit " +
	"aliquet dolor. Nullam sed dignissim justo. Duis id dui id lacus " +
	"facilisis congue.";

var step = 10;
var count = step;
var s;
var e;

while(!e || e - s < 10000) {
	s = new Date().valueOf();
	diff.diffChars(input.substr(0, count), input.substr(0, count))
	e = new Date().valueOf();
	console.log("Count", count, "characters", "Time taken", e - s, "ms");
	count += step;
}

// Without subdivisions (such as diffing characters on lines) the scaling
// of this function is n squared due to the time it takes to pair up characters

// Performance would be increased with line splitting, a line limit, word 
// diffing rather than character diffing. The scoring function is the most
// expensive as a n * graph traversal. This could be optimised.