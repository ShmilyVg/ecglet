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
        if (relevanceId == 0) {
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
        return Network.request({url: 'gather/getCardiac', data: arguments[0], requestWithoutLogin: true}).then(data => {
            return Promise.resolve({data});
        });
    }

    static getPdfUrl({id}) {
        return Network.request({url: 'gather/getPdfUrl', data: {id}, requestWithoutLogin: true}).then(data => {
            return Promise.resolve({data});
        });
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
        return Network.request({url: 'copywriting/getPsiInterval', data: arguments[0]});
    }

    static getHrInterval({id}) {
        return Network.request({url: 'copywriting/getHrInterval', data: arguments[0]});
    }

    static getHrvInterval({id}) {
        return Network.request({url: 'copywriting/getHrvInterval', data: arguments[0]});
    }

    static getRmssdInterval({id}) {
        return Network.request({url: 'copywriting/getRmssdInterval', data: arguments[0]});
    }

    static getMoodInterval({id}) {
        return Network.request({url: 'copywriting/getMoodInterval', data: arguments[0]});
    }

    static sendBluetoothInfo({mac, electricity}) {
        return Network.request({url: 'account/bluetooth', data: arguments[0]});
    }

    static getHeartHealthEvaluationResult() {
        return Promise.resolve({
            "result": {
                "risk": {
                    "level": 1,
                    "content": "太棒啦！您当前患心血管疾病风险极低！你有一颗生命力如夏花一样的心脏，请好好珍惜。可能您一直重视健康生活，也可能最近才开始注意调整生活状态，这个结果都说明您的选择值得坚持~"
                },
                "Interpretation": "心脏健康指数” 是根据美国国家心肺血液研究所（NHLBI）的费雷鸣汉心脏研究计算得到，可完整，定量地评估心血管健康状况，可判断未来十年患心血管疾病的概率，包括冠状动脉死亡，心肌梗死，冠状动脉功能不全，心绞痛，缺血性中风，出血性中风，短暂性脑缺血发作，外周动脉疾病，心力衰竭等。用于检测初级保健的一般心血管风险概况。",
                "healthAge": {
                    "title": "人未老心先衰",
                    "content": "您的心脏年龄比实际年龄大6岁，就像一枚生锈的齿轮亟待修补！"
                },
                "hipeeSuggest": {
                    "img": "",
                    "contents": [
                        {
                            "img": "",
                            "subtitle": "",
                            "title": "健康饮食",
                            "content": [
                                {
                                    "title": "",
                                    "content": "健康饮食：总脂肪量摄入量应降至约占总热量的30％;饱和脂肪，即我们平时吃的肉类，鸡，鸭，鱼等各种脂肪，摄入量应降至占总热量的10％以下，尽量减少甚至停止反式脂肪酸的摄入，如人造黄油，人造奶油，咖啡伴侣，西式糕点，薯片，炸薯条，珍珠奶茶等。"
                                },
                                {
                                    "title": "",
                                    "content": "鼓励所有人减少日常盐摄入量三分之一以上，如有可能，应限制在每日<5克或<90mmol。"
                                }
                            ]
                        },
                        {
                            "img": "",
                            "subtitle": "",
                            "title": "经常锻练身体",
                            "content": [
                                {
                                    "title": "",
                                    "content": "鼓励所有人每天至少有30分钟的中度身体活动（如，快步走）"
                                }
                            ]
                        },
                        {
                            "img": "",
                            "subtitle": "",
                            "title": "戒烟",
                            "content": [
                                {
                                    "title": "",
                                    "content": "强烈建议所有吸烟者戒烟，建议所有不吸烟者不要开始吸烟。\n                尽可能避免被动吸烟。\n                如果戒烟无果可以尝试尼古丁替代疗法，但需要在医师指导下进行，对尼古丁过敏者，心肌梗死，心绞痛，严重心律失常，急性卒中者禁用。"
                                }
                            ]
                        },
                        {
                            "img": "",
                            "subtitle": "",
                            "title": "减少酒精摄入",
                            "content": [
                                {
                                    "title": "",
                                    "content": "建议每日饮酒量超过3单位饮酒量者减少酒精摄入。注：1单位饮酒量=半品脱的啤酒/淡味啤酒（含5％酒精），100毫升葡萄酒（含10％酒精）或25毫升烈性酒（含40％酒精）"
                                }
                            ]
                        },
                        {
                            "img": "",
                            "subtitle": "",
                            "title": "控制体重",
                            "content": [
                                {
                                    "title": "",
                                    "content": "应鼓励所有超重或肥胖者，提供膳食建议结合运动降低体重;"
                                }
                            ]
                        }
                    ],
                    "subtitle": "<p>根据世卫组织估计，2012年有1750多万人死于心脏病发作或中风等心血管疾病。</p>\n<p style=\"margin-top: 12px;\">然而，好消息是80%的过早心脏病发作和中风是可以预防的。\n<span style=\"color: #7265E3;\">健康饮食</span>、\n<span style=\"color: #7265E3;\">经常锻炼身体</span>\n和<span style=\"color: #7265E3;\">不使用烟草制品</span>\n是预防的关键。检查并控制心脏病和中风的危险因素，如高血压、高胆固醇和高血糖或糖尿病，也非常重要。</p>",
                    "title": "改善建议"
                }
            }
        });
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


