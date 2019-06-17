import Network from "./network";
import {PostUrl, UploadUrl} from "../../utils/config";

export default class Protocol {

    static uploadGatheFile({filePath}) {
        return new Promise((resolve, reject) => {
            if (filePath) {
                wx.uploadFile({
                    url: PostUrl + 'gathe/upload',
                    filePath: filePath,
                    name: filePath,
                    // header: {"Content-Type": "multipart/form-data"},
                    formData: {
                        //和服务器约定的token, 一般也可以放在header中
                        // 'session_token': wx.getStorageSync('session_token')
                    },
                    success: function (res) {
                        let data = JSON.parse(res.data);
                        resolve(data);
                    },
                    fail: function (e) {
                        console.log(e);
                        reject();
                    }
                });
            }else{
                reject();
            }
        });
    };

    static getAccountInfo() {
        return Network.request({url: 'account/info'});
    }


    static postDeviceUnbind() {
        return Network.request({url: 'device/unbind'})
    }

    static getDeviceBindInfo() {
        return Network.request({url: 'device/bind/info'})
    }

}


