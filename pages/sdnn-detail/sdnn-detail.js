// pages/AvgHR/AvgHR.js
Page({

    data: {
        lineColor: [
            {color: '#4BABEA', text: '严重心动过缓'},
            {color: '#5ACD4E', text: '心动过缓'},
            {color: '#FDC400', text: '正常'},
            {color: '#FC7648', text: '轻度心动过速'},
            {color: '#EF3A59', text: '心动过速'}
        ],
        lineNum: [50, 60, 90, 100]
    },
    onLoad(res) {

    }
});
