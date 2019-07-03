export function createBLEConnection({deviceId, timeout}) {
    return new Promise((resolve, reject) => wx.createBLEConnection({
        deviceId,
        timeout,
        success: resolve,
        fail: reject
    }));
}

export function closeBLEConnection({deviceId}) {
    return new Promise((resolve, reject) => wx.closeBLEConnection({deviceId, success: resolve, fail: reject}));
}

export function writeBLECharacteristicValue({deviceId, serviceId, characteristicId, value}) {
    return new Promise((resolve, reject) => wx.writeBLECharacteristicValue({
        ...arguments[0],
        success: resolve,
        fail: reject
    }));
}

export function readBLECharacteristicValue({deviceId, serviceId, characteristicId}) {
    return new Promise((resolve, reject) => wx.writeBLECharacteristicValue({
        ...arguments[0],
        success: resolve,
        fail: reject
    }));
}

export function getBLEDeviceServices({deviceId}) {
    return new Promise((resolve, reject) => wx.getBLEDeviceServices({deviceId, success: resolve, fail: reject}));
}

export function getBLEDeviceCharacteristics({deviceId, serviceId}) {
    return new Promise((resolve, reject) => wx.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: resolve,
        fail: reject
    }));
}

export function startBluetoothDevicesDiscovery({services, allowDuplicatesKey, interval}) {
    return new Promise((resolve, reject) => wx.startBluetoothDevicesDiscovery({
        ...arguments[0],
        success: resolve,
        fail: reject
    }));
}

export function stopBluetoothDevicesDiscovery() {
    return new Promise((resolve, reject) => wx.stopBluetoothDevicesDiscovery({success: resolve, fail: reject}));
}

export function openBluetoothAdapter() {
    return new Promise((resolve, reject) => wx.openBluetoothAdapter({success: resolve, fail: reject}));
}

export function closeBluetoothAdapter() {
    return new Promise((resolve, reject) => wx.closeBluetoothAdapter({success: resolve, fail: reject}));
}

export function getConnectedBluetoothDevices({services}) {
    return new Promise((resolve, reject) => wx.getConnectedBluetoothDevices({
        services,
        success: resolve,
        fail: reject
    }));
}

export function getBluetoothDevices() {
    return new Promise((resolve, reject) => wx.getBluetoothDevices({success: resolve, fail: reject}));
}

export function getBluetoothAdapterState() {
    return new Promise((resolve, reject) => wx.getBluetoothAdapterState({success: resolve, fail: reject}));
}

export function notifyBLECharacteristicValueChange({deviceId,serviceId,characteristicId,state}) {
    return new Promise((resolve, reject) => wx.notifyBLECharacteristicValueChange({
        ...arguments[0],
        success: resolve,
        fail: reject
    }));
}
