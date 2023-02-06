var myBarChart;
var myLineChart;

$(document).ready(function (){
    
    $('#dataTable').DataTable({
        searching: false, paging: false, info: false, ordering: false,
        columns: [
            { data: 'date' },
            { data: 'ticker' },
            { data: 'price' },
            { data: 'qty',
                render: function(data, type, row, meta) {
                    return Math.round(data).toLocaleString('ko-KR');
                }
            },
            { data: 'amount',
                render: function(data, type, row, meta) {
                    return '$' + Math.round(data).toLocaleString('ko-KR');
                }
            },
            { data: 'rate',
                render: function(data, type, row, meta) {
                    return Math.round(data).toLocaleString('ko-KR') + '%';
                }
            },
        ],
        columnDefs: [
            { className: "text-center", "targets": [0,1] },
            { className: "text-right", "targets": [2,3,4,5] }
        ],
        language: {
            paginate: {
                next: ">",
                previous: "<"
            },
            emptyTable: "처리중..."
        }
    });

    var jsonData = JSON.parse(JSON.stringify(data));
    for(i=0; i<jsonData.length; i++) {
        $('#input1').append('<option value="'+ jsonData[i].ticker +'">'+ jsonData[i].ticker + " - " + jsonData[i].name +'</option>');
    }
    $('#input1').change(function() {
        for(i=0; i<jsonData.length; i++) {
            if(jsonData[i].ticker == this.value) {
                console.log(jsonData[i].startDate);
                //$('#input2').val(jsonData[i].startDate);
                $("#input2").datepicker("update", jsonData[i].startDate);
                $('#input2').datepicker('updateDates');
            }
        }
    });


    $('#input2').datepicker({
        format: 'yyyy-mm-dd',
        daysOfWeekDisabled: [0, 6],
        autoclose: true,
        language: 'kr'
    });
    $('.prev i').removeClass();
    $('.prev i').addClass("fa fa-chevron-left");
    $('.next i').removeClass();
    $('.next i').addClass("fa fa-chevron-right");


    const input3 = document.querySelector('#input3');
    input3.addEventListener('keyup', function(e) {
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)) {
            input3.value = 0;
        } else {
            const formatValue = value.toLocaleString('ko-KR');
            input3.value = formatValue;
        }
    });

});

function addAmount(num) {
    var value = $('#input3').val();
    value = Number(value.replaceAll(',', ''));
    if(isNaN(value)) {
        $('#input3').val(0);
    } else {
        value += num;
        const formatValue = value.toLocaleString('ko-KR');
        $('#input3').val(formatValue);
    }
}

function valueCheck() {
    var ticker = $('#input1').val();
    var date = $('#input2').val();
    var amount = $('#input3').val();

    if(ticker == '') {
        $('#popupModalMsg').text("주식을 선택해주세요.");
        $('#popupModal').modal('show');
        return true;
    }

    if(date == '') {
        $('#popupModalMsg').text("일자를 입력해주세요.");
        $('#popupModal').modal('show');
        return true;
    }

    if(amount <= 0) {
        $('#popupModalMsg').text("투자금을 입력해주세요.");
        $('#popupModal').modal('show');
        return true;
    }

    return false;
}


function calc() {
    if(valueCheck())
        return;

    var ticker = $('#input1').val();
    var date = $('#input2').val();
    var amount = $('#input3').val();
    console.log(ticker, date, amount);

    tableClear();
    $('#resultTable').show();
    query('select * ', ticker, 'my_callback');

    //sendAjax();
}

function _calc() {
    var ticker = $('#input1').val();
    var date = $('#input2').val();
    var amount = $('#input3').val();
    console.log(ticker, date, amount);


    var jsonData
    if(ticker == 'AAPL')
        jsonData = JSON.parse(JSON.stringify(AAPL));
    else if(ticker == 'TSLA')
        jsonData = JSON.parse(JSON.stringify(TSLA));
    
    //console.log(jsonData);


    for(var i=0; i<jsonData.length; i++) {
        if(date == jsonData[i].date) {
            console.log(jsonData[i].date, jsonData[i].price);
            break;
        }
    }




    //query('select * limit 10', 'my_callback');
    //query('select * where A = 44937.66667 limit 20', 'my_callback');
}

