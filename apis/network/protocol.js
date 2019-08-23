import Network from "./network";
import WXDialog from "../../base/heheda-common-view/dialog";
import BaseNetworkImp from "./network/libs/base/base-network-imp";
import {PostUrl, UploadUrl} from "../../utils/config";

function createFontSize(item) {
    if (!Number.isNaN(parseInt(item.rightContent))) {
        item.fontSize = '64';
    } else {
        item.fontSize = (item.rightContent || '').length < 4 ? '44' : '36';
    }
}

export default class Protocol {
    static getNetworkType() {
        return new Promise((resolve, reject) => {
            wx.getNetworkType({
                success: resolve,
                fail: reject
            });
        });

    }

    static downloadFile({url}) {
        return new Promise((resolve, reject) => {
            wx.downloadFile({
                url, //仅为示例，并非真实的资源
                success: (res) => {
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                    if (res.statusCode === 200) {
                        resolve({tempFilePath: res.tempFilePath});
                    } else {
                        reject();
                    }
                }, fail: reject
            });
        });
    }

    static checkHaveNetwork() {
        return this.getNetworkType().then(res => {
            console.log('当前网络状态', res);
            if (res.networkType === 'none' || res.networkType === 'unknown') {
                return Promise.reject();
            } else {
                return Promise.resolve();
            }
        })
    }

