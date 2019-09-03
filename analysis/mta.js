import * as mta from "./mta_analysis";

export const ScenesHandle = {
    value: '',
    getValue() {
        return this.value;
    },
    setValue(value) {
        return this.value = value;
    }
};

// export let scenes = '333333';

export function initAnalysisOnApp() {
    mta.App.init({
        "appID": "500690452",
        // "eventID": "500670812",
        "autoReport": true,
        "statParam": true,
        "ignoreParams": [],
        "statPullDownFresh": true,
        "statShareApp": true,
        "statReachBottom": true
    });
}

export function stat({key, value = {}} = {}) {
    mta.Event.stat(key, value);
}

