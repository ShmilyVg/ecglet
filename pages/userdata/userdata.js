import Toast from "../../utils/toast";
import WXDialog from "../../utils/dialog";
import {getFormatDate} from "../../utils/tools";
import UserInfo from "../../apis/network/network/libs/userInfo";
import Protocol from "../../apis/network/protocol";
import HiNavigator from "../../components/navigator/hi-navigator";
import * as tools from "../../utils/tools";

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
        isNewMember: false
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
        let sexIndex = 1;
        if (userInfo.sex == null) {

        } else {
            sexIndex = userInfo.sex === -1 ? 0 : userInfo.sex;
        }
        if (isNormalMember) {
            this.setData({
                name: userInfo.nickName,
                number: userInfo.phone || wx.getStorageSync('phoneNumber'),
                sexIndex: sexIndex,
                birthDate: userInfo.birthday || '',
                height: userInfo.height,
                weight: userInfo.weight,
                portraitUrl: userInfo.portraitUrl,
                isNormalMember: isNormalMember
            })
        } else {
            this.setData({
                name: userInfo.nickName,
                number: userInfo.phone || wx.getStorageSync('phoneNumber'),
                sexIndex: sexIndex,
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
            if (this.data.number.length > 0) {
                Toast.showText('手机号格式错误');
            } else if (this.data.number.length == 0) {
                Toast.showText('请填写手机号');
            }
            return;
        }

        if (this.data.birthDate === '请选择出生日期' || this.data.birthDate === "") {
            Toast.showText('请选择出生日期');
            return;
        }

        WXDialog.showDialog({
            title: '提示', content: '确认修改您的信息吗？', showCancel: true, confirmEvent: () => {
                Toast.showLoading();
                let birthTime = this.data.birthDate || '';
                console.log(`birth time: ${birthTime}`);
                try {
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
                    if (that.data.isNewMember) {
                        Protocol.accountCreate(data).then((res) => {
                            HiNavigator.navigateBack({
                                delta: 1
                            });
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
                    } else if (that.data.isNormalMember) {
                        Protocol.accountUpdate(data).then((res) => {
                            return UserInfo.get();
                        }).then((res) => {
                            Toast.success('修改成功');
                            data.age = tools.jsGetAge(data.birthday);
                            return UserInfo.set({...res.userInfo, ...data});
                        }).then(() => {
                            getApp().globalData.editMember = {};
                            wx.navigateBack({delta: 1});
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
