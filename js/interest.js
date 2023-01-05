$(window).ready(function (){
    $('#dataTable').DataTable({
        searching: false, paging: false, info: false, ordering: false,
        columns: [
        { data: 'round' },
        { data: 'payment',
            render: function(data, type, row, meta) {
            return Math.round(data).toLocaleString('ko-KR');
            }
        },
        { data: 'interest',
            render: function(data, type, row, meta) {
            return Math.round(data).toLocaleString('ko-KR');
            }
        },
        { data: 'balance',
            render: function(data, type, row, meta) {
            return Math.round(data).toLocaleString('ko-KR');
            }
        }
        ],
        columnDefs: [
        { className: "text-center", "targets": [0] },
        { className: "text-right", "targets": [1,2,3] }
        ],
        language: {
        paginate: {
            next: ">",
            previous: "<"
        }
        }
    });

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
                if(value > 39) {
                    input2.value = 39;
                } else {
                    value = Math.floor(value * 100) / 100;
                    input2.value = value;
                }
            }
        }
    });

    const input3 = document.querySelector('#input3');
    input3.addEventListener('keyup', function(e) {
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)) {
            input3.value = 0;
        } else {
            if(value > 360) {
                input3.value = 360;
            } else {
                input3.value = value;
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

function addLoanPeriod(num) {
    var value = $('#input3').val();
    value = Number(value);
    if (isNaN(value)) {
        $('#input3').val(0);
    } else {
        value += num;
        if (value > 360) {
            $('#input3').val(360);
        } else {
            $('#input3').val(value);
        }
   }
}

function calc() {
    clear();

    var method = $("input[name='input4']:checked").val();; // 이자계산방식 (0: 단리, 1: 월복리);
    var monthAmt = $('#input1').val(); // 월정립액
    var yearRate = Number($('#input2').val()) / 100; // 연이자율
    var savingsMonth =Number($('#input3').val()); // 적립기간(개월)
    monthAmt = Number(monthAmt.replaceAll(',', ''));

    var result = calcInterest(
        method, // method: 이자계산방식 (0: 단리, 1: 월복리);
        monthAmt, // monthAmt: 월정립액
        yearRate, // yearRate: 연이자율
        savingsMonth, // savingsMonth: 적립기간(개월)
    );
    //console.log(result);

    var filteredData = result.monthly.filter((obj, index) => (index+1) % 12 == 0);
    //console.log(filteredData);

    var table = $('#dataTable').DataTable();
    table.clear();

	if(result.monthly.length > 0) {
		$('#resultDashboard').show();
        $('#resultChart').show();
        $('#resultTable').show();
		$('#resultAmt1').text(Math.round(result.totalPayment).toLocaleString('ko-KR') + "원");
		$('#resultAmt2').text(Math.round(result.totalInterest).toLocaleString('ko-KR') + "원");
		$('#resultAmt3').text(Math.round(result.totalBalance).toLocaleString('ko-KR') + "원");

        setChart(result);

        table.rows.add(filteredData).draw();
	}
}

function init() {
    $('#input1').val(0);
    $('#input2').val(0);
    $('#input3').val(0);

    clear();
}

function clear() {
    var table = $('#dataTable').DataTable();
    table.clear();
    table.rows.add( [] ).draw();

	$('#resultDashboard').hide();
    $('#resultChart').hide();
    $('#resultTable').hide();
	$('#resultAmt1').text("0원");
	$('#resultAmt2').text("0원");
	$('#resultAmt3').text("0원");

    if(typeof myBarChart !== 'undefined')
        myBarChart.destroy();
}


/**
 * @param {number} method 이자계산방식 (0: 단리, 1: 월복리);
 * @param {number} monthAmt 월정립액;
 * @param {number} yearRate 연이자율;
 * @param {number} savingsMonth 적립기간(개월);
 */
function calcInterest(method, monthAmt, yearRate, savingsMonth) {
    var CALC_TYPES = {
        0: '단리',
        1: '월복리'
    };
    var __spreadArray = (this && this.__spreadArray) || function (to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    };
    console.log(method, monthAmt, yearRate, savingsMonth);

    var _a, _b, _c;
    var obj = {
        method: CALC_TYPES[method],
        monthAmt: monthAmt,
        yearRate: yearRate,
        savingsMonth: savingsMonth,
        monthly: [],
        totalPayment: undefined,
        totalInterest: undefined,
        totalBalance: undefined
    };
    var nowYear = new Date().getFullYear();

    // 단리
    if (method === '0') {
        obj.monthly = __spreadArray([], Array(savingsMonth)).reduce(function (a, _, i) {
            var payment = ((a[i - 1]) === null || (a[i - 1]) === void 0 ? 0 : a[i - 1].payment) + monthAmt;
            var interest = ((monthAmt) * (yearRate / 12)) + (((a[i - 1]) === null || (a[i - 1]) === void 0 ? 0 : a[i - 1].payment) * (yearRate / 12)) + ((a[i - 1]) === null || (a[i - 1]) === void 0 ? 0 : a[i - 1].interest); // 대출 이자
            var balance = payment + interest;
            var result = {
                round: (i+1) == 0 ? nowYear : (i+1)%12 == 0 ? nowYear++ : nowYear,
                payment: payment, // 원금합계
                interest: interest, // 이자
                balance: balance // 수령액
            };
            return __spreadArray(__spreadArray([], a), [result]);
        }, []);
    }
    // 월복리
    if (method === '1') {
        obj.monthly = __spreadArray([], Array(savingsMonth)).reduce(function (a, _, i) {
            var payment = ((a[i - 1]) === null || (a[i - 1]) === void 0 ? 0 : a[i - 1].payment) + monthAmt;
            var interest = ((monthAmt) * (yearRate / 12)) + (((a[i - 1]) === null || (a[i - 1]) === void 0 ? 0 : a[i - 1].balance) * (yearRate / 12)) + ((a[i - 1]) === null || (a[i - 1]) === void 0 ? 0 : a[i - 1].interest); // 대출 이자
            var balance = payment + interest;
            var result = {
                round: (i+1) == 0 ? nowYear : (i+1)%12 == 0 ? nowYear++ : nowYear,
                payment: payment, // 원금합계
                interest: interest, // 이자
                balance: balance // 수령액
            };
            return __spreadArray(__spreadArray([], a), [result]);
        }, []);
    }
    console.log(obj);
    obj.totalPayment = (_a = obj.monthly) === null || _a === void 0 ? void 0 : _a[_a.length-1].payment; // 원금합계
    obj.totalInterest = (_b = obj.monthly) === null || _b === void 0 ? void 0 : _b[_b.length-1].interest; // 세후이자
    obj.totalBalance = (_c = obj.monthly) === null || _c === void 0 ? void 0 : _c[_c.length-1].balance; // 만기지급액
    
    return obj;
}
var myBarChart;
function setChart(result) {

    var filteredData = result.monthly.filter((obj, index) => (index+1) % 12 == 0);

    // Bar Chart
    var ctx = document.getElementById("myBarChart");
    myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: filteredData.map(obj => { return obj.round }),
            datasets: [
                {
                    label: "Amount",
                    backgroundColor: "#4e73df",
                    hoverBackgroundColor: "#2e59d9",
                    borderColor: "#4e73df",
                    data: filteredData.map(obj => { return obj.payment }),
                },
                {
                    label: "Interest",
                    backgroundColor: "#008d93",
                    hoverBackgroundColor: "#008d93",
                    borderColor: "#008d93",
                    data: filteredData.map(obj => { return obj.interest }),
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
                    stacked: true,
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
                        min: 0,
                        max: result.totalBalance,
                        maxTicksLimit: 10,
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
                        return datasetLabel + number_format(tooltipItem.yLabel);
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