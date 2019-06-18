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
    let dateT = date.getFullYear() + '年' + (month < 10 ? ('0' + month) : month) + '月' + (day < 10 ? ('0' + day) : day) + '日';
    let time = (hour < 10 ? ('0' + hour) : hour) + ':' + (minute < 10 ? ('0' + minute) : minute);
    return {date: dateT, time: time, day: day, month: month};
}

export function dealAuthUserInfo(e) {
    return new Promise((resolve, reject) => {
        Protocol.getNetworkType().then((res) => {
            if (res.networkType === 'none' || res.networkType === 'unknown') {
                WXDialog.showDialog({content: '请检查网络'});
                return;
            }
            const {
                detail: {
                    userInfo,
                    encryptedData,
                    iv
                }
            } = e;
            console.log(e);
            if (!!userInfo) {
                if (!!wx.getStorageSync('isRegister')) {
                    UserInfo.get().then(res=>{
                        resolve(res);
                    }).catch(res=>{
                        console.error('注册情况下获取用户信息失败',res);
                        reject(res);
                    })
                } else {
                    Toast.showLoading();
                    Login.doRegister({
                        encryptedData, iv
                    }).then(() => UserInfo.get())
                        .then((res) => {
                                console.log('获取到用户信息', res);
                                wx.setStorageSync('isRegister', this.data.isRegister = true);
                                resolve(res);
                            }
                        ).catch((res) => {
                        console.log(res);
                        reject(res);
                    }).finally(() => {
                        Toast.hiddenLoading();
                    });
                }

            } else {
                WXDialog.showDialog({content: '因您拒绝授权，无法使用更多专业服务', showCancel: false});
                reject();
            }
        });
    });
}
