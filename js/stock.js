var myBarChart;

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
            { data: 'rate' },
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
        $('#input1').append('<option value="'+ jsonData[i].ticker +'">'+ jsonData[i].ticker +'</option>');
    }


    $('#input2').datepicker({
        format: 'yyyy-mm-dd',
        daysOfWeekDisabled: [0, 6],
        autoclose: true,
        language: 'kr',
        templates : {
            leftArrow: '<i class="fa fa-long-arrow-left"></i>',
            rightArrow: '<i class="fa fa-long-arrow-right"></i>'
        },
    });


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
    var date = $('#input2').val();
    var amount = $('#input3').val();

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

    /*
    var ticker = $('#input1').val();
    var date = $('#input2').val();
    var amount = $('#input3').val();
    console.log(ticker, date, amount);

    tableClear();
    $('#resultTable').show();
    console.log('## 1');
    query('select * ', ticker, 'my_callback');
    */

    sendAjax();
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

    tableClear();
}

function tableClear() {
    var table = $('#dataTable').DataTable();
    table.clear();
    table.rows.add( [] ).draw();

    if(typeof myBarChart !== 'undefined')
        myBarChart.destroy();
}

function sendAjax() {

    var sheet = $('#input1').val();
    var sql = 'select * ';
    var callback = 'my_callback';

    var url = 'http://spreadsheets.google.com/a/google.com/tq?',
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
    var url = 'http://spreadsheets.google.com/a/google.com/tq?',
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
    console.log('## 2', url);
    return jsonp(url); // Call JSONP helper function
}

var jsonp = function(url)
{
    console.log('## 3');
    var script = window.document.createElement('script');
    console.log('## 3-1');
    script.async = true;
    console.log('## 3-2');
    script.src = url;
    console.log('## 3-3');
    script.onerror = function()
    {
        console.log('## 3-3 111');
        alert('Can not access JSONP file.')
    };
    console.log('## 3-5');

    var done = false;
    console.log('## 3-6');
    script.onload = script.onreadystatechange = function()
    {
        console.log('## 3-6 111');
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete'))
        {
            console.log('## 3-6 222');
            done = true;
            console.log('## 3-6 333');
            script.onload = script.onreadystatechange = null;
            console.log('## 3-6 444');
            if (script.parentNode)
            {
                console.log('## 3-6 555');
                return script.parentNode.removeChild(script);
            }
        }
    };
    console.log('## 3-7');
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
                    price: data[i].Close,
                    qty: Math.trunc(amount / data[i].Close),
                    amount: Math.trunc(data[i].Close * Math.trunc(amount / data[i].Close)),
                    rate: ''
                }

                showData[1] = {
                    date: getDateFormat(lastData.Date),
                    ticker: ticker,
                    price: lastData.Close,
                    qty: showData[0].qty,
                    amount: Math.trunc(lastData.Close * showData[0].qty),
                    rate: Math.floor((((Math.trunc(lastData.Close * showData[0].qty)) / showData[0].amount) - 1) * 100) + "%"
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
                        //var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return '$' + number_format(tooltipItem.yLabel);
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

function getDateFormat(date) {
    var temp = date;

    var temp2 = temp.substring(5, temp.length-1);

    var dateArr = temp2.split(',');

    var tempMonth = Number(dateArr[1]) + 1;
    var tempDay = Number(dateArr[2]);

    var resDate = dateArr[0] + '-' + (tempMonth >= 10 ? tempMonth : '0'+tempMonth) + '-' + (tempDay >= 10 ? tempDay : '0'+tempDay);

    return resDate;
}