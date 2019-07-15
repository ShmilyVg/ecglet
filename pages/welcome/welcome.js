// pages/welcome/welcome.js
import {dealAuthUserInfo} from "../../utils/tools";
import HiNavigator from "../../components/navigator/hi-navigator";
import Toast from "../../utils/toast";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentIndex: 0,
        items: [{title: '多种检测模式', content: '常规心电监测，心脏负荷监测', path: 'item1'},
            {
                title: '即时心电图',
                content: '心动曲线时时显示，检测数据即时呈现',
                path: 'item2'
            }, {title: '医院专业报告', content: '三甲医院信息中心，线上输出报告', path: 'item3'},]
    },
    onClick() {
        console.log('onClick');
        Toast.showLoading();
    },
    bindGetUserInfo(e) {
        console.log(e);
        dealAuthUserInfo(e).then((res) => {
            this.setData({userInfo: res.userInfo});
            HiNavigator.relaunchToStart();
        }).catch((res) => {
            console.log(res);
        }).finally(() => {
            Toast.hiddenLoading();
        });
    },
    onWelcomeItemChanged(e) {
        const {detail: {current}} = e;
        this.setData({currentIndex: current});
    }
});
