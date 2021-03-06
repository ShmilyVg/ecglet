import WXDialog from "../base/heheda-common-view/dialog";
import Toast from "../base/heheda-common-view/toast";
import Login from "../apis/network/login";
import {UserInfo} from "../apis/network/network/index";
import Protocol from "../apis/network/protocol";
import HiNavigator from "../components/navigator/hi-navigator";

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

// 根据出生日期算出年龄
export function jsGetAge(strBirthday) {
    let returnAge;
    let strBirthdayArr = strBirthday.split("-");
    let birthYear = strBirthdayArr[0];
    let birthMonth = strBirthdayArr[1];
    let birthDay = strBirthdayArr[2];

    let d = new Date();
    let nowYear = d.getFullYear();
    let nowMonth = d.getMonth() + 1;
    let nowDay = d.getDate();

    if (nowYear === birthYear) {
        returnAge = 0;//同年 则为0岁
    } else {
        let ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
            if (nowMonth === birthMonth) {
                let dayDiff = nowDay - birthDay;//日之差
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            } else {
                let monthDiff = nowMonth - birthMonth;//月之差
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            }
        } else {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }
    return returnAge;//返回周岁年龄
}

export function HandleShortName(name) {
    let nickName = name;
    if (name.length > 8) {
        nickName = name.slice(0, 7) + '…';
    }
    return nickName;
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

export function dealRegister() {
    return new Promise(async (resolve) => {
        try {
            await Protocol.checkHaveNetwork();
            const {userInfo} = await UserInfo.get();
            const {isNeedRegister} = getApp().judgeNeedRegister({userInfo});
            if (!isNeedRegister) {
                resolve();
            } else {
                HiNavigator.navigateToWelcome();
            }
        } catch (e) {
            console.warn('进入页面失败', e);
            WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
        }

    });
}


export class MyUsed {
    static isFirstUsed() {
        return !wx.getStorageSync('isUsed');
    }

    static setUsed() {
        wx.setStorageSync('isUsed', true);
    }

    static initUsed() {
        wx.setStorageSync('isUsed', false);
    }
}

export function reLoginWithoutLogin() {
    const app = getApp();
    const {query} = app.globalData.options;
    if (query.withoutLogin || query.isGetUserInfo) {
        query.withoutLogin = false;
        query.isGetUserInfo = 0;
        app.doLogin();
    }
}

export function userInfoEmptyTip({nickName, phone, birthday, height, weight}) {
    let res = false;
    if (!nickName || nickName.length === 0) {
        Toast.showText('请填写完整信息');
    } else if (!phone || phone.length !== 11) {
        if (!phone || phone.length === 0) {
            Toast.showText('请填写手机号');
        } else if (!phone || phone.length > 0) {
            Toast.showText('手机号格式错误');
        }
    } else if (!/^\d+$/.test(phone)) {
        Toast.showText('手机号格式错误');
    } else if (!birthday || birthday === '请选择出生日期' || birthday === "") {
        Toast.showText('请选择出生日期');
    } else if (!height || !height.trim()) {
        Toast.showText('请填写身高');
    } else if (!weight || !weight.trim()) {
        Toast.showText('请填写体重');
    } else {
        res = true
    }
    return res;
}
