import {WXDialog} from "heheda-common-view";
import CommonProtocol from "../apis/network/network/libs/protocol";

const updateManager = wx.getUpdateManager();

updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    console.log('检测是否有更新', res.hasUpdate)
});

updateManager.onUpdateReady(async function () {
    const result = await CommonProtocol.getSoftwareUpdateText();
    WXDialog.showDialog({
        title: '版本更新',
        content: result,
        confirmText: '立即更新',
        confirmEvent: () => updateManager.applyUpdate()
    });
});

updateManager.onUpdateFailed(function (res) {
    // 新版本下载失败
    console.log('更新失败', res);
});
