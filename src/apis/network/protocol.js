import Network from "./network";
import WXDialog from "../../base/heheda-common-view/dialog";
import BaseNetworkImp from "./network/libs/base/base-network-imp";
import {PostUrl, UploadUrl} from "../../utils/config";

export default class Protocol {
    static getNetworkType() {
        return new Promise((resolve, reject) => {
            wx.getNetworkType({
                success:resolve,
                fail: reject
            });
        });

    }

    static checkHaveNetwork() {
        return this.getNetworkType().then(res=>{
            console.log('当前网络状态',res);
            if (res.networkType === 'none' || res.networkType === 'unknown') {
                return Promise.reject();
            }else{
                return Promise.resolve();
            }
        })
    }
    static uploadGatherFile({filePath}) {
        return new Promise((resolve, reject) => {
            if (filePath) {
                wx.uploadFile({
                    url: PostUrl + 'gather/upload',
                    filePath: filePath,
                    name: filePath,
                    header: {"Cookie": `JSESSIONID=${wx.getStorageSync('cookie')}`},
                    formData: {
                        //和服务器约定的token, 一般也可以放在header中
                        // 'session_token': wx.getStorageSync('session_token')
                    },
                    success: function (res) {
                        console.log('上传成功的文件',res);
                        let data = JSON.parse(res.data);
                        resolve(data);
                    },
                    fail: function (e) {
                        console.log('上传失败', e);
                        reject();
                    }
                });
            } else {
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

    static getHistoryList({page, page_size = 15}) {
        return Network.request({url: 'gather/list', data: {page, page_size}})
    }

    static accountUpdate({nickname, sex, phone, birthday, height, weight}) {
        return Network.request({url: 'account/update', data: arguments[0]});
    }

    static getPhoneNum({encryptedData, iv}) {
        return new Promise((resolve, reject) =>
            this.wxLogin().then(res => {
                const {code} = res;
                return BaseNetworkImp.request({
                    url: 'account/getphoneNum',
                    data: {code, encrypted_data: encryptedData, iv},
                    requestWithoutLogin: true
                })
            }).then(data => {
                resolve(data.result.phoneNumber);
            }).catch(res => {
                console.log('getPhoneNum failed:', res);
                reject(res);
            })
        )
    }

    static wxReLogin(resolve, reject) {
        wx.login({
            success: resolve, fail: res => {
                WXDialog.showDialog({
                    title: '糟糕', content: '抱歉，目前小程序无法登录，请稍后重试', confirmEvent: () => {
                        this.wxReLogin(resolve, reject);
                    }
                });
                console.log('wx login failed', res);
            }
        })
    }

    static wxLogin() {
        return new Promise((resolve, reject) =>
            this.wxReLogin(resolve, reject)
        );
    }
}


