import Toast from "../../utils/toast";
import WXDialog from "../../utils/dialog";
import * as tools from "../../utils/tools";
import UserInfo from "../../apis/network/network/libs/userInfo";
import Protocol from "../../apis/network/protocol";

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
        portraitUrl: ''
    },

    onLoad(options) {
        let isNormalMember = options.isNormalMember === 'true';
        const isNewUser = parseInt(options.isNewUser || 0);//如果是新用户初次使用


        let birthEndDate = tools.createDateAndTime(new Date());
        this.setData({
            birthEndDate: birthEndDate
        });
        let userInfo = getApp().globalData.currentMember;
        console.log('用户信息:', userInfo);
        if (isNormalMember) {
            this.setData({
                name: userInfo.nickName,
                number: userInfo.phone || wx.getStorageSync('phoneNumber'),
                sexIndex: userInfo.sex === -1 ? 0 : userInfo.sex,
                birthDate: userInfo.birthday || '请选择出生日期',
                height: userInfo.height,
                weight: userInfo.weight,
                portraitUrl: userInfo.portraitUrl,
                isNormalMember: isNormalMember
            })
        } else {
            this.setData({
                name: userInfo.name,
                number: userInfo.phone || wx.getStorageSync('phoneNumber'),
                sexIndex: userInfo.sex === -1 ? 0 : userInfo.sex,
                birthDate: userInfo.birthday || '请选择出生日期',
                height: userInfo.height,
                weight: userInfo.weight,
                portraitUrl: userInfo.portraitUrl,
                id: userInfo.id,
                isNormalMember: isNormalMember
            })
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
        })
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
        let that = this;
        if (this.data.name.length == 0) {
            Toast.showText('请填写完整信息');
            return;
        }

        if (this.data.number.length != 11) {
            Toast.showText('手机号格式错误');
            return;
        }
        WXDialog.showDialog({
            title: '提示', content: '确认修改您的信息吗？', showCancel: true, confirmEvent: () => {
                let birthTime = this.data.birthDate || '';
                console.log(`birth time: ${birthTime}`);
                try {
                    if (that.data.isNormalMember) {
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
                            return UserInfo.get();
                        }).then((res) => {
                            Toast.success('修改成功');
                            return UserInfo.set({...res.userInfo, ...data});
                        }).then(() => {
                            wx.navigateBack({delta: 1});
                        }).catch((res) => {
                            if (res.data.code == 2000) {
                                console.log('手机号重复');
                                Toast.showText('同一手机\n不能绑定两个账号')
                            } else {
                                Toast.showText('修改失败');
                            }
                        });
                    } else {
                        let data = {
                            nickName: this.data.name,
                            phone: this.data.number,
                            sex: this.data.sexIndex,
                            birthday: birthTime,
                            height: this.data.height,
                            weight: this.data.weight,
                            portraitUrl: this.data.portraitUrl,
                            id: this.data.id
                        };
                        console.log('保存信息：', data);
                        Protocol.memberRelevanceUpdate(data).then((res) => {
                            wx.navigateBack({delta: 1});
                        }).catch((res) => {
                            if (res.data.code == 2000) {
                                console.log('手机号重复');
                                Toast.showText('同一手机\n不能绑定两个账号')
                            } else {
                                Toast.showText('修改失败');
                            }
                        });
                    }

                } catch (err) {
                    console.log("onSubmit error: %o", err);
                    Toast.showText('提交失败')
                }
            }
        });
    },

    chooseImage() {
        let that = this;
        console.log('chooseImage');
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
