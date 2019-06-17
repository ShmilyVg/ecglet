import {pagify, MyPage} from 'base/'

@pagify()
export default class extends MyPage {
    data = {
        result: {
            "time": "1560757586488",
            "pdfUrl": "http://localhost:8091/hipee-web-hiecg/pdf/fc2415a80c9c46b491b4af2bc1f76b4a.jpg",
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
    }

    lookDetail() {
        const pdfUrl = this.data.result.pdfUrl;
        if (pdfUrl) {
            this.app.$url.report.go({reportUrl: pdfUrl});
        }
    }

    async onLoad(options: any) {
        // const {info} = this.data.result;

    }
}
