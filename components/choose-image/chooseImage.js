import Toast from "../../base/heheda-common-view/toast";

export default class ChoseImage {
    static chose() {
        return new Promise((resolve, reject) => {
            console.log('chooseImage');
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: (res) => {
                    Toast.showLoading();
                    let path = res.tempFilePaths[0];
                    wx.uploadFile({
                        url: 'https://backend.hipee.cn/hipee-upload/hibox/mp/upload/image.do',
                        filePath: path,
                        name: path,
                        success(res) {
                            console.log(res);
                            Toast.hiddenLoading();
                            let data = res.data;
                            let image = JSON.parse(data).result.img_url;
                            console.log('图片：', image);
                            resolve(image);
                        }
                    })
                }
            })
        })
    }
}
