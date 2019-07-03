import UserInfo from "../../apis/network/network/libs/userInfo";

Page({
    data: {
        isGreen: true,
        result: {
            "time": "1560757586488",
            "pdfUrl": "http://backend.stage.hipee.cn/hipee-web-hiecg/pdf/264e949d6bfe4a6594233a3ef7512366.jpg",
            // "pdfUrl": "",
            "info": [
                {
                    "code": "HR",
                    "name": "心率",
                    "time": 60,
                    "status": 0
                },
                {
                    "code": "QRS",
                    "name": "QRS宽度",
                    "time": 79,
                    "status": 1
                },
                {
                    "code": "QTC",
                    "name": "QTC",
                    "time": 330,
                    "status": 1
                }
            ],
            "hr": 60
        }
    },

    lookDetail() {
        const pdfUrl = this.data.result.pdfUrl;
        if (pdfUrl) {
            this.app.$url.report.go({reportUrl: pdfUrl});
        }
    },

    getTime(timestamp) {
        const date = new Date(timestamp);
        console.log(timestamp, date);
        return `${date.getFullYear()}/${this.getTimeWithZero(date.getMonth() + 1)}/${this.getTimeWithZero(date.getDate())} ${this.getTimeWithZero(date.getHours())}:${this.getTimeWithZero(date.getMinutes())}`;
    },

    getTimeWithZero(num) {
        return ('0' + num).slice(-2);
    },

    onLoad(options) {
        UserInfo.get().then((res) => {
            this.setData({userInfo: res.userInfo});
        });
        // @ts-ignore
        wx.setNavigationBarColor({
            backgroundColor: this.data.isGreen ? '#00C6BC' : '#3A93EF', frontColor: '#ffffff', animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        });
    }
})
