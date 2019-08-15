import {fsp} from '../../fsp/index';
import Protocol from './../../apis/network/protocol.js';
import WXDialog from "../../base/heheda-common-view/dialog";
import Toast from "../../base/heheda-common-view/toast";
import {
    closeBLEConnection,
    closeBluetoothAdapter,
    createBLEConnection,
    getBLEDeviceCharacteristics,
    getBLEDeviceServices,
    getConnectedBluetoothDevices,
    notifyBLECharacteristicValueChange,
    openBluetoothAdapter,
    startBluetoothDevicesDiscovery,
    stopBluetoothDevicesDiscovery
} from "../../apis/ble/manager";
import HiNavigator from "../../components/navigator/hi-navigator";
import {ArrhythStateManager} from "./state";

ArrayBuffer.prototype.concat = function (b2) {
    let tmp = new Uint8Array(this.byteLength + b2.byteLength);
    tmp.set(new Uint8Array(this), 0);
    tmp.set(new Uint8Array(b2), this.byteLength);
    return tmp.buffer;
};
const app = getApp();
Page({
    data: {
        items: [{title: '- 手握式 -', path: 'sws'}, {title: '- 贴胸式 -', path: 'txs'}],
        bleStatus: '',
        windowHeight: 0,
        logs: [],
        deviceList: [],
        lastDeviceId: '',
        connectingDeviceId: '',
        progressCircle: undefined,
        testType: 0,
        count: 0,
        maxCount: 30,
        ecgPannel: undefined,
        connected: false,
        completed: false,
        btCheckTimer: undefined,
        showToast: false,
        toastMsg: undefined,
        showLoading: false,
        tip: '',
        tipAnimationData: {}
    },

    waveData: undefined,


    getOriginTxt() {
        return this.data.testType === 2 ? '300' : '30';
    },

    reset() {
        let that = this
        app.clearAllArrhythTimer();
        that.data.count = 0;

        // if (that.data.progressCircle) {
        //     let circle = that.data.progressCircle
        //     circle.drawCircle(0);
        // }

        if (that.data.ecgPannel) {
            let ecg = that.data.ecgPannel
            ecg.resetPannel()
        }

        // that.data.completed = false
    },

    isStartBLEDevices: true,
    startBluetooth() {
        this.isStartBLEDevices = true;
        return startBluetoothDevicesDiscovery({
            services: ['FFB1'],
            allowDuplicatesKey: true
        }).then(discoverRes => {
            console.log(`wx.startBluetoothDevicesDiscovery result: ${discoverRes.errMsg}`)
        }).catch(error => {
            this.isStartBLEDevices = false
            console.log("startBluetooth error: %o", error)
        });


    },
    onDeviceConnect(connected, devId) {
        let that = this

        if (connected === that.data.connected) return
        that.data.connected = connected

        if (!connected) {
            that.data.lastDeviceId = devId
            that.data.connectingDeviceId = ""
        } else {
            that.data.lastDeviceId = ""
            that.data.connectingDeviceId = devId
        }

        try {
            if (!connected) {
                console.log("设备连接断开...")

                if (!that.data.completed) {
                    // 停止计时，复位
                    if (!this.isNetworkNotConnected) {
                        wx.showToast({title: '信号质量差，请重新测试', icon: 'none'});
                    }
                    that.reset()
                    this.arrhythStateManager.guider();
                    // await wx.showLoading({
                    //   title: "等待设备接通...",
                    //   mask: true
                    // })
                    that.showLoading()
                }

            } else {
                console.log("设备连接成功...")

                // await wx.hideLoading()
                that.hideLoading()

                // 每次重新连接，采集数据缓存清空一次
                that.waveData = undefined

                // 计时开始
                this.arrhythStateManager.prepare();
            }
        } catch (err) {
            console.log("onDeviceConnected error -- %o", err)

        }
    },

    isNetworkNotConnected: false,
    onNetworkStatusChanged(res) {
        if (!res.isConnected) {
            if (!this.isNetworkNotConnected) {
                this.isNetworkNotConnected = true;
                WXDialog.showDialog({
                    content: '网络断开，请检查网络后重新测试', confirmEvent: () => {
                        wx.navigateBack({delta: 1});
                    }
                });
                this.reset();
                this.showLoading();
            }

        }
    },

    onLoad(options) {
        app.clearAllArrhythTimer();
        this.arrhythStateManager = new ArrhythStateManager(this);
        this.arrhythStateManager.guider();
        // console.log(await wx.getUserInfo())
        wx.setKeepScreenOn({
            keepScreenOn: true, success: (res) => {
                console.log('始终亮屏成功', res);
                wx.setKeepScreenOn({keepScreenOn: true});
            }, fail: res => {
                console.error('始终亮屏失败', res);
                wx.setKeepScreenOn({keepScreenOn: true});
            }
        });

        console.log('onLoad', options);
        this.isNetworkNotConnected = false;

        let that = this;
        that.data.testType = parseInt(options.type) || 0;
        wx.setNavigationBarTitle({title: that.data.testType === 2 ? '心脏负荷评估' : '常规心电检测'});
        that.setData({
                maxCount: parseInt(this.getOriginTxt()),
                testType: that.data.testType,
                windowHeight: wx.getSystemInfoSync().windowHeight,
            }
        );
        console.log('onLoad', that.data.testType, this.getOriginTxt(), this.data.maxCount);
        let selectDeviceId;
        try {
            // 设置设备发现监听回调
            wx.onBluetoothDeviceFound(res => {
                console.log('onBluetoothDeviceFound:')
                res.devices.forEach(device => {
                    console.log('Found device: ', device)
                })

                // that.setData({ deviceList: res.devices })
                that.data.deviceList = res.devices.map(v => {
                    return v.deviceId
                })

                // 先判断是否已经有设备接通，则直接跳过
                if (that.data.connectingDeviceId.length > 0) {
                    console.log(`设备<${that.data.connectingDeviceId}>已经接通，不再接通新设备或重复连接`)
                    return
                }

                let matches = res.devices.filter(v => {
                    return v.deviceId === that.data.lastDeviceId
                })

                // 优先连接原设备
                selectDeviceId = matches.length === 0 ? res.devices[0].deviceId : matches[0].deviceId;
                let matchServices = [], tempServices = [];

                // 先判断设备是否已经被接通
                createBLEConnection({deviceId: selectDeviceId}).then(ret => {
                    console.log('return: ' + ret.errMsg)
                    // that.setData({ lastDeviceId:  selectDeviceId })
                    that.data.lastDeviceId = selectDeviceId

                    // await that.onDeviceConnect(true, selectDeviceId)
                    return getBLEDeviceServices({deviceId: selectDeviceId});

                }).then(services => {
                    console.log('getBLEDeviceServices result: ' + services.errMsg)
                    tempServices = services.services;

                    tempServices.forEach(v => {
                        console.log('service: ' + v.uuid + ' isPrimary: ' + v.isPrimary)
                    })

                    matchServices = tempServices.filter(v => {
                        return v.uuid.includes('0000FFB1')
                    })
                    if (matchServices.length > 0) {

                        return getBLEDeviceCharacteristics({
                            deviceId: selectDeviceId,
                            serviceId: matchServices[0].uuid
                        });

                    } else {
                        return Promise.reject('do nothing matchServices.length<=0');
                    }
                }).then(characteristics => {

                    console.log('getBLEDeviceCharacteristics results: ' + characteristics.errMsg)

                    characteristics.characteristics.forEach(v => {
                        console.log('characteristic: ' + v.uuid + ', properties: ' + v.properties)
                    });
                    let matchCharacteristics = characteristics.characteristics.filter(v => {
                        return v.uuid.includes('FFB2')
                    });
                    if (matchCharacteristics.length > 0) {
                        return notifyBLECharacteristicValueChange({
                            deviceId: selectDeviceId,
                            serviceId: matchServices[0].uuid,
                            characteristicId: matchCharacteristics[0].uuid,
                            state: true
                        })

                    } else {
                        return Promise.reject('do nothing matchCharacteristics.length<=0');
                    }
                }).then(res => {
                    console.log('notifyBLECharacteristicValueChange result: ' + res.errMsg)
                    matchServices = tempServices.filter(v => {
                        return v.uuid.includes('0000180F');
                    });
                    if (matchServices.length > 0) {

                        return getBLEDeviceCharacteristics({
                            deviceId: selectDeviceId,
                            serviceId: matchServices[0].uuid
                        });
                    }
                })
                    .then(characteristics => {
                        console.log('电量 getBLEDeviceCharacteristics results: ' + characteristics.errMsg)

                        characteristics.characteristics.forEach(v => {
                            console.log('电量 characteristic: ' + v.uuid + ', properties: ' + v.properties)
                        });
                        let matchCharacteristics = characteristics.characteristics.filter(v => {
                            return v.uuid.includes('2A19');
                        });
                        if (matchCharacteristics.length > 0) {
                            return notifyBLECharacteristicValueChange({
                                deviceId: selectDeviceId,
                                serviceId: matchServices[0].uuid,
                                characteristicId: matchCharacteristics[0].uuid,
                                state: true
                            })

                        }
                    })
                    .catch(error => {
                        console.log('error: %o', error)
                    })

            })

            wx.onBLEConnectionStateChange(res => {
                console.log(`wx.onBLEConnectionStateChange... <${res.deviceId}>: ${res.connected}`)
                that.onDeviceConnect(res.connected, res.deviceId)
            })

            wx.onBluetoothAdapterStateChange(res => {
                console.log(`onBluetoothAdapterStateChanged: (available = ${res.available}), (discovering = ${res.discovering})`)
                try {
                    if (res.available) {
                        // 关闭蓝牙检测未打开提示
                        this.setData({bleStatus: ''});
                        if (!res.discovering && !that.data.completed) {
                            that.startBluetooth()
                        }
                    } else {
                        // 蓝牙适配中断或关闭
                        let that = this

                        that.reset()
                        this.setData({bleStatus: 'not_init'});
                        wx.showModal({
                            title: "提醒",
                            content: "蓝牙没有打开，请在快捷面板或设置中打开蓝牙！",
                            showCancel: false,
                            confirmColor: "#0d69b1"
                        })
                    }
                } catch (error) {
                    console.log("bluetooth error: %o", error)
                }
            })

            wx.onBLECharacteristicValueChange(res => {
                const {serviceId, characteristicId} = res;
                console.log('服务id和特征值id', serviceId, characteristicId);
                if (serviceId.includes('FFB1')) {
                    if (characteristicId.includes('FFB2')) {
                        that.onFirstChannelChange(res.value)
                    }
                } else if (serviceId.includes('180F')) {
                    if (characteristicId.includes('2A19')) {
                        console.log('获取电量开始', res.value);
                        let buffer = new Uint8Array(res.value);
                        const battery = buffer[0];
                        console.log('获取到电量 battery=', battery);
                        console.log('获取电量结束');

                        Protocol.sendBluetoothInfo({mac: selectDeviceId, electricity: battery}).then(data => {
                            console.log('同步电量成功', data);
                        }).catch(res => {
                            console.log('同步电量失败', res);
                        });
                    }
                }
            })

            that.showLoading()

            that.reset()

            that.data.completed = false
            // 初始化蓝牙
            openBluetoothAdapter().then(() => {
                let that = this
                try {
                    // await wx.showLoading({
                    //   title: "等待设备接通...",
                    //   mask: true
                    // })
                    that.startBluetooth()
                } catch (error) {
                    this.isStartBLEDevices = false;
                    console.log('蓝牙错误<' + error.title + '>：' + error.message)
                }
            }).catch(err => {
                if (err.errCode == 10001) {
                    console.log(`wx.openBluetoothAdapter error: ${err.errMsg}`)
                    // that.showToast('蓝牙没有打开，请在快捷面板或设置中打开蓝牙！')
                    this.setData({bleStatus: 'not_init'});
                    wx.showModal({
                        title: "提醒",
                        content: "蓝牙没有打开，请在快捷面板或设置中打开蓝牙！",
                        showCancel: false,
                        confirmColor: "#0d69b1"
                    })

                }
            })


        } catch (error) {
            console.log('蓝牙错误: %o', error)
        }

    },

    onUnload() {
        let that = this
        console.warn('onUnload...');
        try {
            // await wx.hideLoading()
            // that.hideLoading()
            that.isStartBLEDevices = false;
            that.reset();
            closeBluetoothAdapter().then(res => {
                console.log('关闭蓝牙适配: %o', res)
            }).catch(error => {
                console.log('释放蓝牙资源错误<' + error.title + '>: ' + error.message)
            });
        } catch (error) {
            console.log('释放蓝牙资源错误<' + error.title + '>: ' + error.message)
        }
    },
    onFirstChannelChange(data) {
        let that = this
        if (!this.arrhythStateManager.isFilterData()) {
            let buffer = that.waveData ? that.waveData : new ArrayBuffer(0);
            // console.log('onFirstChannelChange waveData', that.waveData, 'buffer', buffer);
            if (buffer) {
                that.waveData = buffer.concat(data);
            }
        }
        // console.log('data: ' + that.ab2hex(that.data.waveData))
        let ecg = that.data.ecgPannel
        // ecg.drawWave(data)

        if (ecg) {
            ecg.drawWaveDark(data);
        } else {
            console.warn('此时ecg是undefined');
        }
        // ecg.drawWaveAnimation(data, that.data.completed)
    },

    startCount() {
        console.log('startCount...')
        let that = this
        let circle = that.data.progressCircle, tempCount = 0, period = circle.getPeriod();
        app.addNewArrhythTimer(setInterval(function f() {
            let {count, maxCount} = that.data;
            tempCount += period;
            if (tempCount % 1000 === 0) {
                that.data.count++;
                // console.log('count: ' + count, maxCount);
            }
            if (count <= maxCount) {
                circle.drawCircle(count);

            } else if (count > maxCount) {
                that.data.count = 0;
                app.clearAllArrhythTimer();
                that.data.completed = true
                that.closeBluetooth().then(() => {
                    console.log('prepare to upload data...')
                    that.uploadData();
                });
            }

        }, period));
    },
    onShow() {
        console.log('onShow... isStartBLEDevices', this.isStartBLEDevices)
        if (this.isStartBLEDevices) {
            return;
        }
        let that = this;
        try {
            // await wx.showLoading({
            //   title: "等待设备接通...",
            //   mask: true
            // })
            that.showLoading()

            that.reset()

            that.data.completed = false

            that.startBluetooth()
        } catch (error) {
            console.log('蓝牙错误<' + error.title + '>：' + error.message)
        }
    },

    onHide() {
        console.log('onHide...')

        let that = this

        that.closeBluetooth().finally(res => {
            that.reset()
            that.data.completed = true
            this.isStartBLEDevices = false;
            this.arrhythStateManager.guider();
        });

    },

    onReady() {
        // // TODO 将来删掉
        // let that = this;
        // setTimeout(() => {
        //     that.hideLoading()
        //
        //     // 每次重新连接，采集数据缓存清空一次
        //     that.waveData = undefined
        //
        //     // 计时开始
        //     this.arrhythStateManager.prepare();
        //     // setTimeout(() => {
        //     //     that.startCount();
        //     // });
        // }, 1000);
    },

    closeBluetooth() {
        return getConnectedBluetoothDevices({services: ['FFB1']}).then(connectedDevices => {
            console.log('getConnectedBluetoothDevices result: ' + connectedDevices.errMsg)
            connectedDevices.devices.forEach(d => {
                console.log(`close device<${d.name}> ${d.deviceId}`)
                closeBLEConnection({deviceId: d.deviceId}).then(res => {
                    console.log('closeBLEConnection result: ' + res.errMsg)
                });
            });
            stopBluetoothDevicesDiscovery().then(res => {
                console.log('stopBluetoothDevicesDiscovery result: ' + res.errMsg)
            });
        }).catch(err => {
            console.log("closeBluetooth error -- %o", err)
        });

    },


    accessFile() {
        let dirPath = wx.env.USER_DATA_PATH + "/cache/bs-upload"
        let fileName = "rawdata"
        let filePath = `${dirPath}/${fileName}`;
        let that = this;


        return fsp.access({path: dirPath}).then(res => {
            console.log("fsp.access -- success", res)

            console.log("先删除原来的文件，再创建新的上传文件...")
            fsp.removeSavedFile({
                filePath: filePath
            }).catch(err => {
                console.log("fsp.removeSavedFile error -- %o", err);
            }).then(res => {
                console.log("fsp.removeSavedFile result -- %o", res)
                if (!that.waveData) {
                    throw new Error("上传数据为空...")
                }

                console.log("开始创建上传数据临时文件...")
                return fsp.writeFile({
                    filePath: filePath,
                    // encoding: "binary",
                    data: that.waveData
                });


            }).then(res => {
                console.log("fsp.writeFile result -- %o", res)
                return fsp.getFileInfo({
                    filePath: filePath
                });

            }).then(res => {
                console.log("fsp.getFileInfo(%s) result -- %o", filePath, res)

                Protocol.checkHaveNetwork().then(() => {
                    HiNavigator.redirectToRichContent({tempFileUrl: filePath, type: this.data.testType});
                    // Protocol.uploadGatherFile({filePath}).then((data) => {
                    //     getApp().globalData.tempGatherResult = data.result;
                    //     HiNavigator.redirectToResult();
                    // }).catch((res) => {
                    //     WXDialog.showDialog({
                    //         content: '网络断开，请检查网络后重新测试', confirmEvent: () => {
                    //             wx.navigateBack({delta: 1});
                    //         }
                    //     });
                    //     console.error('上传解析过程中报错', res);
                    // }).finally(() => {
                    //     Toast.hiddenLoading();
                    // });
                }).catch((res) => {
                    WXDialog.showDialog({
                        content: '网络断开，请检查网络后重新测试', confirmEvent: () => {
                            wx.navigateBack({delta: 1});
                        }
                    });
                    this.reset();
                    Toast.hiddenLoading();
                    console.error('', res);
                });

            }).catch(err => {
                console.error("uploadData: failed", err)
                Toast.hiddenLoading();
                WXDialog.showDialog({
                    content: '您的检测数据不完整，请重新测试', confirmEvent: () => {
                        wx.navigateBack({delta: 1});
                    }
                });
            });


        }).catch(err => {
            console.log("fsp.access -- failed", err)
            fsp.mkdir({
                dirPath: dirPath,
                recursive: true
            }).then(ret => {
                console.log("fsp.mkdir -- success", ret)
                return this.accessFile();
            });
        });
    },

    uploadData() {
        console.log("uploadData...")

        try {
            wx.showToast({title: '处理中，请稍后', icon: 'none', duration: 35000});
            this.accessFile();

        } catch (error) {
            Toast.hiddenLoading();
            WXDialog.showDialog({
                content: '您的检测数据不完整，请重新测试', confirmEvent: () => {
                    wx.navigateBack({delta: 1});
                }
            });
            console.log("uploadData: failed", error)
        }
    },
    showLoading() {
        // $Toast({
        //   content: '等待设备连接...',
        //   image: 'https://i.loli.net/2017/08/21/599a521472424.jpg', // '../../images/borsam_touch.png',
        //   duration: 0
        // });
        let that = this

        that.setData({
            showLoading: false
        })
    },

    hideLoading() {
        // $Toast.hide()
        let that = this

        that.setData({
            showLoading: true
        })
    },

    bindload(e) {
        console.log('bindload event: %o', e)
    },

    binderror(e) {
        console.log('binderror event: %o', e)
    },


});
