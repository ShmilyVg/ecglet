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
            if (name.length > 8) {
                name = name.slice(0, 7) + '…';
            }

            this.setData({
                name: name,
                number: res.userInfo.phone || wx.getStorageSync('phoneNumber'),
                sexIndex: res.userInfo.sex === -1 ? 0 : res.userInfo.sex,
                birthDate: res.userInfo.birthday || '',
                height: res.userInfo.height,
                weight: res.userInfo.weight,
                portraitUrl: res.userInfo.portraitUrl,
                isPhoneNotAuth: this.isPhoneNotAuth()
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
        let birthTime = this.data.birthDate || '';
        console.log(`birth time: ${birthTime}`);
        try {
            Toast.showLoading();
            let data = {
                nickName: this.data.name,
                phone: this.data.number,
                sex: this.data.sexIndex,
                birthday: birthTime,
                height: this.data.height,
                weight: this.data.weight,
                portraitUrl: this.data.portraitUrl
            };
            console.log('保存信息：', data);
            Protocol.accountUpdate(data).then((res) => {
                UserInfo.clear();
                return UserInfo.get();
            }).then(res => {
                return UserInfo.set({...res.userInfo, ...data});
            }).then(() => {
                HiNavigator.relaunchToStart();
            }).catch((res) => {
                switch (res.data.code) {
                    case 2000:
                        Toast.showText('同一手机\n不能绑定两个账号');
                        break;
                    case 3000:
                        Toast.showText('暂不支持表情');
                        break;
                    default:
                        Toast.showText('修改失败');
                        break;
                }
            }).finally(() => {
                Toast.hiddenLoading();
            });
        } catch (err) {
            console.log("onSubmit error: %o", err);
            Toast.showText('提交失败');
            Toast.hiddenLoading();
        }
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
