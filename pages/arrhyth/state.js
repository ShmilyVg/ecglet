export class ArrhythStateManager {

    constructor(page) {
        this._page = page;
    }

    guider() {
        this._page.setData({
            isGuider: true
        })
    }

    prepare() {
        this._page.setData({
            isGuider: false
        }, () => {
            showCanvasView(this._page);
        })
    }

    test() {

    }

    testSuccess() {

    }

    connectedFailed() {
        this._page.setData({
            isGuider: true
        })
    }

}

function showCanvasView(page) {
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
            that.startCount();
        });
        // ecg.preparePannelDark(rect.width, rect.height);
    }).exec()
}
