
// 此文件是由模板文件 ".dtpl/page/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板

import { pagify, MyPage, wxp } from 'base/'
import '../../extensions/Date.extensions'
import { Admin } from './../../utils/admin';
import { APIs } from './../../apis/request';

@pagify()
export default class extends MyPage {
  data = {
    sexies: ['女', '男', '未知'],
    sexIndex: 1,
    birthEndDate: new Date().format('yyyy-MM-dd'),
    birthDate: '',
    submitOpacity: 0.4,
    submitDisabled: true,
    name: '',
    doctor: '',
    hospital: ''
  }

  async onLoad(options: any) {
    // console.log(await wxp.getUserInfo())

    let that = this

    let userData = Admin.default().userData
    if (!!userData) {
      that.setDataSmart({
        name: userData.first_name,
        birthDate: !!userData.birthday ? new Date(userData.birthday * 1000).format('yyyy-MM-dd') : '',
        sexIndex: !!userData.sex ? userData.sex - 1 : 1,
        doctor: userData.doctor,
        hospital: userData.hospital
      })
    }

  }

  onNameChange(e: any) {
    let that = this

    that.setDataSmart({
      name: e.detail.value
    })

    that.enableSubmit()
  }

  onBirthChange(e: any) {
    let that = this

    // console.log('new date: %o', e.detail.value)
    that.setDataSmart({
      birthDate: e.detail.value
    })

    that.enableSubmit()
  }

  onSexChange(e: any) {
    let that = this

    that.setDataSmart({
      sexIndex: parseInt(e.detail.value)
    })

    that.enableSubmit()
  }

  onDoctor(e: any) {
    let that = this

    that.setDataSmart({
      doctor: e.detail.value
    })
  }

  onHospital(e: any) {
    let that = this

    that.setDataSmart({
      hospital: e.detail.value
    })
  }

  private enableSubmit() {
    let that = this

    const disabled = !that.data.name.length || !that.data.birthDate.length

    that.setDataSmart({
      submitDisabled: disabled,
      submitOpacity: !disabled ? 1 : 0.4
    })
  }

  async onSubmit() {
    let that = this
    const apis = APIs.default()

    let birthTime = Date.parse(that.data.birthDate) / 1000
    console.log(`birth time: ${birthTime}`)
    try {
      let data = {
        first_name: that.data.name,
        sex: <number>that.data.sexIndex + 1,
        birthday: birthTime,
        language_id: 1001,
        doctor: that.data.doctor,
        hospital: that.data.hospital
      }
      await apis.postRequest({
        url: 'bs/modify',
        data: data
      })
      Admin.default().userData = {
        first_name: data.first_name,
        sex: data.sex,
        birthday: data.birthday,
        language_id: data.language_id,
        doctor: data.doctor,
        hospital: data.hospital
      }

      await wxp.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 2000
      })

      // 回到首页
      let pages =  getCurrentPages();
      if (pages.length > 1) {
        that.app.$back(pages.length - 1)
      }

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
