var https = require('https')
    ,request = require('request')
    ,cheerio = require('cheerio')
    ,path = require('path')
    ,fs = require('fs')
    ,url = 'https://www.zhihu.com/question/35846840';

function filterHtml(html){
    var $ = cheerio.load(html);
    var noscriptImgs = $('noscript img');
    var imgData = [];
    noscriptImgs.each(function(item){
        var noscriptImg = $(this);
        var imgsSrc = noscriptImg.attr('src');
        // console.log(imgsSrc);
        var filename = parseUrlForFileName(imgsSrc);
        downloadImg(imgsSrc,filename,function(err) {
            if(err){
                console.log(err);
            }
            console.log(filename + ' done');
        });

        imgData.push(imgsSrc);
        return imgData;
    });
    console.log(imgData);
}

function parseUrlForFileName(address) {
    var filename = path.basename(address);
    return filename;
}

function downloadImg(url, filename, callback){
    request.head(url, function(err, res, body){
        if (err) {
            console.log('err: '+ err);
            return false;
        }
        request(url).pipe(fs.createWriteStream('images/'+filename)).on('close', callback);
    });
};

https.get(url,function(res){
    var html = '';
    res.on('data',function(data){
        html += data;
    });
    res.on('end',function(){
        filterHtml(html);
    });
}).on('error',function(){
    console.log('Error');
});