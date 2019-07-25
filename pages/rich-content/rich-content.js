// pages/rich-content/rich-content.js
import Protocol from "../../apis/network/protocol";
import HiNavigator from "../../components/navigator/hi-navigator";
import UserInfo from "../../apis/network/network/libs/userInfo";
import {jsGetAge} from "../../utils/tools";
import Toast from "../../utils/toast";

const app = getApp();
Page({
    data: {
        ill: [
            {
                value: false, text: '头疼'
            },
            {
                value: false, text: '胸口疼'
            },
            {
                value: false, text: '紧张/焦虑'
            },
            {
                value: false, text: '眩晕'
            },
            {
                value: false, text: '倦怠'
            },
            {
                value: false, text: '气促'
            },
            {
                value: false, text: '乏力'
            },
            {
                value: false, text: '高血压病史'
            }
        ],
        detailed: [
            {
                value: false, text: '吸烟'
            },
            {
                value: false, text: '经常熬夜'
            },
            {
                value: false, text: '久坐不动'
            },
            {
                value: false, text: '运动锻炼'
            },
            {
                value: false, text: '刚进行过剧烈活动'
            }
        ],
        userInfo: {},
        count: 0,
        text: ''
    },
    filePath: '',
    arrhythType: '',
    onLoad(options) {
        this.filePath = options.tempFileUrl?decodeURIComponent(options.tempFileUrl):'';
    },
    onShow() {
        const currentMember = app.globalData.currentMember;
        if (currentMember && currentMember.memberId) {
            this.setData({userInfo: currentMember});
        } else {
            UserInfo.get().then(res => {
                console.log(res);
                this.setData({userInfo: {...res.userInfo}});
            });
        }
    },
    switchMember() {
        wx.navigateTo({url: '/pages/member-list/member-list?state=1'});
    },
    textContent(e) {
        let {detail: {cursor, value}} = e;
        if (cursor > 100) {
            value = value.slice(0, 99);
        }
        this.setData({
            count: cursor,
            text: value
        })
    },
    clickIll(e) {
        const {target: {dataset: {index}}} = e;
        let ill = this.data.ill;
        ill[index].value = !ill[index].value;
        this.setData({
            ill: ill
        })
    },

    clickDetailed(e) {
        const {target: {dataset: {index}}} = e;
        let detailed = this.data.detailed;
        detailed[index].value = !detailed[index].value;
        this.setData({
            detailed: detailed
        })
    },
    uploadBaseInfo() {
        if (!!this.filePath) {
            console.log(this.filePath,'2');

            // Toast.showLoading();
            let promise = undefined;
            if (parseInt(this.arrhythType) === 3) {
                promise = Protocol.uploadGatherCardiacFile;
            } else {
                promise = Protocol.uploadGatherRoutineFile;
            }
            promise({
                filePath: this.filePath, symptom: this.data.ill.filter(item => item.value).map(item => item.text).join(','),
                record: this.data.detailed.filter(item => item.value).map(item => item.text).join(',') + (this.data.text || ''),
                memberId: this.data.userInfo.memberId,
            }).then(data => {
                console.log('', data);
                HiNavigator.redirectToResultPageByType({type, dataId: ''});
            }).catch(res => {
                console.error(res);
            }).finally(Toast.hiddenLoading);
        } else {
            Toast.showText('心电数据上传异常\n请重新检测');
        }
    }
});
