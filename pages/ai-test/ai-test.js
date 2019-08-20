// pages/ai-test/ai-test.js

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        function* dataConsumer() {
            console.log('Started1');
            console.log('Started2');
            console.log(`1. ${yield}`);
            console.log('Started3');

            console.log(`2. ${yield}`);
            return 'result';
        }

        let genObj = dataConsumer();
        genObj.next();
// Started
        genObj.next('a')
// 1. a
//         genObj.next('b')
// 2. b

    },
    onTap() {
        //无需关心
        let query = this.createSelectorQuery();
        //fileManager小程序的文件管理系统
        //ecg 心电图绘制组件
        const ecg = this.selectComponent('#ecg'), fileManager = wx.getFileSystemManager();
        //无需关心
        query.select('#ecg').boundingClientRect((rect) => {
            console.log("ECG box rect: %o}", rect);
            ecg.preparePannelDark(rect.width, rect.height);
        }).exec();
        //选择ecg文件
        wx.chooseMessageFile({
            count: 1,//一次选择的最大文件数量
            type: 'file',
            success(res) {
                const {tempFiles} = res;
                tempFiles.forEach(item => {
                    //path：选择的文件路径。
                    //readFileSync接口可指定读取文件的字符编码，如果没指定，则以ArrayBuffer格式读取文件的二进制内容
                    //获取的data就是ArrayBuffer格式数据，每一位是1个字节
                    const data = fileManager.readFileSync(item.path);
                    //以下是绘制心电图的代码
                    //这边在绘制心电图时，每20个字节数据作为一组进行绘制
                    const maxDataLength = 20, partLength = Math.floor(data.byteLength / maxDataLength);
                    let i = 0;
                    const intervalIndex = setInterval(() => {
                        ecg.drawWaveDark(new Int16Array(data.slice(i * maxDataLength, maxDataLength * (i + 1))));
                        i++;
                        if (i >= partLength) {
                            clearInterval(intervalIndex);
                        }
                    }, 20);
                })


            }
        })
    }
});
