let _cancelColor = '#000000', _confirmColor = '#D16730';

export default class WXDialog {

    static setConfig({cancelColor, confirmColor}) {
        _cancelColor = cancelColor;
        _confirmColor = confirmColor;
    }


    static showDialog({title = '', content, showCancel = false, cancelText = '取消', cancelColor = _cancelColor, confirmText = '确定', confirmColor = _confirmColor, confirmEvent, cancelEvent, completeEvent}) {
        wx.showModal({
            title,
            content,
            showCancel,
            cancelText,
            confirmText,
            success: res => {
                if (res.confirm) {
                    confirmEvent && confirmEvent();
                } else {
                    cancelEvent && cancelEvent();
                }
            },
            fail: res => {
                console.log(res);
            },
            cancelColor,
            confirmColor,
            complete: completeEvent
        })
    }
}
