import Network from "./network";
import WXDialog from "../../base/heheda-common-view/dialog";
import BaseNetworkImp from "./network/libs/base/base-network-imp";
import {PostUrl, UploadUrl} from "../../utils/config";

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

    static getRelativesInfo({memberId}) {
        return Network.request({url: 'relatives/info', data: {memberId}})
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

    static accountCreate({nickName, sex, phone, birthday, height, weight, portraitUrl}) {
        return Network.request({
            url: 'member/relevance/create',
            data: {nickName, sex, phone, birthday, height, weight, portraitUrl}
        })
    }

    static memberRelevanceDel({id}) {
        return Network.request({url: 'member/relevance/del', data: {id}})
    }

    static memberRelevanceList({}) {
        return Network.request({url: 'member/relevance/list', data: {}})
    }

    static memberRelevanceUpdate({id, phone, nickName, portraitUrl, birthday, height, weight, sex}) {
        return Network.request({
            url: 'member/relevance/update',
            data: {id, phone, nickName, portraitUrl, birthday, height, weight, sex}
        })
    }

    static accountUpdate({nickname, sex, phone, birthday, height, weight}) {
        return Network.request({url: 'account/update', data: arguments[0]});
    }

    /**
     * 获取常规心电记录详细信息
     * @param id
     * @returns {*|Promise|Promise<any>|never}
     */
    static getRoutine({id}) {
        return Network.request({url: 'gather/getRoutine', data: arguments[0]}).then(data => {
            let isAbNormal = false;
            data.result.report.forEach(item => {
                item.name = item.introduction;
                item.rightContent = item.time;
                item.fontSize = !Number.isNaN(parseInt(item.rightContent)) ? '64' : '44';
                if (!isAbNormal) {
                    isAbNormal = parseInt(item.status) === 0;
                }
                switch (item.targetDes) {
                    case 'HR': {
                        item.description = '心率是指正常人安静状态下每分钟心跳的次数，成人正常心率为60～100次/分钟，如果心率低于40次/分钟，应考虑有病态窦房结综合征、房室传导阻滞等情况；如果出现胸闷、乏力、头晕等不适症状，应立即到医院进一步检查。';
                        if (item.status === '0') {
                            item.description += '\n一次的心率过快或过慢只能反映当前检测期间的数值未在正常区间内，也可能是其他行为导致的异常；建议长期检测，反复多测查看趋势再做判断；';
                        }
                    }
                        break;
                    case 'QRS': {
                        item.description = 'QRS是心电图心室除极的时间，是心室活动的表现，故QRS异常常见心室问题。成人QRS间期应在60~100ms内，超过110ms为QRS时限延长，见于心室肥大、束支传导阻滞、预激综合征、心室内差异传导、高钾血症、急性损伤传导阻滞及药物毒性反应等';
                    }
                        break;
                    case 'QTC': {
                        item.description = 'QTC间期是按心率校正的QT间期，是反映心脏去极化和复极作用的指标。QTc间期延长表示心脏复极延迟，反映了心电异常，通常与心律失常敏感性增高密切相关。男性正常范围＜430ms，女性＜450ms；';
                    }
                }
            });
            if (isAbNormal) {
                data.result.subTitle = '多喝水，好心态，别熬夜~';
            } else {
                data.result.subTitle = '注意身体，继续保持~';
            }
            return Promise.resolve(data);
        });
    }

    /**
     * 获取心脏心电记录详细信息
     * @param id
     * @returns {*|Promise|Promise<any>|never}
     */
    static getCardiac({id}) {
        return Network.request({url: 'gather/getCardiac', data: arguments[0]}).then(data => {
            data.result.list.forEach(item => {
                item.rightContent = item.frequency || item.conclusion;
                item.fontSize = !Number.isNaN(parseInt(item.rightContent)) ? '64' : '44';
                switch (item.target) {
                    case 'HR': {
                        item.description = '心率是指正常人安静状态下每分钟心跳的次数，成人正常心率为60～100次/分钟，如果心率低于40次/分钟，应考虑有病态窦房结综合征、房室传导阻滞等情况；如果出现胸闷、乏力、头晕等不适症状，应立即到医院进一步检查。';
                        if (item.status === '0') {
                            item.description += '\n一次的心率过快或过慢只能反映当前检测期间的数值未在正常区间内，也可能是其他行为导致的异常；建议长期检测，反复多测查看趋势再做判断；';
                        }
                    }
                        break;
                    case 'SDNN': {
                        item.description = '心率变异性(HRV)是指两次心跳时间间隔的微小变化。心率变异性为评估自主神经功能的有效指标，能够预测心脏性猝死，对高血压、心衰、心脏移植、甲亢等疾病的临床应用都有潜在价值。';
                    }
                }
            });

            return Promise.resolve(data);
        });
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


