// pages/heart-health-evaluate/heart-health-evaluate.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        evaluation: {smoke: -1, press: -1, sugar: -1}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({title: '心脏健康评估'});

    },

    onSelectedSmoke(e) {
        const {currentTarget: {dataset: {smoke}}} = e;
        this.setData({'evaluation.smoke': parseInt(smoke)});
    },
    onSelectedPress(e) {
        const {currentTarget: {dataset: {press}}} = e;
        this.setData({'evaluation.press': parseInt(press)});
    },
    onSelectedSugar(e) {
        const {currentTarget: {dataset: {sugar}}} = e;
        console.log(sugar);
        this.setData({'evaluation.sugar': parseInt(sugar)});
    }
});
