var myBarChart;
var chartData = new Map();

$(document).ready(function (){
    var jsonData = JSON.parse(JSON.stringify(data));
    for(i=0; i<jsonData.length; i++) {
        $('#input2').append('<option value="'+ jsonData[i].data +'">'+ jsonData[i].no +'</option>');
    }

    $('#input2').on('change', function() {
        $('#input1').val(this.value);
    });


    // init
    for(var i=0; i<45; i++) {
        var key = i+1;
        var value = { num: i+1, count:0 };
        chartData.set(key, value);
    }
    console.log(chartData);
});

function calc() {
    $('#resultDashboard').hide();
    $('#resultAmt1').text('');

    var gameCnt = 10;
    var data = $('#input1').val(); // data
    console.log(data);
    var arrData = data.split(',');
    console.log(arrData.length);

    if(arrData.length == 45) {

        for(var i=0; i<gameCnt; i++) {
            var result = calcAnalytics(
                arrData, // arrData: 번호 통계 데이터
            );
            //console.log(result);

            for(var j=0; j<result.lotto.length; j++) {
                //console.log(result.lotto[j]);
                var key = result.lotto[j];
                var value = chartData.get(key);
                value.count += 1;
                chartData.set(key, value);
            }
        }
        //console.log(chartData);

        const tempData = [...chartData].map(([name, value]) => ({ value }));
        var drawingData = tempData.map((obj, index) => { return { num:obj.value.num, count:obj.value.count } });
        setChart(drawingData);
    }
}

function _calc() {
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
    $('#resultChart').hide();
	$('#resultDashboard').hide();
	$('#resultAmt1').text("");
    $('#input2').val("");
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


// Chart Color

const red = ['rgba(255, 99, 132, 0.2)', 'rgb(255, 99, 132)'];
const orange = ['rgba(255, 159, 64, 0.2)', 'rgb(255, 159, 64)'];
const yellow = ['rgba(255, 205, 86, 0.2)', 'rgb(255, 205, 86)'];
const green = ['rgba(75, 192, 192, 0.2)', 'rgb(75, 192, 192)'];
const blue = ['rgba(54, 162, 235, 0.2)', 'rgb(54, 162, 235)'];
const purple = ['rgba(153, 102, 255, 0.2)', 'rgb(153, 102, 255)'];
const gray = ['rgba(201, 203, 207, 0.2)', 'rgb(201, 203, 207)'];



function setChart(arrData) {
    $('#resultChart').show();

    if(typeof myBarChart !== 'undefined')
        myBarChart.destroy();

    console.log(arrData);


    var tempData = arrData.slice();
    let sortedByValueDsc = tempData.sort((a, b) => a.count - b.count).reverse();
    console.log(sortedByValueDsc);
    var topSixValue = sortedByValueDsc[5].count;
    console.log(topSixValue);
    var filteredData = sortedByValueDsc.filter((obj, index) => obj.count >= topSixValue);
    console.log(filteredData.length);

    if(filteredData.length == 6) {
        $('#resultDashboard').show();
        filteredData.sort((a, b) => a.num - b.num);
        $('#resultAmt1').text(filteredData.map((obj, index) => { return obj.num }));
    }
    
    // Y축 MAX값 계산
    var maxYTicksLimit;

    // Bar Chart
    var ctx = document.getElementById("myBarChart");
    myBarChart = new Chart(ctx, {
        type: 'bar',
        showTooltips: false,
        data: {
            labels: arrData.map((obj, index) => { return index+1 }),
            datasets: [
                {
                    label: "Count",
                    data: arrData.map((obj, index) => { return obj.count }),
                    backgroundColor: arrData.map((obj, index) => { return filteredData.length != 6 ? green[0] : Number(obj.count) >= Number(topSixValue) ? red[0] : green[0] }),
                    borderColor: arrData.map((obj, index) => { return filteredData.length != 6 ? green[1] : Number(obj.count) >= Number(topSixValue) ? red[1] : green[1] }),
                    borderWidth: 1,
                }
            ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    stacked: false,
                    display: true,
                    time: {
                        unit: 'year'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 6
                    },
                    maxBarThickness: 25,
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: maxYTicksLimit, //result.totalBalance,
                        maxTicksLimit: 6,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            //return number_format(value);
                            return value;
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }],
            },
            legend: {
                position: 'top'
            },
            tooltips: {
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                backgroundColor: "rgb(255,255,255)",
                bodyAlign: 'left',
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                callbacks: {
                    label: function(tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ' ' + tooltipItem.yLabel;
                    }
                }
            },
        }
    });
}
