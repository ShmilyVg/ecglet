// import Protocol from "../../../ecglet的副本/src/apis/network/protocol";
import Toast from "../../utils/toast";
import WXDialog from "../../utils/dialog";
import * as tools from "../../utils/tools";
// import UserInfo from '../../../ecglet的副本/src/apis/network/userInfo.js';

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
        let birthEndDate = tools.createDateAndTime(new Date());
        this.setData({
            birthEndDate: birthEndDate
        });
        // UserInfo.get().then((res) => {
        //     console.log('res:', res);
        //     this.setData({
        //         name: res.userInfo.nickName,
        //         number: res.userInfo.phone || wx.getStorageSync('phoneNumber'),
        //         sexIndex: res.userInfo.sex === -1 ? 0 : res.userInfo.sex,
        //         birthDate: res.userInfo.birthday || '请选择出生日期',
        //         height: res.userInfo.height,
        //         weight: res.userInfo.weight,
        //         portraitUrl: res.userInfo.portraitUrl
        //     })
        // })
    },

    onNameChange(e) {
        let that = this

        that.setData({
            name: e.detail.value
        })
    },

    onNumberChange(e) {
        let that = this;
        that.setData({
            number: e.detail.value
        })
    },

    onBirthChange(e) {
        let that = this

        that.setData({
            birthDate: e.detail.value || ''
        })
    },

    onSexChange(e) {
        let that = this

        that.setData({
            sexIndex: parseInt(e.detail.value)
        })
    },

    onHeightChange(e) {
        let that = this

        that.setData({
            height: e.detail.value
        })
    },

    onWeightChange(e) {
        let that = this

        that.setData({
            weight: e.detail.value
        })
    },

    onSubmit() {
        if (this.data.name.length == 0) {
            Toast.showText('请填写完整信息');
            return;
        }

        if (yhis.data.number.length != 11) {
            Toast.showText('手机号格式错误');
            return;
        }
        WXDialog.showDialog({
            title: '提示', content: '确认修改您的信息吗？', showCancel: true, confirmEvent: () => {
                let birthTime = that.data.birthDate || '';
                console.log(`birth time: ${birthTime}`);
                try {
                    let data = {
                        nickName: that.data.name,
                        phone: that.data.number,
                        sex: that.data.sexIndex,
                        birthday: birthTime,
                        height: that.data.height,
                        weight: that.data.weight,
                        portraitUrl: that.data.portraitUrl
                    }
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
                } catch (err) {
                    console.log("onSubmit error: %o", err);
                    Toast.showText('提交失败')
                }
            }
        });
    },


    chooseImage() {
        console.log('chooseImage');
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                Toast.showLoading();
                let path = res.tempFilePaths[0];
                wxp.uploadFile({
                    url: 'https://backend.hipee.cn/hipee-upload/hibox/mp/upload/image.do',
                    filePath: path,
                    name: path
                }).then((res) => {
                    console.log(res);
                    Toast.hiddenLoading();
                    let data = res.data;
                    let image = JSON.parse(data).result.img_url;
                    console.log('图片：', image);
                    this.setData({
                        portraitUrl: image
                    })
                })
            }
        })
    }
})
