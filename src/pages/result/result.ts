import {pagify, MyPage} from 'base/'
// @ts-ignore
import UserInfo from '../../apis/network/userInfo';
@pagify()
export default class extends MyPage {
    data = {
        result: {
            // "time": "1560757586488",
            // "pdfUrl": "http://backend.stage.hipee.cn/hipee-web-hiecg/pdf/264e949d6bfe4a6594233a3ef7512366.jpg",
            // "info": [
            //     {
            //         "code": "HR",
            //         "name": "心率",
            //         "time": 60,
            //         "status": 0
            //     },
            //     {
            //         "code": "QRS",
            //         "name": "QRS宽度",
            //         "time": 79,
            //         "status": 1
            //     },
            //     {
            //         "code": "QTC",
            //         "name": "QTC",
            //         "time": 330,
            //         "status": 1
            //     }
            // ],
            // "hr": 60
        }
    };

    lookDetail() {
        const pdfUrl = this.data.result.pdfUrl;
        if (pdfUrl) {
            this.app.$url.report.go({reportUrl: pdfUrl});
        }
    }

    getTime(timestamp:number) {
        const date = new Date(timestamp);
        console.log(timestamp,date);
        return `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + (date.getDate())).slice(-2)} ${date.getHours()}:${date.getMinutes()}`;

    }
    async onLoad(options: any) {
        UserInfo.get().then((res: any) => {
            this.setData({userInfo: res.userInfo});
        });
        console.log('接收到的结果',options);
        const result = options.gatheResult;
        // const result = this.data.result;
        result.time = this.getTime(parseInt(result.time));
        this.setData({result});
        // const {info} = this.data.result;

    }
}
