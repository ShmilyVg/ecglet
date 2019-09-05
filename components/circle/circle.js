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
        period: 50,
        size: 160,
        num: 100,
        rpx: 1,
        ctx: {},
        roundWidth: 10,
        circleX: 0,
        circleY: 0,
        startDegree: 1.5 * Math.PI,
        degreeStep: 0,
    },

    options: {
        multipleSlot: true
    },
    methods: {
        initCircleData() {
            const data = this.data, myRadius = Math.floor(data.size / 2), roundWidth = data.roundWidth,
                halfRoundWidth = roundWidth / 2;
            data.radius = myRadius - halfRoundWidth;//半径
            data.wholeDegree = 2 * Math.PI;//360度
            data.circleX = data.radius + halfRoundWidth;
            data.circleY = data.radius + halfRoundWidth;
            data.startDegree = 1.5 * Math.PI;
            data.degreePreFPS = data.wholeDegree / ((data.maxCount >= 120 ? data.maxCount + 4 : data.maxCount + 1) * 1000 / data.period);
        },

        getPeriod() {
            return this.data.period;
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
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.arc(circleX, circleY, radius + halfRoundWidth - 1, 0, wholeDegree, false);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = smallWidth;
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.arc(circleX, circleY, radius - halfRoundWidth, 0, wholeDegree, false);
            ctx.stroke();
            ctx.draw();
        },

        drawCircle(step) {
            const {data: {radius, circleX, circleY, startDegree, maxCount}, canvasTimeCircleContext: timeCircleCtx} = this;
            this._drawCircle({circleX, circleY, startDegree, radius, ctx: timeCircleCtx});
            this._drawText({maxCount, step, radius, ctx: timeCircleCtx});
        },
        _drawText({maxCount, radius, step, ctx}) {
            //绘制文字
            const currentNum = maxCount - step;
            let largeFontSize = 60, halfLargeFontSize = largeFontSize / 2.5, sX = Math.floor(radius / 1.2);
            if (currentNum > 60) {
                largeFontSize = 43;
                halfLargeFontSize = Math.floor(largeFontSize / 2.3);
            }
            ctx.font = `${largeFontSize}px sans-serif`;
            ctx.setTextAlign('center');
            ctx.setTextBaseline('normal');
            ctx.fillStyle = 'white';
            const minute = Math.floor(currentNum / 60);
            if (minute > 0) {
                ctx.fillText(minute.toString(), radius - sX / 5 - 24, radius + halfLargeFontSize + 1);
                ctx.font = '12px sans-serif';
                ctx.fillText('分', radius - sX / 5, radius + halfLargeFontSize - 1);
                ctx.font = `${largeFontSize}px sans-serif`;
                ctx.fillText(('00' + (currentNum % 60)).slice(-2), radius + sX / 2.5, radius + halfLargeFontSize + 1);
                ctx.font = '12px sans-serif';
                ctx.fillText('秒', radius + sX, radius + halfLargeFontSize - 1);
            } else {
                sX = 45;
                ctx.fillText(('00' + currentNum).slice(currentNum < 100 ? -2 : -3), radius, radius + halfLargeFontSize + 1);
                ctx.font = '12px sans-serif';
                ctx.fillText('秒', radius + sX, radius + halfLargeFontSize - 1);
            }

            ctx.draw();
        },
        _drawCircle({circleX, circleY, startDegree, radius, ctx}) {
            let {degreePreFPS, roundWidth} = this.data;
            // const currentDegree = startDegree + degreePreFPS * (725);
            const currentDegree = startDegree + degreePreFPS * (this.data.degreeStep++);
            ctx.lineWidth = roundWidth;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'rgb(255,255,255)';
            ctx.beginPath();
            ctx.arc(circleX, circleY, radius - 1, startDegree, currentDegree, false);
            ctx.stroke();
            // ctx.draw();

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
            this.data.degreeStep = 0;
            this.canvasTimeCircleContext = wx.createCanvasContext('circle_time', this);
            this.canvasBgContext = wx.createCanvasContext('circle_bg1', this);
        },
        detached() {
            console.log('circle 移除节点');
            this.data.degreeStep = 0;
        }
    },


});
