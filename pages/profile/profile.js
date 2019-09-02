import UserInfo from "../../apis/network/network/libs/userInfo";
import HiNavigator from "../../components/navigator/hi-navigator";
import * as tools from "../../utils/tools";
import {dealRegister} from "../../utils/tools";
import {SoftwareVersion} from "../../utils/config";

Page({
    data: {
        userInfo: {},
        SoftwareVersion
    },
    observers: {
        async onLoginSuccess() {
            this.setData({...(await UserInfo.get())});
            // return {deliver: true};
        }
    },
    async onLoad() {

    },

    async onShow() {
        const {userInfo, userInfo: {nickName}} = await UserInfo.get();
        let name = tools.HandleShortName(nickName);
        this.setData({
            userInfo,
            name
        });
    },

    async toEditInfo() {
        await dealRegister();
        const {userInfo} = await UserInfo.get();
        getApp().globalData.editMember = userInfo;
        wx.navigateTo({
                url: '../userdata/userdata?isNormalMember=true'
            }
        );
    },

    async toMemeberListPage(e) {
        await dealRegister();
        HiNavigator.navigateToMemberList({state: 2});
    },

    clickCell2() {
        wx.navigateTo({url: '../disease-arrhyth/disease-arrhyth'})
    },

    clickCell3() {
        wx.navigateTo({url: '../feedback/feedback'})
    },
    async toShareCodePage() {
        await dealRegister();
        HiNavigator.navigateToShareCode();
    },
    toKnowledgePage() {
        HiNavigator.navigateToKnowledge();
    }
})
