const KRWUSD = 1118.30;
var coins;
var markets;
var priceData;

function sortPriceData() {
    //console.log('sortPriceData');
    var lowestPrice = new Array(coins.length);

    for(var i=0; i<priceData.length; i++) {
        for(var j=0; j<priceData[i].length; j++) {
            if(j == 0) {
                lowestPrice[i] = priceData[i][j];
            } else {
                if(lowestPrice[i] > priceData[i][j]) {
                    lowestPrice[i] = priceData[i][j];
                }
            }
        }
    }
    //console.log("lowestPrice:%o",lowestPrice);

    for(var i=0; i<priceData.length; i++) {
        for(var j=0; j<priceData[i].length; j++) {
            var diff = (priceData[i][j] / lowestPrice[i] - 1) * 100;
            $('#'+markets[i][j]+'-'+coins[i]+'-Korea-Premium').text(diff.toFixed(2) + "%");
        }
    }
}

function setPriceData(coin, market, price) {
    for(var i=0; i<coins.length; i++) {
        if(coins[i] == coin) {
            for(var j=0; j<markets[i].length; j++) {
                if(markets[i][j] == market) {
                    priceData[i][j] = parseInt(price);
                }
            }
        }
    }
    //console.log('priceData:%o', priceData);

    var sortFlag = false;
    for(var i=0; i<priceData.length; i++) {
        for(var j=0; j<priceData[i].length; j++) {
            if(priceData[i][j] == 0) {
                sortFlag = false;
                break;
            }
            sortFlag = true;
        }
    }
    if(sortFlag) {
        sortPriceData();
    }
}

function createTable(coinData) {
    console.log('coinName:'+coinData.name+", market.length:"+coinData.market.length)

    var headTitle = ['Country', 'Market', 'Price', 'Korea-Premium', 'DateTime'];
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
            //i == 1 && j == 1 ? td.setAttribute('rowSpan', '2') : null;
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

            td.setAttribute("id", coinData.market[i].name +"-"+ coinData.name +"-"+ headTitle[j]);
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
            var coin = response[0].market.substring(4,7);
            //console.log('coin:'+coin);
            $('#Upbit-'+coin+'-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(response[0].trade_price));
            $('#Upbit-'+coin+'-DateTime').text(response[0].trade_date_kst.substring(0,4) + "-" + response[0].trade_date_kst.substring(4,6) + "-" + response[0].trade_date_kst.substring(6,8) + " " + response[0].trade_time_kst.substring(0,2) + ":" + response[0].trade_time_kst.substring(2,4) + ":" + response[0].trade_time_kst.substring(4,6));
            setPriceData(coin, "Upbit", response[0].trade_price);
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
        var coin = response.data.base;
        //console.log('coin:'+coin);
        $('#Coinbase-'+coin+'-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(response.data.amount) * KRWUSD)+"("+new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(response.data.amount)+")");
        $('#Coinbase-'+coin+'-DateTime').text(getDateTime());
        setPriceData(coin, "Coinbase", Number(response.data.amount) * KRWUSD);
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
        var coin = response.symbol.substring(0,3);
        //console.log('coin:'+coin);
        $('#Binance-'+coin+'-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(response.price) * KRWUSD)+"("+new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(response.price)+")");
        $('#Binance-'+coin+'-DateTime').text(getDateTime());
        setPriceData(coin, "Binance", Number(response.price) * KRWUSD);
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

    const data = '{"coin":[{"name":"BTC","market":[{"name":"Upbit","ticker":"KRW-BTC","country":"Korea"},{"name":"Coinbase","ticker":"BTC-USD","country":"USA"},{"name":"Binance","ticker":"BTCTUSD","country":"China"}]},{"name":"ETH","market":[{"name":"Upbit","ticker":"KRW-ETH","country":"Korea"},{"name":"Coinbase","ticker":"ETH-USD","country":"USA"},{"name":"Binance","ticker":"ETHTUSD","country":"China"}]},{"name":"XRP","market":[{"name":"Upbit","ticker":"KRW-XRP","country":"Korea"},{"name":"Binance","ticker":"XRPTUSD","country":"China"}]},{"name":"LTC","market":[{"name":"Upbit","ticker":"KRW-LTC","country":"Korea"},{"name":"Coinbase","ticker":"LTC-USD","country":"USA"},{"name":"Binance","ticker":"LTCTUSD","country":"China"}]},{"name":"ADA","market":[{"name":"Upbit","ticker":"KRW-ADA","country":"Korea"},{"name":"Coinbase","ticker":"ADA-USD","country":"USA"},{"name":"Binance","ticker":"ADATUSD","country":"China"}]}]}';
    const jsonData = JSON.parse(data);

    // init
    priceData = new Array(jsonData.coin.length);
    coins = new Array(jsonData.coin.length);
    markets = new Array(jsonData.coin.length);
    for(var i=0; i<jsonData.coin.length; i++) {
        priceData[i] = new Array(jsonData.coin[i].market.length);
        coins[i] = jsonData.coin[i].name;
        markets[i] = new Array(jsonData.coin[i].market.length);
        for(var j=0; j<jsonData.coin[i].market.length; j++) {
            markets[i][j] = jsonData.coin[i].market[j].name;
        }
    }
    console.log('%o', priceData);
    console.log('%o', coins);
    console.log('%o', markets);

    setUI(jsonData);

});
