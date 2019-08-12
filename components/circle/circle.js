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
            value: 30,
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        hz: 40,
        size: 0,
        num: 100,
        rpx: 1,
        ctx: {},
        roundWidth: 10,
        circleX: 0,
        circleY: 0,
        startDegree: 1.5 * Math.PI,
        endDegree: 3.5 * Math.PI,
        degreeStep: 0,
        isStart: false
    },

    options: {
        multipleSlot: true
    },
    methods: {
        initCircleData({radius}) {
            const data = this.data, myRadius = radius * data.rpx, roundWidth = data.roundWidth,
                halfRoundWidth = roundWidth / 2;
            this.setData({
                size: 2 * myRadius
            });
            data.radius = myRadius - halfRoundWidth;//半径
            data.wholeDegree = 2 * Math.PI;//360度
            data.circleX = data.radius + halfRoundWidth;
            data.circleY = data.radius + halfRoundWidth;
            data.startDegree = 1.5 * Math.PI;
            data.degreePreFPS = data.wholeDegree / (data.maxCount * 1000 / data.hz);
        },

        drawCircleBg() {
            const {data: {radius, wholeDegree, circleX, circleY, roundWidth}} = this,
                ctx = this.canvasBgContext, halfRoundWidth = roundWidth / 2, smallWidth = 0.5;

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = roundWidth;
            ctx.arc(circleX, circleY, radius, 0, wholeDegree, false);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = smallWidth;
            ctx.strokeStyle = 'white';
            ctx.arc(circleX, circleY, radius + halfRoundWidth, 0, wholeDegree, false);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = smallWidth;
            ctx.strokeStyle = 'white';
            ctx.arc(circleX, circleY, radius - halfRoundWidth, 0, wholeDegree, false);
            ctx.stroke();
            ctx.draw();
        },

        drawCircle(step) {
            const {data: {radius, circleX, circleY, maxCount, startDegree, isStart}, canvasTimeTextContext: timeTextCtx, canvasTimeCircleContext: timeCircleCtx} = this;
            if (!isStart) {
                this.data.isStart = true;
                this._drawCircle({circleX, circleY, startDegree, radius, step, ctx: timeCircleCtx});
            }
            this._drawText({maxCount, step, radius, ctx: timeTextCtx});


            // const x1 = r, maxPointNum = that.data.maxPointNum,maxCount = that.data.maxCount,
            //     smallRadius = r / 12, y1 = smallRadius,
            //     a = 2 * Math.PI / maxPointNum, circleRadius = r - smallRadius,
            //     currentStep = Math.floor(step / (maxCount * 2 / maxPointNum));
            // console.log('currentStep', currentStep);
            //
            // let x = x1, y = y1;
            // for (let i = 1; i <= maxPointNum; i++) {
            //     ctx.beginPath();
            //     ctx.setFillStyle(currentStep >= i ? 'white' : '#257AD1');
            //     ctx.arc(x, y, smallRadius, 0, wholeDegree, false);
            //     ctx.fill();
            //     const degree = a * i;
            //     x = x1 + circleRadius * Math.sin(degree);
            //     y = y1 + circleRadius - circleRadius * Math.cos(degree);
            // }
            // if (step !== -1) {
            //     ctx.setFontSize(43);
            //     ctx.setTextAlign('center');
            //     const currentNum = maxCount * 2 - step,
            //         maxWidthText1 = 90;
            //     ctx.setFillStyle('white');
            //     ctx.fillText(('00' + currentNum).slice(currentNum < 100 ? -2 : -3), r, r + 10, maxWidthText1);
            //     ctx.setFontSize(12);
            //     ctx.fillText('SECOND', r, r + 30, maxWidthText1);
            // }
            // ctx.draw();

        },
        _drawText({maxCount, radius, step, ctx}) {
            //绘制文字
            const currentNum = maxCount - step;
            let largeFontSize = 60, halfLargeFontSize = largeFontSize / 2.5, sX = 45;
            if (currentNum > 100) {
                largeFontSize = 43;
                halfLargeFontSize = Math.floor(largeFontSize / 2.3);
            }
            ctx.font = `${largeFontSize}px sans-serif`;
            ctx.setTextAlign('center');
            ctx.setTextBaseline('normal');
            ctx.fillStyle = 'white';
            ctx.fillText(('00' + currentNum).slice(currentNum < 100 ? -2 : -3), radius, radius + halfLargeFontSize);
            ctx.font = '12px sans-serif';
            ctx.fillText('S', radius + sX, radius + halfLargeFontSize);
            ctx.draw();
        },
        _drawCircle({circleX, circleY, startDegree, radius, ctx}) {
            const intervalIndex = setInterval(() => {
                // data.degreePreFPS = data.wholeDegree / this.data.maxCount / 33
                let {degreePreFPS, endDegree, roundWidth} = this.data;
                const currentDegree = startDegree + degreePreFPS * (this.data.degreeStep++);
                ctx.lineWidth = roundWidth;
                ctx.lineCap = 'round';
                ctx.strokeStyle = 'rgb(255,255,255)';
                ctx.beginPath();
                ctx.arc(circleX, circleY, radius, startDegree, currentDegree, false);
                ctx.stroke();
                ctx.draw();

                if (currentDegree > endDegree) {
                    console.log('清除倒计时');
                    clearInterval(intervalIndex);
                }
            }, this.data.hz);

        },
        _runEvent() {
            this.triggerEvent('runEvent', {}, {})
        },
    },

    lifetimes: {
        created() {
            let that = this
            that.data.rpx = wx.getSystemInfoSync().windowWidth / 375;

            console.log('像素比', that.data.rpx);
        },
        attached() {
            console.log('circle 链接到页面');
            this.canvasTimeTextContext = wx.createCanvasContext('circle_draw1', this);
            this.canvasTimeCircleContext = wx.createCanvasContext('circle_time', this);
            this.canvasBgContext = wx.createCanvasContext('circle_bg1', this);
            this.canvasTimeCircleContext.lineWidth = this.data.roundWidth;
            this.canvasTimeCircleContext.lineCap = 'round';
            // this.canvasTimeTextContext.lineWidth = this.data.roundWidth;
            // this.canvasTimeTextContext.lineCap = 'round';
        },
        detached() {
            console.log('circle 移除节点');
        }
    },


});
