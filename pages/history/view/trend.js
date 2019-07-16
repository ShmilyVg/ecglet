let charts = require('wxcharts.js');

let _page = null;
let _data = null;
let lineChart = null;
let index = 0;
let dataList = [];


function init(page) {
    _page = page;
    _data = page.data;
    normalTrend();
}

function initTouchHandler() {
    _page.touchHandler = function (e) {
        lineChart.scrollStart(e);
    };

    _page.moveHandler = function (e) {
        if (e) {
            lineChart.scroll(e);
        }
    };

    _page.touchEndHandler = function (e) {
        lineChart.scrollEnd(e);
        lineChart.showToolTip(e, {
            format: function (item) {
                return item.data
            }
        });
    };
}

function normalTrend() {
    let windowWidth = 370;
    let windowHeight = 200;
    try {
        let res = wx.getSystemInfoSync();
        windowWidth = 370 * res.windowWidth / 375;
        windowHeight = 200 * windowWidth / 370;
    } catch (e) {
        // do something when get system info failed
    }
    lineChart = new charts({
        canvasId: 'lineCanvas',
        type: 'area',
        lineStyle: 'curve',
        categories: ['2012', '2013', '2014', '2015', '2016', '2017','2012', '2013', '2014', '2015', '2016', '2017'],
        series: [{
            name: '成交量1',
            type: 'calibration',
            data: [0.15, 0.2, 0.45, 0.37, 0.4, 0.8,0.15, 0.2, 0.45, 0.37, 0.4, 0.8],
            format: function (val) {
                return val.toFixed(2) + '万';
            }
        }],
        legend: false,
        yAxis: {
            format: function (val) {
                return val.toFixed(2);
            },
            min: 0,
            fontColor: '#AABAC1'
        },
        xAxis: {
            fontColor: '#AABAC1',
        },
        width: windowWidth,
        height: windowHeight,
        enableScroll: true,
        dataLabel: false,
        haveNum: true,
        yAxisSplit: 5
    });
}

module.exports = {
    init: init,
    initTouchHandler: initTouchHandler
};