function init() {
    $('#input1').val('AAPL');
    $('#input2').val('');
    $('#input3').val(0);


    $('#resultTable').hide();
    $('#resultChart').hide();
    $('#resultChart2').hide();

    tableClear();
}

function tableClear() {
    var table = $('#dataTable').DataTable();
    table.clear();
    table.rows.add( [] ).draw();

    if(typeof myBarChart !== 'undefined')
        myBarChart.destroy();

    if(typeof myLineChart !== 'undefined')
        myLineChart.destroy();
}

function sendAjax() {

    var sheet = $('#input1').val();
    var sql = 'select * ';
    var callback = 'my_callback';

    var url = 'https://spreadsheets.google.com/a/google.com/tq?',
        params = {
            sheet: sheet,
            key: '12NTj_4nSjyNbmv6kzRqQNLMBdvAlEosQD7fy4FbukN0',
            tq: encodeURIComponent(sql),
            tqx: 'responseHandler:' + callback
        },
        qs = [];
    for (var key in params)
    {
        qs.push(key + '=' + params[key]);
    }
    url += qs.join('&');
    console.log('sendAjax() ', url);

    $.ajax({
        url: url,
        type: "GET",
        dataType: 'jsonp'
    });
}


// https://coderwall.com/p/pluhsg/google-spreadsheet-json-api-sql-filtering
var query = function(sql, sheet, callback)
{
    var url = 'https://spreadsheets.google.com/a/google.com/tq?',
        params = {
            sheet: sheet,
            key: '12NTj_4nSjyNbmv6kzRqQNLMBdvAlEosQD7fy4FbukN0',
            tq: encodeURIComponent(sql),
            tqx: 'responseHandler:' + callback
        },
        qs = [];
    for (var key in params)
    {
        qs.push(key + '=' + params[key]);
    }
    url += qs.join('&');
    return jsonp(url); // Call JSONP helper function
}

var jsonp = function(url)
{
    var script = window.document.createElement('script');
    script.async = true;
    script.src = url;
    script.onerror = function()
    {
        alert('Can not access JSONP file.')
    };

    var done = false;
    script.onload = script.onreadystatechange = function()
    {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete'))
        {
            done = true;
            script.onload = script.onreadystatechange = null;
            if (script.parentNode)
            {
                return script.parentNode.removeChild(script);
            }
        }
    };
    window.document.getElementsByTagName('head')[0].appendChild(script);
};

var parse = function(data)
{
    var column_length = data.table.cols.length;
    if (!column_length || !data.table.rows.length)
    {
        return false;
    }
    var columns = [],
        result = [],
        row_length,
        value;
    for (var column_idx in data.table.cols)
    {
        columns.push(data.table.cols[column_idx].label);
    }
    for (var rows_idx in data.table.rows)
    {
        row_length = data.table.rows[rows_idx]['c'].length;
        if (column_length != row_length)
        {
            // Houston, we have a problem!
            return false;
        }
        for (var row_idx in data.table.rows[rows_idx]['c'])
        {
            if (!result[rows_idx])
            {
                result[rows_idx] = {};
            }
            value = !!data.table.rows[rows_idx]['c'][row_idx].v ? data.table.rows[rows_idx]['c'][row_idx].v : null;
            result[rows_idx][columns[row_idx]] = value;
        }
    }
    return result;
};

