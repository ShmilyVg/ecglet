// pages/heart-health-evaluate/heart-health-evaluate.js
import Toast from "../../utils/toast";

Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.resultId = options.resultId;
        wx.setNavigationBarTitle({title: '心脏健康评估'});

    },



});
