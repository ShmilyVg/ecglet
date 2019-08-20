import {RandomRemindData} from "../../utils/tips";

Component({
    properties: {
        type:{
            type:Number,
            value: 1
        }
    },
    data: {
        tip: '',
        opacity: 1
    },


    methods:{

        remindAnimation() {
            this.remindAnimationAlways({
                showFun: () => {
                    this.setData({opacity: 1});
                }, hiddenFun: () => {
                    this.setData({opacity: 0});
                }
            })
        },

        remindAnimationAlways({showFun, hiddenFun}) {
            showFun();
            this.setData({
                tip: this.randomRemindData.getRemindData(),
                // tipAnimationData: this.animation.export()
            }, () => {
                setTimeout(() => {
                    hiddenFun();
                    setTimeout(() => {
                        // !!this.data.countTimer && this.remindAnimationAlways({showFun, hiddenFun});
                        this.isCircly && this.remindAnimationAlways({showFun, hiddenFun});
                    }, this.hiddenOptions.delay + this.hiddenOptions.duration);
                }, this.showOptions.delay + this.showOptions.duration);
            });
        }
    },
    lifetimes:{
        created() {
            this.randomRemindData = new RandomRemindData();
            this.showOptions = {
                duration: 800,
                timingFunction: 'linear',
                delay: 6000,
                transformOrigin: '50% 50% 0'
            };
            this.hiddenOptions = {
                duration: 1000,
                timingFunction: 'linear',
                delay: 0,
                transformOrigin: '50% 50% 0'
            };
        },
        attached() {
            console.log('opacity-text 链接到页面', this.data);

            this.isCircly = true;
            this.randomRemindData.random({type: this.data.type});
            this.remindAnimation();
        },
        detached() {
            console.log('opacity-text 移除节点');
            this.isCircly = false;
            this.randomRemindData = null;
        }
    },
});
