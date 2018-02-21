//BY HYEJI 네이버 지식백과 약 정보 크롤링

var cheerio = require('cheerio');
var request = require('request');
var Hangultest = require('../../MyDoctor-Chatbot/hangultest.js');

//var page_num = 1; //1-100


for(var page_num=91; page_num<=100; page_num++){

var options = {
  encoding: "UTF-8",
  uri: 'http://terms.naver.com/medicineSearch.nhn?page=' + page_num
}


request(options, function(error, response, html){
  if (error) {throw error};

  var $ = cheerio.load(html);


  //List 태그를 받아와서 li 를 기준으로 반복해서 크롤링 작업을 합니다.
  $('.content_list li').each(function() {
    var $table_url_temp = $(this).find(".info_area").find('a').attr('href');
    var $table_url = 'http://terms.naver.com/' + $table_url_temp; //목차에 있는 항목들의 각 링크들을 추출합니다.
    
    
    var options2 = {
      encoding: "UTF-8",
      uri: $table_url
    }
    
    request(options2, function(error, response, html){
      if (error) {throw error};
    

      var $ = cheerio.load(html);
      var $drug_name = $(".headword").text();
      var $drug_efficacy = $("#TABLE_OF_CONTENT4").next().text();
      var $howtouse = $("#TABLE_OF_CONTENT5").next().text();
      var $precaution = $("#TABLE_OF_CONTENT6").next().text();
      var $url = $table_url;
      var $img_url = $('.img_box').find('img').attr('data-src');
      var $synonyms = Hangultest.hanguler($drug_name);

      //id자리 공백, 약이름, Tolerance, 효능효과, 용법, 주의사항, 글url, 이미지url 순서로 한 행씩 묶어 추출합니다.
      //이때 '!'는 텍스트 파일에서 정제시 ','로 치환해줘야 열 별로 나눌 수 있게 됩니다.
      console.log("!"+$drug_name+"!"+$synonyms+"!"+$drug_efficacy+"!"+$howtouse+"!"+$precaution+"!"+$url+"!"+$img_url);



    });

    


  });


});


}


