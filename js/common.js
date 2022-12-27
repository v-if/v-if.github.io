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

    const input4 = document.querySelector('#input4');
    input4.addEventListener('keyup', function(e) {
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)) {
            input4.value = 0;
        } else {
            if(value > 36) {
                input4.value = 36;
            } else {
                input4.value = value;
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

function addGracePeriod(num) {
    var value = $('#input4').val();
    value = Number(value);
    if (isNaN(value)) {
        $('#input4').val(0);
    } else {
        value += num;
        if (value > 36) {
            $('#input4').val(36);
        } else {
            $('#input4').val(value);
        }
    }
}

function calc() {
    var loanMoney = $('#input1').val();
    var rates = Number($('#input2').val()) / 100;
    var loansDate =Number($('#input3').val());
    var period = Number($('#input4').val());
    var method = Number($('#input5').val());
    loanMoney = Number(loanMoney.replaceAll(',', ''));

    var result = calcLoanInterest(
        method, // method: 상환방법 (0: 원리금 균등 상환, 1: 원금 균등 상환);
        loanMoney, // loanMoney: 원금
        rates, // rates: 이자율
        loansDate, // loanDate: 납입기간(월)
        period, // period: 거치기간(월)
    );

    var table = $('#dataTable').DataTable();
    table.clear();
    table.rows.add( result.monthly ).draw();
}

function init() {
    $('#input1').val(0);
    $('#input2').val(0);
    $('#input3').val(0);
    $('#input4').val(0);
    $('#input5').val(0);

    var table = $('#dataTable').DataTable();
    table.clear();
    table.rows.add( [] ).draw();
}


/**
 * @param {number} method 상환방법 (0: 원리금 균등 상환, 1: 원금 균등 상환);
 * @param {number} loanMoney 원금;
 * @param {number} rates 이자율;
 * @param {number} loansDate 납입기간(월);
 * @param {number} period 거치기간(월);
 */
function calcLoanInterest(method, loanMoney, rates, loansDate, period) {
    var CALC_LOAN_INTEREST_TYPES = {
        0: '원리금 균등 상환',
        1: '원금 균등 상환'
    };
    var __spreadArray = (this && this.__spreadArray) || function (to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    };

    var _a, _b;
    var obj = {
        method: CALC_LOAN_INTEREST_TYPES[method],
        loanMoney: loanMoney,
        rates: rates,
        loansDate: loansDate,
        monthly: [],
        totalInterest: undefined,
        totalRepay: undefined
    };
    // 원리금균등
    if (method === 0) {
        obj.monthly = __spreadArray([], Array(loansDate)).reduce(function (a, _, i) {
            var _a, _b;
            var interest = ((_a = a[i - 1]) === null || _a === void 0 ? void 0 : _a.balance) * (rates / 12) || loanMoney * (rates / 12); // 대출 이자
            var repayment = period && period >= i + 1
                ? interest
                : (loanMoney * (rates / 12) * Math.pow((1 + rates / 12), (loansDate - (period !== null && period !== void 0 ? period : 0)))) /
                (Math.pow((1 + rates / 12), (loansDate - (period !== null && period !== void 0 ? period : 0))) - 1); // 월상환금
            var payment = period && period >= i + 1 ? 0 : repayment - interest; // 납입원금
            var balance = (((_b = a[i - 1]) === null || _b === void 0 ? void 0 : _b.balance) || loanMoney) - repayment + interest; // 대출잔금
            var result = {
                round: i + 1,
                payment: payment,
                interest: interest,
                repayment: repayment,
                balance: balance > 0 ? balance : 0
            };
            return __spreadArray(__spreadArray([], a), [result]);
        }, []);
    }
    // 원금균등
    if (method === 1) {
        obj.monthly = __spreadArray([], Array(loansDate)).reduce(function (a, _, i) {
            var _a, _b, _c;
            var interest = ((_b = (_a = a[i - 1]) === null || _a === void 0 ? void 0 : _a.balance) !== null && _b !== void 0 ? _b : loanMoney) * (rates / 12); // 대출 이자
            var payment = period && period >= i + 1 ? 0 : loanMoney / (loansDate - (period !== null && period !== void 0 ? period : 0)); // 납입원금
            var repayment = payment + interest; // 월상환금1
            var balance = (((_c = a[i - 1]) === null || _c === void 0 ? void 0 : _c.balance) || loanMoney) - repayment + interest; // 대출잔금
            var result = {
                round: i + 1,
                payment: payment,
                interest: interest,
                repayment: repayment,
                balance: balance > 0 ? balance : 0
            };
            return __spreadArray(__spreadArray([], a), [result]);
        }, []);
    }
    obj.totalInterest = (_a = obj.monthly) === null || _a === void 0 ? void 0 : _a.reduce(function (a, c) { return a + c.interest || 0; }, 0); // 총대출이자
    obj.totalRepay = (_b = obj.monthly) === null || _b === void 0 ? void 0 : _b.reduce(function (a, c) { return a + c.repayment || 0; }, 0); // 총상환금액
    return obj;
}