    /**
     * 上传常规心电
     * @param filePath
     * @param symptom
     * @param record
     * @param relevanceId
     * @returns {Promise<any>}
     */
    static uploadGatherRoutineFile({filePath, symptom, record, relevanceId}) {
        console.log('filePath', filePath, 'sys', symptom, 'record', record, 'relevan', relevanceId);
        return new Promise((resolve, reject) => {
            if (filePath) {
                wx.uploadFile({
                    url: PostUrl + 'gather/routine',
                    filePath: filePath,
                    name: filePath,
                    header: {"Cookie": `JSESSIONID=${wx.getStorageSync('cookie')}`},
                    formData: {
                        symptom, record, relevanceId
                        //和服务器约定的token, 一般也可以放在header中
                        // 'session_token': wx.getStorageSync('session_token')
                    },
                    success: function (res) {
                        console.log('上传成功的文件', res);
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

    /**
     * 上传心脏负荷心电
     * @param filePath
     * @param symptom
     * @param record
     * @param relevanceId
     * @returns {Promise<any>}
     */
    static uploadGatherCardiacFile({filePath, symptom, record, relevanceId}) {
        return new Promise((resolve, reject) => {
            if (filePath) {
                wx.uploadFile({
                    url: PostUrl + 'gather/cardiac',
                    filePath: filePath,
                    name: filePath,
                    header: {"Cookie": `JSESSIONID=${wx.getStorageSync('cookie')}`},
                    formData: {
                        symptom, record, relevanceId
                        //和服务器约定的token, 一般也可以放在header中
                        // 'session_token': wx.getStorageSync('session_token')
                    },
                    success: function (res) {
                        console.log('上传成功的文件', res);
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

    static getHistoryList({data}) {
        return Network.request({url: 'gather/list', data: data})
    }

    static getLinearGraph({data}) {
        return Network.request({url: 'gather/list/linearGraph', data: data})
    }

    static getLinearGraphList({data}) {
        console.log('getLinearGraphList', data);
        return Network.request({url: 'gather/list/linearGraphList', data: data})
    }

    static getTargetByType({type}) {
        return Network.request({url: 'gather/getTargetByType', data: {type}})
    }

    static getQRCode({}) {
        return Network.request({url: 'shared/getRelatedQRCode'})
    }

    static getRelativesList({memberId, page = 1}) {
        return Network.request({url: 'relatives/list', data: {memberId, page}})
    }

    static getRelativesGetToolTip({}) {
        return Network.request({url: 'relatives/getToolTip'})
    }

    static getRelativesDelToolTip({}) {
        return Network.request({url: 'relatives/delToolTip'})
    }

    static accountCreate({nickName, sex, phone, birthday, height, weight, portraitUrl,hypertension,cardiopathy,diabetes}) {
        return Network.request({
            url: 'member/relevance/create',
            data: {nickName, sex, phone, birthday, height, weight, portraitUrl,hypertension,cardiopathy,diabetes}
        })
    }

    static memberRelevanceDel({relevanceId}) {
        return Network.request({url: 'member/relevance/del', data: {relevanceId}})
    }

    static memberRelevanceList({}) {
        return Network.request({url: 'member/relevance/list', data: {}}).then(data => {

            data.result.dataList && data.result.dataList.forEach(item => {
                item.relevanceId = item.memberId;
            });
            return Promise.resolve(data);
        });
    }

    static shareRelativesDelRelatives({memberId}) {
        return Network.request({url: 'relatives/delRelatives ', data: {memberId}})
    }

    static memberRelevanceUpdate({relevanceId, phone, nickName, portraitUrl, birthday, height, weight, sex,hypertension,cardiopathy,diabetes}) {
        return Network.request({
            url: 'member/relevance/update',
            data: {relevanceId, phone, nickName, portraitUrl, birthday, height, weight, sex,hypertension,cardiopathy,diabetes}
        })
    }

    static accountUpdate({nickname, sex, phone, birthday, height, weight}) {
        return Network.request({url: 'account/update', data: arguments[0]});
    }


    // 4。0新增协议
    static memberDiseaseGetMemberHistory({relevanceId}) {
        if (!relevanceId) {
            console.log('主成员');
            return Network.request({
                url: 'member/disease/getMemberHistory',
            })
        } else {
            console.log('非主成员');
            return Network.request({
                url: 'member/disease/getMemberHistory',
                data: {relevanceId}
            })
        }
    }

    static memberDiseaseCreate({data}) {
        return Network.request({
            url: 'member/disease/create',
            data: data
        })
    }

    static memberDiseaseUpdate({data}) {
        return Network.request({
            url: 'member/disease/update',
            data: data
        })
    }

    /**
     * 获取常规心电记录详细信息
     * @param id
     * @returns {*|Promise|Promise<any>|never}
     */
    static getRoutine({id}) {
        return Network.request({url: 'gather/getRoutine', data: arguments[0], requestWithoutLogin: true}).then(data => {
            const {result: {data: dataList, userInfo}} = data;
            return Promise.resolve({dataList, userInfo});
        });
    }

    /**
     * 获取心脏心电记录详细信息
     * @param id
     * @returns {*|Promise|Promise<any>|never}
     */
    static getCardiac({id}) {
       return Network.request({url: 'gather/getCardiac', data: arguments[0], requestWithoutLogin: true});
    }

    static getPdfUrl({id}) {
        return Network.request({url: 'gather/getPdfUrl', data: {id}, requestWithoutLogin: true});
    }

    static getRelativesInfo({memberId}) {
        return Network.request({url: 'relatives/info', data: {memberId}})
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

    static getCopywritingChecking() {
        return Network.request({url: 'copywriting/checking'});
    }

    static getPsilnterval({id}) {
        return Network.request({url: 'copywriting/getPsiInterval', data: arguments[0], requestWithoutLogin: true});
    }

    static getHrInterval({id}) {
        return Network.request({url: 'copywriting/getHrInterval', data: arguments[0], requestWithoutLogin: true});
    }

    static getHrvInterval({id}) {
        return Network.request({url: 'copywriting/getHrvInterval', data: arguments[0], requestWithoutLogin: true});
    }

    static getRmssdInterval({id}) {
        return Network.request({url: 'copywriting/getRmssdInterval', data: arguments[0], requestWithoutLogin: true});
    }

    static getMoodInterval({id}) {
        return Network.request({url: 'copywriting/getMoodInterval', data: arguments[0], requestWithoutLogin: true});
    }

    static sendBluetoothInfo({mac, electricity}) {
        return Network.request({url: 'account/bluetooth', data: arguments[0]});
    }

    /**
     *
     * @param relevanceId
     * @param sbp
     * @param smoke 是否吸烟 1 是 0 否
     * @param trtbp 是否有高血压病史 1 是 0 否
     * @param diabetes 是否有糖尿病 1 是 0 否
     * @returns {*|Promise|Promise<any>|never}
     */
    static getHeartHealthEvaluationResult({relevanceId, sbp, smoke, trtbp, diabetes}) {
        return Network.request({url: 'cardiac/health/getEvaluate', data: arguments[0]});
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