var my_callback = function(data)
{
    //console.log(data);
    data = parse(data); // Call data parser helper function
    //console.log(data);

    if(data.length > 0) {
        var showData = new Array();

        var ticker = $('#input1').val();
        var date = $('#input2').val();
        var amount = $('#input3').val();
        amount = Number(amount.replaceAll(',', ''));

        var firstData = data[0];
        var lastData = data[data.length-1];

        console.log('loaded', data.length, firstData.Date, lastData.Date);


        for(var i=0; i<data.length; i++) {
            var resDate = getDateFormat(data[i].Date);
            if(resDate == date) {
                showData[0] = {
                    date: resDate,
                    ticker: ticker,
                    price: '$' + number_format(data[i].Close, 2),
                    qty: Math.trunc(amount / data[i].Close),
                    amount: Math.trunc(data[i].Close * Math.trunc(amount / data[i].Close)),
                    rate: ''
                }

                // 초기 금액과 최종 금액을 저장할 변수 선언
                let initialAmount = data[i].Close;
                let finalAmount = lastData.Close;

                // 수익률 계산
                let rate = (finalAmount - initialAmount) / initialAmount * 100;

                showData[1] = {
                    date: getDateFormat(lastData.Date),
                    ticker: ticker,
                    price: '$' + number_format(lastData.Close, 2),
                    qty: showData[0].qty,
                    amount: Math.trunc(lastData.Close * showData[0].qty),
                    rate: rate
                }

                break;
            }
        }

        if(showData.length == 2) {
            console.log(firstData, lastData);

            var table = $('#dataTable').DataTable();
            table.clear();

            table.rows.add(showData).draw();
            
            setChart(showData);

            setAreaChart(data, showData);
        } else {
            $('#popupModalMsg').text("입력한 투자일자가 휴일이거나 가격정보가 없습니다. 입력한 종목의 가격정보는 " + getDateFormat(firstData.Date) + " 이후부터 있습니다.");
            $('#popupModal').modal('show');

            $('#resultChart').hide();
            tableClear();
        }
    }
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
    
    // Y축 MAX값 계산
    var maxYTicksLimit;

    // Bar Chart
    var ctx = document.getElementById("myBarChart");
    myBarChart = new Chart(ctx, {
        type: 'bar',
        showTooltips: false,
        data: {
            labels: arrData.map((obj, index) => { return obj.date }),
            datasets: [
                {
                    label: "평가금액",
                    data: arrData.map((obj, index) => { return obj.amount }),
                    backgroundColor: arrData.map((obj, index) => { return index % 2 == 0 ? blue[0] : green[0] }),
                    borderColor: arrData.map((obj, index) => { return index % 2 == 0 ? blue[1] : green[1] }),
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
                            //return '$' + number_format(value);
                            return '$' + nFormatter(value, 1);
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
                        //var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return '$' + number_format(tooltipItem.yLabel);
                    }
                }
            },
        }
    });
}

const CHART_LINE_COUNT = 100;

