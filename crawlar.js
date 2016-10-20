var https = require('https')
    ,request = require('request')
    ,cheerio = require('cheerio')
    ,path = require('path')
    ,fs = require('fs')
    ,$ = require('jquery')
    ,url = 'https://www.zhihu.com/question/35846840';

function filterHtml(html){
    var _ = cheerio.load(html);
    var noscriptImgs = _('.zm-item-rich-text img');

    // var clickMore = &('.zu-button-more');
   
    // clickMore.click(function(){
    //     console.log('click me');
    // });

    // clickMore.trigger('click');

    var imgData = [];
    noscriptImgs.each(function(){

        var noscriptImg = _(this);

        var imgsSrc = noscriptImg.attr('src');

        imgData.push(imgsSrc);
        
        return imgData;
    });

    var newArr = addHttpsForArray(imgData);
    // console.log(newArr);

    newArr.map(function(item){

        var filename = parseUrlForFileName(item);

        downloadImg(item,filename,function(err) {
            if(err){
                console.log(err);
            }
            console.log(filename + ' done');
        });    
    });
    
}

// 获取各个答案的答主名称并作为文件夹名
function createFileName(){

}

// 获取下载文件的时候的文件名
function parseUrlForFileName(address) {
    var filename = path.basename(address);
    return filename;
}

//给字符串增加https 
function addHttpsForString(string){
    if(string.indexOf('https') === -1 ){
        string = 'https' + string;
    }
    return string;
}

// 给数组增加https
function addHttpsForArray(arr){
    for( var i=0; i<arr.length; i++ ){
        if( arr[i].indexOf( "https" ) === -1 ) {
            arr[i] = "https:" + arr[i];
        }
    }
    return arr;
}

// 下载到本地制定images文件夹
function downloadImg(url, filename, callback){
    request.head(url, function(err, res, body){
        if (err) {
            console.log('err: '+ err);
            return false;
        }
        request(url)
            .pipe(fs.createWriteStream('images/'+filename))
            .on('close', callback);
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


