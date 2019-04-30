var fs = require('fs');
var iconv = require('iconv-lite');
console.log(process.env)

fs.readFile(process.argv[1].replace('addMenu.js','')+'../page.json', function (err, data) {
    if (err){
  	    console.log(err)
  	    //throw err
    };
    var strr = iconv.decode(data,'utf-8');
    console.log(strr)
})
/*var path = {}
process.argv.slice(2).map(item => {
	if(item.indexOf('=')>-1){
		path[item.split('=')[0]] = item.split('=')[1];
		return '';
	}
})
console.log(path)*/