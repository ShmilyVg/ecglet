export default class ResultTop {
    constructor(page) {
        this._page = page;
    }

    showItems({items}) {
        this._page.setData({
            items
        });
        this._page.onShowDetail = (e) => {
            const {currentTarget: {dataset: {index,item}}} = e;
            console.log(e);
            let obj = {};
            obj[`items[${index}].showDetail`] = !item.showDetail;
            this._page.setData(obj);
        }
    }
}
