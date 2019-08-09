import login from "../../apis/network/network/libs/login";

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
        textWidth: 0,
        roundWidth: 10,
        circleX: 0,
        circleY: 0
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
            ctx.arc(circleX, circleY, radius + halfRoundWidth - 1, 0, wholeDegree, false);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = smallWidth;
            ctx.strokeStyle = 'white';
            ctx.arc(circleX, circleY, radius - halfRoundWidth - 1, 0, wholeDegree, false);
            ctx.stroke();
            ctx.draw();
        },

        drawCircle(step) {
            const {data, data: {radius, wholeDegree, circleX, circleY, maxCount, roundWidth}} = this,
                ctx = this.canvasContext, largeFontSize = 43, halfLargeFontSize = largeFontSize / 2;
            ctx.strokeStyle = 'rgb(255,255,255)';
            ctx.beginPath();
            ctx.arc(circleX, circleY, radius, -1.5 * Math.PI, 0, false);
            ctx.stroke();

            ctx.font = `${largeFontSize}px sans-serif`;
            ctx.setTextAlign('center');
            ctx.setTextBaseline('normal');
            const currentNum = maxCount * 2 - step;
            ctx.fillStyle = 'white';
            ctx.fillText(('00' + currentNum).slice(currentNum < 100 ? -2 : -3), radius, radius + halfLargeFontSize);
            ctx.font= '12px sans-serif';
            ctx.fillText('S', radius + (currentNum < 100 ? 35 : 45), radius + halfLargeFontSize);


            ctx.draw();


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
        attached() {
            console.log('circle 链接到页面');
            this.canvasContext = wx.createCanvasContext('circle_draw1', this);
            this.canvasBgContext = wx.createCanvasContext('circle_bg1', this);
            this.canvasContext.lineWidth = this.data.roundWidth;
            this.canvasContext.lineCap = 'round';
        },
        detached() {
            console.log('circle 移除节点');
        }
    },


});
