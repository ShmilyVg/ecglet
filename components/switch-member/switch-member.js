import * as Tools from "../../utils/tools";
import UserInfo from "../../apis/network/network/libs/userInfo";
import Protocol from "../../apis/network/protocol";
import HiNavigator from "../navigator/hi-navigator";

const app = getApp();
Component({
    properties: {},
    data: {
        userInfo: {}
    },


    methods: {
        getUserInfo() {
            return this.data.userInfo;
        },
        switchMember() {
            // let myEventDetail = {} // detail对象，提供给事件监听函数
            // let myEventOption = {} // 触发事件的选项
            HiNavigator.navigateToMemberList({state: 1});
        },
        _whenUpdateUserInfo({userInfo}) {
            console.log('当前选择的用户信息', userInfo);
            this.setData({userInfo}, async () => {
                const {result: {data}} = await Protocol.memberDiseaseGetMemberHistory({relevanceId: userInfo.relevanceId});
                const myEventDetail = {disease: {...data}};
                this.triggerEvent('onGetMemberDisease', myEventDetail);
            });
        }

    },
    lifetimes: {
        created() {

        },
        attached() {

        },
        detached() {

        }
    },
    pageLifetimes: {
       async show() {
            // 页面被展示
            const currentMember = app.globalData.currentMember;
            if (currentMember && currentMember.memberId) {
                currentMember.shortName = Tools.HandleShortName(currentMember.nickName);
                this._whenUpdateUserInfo({userInfo: currentMember});
            } else {
                const {userInfo, userInfo: {nickName}} = await UserInfo.get();
                this._whenUpdateUserInfo({userInfo: {...userInfo, shortName: Tools.HandleShortName(nickName)}});
            }
        },
        hide() {
            // 页面被隐藏
        },
        resize(size) {
            // 页面尺寸变化
        }
    }
});
