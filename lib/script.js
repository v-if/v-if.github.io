const KRWUSD = 1118.30;
var priceData = [[0, 0, 0], [0, 0, 0]];

function sortPriceData() {
    console.log('sortPriceData');
    var lowestBTC = 0;
    var lowestETH = 0;

    for(var i=0; i<priceData.length; i++) {
        for(var j=0; j<priceData[i].length; j++) {
            if(i == 0) {
                // BTC
                if(j == 0) {
                    lowestBTC = priceData[i][j];
                } else {
                    if(lowestBTC > priceData[i][j]) {
                        lowestBTC = priceData[i][j];
                    }
                }
            } else if(i == 1) {
                // ETH
                if(j == 0) {
                    lowestETH = priceData[i][j];
                } else {
                    if(lowestETH > priceData[i][j]) {
                        lowestETH = priceData[i][j];
                    }
                }
            }
        }
    }
    console.log("lowestBTC:"+lowestBTC)
    console.log("lowestETH:"+lowestETH)

    for(var i=0; i<priceData.length; i++) {
        for(var j=0; j<priceData[i].length; j++) {
            if(i == 0) {
                // BTC
                var diff = (priceData[i][j] / lowestBTC - 1) * 100;
                if(j == 0) {
                    $('#Bitcoin-Upbit-Korea-Premium').text(diff.toFixed(2) + "%");
                } else if(j == 1) {
                    $('#Bitcoin-Coinbase-Korea-Premium').text(diff.toFixed(2) + "%");
                } else if(j == 2) {
                    $('#Bitcoin-Binance-Korea-Premium').text(diff.toFixed(2) + "%");
                }
            } else if(i == 1) {
                // ETH
                var diff = (priceData[i][j] / lowestETH - 1) * 100;
                if(j == 0) {
                    $('#Ethereim-Upbit-Korea-Premium').text(diff.toFixed(2) + "%");
                } else if(j == 1) {
                    $('#Ethereim-Coinbase-Korea-Premium').text(diff.toFixed(2) + "%");
                } else if(j == 2) {
                    $('#Ethereim-Binance-Korea-Premium').text(diff.toFixed(2) + "%");
                }
            }
        }
    }
}

function setPriceData(coin, market, price) {
    if(coin == "BTC") {
        if(market == "Upbit") {
            priceData[0][0] = parseInt(price);
        } else if(market == "Coinbase") {
            priceData[0][1] = parseInt(price);
        } else if(market == "Binance") {
            priceData[0][2] = parseInt(price);
        }
    } else if(coin == "ETH") {
        if(market == "Upbit") {
            priceData[1][0] = parseInt(price);
        } else if(market == "Coinbase") {
            priceData[1][1] = parseInt(price);
        } else if(market == "Binance") {
            priceData[1][2] = parseInt(price);
        }
    }
    console.log('%o', priceData);

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
                setPriceData("BTC", "Upbit", response[0].trade_price);
            }
            if(response[0].market == "KRW-ETH") {
                $('#Ethereim-Upbit-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(response[0].trade_price));
                $('#Ethereim-Upbit-DateTime').text(response[0].trade_date_kst.substring(0,4) + "-" + response[0].trade_date_kst.substring(4,6) + "-" + response[0].trade_date_kst.substring(6,8) + " " + response[0].trade_time_kst.substring(0,2) + ":" + response[0].trade_time_kst.substring(2,4) + ":" + response[0].trade_time_kst.substring(4,6));
                setPriceData("ETH", "Upbit", response[0].trade_price);
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
        if(response.data.base == "BTC") {
            $('#Bitcoin-Coinbase-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(response.data.amount) * KRWUSD)+"("+new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(response.data.amount)+")");
            $('#Bitcoin-Coinbase-DateTime').text(getDateTime());
            setPriceData("BTC", "Coinbase", Number(response.data.amount) * KRWUSD);
        }
        if(response.data.base == "ETH") {
            $('#Ethereim-Coinbase-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(response.data.amount) * KRWUSD)+"("+new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(response.data.amount)+")");
            $('#Ethereim-Coinbase-DateTime').text(getDateTime());
            setPriceData("ETH", "Coinbase", Number(response.data.amount) * KRWUSD);
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
        if(response.symbol == "BTCTUSD") {
            $('#Bitcoin-Binance-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(response.price) * KRWUSD)+"("+new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(response.price)+")");
            $('#Bitcoin-Binance-DateTime').text(getDateTime());
            setPriceData("BTC", "Binance", Number(response.price) * KRWUSD);
        }
        if(response.symbol == "ETHTUSD") {
            $('#Ethereim-Binance-Price').text(new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(response.price) * KRWUSD)+"("+new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(response.price)+")");
            $('#Ethereim-Binance-DateTime').text(getDateTime());
            setPriceData("ETH", "Binance", Number(response.price) * KRWUSD);
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
