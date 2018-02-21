**Step 5-2: 세브란스 병원 FAQ 웹 크롤링**
===
---
### 1. 개발 환경 설정
크롤링에 필요한 모듈을 설치해주세요.
~~~
$npm init
$npm install request
$npm install cheerio
~~~
<br>
### 2. 웹 크롤러 작성

2.1. 인코딩과 uri 옵션을 설정해주세요.
~~~
var options = {
  encoding: "UTF-8",
  uri: 'http://sev.iseverance.com/health/health_reserve/faq/?page='+page_num
}
~~~
<br>
2.2. 목차 안에 있는 글들의 URL을 추출하는 작업을 합니다.

![img2_2](https://user-images.githubusercontent.com/28593546/36489564-b4c940b8-1769-11e8-92be-3334b9ba2a60.JPG)<br>
bbslist2 태그를 받아와서 tr이 하나의 글을 의미합니다.
td 태그 다음의 href에서 url을 받아옵니다.
유효하지 않는 URL을 필터링하는 작업도 해줍니다.
~~~
request(options, function(error, response, html){
  if (error) {throw error};

  var $ = cheerio.load(html);

  $('.bbslist2 tr').each(function() {
    var $table1 = $(this);
    $table1.find("td").next().text();

    // # URL
    $table_url_temp = $table1.next().find('a').attr('href');

    // 찾지못한 url은 배제
    if(typeof $table_url_temp != "undefined"){  
      $table_url_fin = $table_url_temp;
    }
~~~
<br>
2.3. 각 URL에 맞는 제목, 내용, URL을 클래스 이름과 ID로 구분해 가져옵니다.

![img2_3](https://user-images.githubusercontent.com/28593546/36489624-e2809c2c-1769-11e8-9664-8b31b3b46f08.JPG)<br>

내용은 bbsview_content 클래스 이름의 태그 안에서 가져오고

제목은 title_date 클래스 이름의 태그 안에 있는 h4 태그에서 추출합니다.

~~~
var table_url = 'http://sev.iseverance.com/health/health_reserve/faq/' + $table_url_fin;

var options2 = {
  encoding: "UTF-8",
  uri: 'http://sev.iseverance.com/health/health_reserve/faq/' + $table_url_fin
}

request(options2, function(error, response, html){
  if (error) {throw error};

  var $ = cheerio.load(html);

  // # 제목
  $table_content_title = $(".title_date").find('h4').text();

  // # 내용
  $table_content = $(".bbsview_content").text();

~~~

<br>
2.4. FAQ의 제목, 내용, URL을 텍스트 파일로 한행씩 출력해줍니다.

추후 FAQ 정보 DB 테이블의 id자리를 남기기 위해 임의의 열 구분자 '!'를 추가합니다.

id자리 공백, 제목, 내용, URL 순서로 한 행씩 묶어 추출합니다.

~~~
console.log("!"+$table_content_title+"!"+$table_content +"!"+ table_url);
~~~
<br>

### 3. 데이터 저장

텍스트 파일로 저장을 합니다.
~~~
$node faq_cr.js > text.txt
~~~

### 4. 데이터 정제
','는 나중에 csv파일로 변환될때 열 구분자가 됩니다.
따라서 ','문자는 '¸'으로 치환하고
열을 구분하기 위해 임의로 설정한 '!'문자는 ',' 으로 치환해줍니다.

### 5. csv 파일로 변환

.csv 확장자로 저장하되 반드시 UTF-8 형식으로 저장해주어야 합니다.
