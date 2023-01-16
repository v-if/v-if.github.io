var myBarChart;

$(window).ready(function (){

    const input1 = document.querySelector('#input1');
    input1.addEventListener('keyup', function(e) {
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)) {
            input1.value = 0;
        } else {
            const formatValue = value.toLocaleString('ko-KR');
            input1.value = formatValue;
        }
    });

    const input2 = document.querySelector('#input2');
    input2.addEventListener('keyup', function(e) {
        let value = e.target.value;
        if(value.substring(value.length-1, value.length) != '.') {
            value = Number(value);
            if(isNaN(value)) {
                input2.value = 0;
            } else {
                if(value > 100) {
                    input2.value = 100;
                } else {
                    value = Math.floor(value * 100) / 100;
                    input2.value = value;
                }
            }
        }
    });
});

function addAmount(num) {
    var value = $('#input1').val();
    value = Number(value.replaceAll(',', ''));
    if(isNaN(value)) {
        $('#input1').val(0);
    } else {
        value += num;
        const formatValue = value.toLocaleString('ko-KR');
        $('#input1').val(formatValue);
    }
}

function addRate(num) {
    var value = $('#input2').val();
    value = Number(value);
    if(isNaN(value)) {
        $('#input2').val(0);
    } else {
        value += num;
        if(value > 39) {
            $('#input2').val(39);
        } else {
            value = Math.floor(value * 100) / 100;
            $('#input2').val(value);
        }
    }
}

function calc() {
    var amount = $('#input1').val();
    var rates = Number($('#input2').val()) / 100;
    var method = Number($('#input5').val());
    amount = Number(amount.replaceAll(',', ''));

    $('#resultDashboard').show();
    var totalDividend = amount * rates;
    $('#resultAmt1').text(Math.round(totalDividend).toLocaleString('ko-KR') + "원");
    $('#resultAmt2').text(Math.round(totalDividend + amount).toLocaleString('ko-KR') + "원");

    setChart();
}

function init() {
    $('#input1').val(0);
    $('#input2').val(0);
    $('#input5').val("1");

    $('#resultAmt1').text("0원");
	$('#resultAmt2').text("0원");

    $('#resultChart').hide();
	$('#resultDashboard').hide();
}


// Chart Color

const red = ['rgba(255, 99, 132, 0.2)', 'rgb(255, 99, 132)'];
const orange = ['rgba(255, 159, 64, 0.2)', 'rgb(255, 159, 64)'];
const yellow = ['rgba(255, 205, 86, 0.2)', 'rgb(255, 205, 86)'];
const green = ['rgba(75, 192, 192, 0.2)', 'rgb(75, 192, 192)'];
const blue = ['rgba(54, 162, 235, 0.2)', 'rgb(54, 162, 235)'];
const purple = ['rgba(153, 102, 255, 0.2)', 'rgb(153, 102, 255)'];
const gray = ['rgba(201, 203, 207, 0.2)', 'rgb(201, 203, 207)'];



function setChart() {
    $('#resultChart').show();

    if(typeof myBarChart !== 'undefined')
        myBarChart.destroy();

    var amount = $('#input1').val();
    var rates = Number($('#input2').val()) / 100;
    var method = Number($('#input5').val());
    amount = Number(amount.replaceAll(',', ''));
    console.log(amount, rates, method);


    var calcMonth = 0;
    if(method == "1") 
        calcMonth = 12;
    else if(method == "3") 
        calcMonth = 4;
    else if(method == "6") 
        calcMonth = 2;
    else if(method == "12") 
        calcMonth = 1;

    var totalDividend = amount * rates;
    var div = totalDividend / calcMonth;

    console.log(totalDividend, div);


    var arrData = new Array();
    for(var i=0; i<12; i++) {

        var n = i+1;
        var amt = 0;
        if(n % method == 0) {
            amt = div
        }

        arrData[i] = {
            month : i+1,
            dividend : amt
        }

    }
    
    // Y축 MAX값 계산
    var maxYTicksLimit;

    // Bar Chart
    var ctx = document.getElementById("myBarChart");
    myBarChart = new Chart(ctx, {
        type: 'bar',
        showTooltips: false,
        data: {
            labels: arrData.map((obj, index) => { return obj.month + "M" }),
            datasets: [
                {
                    label: "배당금",
                    data: arrData.map((obj, index) => { return obj.dividend }),
                    backgroundColor: arrData.map((obj, index) => { return blue[0] }),
                    borderColor: arrData.map((obj, index) => { return blue[1] }),
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
                        maxTicksLimit: 12
                    },
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
                            return number_format(value);
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
                        return datasetLabel + ' ' + number_format(tooltipItem.yLabel);
                    }
                }
            },
        }
    });
}

function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}