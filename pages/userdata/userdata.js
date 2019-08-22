import Toast from "../../utils/toast";
import {getFormatDate} from "../../utils/tools";
import HiNavigator from "../../components/navigator/hi-navigator";
import ChooseImage from "../../components/choose-image/chooseImage";

Page({
    data: {
        sexies: ['女', '男'],
        isNewMember: false,
    },

    onLoad(options) {
        let isNormalMember = options.isNormalMember === 'true';
        console.log('是否为基本成员：', isNormalMember);
        let {year, month, day} = getFormatDate(Date.now());
        this.setData({
            birthEndDate: year + '-' + month + '-' + day
        });

        let userInfo = getApp().globalData.editMember;
        console.log('用户信息:', userInfo);

        if (JSON.stringify(userInfo) === "{}") {
            this.setData({
                isNewMember: true
            });
            return;
        }
        if (userInfo.sex == null) {
            userInfo.sex = 1;
        } else {
            userInfo.sex = userInfo.sex === -1 ? 0 : userInfo.sex;
        }

        if (!userInfo.phone) {
            userInfo.phone = wx.getStorageSync('phoneNumber');
        }

        this.setData({...this.data, ...userInfo});
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
        const {nickName, phone, birthday, height, weight} = this.data;
        if (nickName.length === 0) {
            Toast.showText('请填写完整信息');
        } else if (phone.length !== 11) {
            if (phone.length > 0) {
                Toast.showText('手机号格式错误');
            } else if (phone.length === 0) {
                Toast.showText('请填写手机号');
            }
        } else if (!/^\d+$/.test(phone)) {
            Toast.showText('手机号格式错误');
        } else if (birthday === '请选择出生日期' || birthday === "") {
            Toast.showText('请选择出生日期');
        } else if (!height || !height.trim()) {
            Toast.showText('请填写身高');
        } else if (!weight || !weight.trim()) {
            Toast.showText('请填写体重');
        } else {
            getApp().globalData.editMember = this.data;
            HiNavigator.navigateToIllHistory({});
        }
    },

    chooseImage() {
        ChooseImage.chose().then(image=>{
            this.setData({
                portraitUrl: image
            })
        });
    }
})
