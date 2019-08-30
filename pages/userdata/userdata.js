import Toast from "../../utils/toast";
import {getFormatDate, userInfoEmptyTip} from "../../utils/tools";
import HiNavigator from "../../components/navigator/hi-navigator";
import ChooseImage from "../../components/choose-image/chooseImage";

Page({
    data: {
        sexies: ['女', '男'],
        isNewMember: false,
        isNormalMember: false
    },

    onLoad(options) {
        let {year, month, day} = getFormatDate(Date.now());
        let birthEndDate = year + '-' + month + '-' + day;

        let isNormalMember = options.isNormalMember === 'true';
        let userInfo = getApp().globalData.editMember;

        if (JSON.stringify(userInfo) === "{}") {
            this.setData({isNewMember: true, sex: 1, birthEndDate});
        } else {
            if (userInfo.sex !== 0 && userInfo.sex !== 1) {
                userInfo.sex = 1;
            }
            if (!userInfo.phone) {
                userInfo.phone = wx.getStorageSync('phoneNumber');
            }
            this.setData({...this.data, ...userInfo, isNormalMember, birthEndDate});
        }
    },

    onNameChange(e) {
        this.setData({
            nickName: e.detail.value
        })
    },

    onNumberChange(e) {
        this.setData({
            phone: e.detail.value
        })
    },

    onBirthChange(e) {
        this.setData({
            birthday: e.detail.value || ''
        })
    },

    onSexChange(e) {
        this.setData({
            sex: parseInt(e.detail.value)
        })
    },

    onHeightChange(e) {
        this.setData({
            height: e.detail.value
        })
    },

    onWeightChange(e) {
        this.setData({
            weight: e.detail.value
        })
    },

    onSubmit() {
        if (userInfoEmptyTip(this.data)) {
            getApp().globalData.editMember = this.data;
            HiNavigator.navigateToIllHistory({});
        }
    },

    async chooseImage() {
        const image = await ChooseImage.chose();
        this.setData({
            portraitUrl: image
        })
    }
});