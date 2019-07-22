import Toast from "../../utils/toast";
import WXDialog from "../../utils/dialog";
import * as tools from "../../utils/tools";
import Protocol from "../../apis/network/protocol";
import HiNavigator from "../../components/navigator/hi-navigator";

Page({
    data: {
        sexies: ['女', '男'],
        sexIndex: 1,
        birthEndDate: '',
        birthDate: '请选择出生日期',
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
        let birthEndDate = tools.createDateAndTime(new Date());
        this.setData({
            birthEndDate: birthEndDate
        });
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
            WXDialog.showDialog({content: '因您拒绝授权，无法使用更多专业服务', showCancel: false});
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
            Toast.showText('请填写完整信息');
            return;
        }
        console.log(this.data.number);
        if (this.data.number.length != 11) {
            Toast.showText('手机号格式错误');
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
            Protocol.accountCreate(data).then((res) => {
                HiNavigator.relaunchToStart();
            }).catch((res) => {
                if (res.data.code == 2000) {
                    console.log('手机号重复');
                    Toast.showText('同一手机\n不能绑定两个账号')
                } else {
                    Toast.showText('保存失败');
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
