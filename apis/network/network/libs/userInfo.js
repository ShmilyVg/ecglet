import CommonProtocol from "./protocol";

export default class UserInfo {
    static get() {
        return new Promise((resolve, reject) => {
            const globalData = getApp().globalData;
            let localUserInfoInMemory = globalData.userInfo;
            if (!!localUserInfoInMemory && !!localUserInfoInMemory.memberId) {
                resolve({userInfo: localUserInfoInMemory});
                return;
            }
            wx.getStorage({
                key: 'userInfo', success: res => {
                    resolve({userInfo: globalData.userInfo = {...res.data}});
                }, fail: () => {
                    this._postGetUserInfo({resolve, reject});
                }
            });
        });
    }

    static set({nickName, portraitUrl, memberId, phone, birthday, height, weight, sex, id}) {
        const globalData = getApp().globalData;
        globalData.userInfo = {...arguments[0]};
        return new Promise((resolve, reject) => {
            wx.setStorage({key: 'userInfo', data: globalData.userInfo, success: resolve, fail: reject});
        });
    }

    static _postGetUserInfo({resolve, reject}) {
        CommonProtocol.getAccountInfo().then(data => {
            if (!!data.result) {
                this.set({...data.result});
                resolve({userInfo: getApp().globalData.userInfo});
            } else {
                reject({errMsg: 'data result is empty!'});
            }
        }).catch(reject);
    }
}
