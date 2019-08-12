const WAIT_TIME = 5000, radius = 80;

export class ArrhythStateManager {

    constructor(page) {
        this._page = page;
        this._page.onClickConnectedFail = () => {
            this.guider();
        };
        this._page.onConnectedFailedReason = () => {
            const remindDialog = this._page.selectComponent('#myDialog');
            remindDialog.show({title:'连接不上?',content:
                    '1、请检查网络状态和蓝牙是否开启；\n' +
                    '2、确认心电仪的蓝色指示灯是否亮起；\n' +
                    '3、将手机尽可能靠近心电仪；\n' +
                    '4、清理小程序后台进程，再进一遍看看是否能够重连；'})

        };
        this.connectedStateIndex = -1;
        this.remindIntervalIndex = -1;
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
        this._page.onConnectedFailedReason();
        this._page.setData({
            isGuider: true,
            isConnectedTimeout: true,
            isFilterArrhythData: false
        })
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
    circle.initCircleData({radius: getCircleRadius()});
    circle.drawCircleBg(that.data.maxCount);
    // setTimeout(()=>{
    query.select('#ecg').boundingClientRect((rect) => {
        that.data.ecgPannel = that.selectComponent('#ecg')
        console.log("ECG box rect: %o}", rect)
        // let ecg: any = that.data.ecgPannel
        // ecg.preparePannel(rect.width, rect.height)
        // that.data.ecgPannel.preparePannelDark(rect.width, rect.height);
        that.data.ecgPannel.preparePannelDark(rect.width, rect.height);
        that.data.ecgPannel.preparePannelDark(rect.width, rect.height);
        setTimeout(() => {
            startCountFun && startCountFun();
            that.startCount();
        }, WAIT_TIME);
        // ecg.preparePannelDark(rect.width, rect.height);
    }).exec()
}
