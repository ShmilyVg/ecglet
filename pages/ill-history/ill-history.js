// pages/ill-history/ill-history.js
import HiNavigator from "../../components/navigator/hi-navigator";
import Protocol from "../../apis/network/protocol";

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
        haveHistoryIll: false,
        result: {}
    },

    onLoad(options) {
        const {isNormalMember, isNewMember, relevanceId} = options;
        this.setData({
            isNormalMember: isNormalMember,
            isNewMember: isNewMember,
            relevanceId: relevanceId
        });

        Protocol.memberDiseaseGetMemberHistory({relevanceId}).then(res => {
            if (res.result.data) {
                this.data.illItem[0].isChose = res.result.data.hypertension;
                this.data.illItem[1].isChose = res.result.data.cardiopathy;
                this.data.illItem[2].isChose = res.result.data.diabetes;
                this.setData({
                    illItem: this.data.illItem,
                    illId: res.result.data.id,
                    haveHistoryIll: true
                })
            } else {
                this.setData({
                    haveHistoryIll: false
                })
            }
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
        let result = {};
        this.data.illItem.map(value => {
            if (value.en) {
                result[value.en] = value.isChose ? 1 : 0;
            }
        });

        if (!this.data.isNormalMember) {
            result.relevanceId = this.data.relevanceId;
        }
        if (this.data.haveHistoryIll) {
            result.id = this.data.illId;
            Protocol.memberDiseaseUpdate({data: result}).then(_ => {
                this.editFinish();
            })
        } else {
            Protocol.memberDiseaseCreate({data: result}).then(_ => {
                this.editFinish();
            })
        }
    },

    editFinish() {
        HiNavigator.navigateBack({
            delta: 2
        })
    },

    back() {
        HiNavigator.navigateBack({
            delta: 1
        })
    }
})