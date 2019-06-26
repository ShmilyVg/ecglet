import {pagify, MyPage} from 'base/'


@pagify()
export default class extends MyPage {
    data = {
        memberIndex: 0
    };

    onLoad(options: any) {

    };

    choseMember(e: any) {
        const memberIndex = e.target.dataset.memberIndex;
        console.log(memberIndex);
        this.setDataSmart({
            memberIndex: memberIndex
        })
    };

    addMember() {
        wx.navigateTo({url: '../userdata/userdata'})
    };

    clickDefine() {

    };
}
