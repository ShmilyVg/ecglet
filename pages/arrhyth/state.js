export class ArrhythStateManager {

    constructor(page) {
        this._page = page;
        this._page.onClickConnectedFail = () => {
            this.guider();
        };
        this.connectedStateIndex = -1;
        // this.prepareStateIndex = -1;
    }

    isFilterData() {
        return this._page.data.isFilterArrhythData;
    }

    guider() {
        this._page.setData({
            isGuider: true,
            isConnectedFailed: false,
            isFilterArrhythData:true
        }, () => {
            this.connectedStateIndex = setTimeout(() => {
                this.connectedFailed();
            }, 1000);
        })
    }

    prepare() {
        this._page.setData({
            isGuider: false,
            isConnectedFailed: false,
            isFilterArrhythData: true
        }, () => {
            showCanvasView(this._page, () => {
                this._page.setData({
                    isFilterArrhythData: false
                })
            });
        });
    }



    test() {

    }

    testSuccess() {

    }

    connectedFailed() {
        clearTimeout(this.connectedStateIndex);
        this._page.setData({
            isGuider: true,
            isConnectedFailed: true,
            isFilterArrhythData:false
        })
    }

}

function showCanvasView(page, startCountFun) {
    let that = page;

    let query = that.createSelectorQuery()

    that.data.progressCircle = that.selectComponent('#circle1')
    let circle = that.data.progressCircle
    circle.drawCircleBg('circle_bg1', 100)
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
        }, 5000);
        // ecg.preparePannelDark(rect.width, rect.height);
    }).exec()
}
