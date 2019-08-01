Component({
    properties: {
        title: {
            type:String,
            value: ''
        },
        content:{
            type:String,
            value: ''
        }
    },
    data: {
        title: '',
        confirmText: '确定',
        confirmTextColor: '',
        cancelText: '取消',
        cancelTextColor: '',
        showDialog: false,
        showCancel: false
    },
    methods: {

        show({title = '', content = '', confirmEvent, confirmText = '确定', confirmTextColor, cancelEvent, cancelText = '取消', cancelTextColor, showCancel = false}) {
            this.setData({
                title, content, confirmText, cancelText, showCancel,
                showDialog: true
            });
        },

        _confirmEvent() {
            console.log('回调_confirmEvent');
            this._cancelEvent();
        },

        _cancelEvent() {
            console.log('回调_cancelEvent');
            this.setData({showDialog: false});
        },

        _update() {
            this.setData(this.data);
        }
    },
    created() {

    }});
