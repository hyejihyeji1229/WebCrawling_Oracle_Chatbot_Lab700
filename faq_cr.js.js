//BY HYEJI 세브란스 병원 건강검진 FAQ 웹 크롤링

var cheerio = require('cheerio');
var request = require('request');
var client = require('cheerio-httpcli');


var page_num = 1;

var $table_title ='';
var $table_url_fin = '';
var $table_content = '';


//for(page_num=1;page_num<=2;page_num++) 문을 사용해 페이지를 싹 다 긁어올 수 있습니다. 
var options = {
  encoding: "UTF-8",
  uri: 'http://sev.iseverance.com/health/health_reserve/faq/?page='+page_num
}


request(options, function(error, response, html){
  if (error) {throw error};

  var $ = cheerio.load(html);


  
  $('.bbslist2 tr').each(function() {
    var $table1 = $(this);
    $table1.find("td").next().text();

    // #1 제목
    $table_title = $table1.next().text();
    //console.log($table_title + "!");

    // #2 URL 
    $table_url_temp = $table1.next().find('a').attr('href');
    
    // 찾지못한 url은 배제
    if(typeof $table_url_temp != "undefined"){  
      $table_url_fin = $table_url_temp;
    }
    

    var table_url = 'http://sev.iseverance.com/health/health_reserve/faq/' + $table_url_fin;
    
    
    var options2 = {
      encoding: "UTF-8",
      uri: 'http://sev.iseverance.com/health/health_reserve/faq/' + $table_url_fin
    }
    
    request(options2, function(error, response, html){
      if (error) {throw error};
    
      var $ = cheerio.load(html);

      // # 내용
      $table_content = $(".bbsview_content").text();
      $table_content_title = $(".title_date").find('h4').text();
      //$content_string.val().replaceWith(/\r/g, " "); //엔터 제거<-실패
      console.log($table_content_title+"!"+$table_content +"!"+ table_url); // 한행에 title, content, url 찍기.


    });


  });


});
