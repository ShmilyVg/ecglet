// pages/rich-content/rich-content.js
Page({
    data: {
        ill: [
            {
                value: false, text: '头疼'
            },
            {
                value: false, text: '胸口疼'
            },
            {
                value: false, text: '紧张/焦虑'
            },
            {
                value: false, text: '眩晕'
            },
            {
                value: false, text: '倦怠'
            },
            {
                value: false, text: '气促'
            },
            {
                value: false, text: '乏力'
            },
            {
                value: false, text: '高血压病史'
            }
        ],
        detailed: [
            {
                value: false, text: '吸烟'
            },
            {
                value: false, text: '经常熬夜'
            },
            {
                value: false, text: '久坐不动'
            },
            {
                value: false, text: '运动锻炼'
            },
            {
                value: false, text: '刚进行过剧烈活动'
            }
        ],
        count: 0
    },

    onLoad(options) {

    },

    textContent(e) {
        const {detail: {cursor, value}} = e;
        this.setData({
            count: cursor,
            text: value
        })
    },
    clickIll(e) {
        const {target: {dataset: {index}}} = e;
        let ill = this.data.ill;
        ill[index].value = !ill[index].value;
        this.setData({
            ill: ill
        })
    },

    clickDetailed(e) {
        const {target: {dataset: {index}}} = e;
        let detailed = this.data.detailed;
        detailed.map((value, index1) => {
            value.value = value.value ? false : index1 === index
        });
        this.setData({
            detailed: detailed
        })
    }
});