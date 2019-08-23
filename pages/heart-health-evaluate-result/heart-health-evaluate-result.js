// pages/heart-health-evaluate/heart-health-evaluate.js
import HiNavigator from "../../components/navigator/hi-navigator";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        result: {},
        levels: [{
            level: 1,
            name: '极低',
            selected: false,
            primaryColor: '#7B6EEA',
            levelIconPosition: '14%'
        }, {
            level: 2,
            name: '较高',
            selected: false,
            primaryColor: '#FF9732',
            levelIconPosition: '48%'
        }, {
            level: 3,
            name: '很高',
            selected: false,
            primaryColor: '#F8695A',
            levelIconPosition: '82%'

        },],
        levelIconPosition: '',
        // subtitle: '<p>根据世卫组织估计，2012年有1750多万人死于心脏病发作或中风等心血管疾病。</p>\n' +
        //     '<p style="margin-top: 12px;">然而，好消息是80%的过早心脏病发作和中风是可以预防的。<span style="color: #7265E3;">健康饮食</span>、<span style="color: #7265E3;">经常锻炼身体</span>和<span style="color: #7265E3;">不使用烟草制品</span>是预防的关键。检查并控制心脏病和中风的危险因素，如高血压、高胆固醇和高血糖或糖尿病，也非常重要。</p>\n'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({title: '心脏健康评估'});
        const result = HiNavigator.getHeartHealthEvaluationResult(), level = parseInt(result.risk.level),
            levels = this.data.levels.map(item => {
                return {...item, selected: level === item.level}
            }),
            currentLevelObj = levels.filter(item => item.selected).pop();
        this.setData({
            levels,
            result,
            levelIconPosition: currentLevelObj ? currentLevelObj.levelIconPosition : '0'
        });
    },


});
