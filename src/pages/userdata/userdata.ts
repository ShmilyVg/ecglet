// 此文件是由模板文件 ".dtpl/page/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板

import {pagify, MyPage, wxp} from 'base/'
import '../../extensions/Date.extensions'
// @ts-ignore
import Protocol from "../../apis/network/protocol";
// @ts-ignore
import Toast from "../../base/heheda-common-view/toast";
// import {Admin} from './../../utils/admin';
// var request_1 = require("../../apis/request");
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

        // console.log('new date: %o', e.detail.value)
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
        // const apis = APIs.default()

        let birthTime = that.data.birthDate || '';
        console.log(`birth time: ${birthTime}`)
        try {
            let data = {
                nickName: that.data.name,
                phone: that.data.number,
                sex: that.data.sexIndex,
                birthday: birthTime,
                height: that.data.height,
                weight: that.data.weight
            }
            // await apis.postRequest({
            //     url: 'bs/modify',
            //     data: data
            // })
            console.log('保存信息：', data);
            Protocol.accountUpdate(data).then(() => {
                return UserInfo.get();
            }).then((res: any) => {
                Toast.success('修改成功');
                return UserInfo.set({...res.userInfo, ...data});
            }).then(() => {
                wx.navigateBack({delta: 1});
            }).catch(() => {
                Toast.success('修改失败');
            });


            // Admin.default().userData = {
            //     first_name: data.first_name,
            //     sex: data.sex,
            //     birthday: data.birthday,
            //     language_id: data.language_id,
            //     doctor: data.doctor,
            //     hospital: data.hospital
            // }
            //
            // await wxp.showToast({
            //     title: '修改成功',
            //     icon: 'success',
            //     duration: 2000
            // })
            //
            // // 回到首页
            // let pages = getCurrentPages();
            // if (pages.length > 1) {
            //     that.app.$back(pages.length - 1)
            // }

        } catch (err) {
            console.log("onSubmit error: %o", err)
            await wxp.showToast({
                title: '提交失败',
                icon: 'none',
                duration: 2000
            })
        }
    }
}
