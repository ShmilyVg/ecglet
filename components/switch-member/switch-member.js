Component({
    properties: {
        userInfo:{
            type:Object,
            value: {}
        }
    },
    data: {

    },


    methods:{
        switchMember(){
            // let myEventDetail = {} // detail对象，提供给事件监听函数
            // let myEventOption = {} // 触发事件的选项
            this.triggerEvent('switchMember');
        }

    },
    lifetimes:{
        created() {

        },
        attached() {

        },
        detached() {

        }
    },
});
