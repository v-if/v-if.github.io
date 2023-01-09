var myBarChart;

$(window).ready(function (){
    // for test
    $('#input1').val('146,141,140,140,139,133,138,136,113,140,143,154,149,150,144,138,151,155,138,147,141,121,125,139,134,140,151,126,133,124,141,120,145,161,134,142,146,137,150,145,131,138,147,141,147');
    //$('#input1').val('1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1');
});

function calc() {
    var gameCnt = 1000;
    var data = $('#input1').val(); // data
    console.log(data);
    var arrData = data.split(',');
    console.log(arrData.length);

    if(arrData.length == 45) {

        var resultMap = new Map();

        for(var i=0; i<gameCnt; i++) {
            var result = calcAnalytics(
                arrData, // arrData: 번호 통계 데이터
            );
            //console.log(result);

            var key = result.lotto.toString();
            if(resultMap.has(key)) {
                var cnt = resultMap.get(key);
                resultMap.set(key, cnt+1);
                console.log('!!!', key);
            } else {
                resultMap.set(key, 1);
            }
        }
        //console.log(resultMap);
        let sortedByValueDsc = [...resultMap].sort((a, b) => a[1] - b[1]).reverse();
        //console.log(sortedByValueDsc);
        var filteredData = sortedByValueDsc.filter((obj, index) => obj[1] > 1);
        console.log(filteredData);
        

        if(filteredData.length > 0) {
            var numberText = '';
            for(var i=0; i<filteredData.length; i++) {
                if(numberText == '')
                    numberText += filteredData[i][0];
                else
                    numberText += '\n' + filteredData[i][0];
            }
            $('#resultDashboard').show();
            $('#resultAmt1').text(numberText);
        } else {
            $('#resultDashboard').show();
            var tempText = $('#resultAmt1').text();
            if(tempText == '')
                tempText = '다시';
            else
                tempText += '.';
            $('#resultAmt1').text(tempText);
        }
    }
}

function init() {
    $('#input1').val('');

    clear();
}

function shuffle(array) {
    for (let index=array.length-1; index>0; index--) {
      // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
      const randomPosition = Math.floor(Math.random() * (index + 1));
  
      // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
      const temporary = array[index];
      array[index] = array[randomPosition];
      array[randomPosition] = temporary;
    }
    return array;
}

function _shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function clear() {
	$('#resultDashboard').hide();
	$('#resultAmt1').text("");
}


/**
 * @param {number} arrData 번호 통계 데이터;
 */
function calcAnalytics(arrData) {
    //console.log(arrData);


    // 공 나열하기
    var index = 0;
    var displayBall = 1;
    var balls = new Array();
    for(var i=0; i<arrData.length; i++) {
        for(var j=0; j<arrData[i]; j++) {
            balls[index++] = displayBall;

            if(j == Number(arrData[i])-1) 
                displayBall++;
        }
    }
    //console.log(balls);


    // 5~10회 중 랜덤으로 뽑힌 횟수만큼 shuffle(섞기) 진행
    var min = 5;
    var max = 10;
    var shuffleCnt = (Math.random() * (max - min)) + min;
    shuffleCnt = Math.ceil(shuffleCnt);
    //console.log('shuffleCnt:'+shuffleCnt);

    for(var i=0; i<shuffleCnt; i++) {
        balls = shuffle(balls);
        //console.log(balls);
    }


    var result = new Array();

    // 공 6개 뽑기
    for(var i=0; i<6; i++) {
        var lottoMin = 0;
        var lottoMax = balls.length;
        var ballIdx = (Math.random() * (lottoMax - lottoMin)) + lottoMin;
        ballIdx = Math.trunc(ballIdx);
        var ballNum = balls[ballIdx];
        //console.log(balls);
        //console.log(lottoMin, lottoMax, ballIdx, ballNum);


        // 뽑은 공 저장
        result[i] = Number(ballNum);


        // 뽑힌 공은 array에서 제거
        var temp = new Array();
        var tempIdx = 0;
        for(var j=0; j<balls.length; j++) {
            if(ballNum != balls[j])
                temp[tempIdx++] = balls[j];
        }
        //console.log(temp);
        balls = temp;
    }

    //console.log(result);

    var obj = {
        lotto: result.sort(function(a, b){return a-b})
    };
    
    return obj;
}
