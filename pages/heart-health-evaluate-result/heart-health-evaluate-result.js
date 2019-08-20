// pages/heart-health-evaluate/heart-health-evaluate.js
import Toast from "../../utils/toast";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        "img": "",
        "contents": [{
            "img": "",
            "subtitle": "",
            "title": "健康饮食",
            "content": [{
                "title": "",
                "content": "健康饮食：总脂肪量摄入量应降至约占总热量的30％;饱和脂肪，即我们平时吃的肉类，鸡，鸭，鱼等各种脂肪，摄入量应降至占总热量的10％以下，尽量减少甚至停止反式脂肪酸的摄入，如人造黄油，人造奶油，咖啡伴侣，西式糕点，薯片，炸薯条，珍珠奶茶等。"
            }, {"title": "", "content": "鼓励所有人减少日常盐摄入量三分之一以上，如有可能，应限制在每日<5克或<90mmol。"}]
        }, {
            "img": "",
            "subtitle": "",
            "title": "经常锻练身体",
            "content": [{"title": "", "content": "鼓励所有人每天至少有30分钟的中度身体活动（如，快步走）"}]
        }, {
            "img": "",
            "subtitle": "",
            "title": "戒烟",
            "content": [{
                "title": "",
                "content": "强烈建议所有吸烟者戒烟，建议所有不吸烟者不要开始吸烟。\n                尽可能避免被动吸烟。\n                如果戒烟无果可以尝试尼古丁替代疗法，但需要在医师指导下进行，对尼古丁过敏者，心肌梗死，心绞痛，严重心律失常，急性卒中者禁用。"
            }]
        }, {
            "img": "",
            "subtitle": "",
            "title": "减少酒精摄入",
            "content": [{
                "title": "",
                "content": "建议每日饮酒量超过3单位饮酒量者减少酒精摄入。注：1单位饮酒量=半品脱的啤酒/淡味啤酒（含5％酒精），100毫升葡萄酒（含10％酒精）或25毫升烈性酒（含40％酒精）"
            }]
        }, {
            "img": "",
            "subtitle": "",
            "title": "控制体重",
            "content": [{"title": "", "content": "应鼓励所有超重或肥胖者，提供膳食建议结合运动降低体重;"}]
        }],
        "subtitle": [{"content": "根据世卫组织估计，2012年有1750多万人死于心脏病发作或中风等心血管疾病。"}, {"content": "然而，好消息是80％的过早心脏病发作和中风是可以预防的。健康饮食，经常锻练身体状语从句：不使用烟草制品的英文预防的关键。检查并控制心脏病和中风的危险因素，如高血压，高胆固醇和高血糖或糖尿病，也非常重要。"}],
        "title": "改善建议",


        level: [{
            name: '极低',
            selected: false,
            primaryColor:  '#7B6EEA'
        },{
            name: '较高',
            selected:true,
            primaryColor:  '#FF9732'
        },{
            name: '很高',
            selected:false,
            primaryColor:  '#F8695A'
        },]

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.resultId = options.resultId;
        wx.setNavigationBarTitle({title: '心脏健康评估'});

    },


});
