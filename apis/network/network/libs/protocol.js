import Network from "./network";

export default class CommonProtocol {

    static getAccountInfo() {
        return Network.request({url: 'account/info'});
    }

    static getDeviceBindInfo() {
        return Network.request({url: 'device/bind/info'})
    }

    static postDeviceBind({deviceId, mac}) {
        return Network.request({url: 'device/bind', data: {deviceId, mac}});
    }

    static postDeviceUnbind({deviceId}) {
        return Network.request({url: 'device/unbind', data: {deviceId}});
    }

    static postBlueToothUpdate({deviceId, version}) {
        return Network.request({url: 'device/version/sync', data: {deviceId, version}});
    }

    static postSystemInfo({systemInfo, hiSoftwareVersion}) {
        // return Promise.resolve();
        return Network.request({url: 'account/systeminfo', data: {systemInfo: {...systemInfo, hiSoftwareVersion}}});
    }

    static getSoftwareUpdateText() {
        return Network.request({url: 'software/update/text', requestWithoutLogin: true});
    }

}
