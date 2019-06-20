// 此文件是由模板文件 ".dtpl/page/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板

import {pagify, MyPage, wxp} from 'base/'
import '../../extensions/Date.extensions'
// @ts-ignore
import Protocol from "../../apis/network/protocol";
// @ts-ignore
import Toast from "../../base/heheda-common-view/toast";
// @ts-ignore
import WXDialog from "../../base/heheda-common-view/dialog";
// @ts-ignore
import UserInfo from '../../apis/network/userInfo.js';

@pagify()
export default class extends MyPage {
    data = {
        sexies: ['女', '男'],
        sexIndex: 1,
        birthEndDate: new Date().format('yyyy-MM-dd'),
        birthDate: '请选择出生日期',
        submitOpacity: 0.4,
        submitDisabled: true,
        name: '',
        height: '',
        weight: '',
        number: '',
        portraitUrl: ''
    }

    async onLoad(options: any) {
        let that = this
        UserInfo.get().then((res: any) => {
            console.log('res:', res);
            that.setDataSmart({
                name: res.userInfo.nickName,
                number: res.userInfo.phone || wx.getStorageSync('phoneNumber'),
                sexIndex: res.userInfo.sex === -1 ? 0 : res.userInfo.sex,
                birthDate: res.userInfo.birthday || '请选择出生日期',
                height: res.userInfo.height,
                weight: res.userInfo.weight,
                portraitUrl: res.userInfo.portraitUrl
            })
        })
    }

    onNameChange(e: any) {
        let that = this

        that.setDataSmart({
            name: e.detail.value
        })
    }

    onNumberChange(e: any) {
        let that = this;
        that.setDataSmart({
            number: e.detail.value
        })
    }

    onBirthChange(e: any) {
        let that = this

        that.setDataSmart({
            birthDate: e.detail.value || ''
        })
    }

    onSexChange(e: any) {
        let that = this

        that.setDataSmart({
            sexIndex: parseInt(e.detail.value)
        })
    }

    onHeightChange(e: any) {
        let that = this

        that.setDataSmart({
            height: e.detail.value
        })
    }

    onWeightChange(e: any) {
        let that = this

        that.setDataSmart({
            weight: e.detail.value
        })
    }

    async onSubmit() {
        let that = this

        if (that.data.name.length == 0) {
            Toast.showText('请填写完整信息');
            return;
        }

        if (that.data.number.length != 11) {
            Toast.showText('手机号格式错误');
            return;
        }
        WXDialog.showDialog({title: '提示', content: '确认修改您的信息吗？', showCancel: true,confirmEvent:()=>{
                let birthTime = that.data.birthDate || '';
                console.log(`birth time: ${birthTime}`)
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
                    Protocol.accountUpdate(data).then((res: any) => {
                        return UserInfo.get();
                    }).then((res: any) => {
                        Toast.success('修改成功');
                        return UserInfo.set({...res.userInfo, ...data});
                    }).then(() => {
                        wx.navigateBack({delta: 1});
                    }).catch((res: any) => {
                        if (res.data.code == 2000) {
                            console.log('手机号重复');
                            Toast.showText('同一手机\n不能绑定两个账号')
                        } else {
                            Toast.success('修改失败');
                        }
                    });
                } catch (err) {
                    console.log("onSubmit error: %o", err)
                    Toast.showText('提交失败')
                }
            }});

    }


    chooseImage() {
        let that = this
        console.log('chooseImage');
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                Toast.showLoading();
                let path = res.tempFilePaths[0];
                wxp.uploadFile({
                    url: 'https://backend.hipee.cn/hipee-upload/hibox/mp/upload/image.do',
                    filePath: path,
                    name: path
                }).then((res: any) => {
                    console.log(res);
                    Toast.hiddenLoading();
                    let data = res.data;
                    let image = JSON.parse(data).result.img_url;
                    console.log('图片：', image);
                    that.setDataSmart({
                        portraitUrl: image
                    })
                })
            }
        })
    }
}
