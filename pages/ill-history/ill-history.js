// pages/ill-history/ill-history.js
import HiNavigator from "../../components/navigator/hi-navigator";

Page({
    data: {
        illItem: [
            {
                image: {chose: 'item0-chose', nor: 'item0-nor'},
                text: '高血压',
                isChose: false,
                isNorItem: true,
                en: 'hypertension'
            },
            {
                image: {chose: 'item1-chose', nor: 'item1-nor'},
                text: '心脏病',
                isChose: false,
                isNorItem: true,
                en: 'cardiopathy'
            },
            {
                image: {chose: 'item2-chose', nor: 'item2-nor'},
                text: '糖尿病',
                isChose: false,
                isNorItem: true,
                en: 'diabetes'
            },
            {
                image: {chose: 'item3-chose', nor: 'item3-nor'},
                text: '以上均无',
                isChose: false,
                isNorItem: false,
            }
        ],
        result: {}
    },

    onLoad(options) {
        const {isNormalMember, isNewMember, memberId} = options;
        this.setData({
            isNormalMember: isNormalMember,
            isNewMember: isNewMember,
            memberId: memberId
        })
    },

    clickItem(e) {
        let index = e.currentTarget.dataset.index;
        if (this.data.illItem[index].isNorItem) {
            this.data.illItem.map((value, mapIndex) => {
                if (value.isNorItem) {
                    if (index == mapIndex) {
                        value.isChose = !value.isChose;
                    }
                } else {
                    value.isChose = false;
                }
            })
        } else {
            this.data.illItem.map(value => {
                value.isChose = !value.isNorItem
            })
        }
        this.setData({
            illItem: this.data.illItem
        })
    },

    save() {
        this.data.illItem.map(value => {
            if (value.en) {
                this.data.result[value.en] = value.isChose ? 1 : 0;
            }
        });
        this.setData({
            result: this.data.result
        })
    },

    back() {
        HiNavigator.navigateBack({
            delta: 1
        })
    }
})