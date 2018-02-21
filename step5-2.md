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

### 2. 웹 크롤러 작성

2.1. 인코딩과 uri 옵션을 설정해주세요.
~~~
var options = {
  encoding: "UTF-8",
  uri: 'http://sev.iseverance.com/health/health_reserve/faq/?page='+page_num
}
~~~

2.2. 목차 안에 있는 글들의 URL을 추출하는 작업을 합니다.

![1](/image/pic2_2.JPEG)<br>
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

2.3. 제목, 내용, URL을 클래스 이름과 ID로 구분해 가져옵니다.

![2](/image/pic2_3.JPEG)<br>

예를 들어 효능효과의 경우, 효능효과 제목 다음의 태그가 실질적인 내용을 담고 있기 때문에, next()로 다음 태그를 접근해줍니다.

추후 약 정보 DB 테이블의 id자리를 남기기 위해 임의의 열 구분자 '!'를 추가합니다.

id자리 공백, 약 이름, Tolerance, 효능효과, 용법, 주의사항, 글URL, 이미지URL 순서로 한 행씩 묶어 추출합니다.



~~~
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
  
  // # 제목
  $table_content_title = $(".title_date").find('h4').text();
  console.log("!"+$table_content_title+"!"+$table_content +"!"+ table_url); // 한행에 title, content, url 찍기.


});

~~~

### 3. 데이터 저장
10페이지씩 나눠 text1~text10까지 텍스트 파일로 저장합니다.
그 다음 10개의 텍스트파일을 하나로 합칩니다.
~~~
$node medicine_cr.js > text1.txt
.
.
.
$node medicine_cr.js > text10.txt

$type text*.txt > text_total.txt
~~~

### 4. 데이터 정제
','는 나중에 csv파일로 변환될때 열 구분자가 됩니다.
따라서 ','문자는 '¸'으로 치환하고
열을 구분하기 위해 임의로 설정한 '!'문자는 ',' 으로 치환해줍니다.

### 5. csv 파일로 변환
![4](/image/pic5.JPEG)<br>

.csv 확장자로 저장하되 반드시 UTF-8 형식으로 저장해주어야 합니다.
