Component({
    /**
     * 组件的属性列表
     */
    properties: {
        bg: {
            type: String,
            value: 'bg'
        },
        draw: {
            type: String,
            value: 'draw'
        },
        maxCount: {
            type: Number,
            value: 15,
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        size: 0,
        step: 1,
        num: 100,
        rpx: 1,
        maxPointNum: 15,
        ctx: {},
        textWidth: 0
    },

    options: {
        multipleSlot: true
    },
    methods: {
        drawCircleBg(id, radius) {
            //源代码 start------------
            // let that = this
            // const r = radius * that.data.rpx
            // const w = width * that.data.rpx
            // that.setData({
            //   size: 2 * r
            // })
            // const ctx = wx.createCanvasContext(id, that)
            // ctx.setLineWidth(w / 2)
            // // ctx.setStrokeStyle('#20183b')
            // ctx.setStrokeStyle('#bbb')
            // ctx.setLineCap('round')
            // ctx.beginPath()
            // ctx.arc(r, r, r - w, 0, 2 * Math.PI, false)
            // ctx.stroke()
            // ctx.draw()
            //源代码 end------------

            this.drawCircle('circle_draw1', radius, -1);
        },

        drawCircle(id, radius, step) {
            let that = this;
            const textWidth = that.data.textWidth, r = radius * that.data.rpx;
            if (!that.data.size) {
                that.setData({
                    size: 2 * r
                });
            }
            const ctx = wx.createCanvasContext(id, that), x1 = r, maxPointNum = that.data.maxPointNum,maxCount = that.data.maxCount,
                smallRadius = r / 12, y1 = smallRadius,
                wholeDegree = 2 * Math.PI, a = 2 * Math.PI / maxPointNum, circleRadius = r - smallRadius,
                currentStep = Math.floor(step / (maxCount * 2 / maxPointNum));
            console.log('currentStep', currentStep);

            let x = x1, y = y1;
            for (let i = 1; i <= maxPointNum; i++) {
                ctx.beginPath();
                ctx.setFillStyle(currentStep >= i ? 'white' : '#257AD1');
                ctx.arc(x, y, smallRadius, 0, wholeDegree, false);
                ctx.fill();
                const degree = a * i;
                x = x1 + circleRadius * Math.sin(degree);
                y = y1 + circleRadius - circleRadius * Math.cos(degree);
            }
            if (step !== -1) {
                ctx.setFontSize(43);
                const currentNum = maxCount * 2 - step,
                    maxWidthText1 = 30 * (currentNum < 100 ? 2 : 3) ,
                    maxWidthText2 = 72,
                    centerX1 = r - maxWidthText1 / 2.4,
                    centerX2 = r - maxWidthText2 / 3;
                ctx.setFillStyle('white');
                ctx.fillText(('00' + currentNum).slice(currentNum < 100 ? -2 : -3), centerX1, r + 10, maxWidthText1);
                ctx.setFontSize(12);
                ctx.fillText('SECOND', centerX2, r + 30, maxWidthText2);
            }
            ctx.draw();

        },

        _runEvent() {
            this.triggerEvent('runEvent', {}, {})
        },
    },

    lifetimes: {
        created() {
            let that = this
            that.data.rpx = wx.getSystemInfoSync().windowWidth / 375;
            that.data.textWidth = parseFloat((that.data.rpx / 1.4).toFixed(2));


            console.log('像素比', that.data.rpx, that.data.textWidth);
        },
    },


});
