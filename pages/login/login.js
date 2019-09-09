// pages/login/login.js
import WXDialog from "../../base/heheda-common-view/dialog";

Page({

    data: {
        content: [
            '需要获取您的性别，用于计算出符合您个人真实情况的心电检测结果；',
            '授权后才能够支持“同步检测记录给家人”的功能、检测结果异常的推送服务'
        ]
    },

    onLoad(options) {

    },

    bindGetUserInfo(e) {
        const {detail: {errMsg}} = e;
        if (errMsg === "getUserInfo:ok") {

        } else {
            this.cancel();
        }
    },

    cancel() {
        WXDialog.showDialog({content: '因您拒绝授权，无法使用更多专业服务'})
    }
})