import {pagify, MyPage, wxp} from 'base/'
import {Admin} from './../../utils/admin'

@pagify()
export default class extends MyPage {
    data = {
        userData: {},
        phone: '4009210610'
    }

    async onLoad(options: any) {
        // console.log(await wxp.getUserInfo())
    }

    async onShow() {
        let that = this
        let userData = Admin.default().userData

        that.setDataSmart({
            userData: userData
        })
    }

    getPhoneNumber(e: any) {
        if (e.detail.errMsg == 'getPhoneNumber:ok') {

        }
    }

    async call() {
        let that = this

        await wxp.makePhoneCall({
            phoneNumber: that.data.phone
        })
    }

    async toEditInfo() {
        wx.navigateTo({
                url: '../userdata/userdata'
            }
        )
    }

    async clickCell1() {
        wx.navigateTo({url: '../history/history'})
    }

    async clickCell2() {
        console.log('ceshidwe2');
    }

    async clickCell3() {
        console.log('ceshidwe3');
    }
}