class BaseStorage {
    static set({key, data}) {
        return new Promise((resolve, reject) => {
            wx.setStorage({key, data, success: resolve, fail: reject});
        });
    }

    static get(key) {
        return new Promise((resolve, reject) => {
            wx.getStorage({key, success: resolve, fail: reject});
        });
    }

    static setSync({key, data}) {
        wx.setStorageSync(key, data);
    }

    static getSync(key) {
        return wx.getStorageSync(key);
    }

    /**
     * 每两条更新一次
     * @returns {boolean}
     */
    static isUpdateLocalStorage() {
        const now = Date.now(),
            isUpdate = Math.abs((parseInt(this.getSync('hi_update_time')) || 0) - now) > 86400000;
        if (isUpdate) {
            this.setSync({key: 'hi_update_time', data: now});
        }
        return isUpdate;
    }

    // static updateAllLocalStorage() {
    //     if (this.isUpdateLocalStorage()) {
    //
    //     }
    // }
}

// @testable
export default class Storage extends BaseStorage {

    static setTips({tips}) {
        return this.set({key: 'hi_checking_tips', data: tips});
    }

    static getTipsSync() {
        return this.getSync('hi_checking_tips');
    }

    static setCardiac({tips}) {
        return this.set({key: 'hi_checking_cardiac_tips', data: tips});
    }
    static getCardiacSync() {
        return this.getSync('hi_checking_cardiac_tips');
    }
    static setRoutine({tips}) {
        return this.set({key: 'hi_checking_routine_tips', data: tips});
    }
    static getRoutineSync() {
        return this.getSync('hi_checking_routine_tips');
    }

}

function testable(target) {
    target.isAlive = true;
}
