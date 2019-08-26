// pages/ill-history/ill-history.js
import HiNavigator from "../../components/navigator/hi-navigator";
import Protocol from "../../apis/network/protocol";
import WXDialog from "../../utils/dialog";
import Toast from "../../base/heheda-common-view/toast";
import UserInfo from "../../apis/network/network/libs/userInfo";
import * as tools from "../../utils/tools";

Page({
    data: {
        illItem: [
            {
                image: {chose: 'item0-chose', nor: 'item0-nor'},
                text: '高血压',
                isChose: false,
                isNorItem: true,
                en: 'hypertension'
            },
            {
                image: {chose: 'item1-chose', nor: 'item1-nor'},
                text: '心脏病',
                isChose: false,
                isNorItem: true,
                en: 'cardiopathy'
            },
            {
                image: {chose: 'item2-chose', nor: 'item2-nor'},
                text: '糖尿病',
                isChose: false,
                isNorItem: true,
                en: 'diabetes'
            },
            {
                image: {chose: 'item3-chose', nor: 'item3-nor'},
                text: '以上均无',
                isChose: false,
                isNorItem: false,
            }
        ],
        haveHistoryIll: false,
        result: {},
        isFirstInto: false
    },

    onLoad(option) {
        let userInfo = getApp().globalData.editMember;
        if (option.isFirstInto != 'false') {
            this.setData({
                isFirstInto: option.isFirstInto
            });
        }

        if (userInfo.isNewMember) {
            return;
        }

        if (!userInfo.diseaseNull) {
            let illItem = this.data.illItem;
            illItem[0].isChose = userInfo.hypertension;
            illItem[1].isChose = userInfo.cardiopathy;
            illItem[2].isChose = userInfo.diabetes;
            if (!userInfo.hypertension && !userInfo.cardiopathy && !userInfo.diabetes) {
                illItem[3].isChose = true;
            }
            this.setData({
                illItem: illItem
            });
        }
    },

    clickItem(e) {
        let index = e.currentTarget.dataset.index;
        if (this.data.illItem[index].isNorItem) {
            this.data.illItem.map((value, mapIndex) => {
                if (value.isNorItem) {
                    if (index == mapIndex) {
                        value.isChose = !value.isChose;
                    }
                } else {
                    value.isChose = false;
                }
            })
        } else {
            this.data.illItem.map(value => {
                value.isChose = !value.isNorItem
            })
        }
        this.setData({
            illItem: this.data.illItem
        })
    },

    save() {
        let result = {};
        this.data.illItem.map(value => {
            if (value.en) {
                result[value.en] = value.isChose ? 1 : 0;
            }
            if (value.isChose && !this.data.haveHistoryIll) {
                this.setData({
                    haveHistoryIll: true
                })
            }
        });
        if (this.data.isFirstInto) {
            this.saveUserInfo({ill: result});
        } else if (this.data.haveHistoryIll) {
            this.saveUserInfoDialog({ill: result})
        } else {
            Toast.showText('请选择是否有病史');
        }
    },

    saveUserInfoDialog({ill}) {
        let dialogTitle = getApp().globalData.editMember.isNewMember ? '确认添加此成员吗？' : '确认修改您的信息吗？';
        WXDialog.showDialog({
            title: '提示', content: dialogTitle, showCancel: true, confirmEvent: () => {
                this.saveUserInfo({ill});
            }
        });
    },

    async saveUserInfo({ill}) {
        let data = {...getApp().globalData.editMember, ...ill};
        Toast.showLoading();
        console.log('保存信息：', data);
        try {
            if (data.isNewMember) {
                await Protocol.accountCreate(data);
            } else if (data.isNormalMember) {
                await Protocol.accountUpdate(data);
                data.age = tools.jsGetAge(data.birthday);
                const userInfo = await UserInfo.get().userInfo;
                UserInfo.set({...userInfo, ...data, diseaseNull: 0});
                getApp().globalData.editMember = {};
            } else {
                await Protocol.memberRelevanceUpdate(data);
                if (getApp().globalData.currentMember.memberId === data.memberId) {
                    getApp().globalData.currentMember = data
                }
            }
            this.editFinish();
        } catch (e) {
            this.editErr(e.data.code);
        } finally {
            Toast.hiddenLoading();
        }
    },

    editFinish() {
        if (this.data.isFirstInto) {
            HiNavigator.relaunchToStart();
        } else {
            HiNavigator.navigateBack({
                delta: 2
            })
        }
    },

    editErr(code) {
        switch (code) {
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
    },

    back() {
        HiNavigator.navigateBack({
            delta: 1
        })
    }
})