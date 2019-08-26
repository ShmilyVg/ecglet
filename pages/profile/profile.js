import UserInfo from "../../apis/network/network/libs/userInfo";
import HiNavigator from "../../components/navigator/hi-navigator";
import * as tools from "../../utils/tools";
import {SoftwareVersion} from "../../utils/config";

Page({
    data: {
        userInfo: {},
        SoftwareVersion
    },

    onLoad() {
        getApp().onLoginSuccess = async () => {
            this.setData({userInfo: await UserInfo.get()});
        };
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
        const {userInfo} = await UserInfo.get();
        getApp().globalData.editMember = userInfo;
        wx.navigateTo({
                url: '../userdata/userdata?isNormalMember=true'
            }
        );
    },

    toMemeberListPage(e) {
        HiNavigator.navigateToMemberList({state: 2});
    },

    clickCell2() {
        wx.navigateTo({url: '../disease-arrhyth/disease-arrhyth'})
    },

    clickCell3() {
        wx.navigateTo({url: '../feedback/feedback'})
    },
    toShareCodePage() {
        HiNavigator.navigateToShareCode();
    },
    toKnowledgePage() {
        HiNavigator.navigateToKnowledge();
    }
})
