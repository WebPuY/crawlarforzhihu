// var fs = require('fs');
// var path = require('path');
// var request = require('request');
var Promise = require('Promise');
var http = require('http');
var cheerio = require('cheerio');
var url = 'http://www.imooc.com/learn/348';

function filterHtml(html){
    var $ = cheerio.load(html);
    var chapters = $('.chapter');
    // console.log(chapters)
    var courseData = [];
    chapters.each(function(item){
        var chapter = $(this);
        var chapterTitle = chapter.find('strong').text();
        var videos = chapter.find('.video').children('li');
        var chapterData = {
            chapterTitle:chapterTitle,
            videos:[]
        }
        
        videos.each(function(item){
            var video = $(this).find('a');
            var videoTitle = video.text();
            var id = video.attr('href').split('video/')[1];

            chapterData.videos.push({
                title:videoTitle,
                id:id
            });
        });

        courseData.push(chapterData);

    });

    return courseData;
}

function printCourseData(courseData){
    courseData.forEach(function(item){
        var chapterTitle = item.chapterTitle;

        console.log(chapterTitle + '\n');

        item.videos.forEach(function(video){
            console.log('[' + video.id + ']' + video.title + '\n');
        });
    });
}

http.get(url,function(res){
    var html = '';
    res.on('data',function(data){
        html += data;
    });
    res.on('end',function(){
        var courseData = filterHtml(html);
        printCourseData(courseData);
    });
}).on('error',function(){
    console.log('Error');
});