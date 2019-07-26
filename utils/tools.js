import WXDialog from "../base/heheda-common-view/dialog";
import Toast from "../base/heheda-common-view/toast";
import Login from "../apis/network/login";
import {UserInfo} from "../apis/network/network/index";
import Protocol from "../apis/network/protocol";

export function createDateAndTime(timeStamp) {
    let date = new Date(timeStamp);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let dateT = date.getFullYear() + '/' + (month < 10 ? ('0' + month) : month) + '/' + (day < 10 ? ('0' + day) : day) + '';
    let time = (hour < 10 ? ('0' + hour) : hour) + ':' + (minute < 10 ? ('0' + minute) : minute);
    return {date: dateT, time: time, day: day, month: month};
}

export function getFormatDate(timestamp) {
    const date = new Date(timestamp);
    return {
        year: date.getFullYear(),
        month: ('0' + (date.getMonth() + 1)).slice(-2),
        day: ('0' + date.getDate()).slice(-2)
    };
}

export function dealAuthUserInfo(e) {
    return new Promise((resolve, reject) => {
        Protocol.getNetworkType().then((res) => {
            if (res.networkType === 'none' || res.networkType === 'unknown') {
                WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
                return;
            }
            const {
                detail: {
                    userInfo,
                    encryptedData,
                    iv
                }
            } = e;
            console.log('dealAuthUserInfo 用户信息', e);
            if (!!userInfo) {
                // if (!!wx.getStorageSync('isRegister')) {
                //     UserInfo.get().then(res=>{
                //         resolve(res);
                //     }).catch(res=>{
                //         console.error('注册情况下获取用户信息失败',res);
                //         reject(res);
                //     })
                // } else {
                Toast.showLoading();
                Login.doRegister({
                    encryptedData, iv
                }).then(() => UserInfo.get())
                    .then((res) => {
                            console.log('获取到用户信息', res);
                            wx.setStorageSync('isRegister', true);
                            resolve(res);
                        }
                    ).catch((res) => {
                    console.log(res);
                    reject(res);
                }).finally(() => {
                    Toast.hiddenLoading();
                });
                // }

            } else {
                WXDialog.showDialog({content: '因您拒绝授权，无法使用更多专业服务', showCancel: false});
                reject();
            }
        });
    });
}


export class MyUsed {
   static isFirstUsed() {
        return !wx.getStorageSync('isUsed');
    }
    static setUsed() {
        wx.setStorageSync('isUsed', true);
    }
}
