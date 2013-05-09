var diff = require("../../lib/diff");

var a = 
	"Lorem ipsums dolor sit amet, consectetur adipiscing elit. Proin in " +
	"nisl a nisi porttitor tempus quis eget arcu. Quisque rutrum, tellus " +
	"ut sodales iaculis, augue lorem sagittis est, eu aliquet tellus elit " +
	"aliquet dolor. Nullam sed dignissim justo. Duis id dui id lacus " +
	"facilisis congue.";
	
var b = 
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in " +
	"nisl a nisi porttitor tempus quis eget arcu. Quisque rutrum, tellus " +
	"ut sodales iaculis, augue lorems sagittitis est, eu aliquet tellus elit " +
	"aliquet dolor. Nullam sed dignissim justo. Duis id dui id lacus " +
	"facilisis congue.";

var step = 10;
var count = step;
var s;
var e;
var l = Math.min(a.length, b.length);

while(count < l && (!e || e - s < 10000)) {
	var q = count;
	s = new Date().valueOf();
	diff.diffWords(a.substr(0, q), b.substr(0, q));
	e = new Date().valueOf();
	console.log("Count", q, "characters", "Time taken", e - s, "ms");
	count += step;
}

console.log("Performance:", q, "characters in", e - s, "ms"); 