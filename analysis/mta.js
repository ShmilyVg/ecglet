import * as mta from "./mta_analysis";
import {Release} from "../utils/config";

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
    if (Release) {
        mta.App.init({
            "appID": "500690452",
            "eventID": "500695339",
            "autoReport": true,
            "statParam": true,
            "ignoreParams": [],
        });
    }
}

export function stat({key, value = {}} = {}) {
    if (Release) {
        mta.Event.stat(key, value);
    }
}

