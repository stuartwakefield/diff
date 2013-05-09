var diff = require("../../lib/diff");

var a = 
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in " +
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
	
console.log(diff.diffWords(a, b));