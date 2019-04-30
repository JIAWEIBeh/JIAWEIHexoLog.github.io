var fs = require('fs');
var iconv = require('iconv-lite');
const script = process.argv[1].replace('create.js','');
/*console.log(process.argv)
var path = {}
process.argv.slice(2).map(item => {
	if(item.indexOf('=')>-1){
		path[item.split('=')[0]] = item.split('=')[1];
		return '';
	}
})
console.log(path)*/

const contentName = process.argv.slice(2)[0];

function randId(){
	return Math.random().toString(36).substring(2);
}


fs.readFile(script+'../page.json', function (err, data) {
    if (err){
  	    console.log(err)
  	    //throw err
    };
    var strr = iconv.decode(data,'utf-8');
    var datas = JSON.parse(strr);
    var randIds = randId();
    if(!datas){
    	datas = {};
    }
    if(datas&&!datas.contentList){
    	datas.contentList = [];
    }
    datas.contentList.push({"sort":randIds,"name":contentName,"contentUrl":"text/"+randIds+".md"})

    fs.writeFile(script+'../page.json', JSON.stringify(datas), function (err) {
	    if (err) throw err;
	    console.log('写入完成'+contentName);
	    fs.writeFile(script+'../text/'+randIds+'.md', '', function (err) {
		    if (err) throw err;
		    console.log('写入完成'+randIds);
	    });
    });
});

