// pages/rich-content/rich-content.js
import Protocol from "../../apis/network/protocol";
import HiNavigator from "../../components/navigator/hi-navigator";
import Toast from "../../utils/toast";

const app = getApp();
Page({
    data: {
        ill: [
            {value: false, text: '头疼'},
            {value: false, text: '胸口疼'},
            {value: false, text: '紧张/焦虑'},
            {value: false, text: '眩晕'},
            {value: false, text: '倦怠'},
            {value: false, text: '气促'},
            {value: false, text: '乏力'}
        ],
        detailed: [
            {value: false, text: '吸烟'},
            {value: false, text: '经常熬夜'},
            {value: false, text: '久坐不动'},
            {value: false, text: '运动锻炼'},
            {value: false, text: '刚进行过剧烈活动'},
            {value: false, text: '饮酒'}
        ],
        count: 0,
        text: ''
    },
    filePath: '',
    arrhythType: '',

    onLoad(options) {
        this.filePath = options.tempFileUrl ? decodeURIComponent(options.tempFileUrl) : '';
        this.arrhythType = options.type;
    },

    onShow() {
        getApp().globalData.refresh = true;
    },

    onUnload() {
        wx.setKeepScreenOn({
            keepScreenOn: false, success: (res) => {
                console.log('可以息屏成功', res);
                wx.setKeepScreenOn({keepScreenOn: false});
            }, fail: res => {
                console.error('可以息屏失败', res);
                wx.setKeepScreenOn({keepScreenOn: false});
            }
        });
    },

    textContent(e) {
        let {detail: {cursor: count, value: text}} = e;
        this.setData({count, text})
    },

    clickIll(e) {
        const {target: {dataset: {index}}} = e;
        let ill = this.data.ill;
        ill[index].value = !ill[index].value;
        this.setData({ill})
    },

    clickDetailed(e) {
        const {target: {dataset: {index}}} = e;
        let detailed = this.data.detailed;
        detailed[index].value = !detailed[index].value;
        this.setData({
            detailed: detailed
        })
    },

    async uploadBaseInfo() {
        if (this.data.count > 100) {
            Toast.showText('字符超出限制');
            return;
        }
        if (!!this.filePath) {
            Toast.showLoading();
            let promise = undefined;
            if (parseInt(this.arrhythType) === 2) {
                promise = Protocol.uploadGatherCardiacFile;
            } else {
                promise = Protocol.uploadGatherRoutineFile;
            }
            const userInfo = this.selectComponent('#switchMemberView').getUserInfo();
            try {
                const {result} = await promise({
                    filePath: this.filePath,
                    symptom: this.data.ill.filter(item => item.value).map(item => item.text).join(','),
                    record: this.data.detailed.filter(item => item.value).map(item => item.text).join(',') + (this.data.text || ''),
                    relevanceId: userInfo.isMainMember ? '' : userInfo.memberId,
                });

                if (!result) {
                    throw new Error('接收到的dataId是空！');
                }
                HiNavigator.redirectToResultPageByType({type: parseInt(this.arrhythType), dataId: result});
            } catch (e) {
                console.error(e);
                Toast.showErrMsg(e);
            } finally {
                Toast.hiddenLoading();
            }
        } else {
            Toast.showText('心电数据上传异常\n请重新检测');
        }
    }
});
