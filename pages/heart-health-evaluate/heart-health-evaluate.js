// pages/heart-health-evaluate/heart-health-evaluate.js
import Toast from "../../utils/toast";
import HiNavigator from "../../components/navigator/hi-navigator";
import Protocol from "../../apis/network/protocol";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        evaluation: {smoke: -1, press: -1, sugar: -1, systolic: ''}
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
    },
    onGetMemberDisease(e) {
        console.log(e);
        const {detail: {disease: {hypertension, diabetes}}} = e, obj = {};
        obj['evaluation.press'] = hypertension ? 1 : 0;//高血压
        obj['evaluation.sugar'] = diabetes ? 1 : 0;//糖尿病
        this.setData(obj);
    },
    onInputEvent(e) {
        const {detail: {value}} = e;
        this.data.evaluation.systolic = value.trim();
    },
    HeartHealthEvaluationConfirm() {
        const {evaluation: {smoke, press, sugar, systolic}} = this.data;
        if (smoke === -1 || press === -1 || sugar === -1 || !systolic) {
            Toast.showText('请完善表单各项内容');
            return;
        }
        const userInfo = this.selectComponent('#switchMemberView').getUserInfo();

        Toast.showLoading('评估中，请稍候');
        Protocol.getHeartHealthEvaluationResult().then(data => {
            HiNavigator.navigateToHeartHealthEvaluationResult({result: data.result});
        }).catch(res => {
            console.error(res);
            Toast.showText('评估失败，请重试');
        }).finally(Toast.hiddenLoading);
    }


});
