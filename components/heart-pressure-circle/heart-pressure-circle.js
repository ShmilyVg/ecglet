Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // size: {
        //     type: Number,
        //     value: 0
        // },
    },

    /**
     * 组件的初始数据
     */
    data: {
        score: 0,
        outRadius: 90,
        radius: 0,
        rpx: 1,
        ctx: {},
        roundWidth: 10,
        circleX: 0,
        circleY: 0,
        wholeDegree: 2 * Math.PI,
        startDegree: 0.75 * Math.PI,
        endDegree: 0.25 * Math.PI,
        degreeStep: 0,
        degreePreScore: 0
    },

    options: {
        multipleSlot: true
    },
    methods: {

        getPeriod() {
            return this.data.period;
        },

        _drawCircleBg() {
            try {
                const {data: {radius, startDegree, endDegree, circleX, circleY, roundWidth}} = this,
                    ctx = this.canvasBgContext, smallLineWidth = 2, smallLineLength = 25,
                    smallLineToInnerCircleLength = 10,
                    smallLineStartPointToCenterRadius = radius - smallLineToInnerCircleLength,
                    smallLineEndPointToCenterRadius = smallLineStartPointToCenterRadius - smallLineLength;

            } catch (e) {
                console.error(e);
            }

        },

        drawCircle({score = 0} = {}) {
            const {data: {radius, circleX, circleY, startDegree}, canvasCircleContext} = this;
            const grd = canvasCircleContext.createLinearGradient(0, 1.5 * radius, radius + radius * Math.cos(Math.PI / 4), radius + radius * Math.sin(Math.PI / 4));
            grd.addColorStop(0.15, '#54D1F0');
            grd.addColorStop(0.4, '#8689FA');
            grd.addColorStop(0.9, '#CE7AC8');
            grd.addColorStop(1, '#f05e77');

            this._drawCircle({step: 0, score, circleX, circleY, startDegree, radius, grd, ctx: canvasCircleContext});

        },

        _drawCircle({step, score, circleX, circleY, startDegree, radius, grd, ctx}) {
            const currentNum = step;
            if (step > score) {
                return;
            }
            let {degreePreScore, roundWidth, size} = this.data;
            if (score > 0) {
                const currentDegree = startDegree + degreePreScore * (step);
                ctx.lineWidth = roundWidth;
                ctx.lineCap = 'round';
                ctx.strokeStyle = grd;
                ctx.beginPath();
                ctx.arc(circleX, circleY, radius - 1, startDegree, currentDegree, false);
                ctx.stroke();
            }

            //绘制文字
            let largeFontSize = 50, halfLargeFontSize = largeFontSize / 1.7, sX = 40, bottomScoreMargin = 5;
            if (currentNum >= 100) {
                largeFontSize = 43;
                halfLargeFontSize = Math.floor(largeFontSize / 1.7);
            }
            ctx.font = `${largeFontSize}px sans-serif`;
            ctx.setTextAlign('center');
            ctx.setTextBaseline('normal');
            ctx.fillStyle = '#617683';
            ctx.fillText(('00' + currentNum).slice(currentNum < 100 ? -2 : -3), radius, radius + halfLargeFontSize);
            ctx.font = '12px sans-serif';
            ctx.fillText('分', radius + sX, radius + halfLargeFontSize);
            ctx.font = '11px sans-serif';
            ctx.fillStyle = '#ABBBC2';
            ctx.fillText('0', radius - (radius - roundWidth) * Math.sin(0.25 * Math.PI), size - bottomScoreMargin);
            ctx.fillText('100', radius + (radius) * Math.sin(0.25 * Math.PI), size - bottomScoreMargin);



            ctx.draw();
            setTimeout(() => {
                this._drawCircle({...arguments[0], step: currentNum + 1});
            }, 20);
        },
        _runEvent() {
            this.triggerEvent('runEvent', {}, {})
        },
    },

    lifetimes: {
        created() {
            let that = this
            const data = this.data, myRadius = data.outRadius * data.rpx, roundWidth = data.roundWidth,
                halfRoundWidth = roundWidth / 2;
            data.rpx = wx.getSystemInfoSync().windowWidth / 375;
            data.radius = myRadius - halfRoundWidth;//着色弧线半径
            data.circleX = data.radius + halfRoundWidth;
            data.circleY = data.radius + halfRoundWidth;
            data.degreePreScore = 1.5 * Math.PI / 100;
            console.log('像素比', that.data.rpx);
        },
        attached() {
            console.log('circle 链接到页面', this.data.score);
            this.setData({
                size: 2 * this.data.outRadius
            });
            this.data.degreeStep = 0;
            this.canvasCircleContext = wx.createCanvasContext('circle_draw', this);
            setTimeout(() => {
                this.drawCircle();
            });
        },
        detached() {
            console.log('circle 移除节点');
            this.data.degreeStep = 0;
        }
    },


});