function setAreaChart(data, showData) {
    $('#resultChart2').show();

    if(typeof myLineChart !== 'undefined')
        myLineChart.destroy();

    //console.log(data, data.length, showData, showData.length);

    var warp = Math.trunc(data.length / CHART_LINE_COUNT);
    var drawIdx = data.length - (warp * CHART_LINE_COUNT);
    //console.log(warp, drawIdx);

    //var filteredData = data.filter((obj, index) => ((index+1)-drawIdx) % warp == 0);
    //console.log(filteredData);

    var arrData = new Array();
    var idx = 0;
    var isSkip = false;
    //var step = Math.ceil(drawIdx / 50);
    //console.log(step, Math.ceil(step));
    for(var i=0; i<CHART_LINE_COUNT+1; i++) {
        //console.log("i:"+i+", idx:"+idx, data[idx]);
        arrData[i] = data[idx];
        arrData[i].amount = Math.trunc(data[idx].Close * showData[0].qty);


        //console.log(getDateFormat(data[idx].Date), showData[0].date);

        if(!isSkip) {
            const dateA = new Date(getDateFormat(data[idx].Date));
            const dateB = new Date(showData[0].date);
            if(dateA >= dateB) {
                isSkip = true;
                arrData[i].flag = true;
            }
        }

        if(drawIdx-1 > i)
            idx += warp+1;
        else
            idx += warp;

        if(idx >= data.length)
            idx = data.length - 1;
        
    }
    //console.log(arrData);


    var ctx = document.getElementById("myAreaChart");
    myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: arrData.map((obj, index) => { return obj.flag ? getDateFormat(obj.Date)+'(투자시작)' : getDateFormat(obj.Date) }),
        datasets: [{
            label: "History",
            lineTension: 0.3,
            backgroundColor: green[0],
            borderColor: arrData.map((obj, index) => { return obj.flag ? red[1] : green[1] }),
            pointRadius: arrData.map((obj, index) => { return obj.flag ? 3 : 0 }),
            //pointRadius: 0, // disable for a single dataset
            pointBackgroundColor: arrData.map((obj, index) => { return obj.flag ? red[0] : green[0] }),
            pointBorderColor: arrData.map((obj, index) => { return obj.flag ? red[1] : green[1] }),
            pointHoverRadius: arrData.map((obj, index) => { return obj.flag ? 3 : 0 }),
            pointHoverBackgroundColor: arrData.map((obj, index) => { return obj.flag ? red[0] : green[0] }),
            pointHoverBorderColor: arrData.map((obj, index) => { return obj.flag ? red[1] : green[1] }),
            pointHitRadius: 10,
            pointBorderWidth: arrData.map((obj, index) => { return obj.flag ? 3 : 0 }),
            data: arrData.map((obj, index) => { return obj.amount }),
        }],
    },
    options: {
        datasets: {
            line: {
                pointRadius: 0 // disable for all `'line'` datasets
            }
        },
        elements: {
            point: {
                radius: 0 // default to disabled in all datasets
            }
        }, 
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
                time: {
                    unit: 'date'
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    maxTicksLimit: 7
                }
            }],
            yAxes: [{
                ticks: {
                    maxTicksLimit: 5,
                    padding: 10,
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        //return '$' + number_format(value);
                        return '$' + nFormatter(value, 1);
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
            display: false
        },
        tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: 'index',
            caretPadding: 10,
            callbacks: {
                label: function(tooltipItem, chart) {
                    //console.log(tooltipItem.yLabel, chart.datasets[tooltipItem.datasetIndex].data[0], tooltipItem, chart);
                    //var a = Number(tooltipItem.yLabel);
                    //var b = Number(showData[0].price);
                    //var c = Math.floor((((a) / b) - 1) * 100);


                    // 초기 금액과 최종 금액을 저장할 변수 선언
                    let initialAmount = Number(showData[0].price * showData[0].qty);
                    let finalAmount = Number(tooltipItem.yLabel);

                    // 수익률 계산
                    let rate = (finalAmount - initialAmount) / initialAmount * 100;

                    //console.log("수익률: " + rate + "%");


                    const dateA = new Date(tooltipItem.label);
                    const dateB = new Date(showData[0].date);
                    var isShow = false;
                    if(dateA >= dateB)
                        isShow = true;
                    else
                        isShow = false;

                    //console.log(tooltipItem.label, showData[0].date, isShow);

                    //console.log(a, b, c);
                    //var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                    return '$' + number_format(tooltipItem.yLabel) + (isShow == true ? " / " + number_format(rate) + '%' : '');
                }
            }
        }
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

function getDateFormat(date) {
    var temp = date;

    var temp2 = temp.substring(5, temp.length-1);

    var dateArr = temp2.split(',');

    var tempMonth = Number(dateArr[1]) + 1;
    var tempDay = Number(dateArr[2]);

    var resDate = dateArr[0] + '-' + (tempMonth >= 10 ? tempMonth : '0'+tempMonth) + '-' + (tempDay >= 10 ? tempDay : '0'+tempDay);

    return resDate;
}

function nFormatter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }
