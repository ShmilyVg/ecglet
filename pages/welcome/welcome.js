// pages/welcome/welcome.js
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    onWelcomeItemChanged(e) {
        const {detail: {current}} = e;
        console.log('current', current);
        this.setData({currentIndex: current});
    }
});
