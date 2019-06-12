// 此文件是由模板文件 ".dtpl/page/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板

import {pagify, MyPage, wxp} from 'base/'
import '../../extensions/Date.extensions'
// import {Admin} from './../../utils/admin';
// import {APIs} from './../../apis/request';

@pagify()
export default class extends MyPage {
    data = {
        sexies: ['女', '男', '未知'],
        sexIndex: 1,
        birthEndDate: new Date().format('yyyy-MM-dd'),
        birthDate: '请选择出生日期',
        submitOpacity: 0.4,
        submitDisabled: true,
        name: '',
        height: '',
        weight: '',
        number: ''
    }

    async onLoad(options: any) {
        // console.log(await wxp.getUserInfo())

        // let that = this
        //
        // let userData = Admin.default().userData
        // if (!!userData) {
        //     that.setDataSmart({
        //         name: userData.first_name,
        //         birthDate: !!userData.birthday ? new Date(userData.birthday * 1000).format('yyyy-MM-dd') : '',
        //         sexIndex: !!userData.sex ? userData.sex - 1 : 1,
        //         doctor: userData.doctor,
        //         hospital: userData.hospital
        //     })
        // }

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
            birthDate: e.detail.value
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

        let birthTime = Date.parse(that.data.birthDate) / 1000
        console.log(`birth time: ${birthTime}`)
        try {
            let data = {
                name: that.data.name,
                number: that.data.number,
                sex: <number>that.data.sexIndex + 1,
                birthday: that.data.birthDate,
                height: that.data.height,
                weight: that.data.weight
            }
            // await apis.postRequest({
            //     url: 'bs/modify',
            //     data: data
            // })

            console.log('保存信息：', data);

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
