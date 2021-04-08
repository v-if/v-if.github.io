
function createTable(coinData) {
    console.log('coinName:'+coinData.name+", market.length:"+coinData.market.length)

    var headTitle = ['Country', 'Market', 'Price', 'Diff', 'DateTime'];
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    tbl.className = "styled-table";

    var coinTitle = document.createElement('div');
    coinTitle.appendChild(document.createTextNode(coinData.name))

    // head
    var thead = document.createElement('thead');
    for (var i = 0; i < 1; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < headTitle.length; j++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(headTitle[j]))
            i == 1 && j == 1 ? td.setAttribute('rowSpan', '2') : null;
            tr.appendChild(td)
        }
        thead.appendChild(tr);
    }
    tbl.appendChild(thead);

    // body
    var tbdy = document.createElement('tbody');
    for (var i = 0; i < coinData.market.length; i++)  {
        if(coinData.market[i].name == "Upbit") {
            getPriceUpbit(coinData.market[i].ticker);
        }
        if(coinData.market[i].name == "Coinbase") {
            getPriceCoinbase(coinData.market[i].ticker);
        }
        if(coinData.market[i].name == "Binance") {
            getPriceBinance(coinData.market[i].ticker);
        }

        var tr = document.createElement('tr');
        for (var j = 0; j < headTitle.length; j++) {
            var td = document.createElement('td');
            var content = "";
            if(j == 0) {
                content = coinData.market[i].country;
                var img = document.createElement('img');
                img.src = getCountryImage(coinData.market[i].country);
                td.appendChild(img);
            } else if(j == 1) {
                content = coinData.market[i].name;
            }

            td.setAttribute("id", coinData.name +"-"+coinData.market[i].name +"-"+ headTitle[j]);
            td.appendChild(document.createTextNode(content == "" ? '\u0020':content));
            //i == 1 && j == 1 ? td.setAttribute('rowSpan', '2') : null;
            tr.appendChild(td)
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(coinTitle);
    body.appendChild(tbl)
}

function setUI(jsonData) {
    console.log('coin.length:'+jsonData.coin.length);
    for(var i=0; i<jsonData.coin.length; i++) {
        createTable(jsonData.coin[i]);
    }
}

function getPriceUpbit(ticker) {

    // upbit
    $.ajax({
        method: "GET",
        url: "https://api.upbit.com/v1/ticker",
        data: { markets: ticker }
    })
    .done(function( response ) {
        //console.log('%o', response);
        if(response.length > 0) {
            if(response[0].market == "KRW-BTC") {
                var d = new Date(response[0].trade_date_kst + " " + response[0].trade_time_kst);
                $('#Bitcoin-Upbit-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(response[0].trade_price));
                $('#Bitcoin-Upbit-DateTime').text(response[0].trade_date_kst.substring(0,4) + "-" + response[0].trade_date_kst.substring(4,6) + "-" + response[0].trade_date_kst.substring(6,8) + " " + response[0].trade_time_kst.substring(0,2) + ":" + response[0].trade_time_kst.substring(2,4) + ":" + response[0].trade_time_kst.substring(4,6));
            }
            if(response[0].market == "KRW-ETH") {
                $('#Ethereim-Upbit-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(response[0].trade_price));
                $('#Ethereim-Upbit-DateTime').text(response[0].trade_date_kst.substring(0,4) + "-" + response[0].trade_date_kst.substring(4,6) + "-" + response[0].trade_date_kst.substring(6,8) + " " + response[0].trade_time_kst.substring(0,2) + ":" + response[0].trade_time_kst.substring(2,4) + ":" + response[0].trade_time_kst.substring(4,6));
            }
        }
    });
}

function getPriceCoinbase(ticker) {

    // coinbase
    $.ajax({
        method: "GET",
        url: "https://api.coinbase.com/v2/prices/"+ticker+"/buy"
    })
    .done(function( response ) {
        //console.log('%o', response);
        var KRWUSD = 1118.30;
        if(response.data.base == "BTC") {
            $('#Bitcoin-Coinbase-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(response.data.amount) * KRWUSD)+"("+new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(response.data.amount)+")");
            $('#Bitcoin-Coinbase-DateTime').text(getDateTime());
        }
        if(response.data.base == "ETH") {
            $('#Ethereim-Coinbase-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(response.data.amount) * KRWUSD)+"("+new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(response.data.amount)+")");
            $('#Ethereim-Coinbase-DateTime').text(getDateTime());
        }
    });
}

function getPriceBinance(ticker) {

    // Binance
    $.ajax({
        method: "GET",
        url: "https://api.binance.com/api/v3/ticker/price",
        data: { symbol: ticker }
    })
    .done(function( response ) {
        //console.log('%o', response);
        var KRWUSD = 1118.30;
        if(response.symbol == "BTCTUSD") {
            $('#Bitcoin-Binance-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(response.price) * KRWUSD)+"("+new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(response.price)+")");
            $('#Bitcoin-Binance-DateTime').text(getDateTime());
        }
        if(response.symbol == "ETHTUSD") {
            $('#Ethereim-Binance-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(response.price) * KRWUSD)+"("+new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(response.price)+")");
            $('#Ethereim-Binance-DateTime').text(getDateTime());
        }
    });
}

function getCountryImage(country) {
    var imageName = "image/" + country + ".png";
    return imageName;
}

function getDateTime() {
    Date.prototype.format = function() {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
        var hh = this.getHours();
        var mi = this.getMinutes();
        var ss = this.getSeconds();

        return [this.getFullYear(),'-',
            (mm>9 ? '' : '0') + mm,'-',
            (dd>9 ? '' : '0') + dd,' ',
            (hh>9 ? '' : '0') + hh,':',
            (mi>9 ? '' : '0') + mi,':',
            (ss>9 ? '' : '0') + ss
        ].join('');
    };

    var date = new Date();
    return date.format();
}

$(document).ready(function() {

    //const data = '{"coin":[{"name":"Bitcoin","market":[{"name":"Upbit","ticker":"KRW-BTC","country":"Korea"},{"name":"Coinbase","ticker":"BTC-USD","country":"USA"}]},{"name":"Ethereim","market":[{"name":"Upbit","ticker":"KRW-ETH","country":"Korea"},{"name":"Coinbase","ticker":"ETH-USD","country":"USA"}]}]}';
    const data = '{"coin":[{"name":"Bitcoin","market":[{"name":"Upbit","ticker":"KRW-BTC","country":"Korea"},{"name":"Coinbase","ticker":"BTC-USD","country":"USA"},{"name":"Binance","ticker":"BTCTUSD","country":"China"}]},{"name":"Ethereim","market":[{"name":"Upbit","ticker":"KRW-ETH","country":"Korea"},{"name":"Coinbase","ticker":"ETH-USD","country":"USA"},{"name":"Binance","ticker":"ETHTUSD","country":"China"}]}]}';
    const jsonData = JSON.parse(data);

    setUI(jsonData);

});
