import WXDialog from "../../utils/dialog";
import {RandomRemindData} from "../../utils/tips";

const WAIT_TIME = 4500, radius = 80;

export class ArrhythStateManager {

    constructor(page) {
        this._page = page;
        this._page.onClickConnectedFail = () => {
            this.guider();
        };
        this._page.onConnectedFailedReason = () => {
            WXDialog.showDialog({
                title: '连接不上?', content:
                    '1、请检查网络状态和蓝牙是否开启 ；\n' +
                    '2、 确认心电仪的蓝色指示灯是否亮起；\n' +
                    '3、将手机尽可能靠近心电仪；\n' +
                    '4、清理小程序后台进程，再进一遍看看是否能够重连；'
            })

        };
        this.connectedStateIndex = -1;
        this.remindIntervalIndex = -1;
        this.showOptions = {
            duration: 500,
            timingFunction: 'linear',
            delay: 300,
            transformOrigin: '50% 50% 0'
        };
        this.hiddenOptions = {
            duration: 500,
            timingFunction: 'linear',
            delay: 6000,
            transformOrigin: '50% 50% 0'
        };
        this.animation = wx.createAnimation();
        this.randomRemindData = new RandomRemindData();
        // this.prepareStateIndex = -1;
    }



    isFilterData() {
        return this._page.data.isFilterArrhythData;
    }

    guider() {
        this._page.setData({
            isGuider: true,//是否是引导页
            isConnectedTimeout: false,//；连接失败页面
            isFilterArrhythData: true//是否5s内过滤数据
        }, () => {
            this.connectedStateIndex = setTimeout(() => {
                this.connectedFailed();
            }, 60000);
        });
    }

    prepare() {
        this.randomRemindData.random();
        clearTimeout(this.connectedStateIndex);
        clearInterval(this.remindIntervalIndex);
        this._page.setData({
            isGuider: false,
            isConnectedTimeout: false,
            isFilterArrhythData: true
        }, () => {

            showCanvasView(this._page, () => {
                this._page.setData({
                    isFilterArrhythData: false,
                });
                this.remindAnimation();
                // setTimeout(() => {
                //     this.animation.opacity(0).step();
                //     this._page.setData({
                //         tipAnimationData: this.animation.export()
                //     });
                // }, 5500);
            });
        });
    }


    test() {

    }

    testSuccess() {

    }

    connectedFailed() {
        clearTimeout(this.connectedStateIndex);
        clearInterval(this.remindIntervalIndex);
        this._page.setData({
            isGuider: true,
            isConnectedTimeout: false,
            isFilterArrhythData: false
        })
    }


    remindAnimation() {
        // this.animation.opacity(1).step(this.showOptions);
        // this._page.setData({
        //     tipAnimationData: this.animation.export()
        // }, () => {
        //     setTimeout(() => {
        //         this.animation.opacity(0).step(this.hiddenOptions);
        //         this._page.setData({
        //             tipAnimationData: this.animation.export()
        //         }, this.remindAnimationAlways.bind(this, {showFun, hiddenFun}));
        //     }, this.showOptions.delay);
        // });
        this.remindAnimationAlways({
            showFun: () => {
                this.animation.opacity(1).step(this.showOptions);
            }, hiddenFun: () => {
                this.animation.opacity(0).step(this.hiddenOptions);
            }
        })
    }

    remindAnimationAlways({showFun, hiddenFun}) {
        showFun();
        this._page.setData({
            tip: this.randomRemindData.getRemindData(),
            tipAnimationData: this.animation.export()
        }, () => {
            setTimeout(() => {
                hiddenFun();
                this._page.setData({
                    tipAnimationData: this.animation.export()
                }, () => {
                    setTimeout(() => {
                        console.log('开始重复');
                        !!this._page.data.countTimer && this.remindAnimationAlways({showFun, hiddenFun});
                    }, this.hiddenOptions.delay + this.hiddenOptions.duration);
                });
            }, this.showOptions.delay + this.showOptions.duration);
        });
    }
}
export function getCircleRadius() {
    return radius;
}
function showCanvasView(page, startCountFun) {
    let that = page;

    let query = that.createSelectorQuery()

    that.data.progressCircle = that.selectComponent('#circle1')
    let circle = that.data.progressCircle
    circle.drawCircleBg('circle_bg1', getCircleRadius(), that.data.maxCount);
    // setTimeout(()=>{
    query.select('#ecg').boundingClientRect((rect) => {
        that.data.ecgPannel = that.selectComponent('#ecg')
        console.log("ECG box rect: %o}", rect)
        // let ecg: any = that.data.ecgPannel
        // ecg.preparePannel(rect.width, rect.height)
        that.data.canvasWidth = rect.width;
        that.data.canvasHeight = rect.height;
        that.preparePannelDark('white');
        setTimeout(() => {
            startCountFun && startCountFun();
            that.startCount();
        }, WAIT_TIME);
        // ecg.preparePannelDark(rect.width, rect.height);
    }).exec()
}
