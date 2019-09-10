import Toast from "../../base/heheda-common-view/toast";
import * as config from "../../utils/config";

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
                    wx.compressImage({
                        src: res.tempFilePaths[0], // 图片路径
                        quality: 40, // 压缩质量
                        success: res => {
                            const path = res.tempFilePath;
                            wx.uploadFile({
                                url: config.UploadUrl,
                                filePath: path,
                                name: path,
                                success(res) {
                                    console.log(res);
                                    Toast.hiddenLoading();
                                    let data = res.data;
                                    let image = JSON.parse(data).result.img_url;
                                    console.log('上传图片：', image);
                                    resolve(image);
                                }, fail: reject
                            })
                        },
                        fail: reject
                    });

                },
                fail: reject
            })
        })
    }
}
