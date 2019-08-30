import Toast from "../../utils/toast";
import WXDialog from "../../utils/dialog";
import {getFormatDate, userInfoEmptyTip} from "../../utils/tools";
import Protocol from "../../apis/network/protocol";
import HiNavigator from "../../components/navigator/hi-navigator";
import UserInfo from "../../apis/network/network/libs/userInfo";
import ChoseImage from "../../components/choose-image/chooseImage";

Page({
    data: {
        sexies: ['女', '男'],
        isPhoneNotAuth: true
    },

    async onLoad() {
        const {year, month, day} = getFormatDate(Date.now());
        const birthEndDate = year + '-' + month + '-' + day;

        let {userInfo} = await UserInfo.get();
        console.log('用户信息:', userInfo);
        userInfo.phone = userInfo.phone || wx.getStorageSync('phoneNumber');

        const isPhoneNotAuth = !userInfo.phone;

        this.setData({birthEndDate, ...userInfo, sex: userInfo.sex === -1 ? 1 : userInfo.sex, isPhoneNotAuth})
    },

    isPhoneNotAuth() {
        return !wx.getStorageSync('isNewUserPhoneAuth');
    },

    async getPhoneNumber(e) {
        const {detail: {encryptedData, iv, errMsg}} = e;
        if (errMsg === 'getPhoneNumber:ok') {
            Toast.showLoading();
            try {
                let phoneNumber = await Protocol.getPhoneNum({encryptedData, iv});
                wx.setStorageSync('phoneNumber', phoneNumber);
                this.handlePhoneNum();
            } catch (e) {
                console.error(e);
                Toast.showText('授权手机号失败，请重试');
            } finally {
                Toast.hiddenLoading();
            }
        } else {
            WXDialog.showDialog({content: '因您拒绝授权手机号，可能对后续专业服务造成影响。您可以再次点击进行手动填写', showCancel: false});
            this.handlePhoneNum();
        }
    },

    handlePhoneNum() {
        wx.setStorageSync('isNewUserPhoneAuth', true);
        this.setData({
            phone: wx.getStorageSync('phoneNumber'),
            isPhoneNotAuth: this.isPhoneNotAuth()
        });
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
            getApp().globalData.editMember = {...this.data, isNormalMember: true};
            HiNavigator.navigateToIllHistory({isFirstInto: 1});
        }
    },

    async chooseImage() {
        const image = await ChoseImage.chose();
        this.setData({
            portraitUrl: image
        })
    }
})
