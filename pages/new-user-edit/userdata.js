import Toast from "../../utils/toast";
import WXDialog from "../../utils/dialog";
import {getFormatDate} from "../../utils/tools";
import Protocol from "../../apis/network/protocol";
import HiNavigator from "../../components/navigator/hi-navigator";
import UserInfo from "../../apis/network/network/libs/userInfo";

Page({
    data: {
        sexies: ['女', '男'],
        sexIndex: 1,
        birthEndDate: '',
        birthDate: '',
        submitOpacity: 0.4,
        submitDisabled: true,
        name: '',
        height: '',
        weight: '',
        number: '',
        portraitUrl: '',
        isPhoneNotAuth: true
    },

    onLoad(options) {
        let {year, month, day} = getFormatDate(Date.now());
        this.setData({
            birthEndDate: year + '-' + month + '-' + day
        });
        UserInfo.get().then((res) => {
            console.log('res:', res);

            let name = res.userInfo.nickName;

            this.setData({
                name: name,
                number: res.userInfo.phone || wx.getStorageSync('phoneNumber'),
                sexIndex: res.userInfo.sex === -1 ? 0 : res.userInfo.sex,
                birthDate: res.userInfo.birthday || '',
                height: res.userInfo.height,
                weight: res.userInfo.weight,
                portraitUrl: res.userInfo.portraitUrl,
                isPhoneNotAuth: !res.userInfo.phone
            })
        })
    },
    isPhoneNotAuth() {
        return !wx.getStorageSync('isNewUserPhoneAuth');
    },
    getPhoneNumber(e) {
        const {detail: {encryptedData, iv, errMsg}} = e;
        if (errMsg === 'getPhoneNumber:ok') {
            Toast.showLoading();
            Protocol.getPhoneNum({
                encryptedData, iv
            }).then((phoneNumber) => {
                wx.setStorageSync('phoneNumber', phoneNumber);
                wx.setStorageSync('isNewUserPhoneAuth', true);
            }).then((res) => {
                    this.setData({
                        number: wx.getStorageSync('phoneNumber'),
                        isPhoneNotAuth: this.isPhoneNotAuth()
                    });
                }
            ).catch((res) => {
                console.log(res);
                Toast.showText('授权手机号失败，请重试');
            }).finally(() => {
                Toast.hiddenLoading();
            });
        } else {
            WXDialog.showDialog({content: '因您拒绝授权手机号，可能对后续专业服务造成影响。您可以再次点击进行手动填写', showCancel: false});
            wx.setStorageSync('isNewUserPhoneAuth', true);
            this.setData({
                number: wx.getStorageSync('phoneNumber'),
                isPhoneNotAuth: this.isPhoneNotAuth()
            });

        }
    },
    onNameChange(e) {
        this.setData({
            name: e.detail.value
        })
    },

    onNumberChange(e) {
        this.setData({
            number: e.detail.value
        }, () => {
            console.log(this.data.number);
        });
    },

    onBirthChange(e) {
        this.setData({
            birthDate: e.detail.value || ''
        })
    },

    onSexChange(e) {
        this.setData({
            sexIndex: parseInt(e.detail.value)
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
        if (this.data.name.length == 0) {
            Toast.showText('请填写昵称');
            return;
        }
        console.log(this.data.number);
        if (this.data.number.length != 11) {
            Toast.showText('请填写手机号');
            return;
        }
        if (!this.data.birthDate.trim()) {
            Toast.showText('请选择出生日期');
            return;
        }
        const {height, weight} = this.data;
        if (!height || !height.trim()) {
            Toast.showText('请填写身高');
            return;
        }
        if (!weight || !weight.trim()) {
            Toast.showText('请填写体重');
            return;
        }
        let birthTime = this.data.birthDate || '';
        console.log(`birth time: ${birthTime}`);

        let editMember = {
            nickName: this.data.name,
            phone: this.data.number,
            sex: this.data.sexIndex,
            birthday: birthTime,
            height: this.data.height,
            weight: this.data.weight,
            portraitUrl: this.data.portraitUrl,
            isNormalMember: true
        };
        getApp().globalData.editMember = editMember;
        HiNavigator.navigateToIllHistory({});
    },

    chooseImage() {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                Toast.showLoading();
                let path = res.tempFilePaths[0];
                wx.uploadFile({
                    url: 'https://backend.hipee.cn/hipee-upload/hibox/mp/upload/image.do',
                    filePath: path,
                    name: path,
                    success(res) {
                        console.log(res);
                        Toast.hiddenLoading();
                        let data = res.data;
                        let image = JSON.parse(data).result.img_url;
                        console.log('图片：', image);
                        that.setData({
                            portraitUrl: image
                        })
                    }

                })
            }
        })
    }
})
