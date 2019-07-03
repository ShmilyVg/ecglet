// 此文件是由模板文件 ".dtpl/page/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板
import {fsp} from '../../fsp/index';
import Protocol from './../../apis/network/protocol.js';
import WXDialog from "../../base/heheda-common-view/dialog";
import Toast from "../../base/heheda-common-view/toast";


Page({
  data: {
    bleStatus: '',
    canvasHeight: 0,
    canvasWidth: 0,
    windowHeight: 0,
    logs: [],
    deviceList: [],
    lastDeviceId: '',
    connectingDeviceId: '',
    progressCircle: undefined,
    txt: '',
    testType: 0,
    count: 0,
    maxCount: 15,
    countTimer: undefined,
    ecgPannel: undefined,
    connected: false,
    completed: false,
    btCheckTimer: undefined,
    showToast: false,
    toastMsg: undefined,
    showLoading: true
  },

  waveData: undefined,

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
          that.preparePannelDark('');

          that.showLoading()
        }

      } else {
        console.log("设备连接成功...")

        that.hideLoading()

        // 每次重新连接，采集数据缓存清空一次
        that.waveData = undefined

        // 计时开始
        if (!that.data.countTimer) {
          that.preparePannelDark('white');
          setTimeout(() => {
            that.startCount();
          });
        }
      }
    } catch (err) {
      that.preparePannelDark('');
      console.log("onDeviceConnected error -- %o", err)

    }
  },

  isNetworkNotConnected : false,
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
      this.preparePannelDark('');
      this.showLoading();
    }

  }
},

getOriginTxt() {
  return this.data.testType === 3 ? '180' : '30';
},

onLoad(options) {
  console.log('onLoad', options);
  this.isNetworkNotConnected = false;

  let that = this;
  that.data.testType = parseInt(options.type) || 0;
  that.data.maxCount = parseInt(this.getOriginTxt()) / 2;
  console.log('onLoad', that.data.testType, this.getOriginTxt(),this.data.maxCount);
  that.setData({
        testType: that.data.testType,
        windowHeight: wx.getSystemInfoSync().windowHeight,
        txt: this.getOriginTxt(),

      }
  );

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

      try {
        // 优先连接原设备
        let selectDeviceId = matches.length === 0 ? res.devices[0].deviceId : matches[0].deviceId

        // 先判断设备是否已经被接通
        wx.createBLEConnection({
          deviceId: selectDeviceId,
          success:(ret)=>{
            console.log('return: ' + ret.errMsg)
            // that.setData({ lastDeviceId:  selectDeviceId })
            that.data.lastDeviceId = selectDeviceId

            // await that.onDeviceConnect(true, selectDeviceId)

            wx.getBLEDeviceServices({
              deviceId: selectDeviceId,
              success:services=>{
                console.log('getBLEDeviceServices result: ' + services.errMsg)
                services.services.forEach(v => {
                  console.log('service: ' + v.uuid + ' isPrimary: ' + v.isPrimary)
                })

                let matchServices = services.services.filter(v => {
                  return v.uuid.includes('0000FFB1')
                })
                if (matchServices.length > 0) {
                    wx.getBLEDeviceCharacteristics({
                    deviceId: selectDeviceId,
                    serviceId: matchServices[0].uuid,
                    success:characteristics=>{
                      console.log('getBLEDeviceCharacteristics results: ' + characteristics.errMsg)

                      characteristics.characteristics.forEach(v => {
                        console.log('characteristic: ' + v.uuid + ', properties: ' + v.properties)
                      })
                      let matchCharacteristics = characteristics.characteristics.filter(v => {
                        return v.uuid.includes('FFB2')
                      })
                      if (matchCharacteristics.length > 0) {
                          wx.notifyBLECharacteristicValueChange({
                          deviceId: selectDeviceId,
                          serviceId: matchServices[0].uuid,
                          characteristicId: matchCharacteristics[0].uuid,
                          state: true,
                          success:res=>{
                            console.log('notifyBLECharacteristicValueChange result: ' + res.errMsg)
                          },fail:error=>{
                            console.log('error: %o', error)

                          }
                        })
                      }
                    },fail:error=>{
                        console.log('error: %o', error)

                      }
                  })

                }
              },fail:error=>{
                console.log('error: %o', error)

              }
            })

          },fail:error=>{
            console.log('error: %o', error)

          }
        })

      } catch (error) {
        console.log('error: %o', error)
      }
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
          let res = wx.showModal({
            title: "提醒",
            content: "蓝牙没有打开，请在快捷面板或设置中打开蓝牙！",
            showCancel: false,
            confirmColor: "#0d69b1"
          })
          if (res.confirm) {

          }

        }
      } catch (error) {
        console.log("bluetooth error: %o", error)
      }
    })

    wx.onBLECharacteristicValueChange(res => {
      if (res.serviceId.includes('FFB1')) {
        if (res.characteristicId.includes('FFB2')) {
          that.onFirstChannelChange(res.value)
        }
      }
    })

    // 初始化蓝牙
     wx.openBluetoothAdapter({fail:err => {
         if (err.errCode == 10001) {
           console.log(`wx.openBluetoothAdapter error: ${err.errMsg}`)
           // that.showToast('蓝牙没有打开，请在快捷面板或设置中打开蓝牙！')
           this.setData({bleStatus: 'not_init'});
           wx.showModal({
             title: "提醒",
             content: "蓝牙没有打开，请在快捷面板或设置中打开蓝牙！",
             showCancel: false,
             confirmColor: "#0d69b1"
           });

           let that = this
           try {

             that.showLoading()

             that.reset()

             that.data.completed = false

             that.startBluetooth()
           } catch (error) {
             this.isStartBLEDevices = false;
             console.log('蓝牙错误<' + error.title + '>：' + error.message)
           }

         }
       }})


  } catch (error) {
    console.log('蓝牙错误: %o', error)
  }
},

 onShow() {
  console.log('onShow...')
  if (this.isStartBLEDevices) {
    return;
  }
  let that = this;
  try {

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

   that.closeBluetooth(() => {
     that.reset()
     that.data.completed = true
     this.isStartBLEDevices = false;
   });


},

 onReady() {
  let that = this

  let query = that.createSelectorQuery()

  that.data.progressCircle = that.selectComponent('#circle1')
  let circle = that.data.progressCircle
  circle.drawCircleBg('circle_bg1', 100)
  // setTimeout(()=>{
  query.select('#ecg').boundingClientRect((rect) => {
    that.data.ecgPannel = that.selectComponent('#ecg')
    console.log("ECG box rect: %o}", rect)
    // let ecg: any = that.data.ecgPannel
    // ecg.preparePannel(rect.width, rect.height)
    that.data.canvasWidth = rect.width;
    that.data.canvasHeight = rect.height;
    this.preparePannelDark('');
    // ecg.preparePannelDark(rect.width, rect.height);
  }).exec()
  // },2000)


},

preparePannelDark(bgColor) {
  const ecg = this.data.ecgPannel || this.selectComponent('#ecg');
  ecg.preparePannelDark(this.data.canvasWidth, this.data.canvasHeight, bgColor || '');
},
 onUnload() {
  console.log('onUnload...')
  let that = this
  try {
    // await wxp.hideLoading()
    that.hideLoading()
    that.isStartBLEDevices = false;
    that.reset()

    let res = wx.closeBluetoothAdapter()
    console.log('关闭蓝牙适配: %o', res)
  } catch (error) {
    console.log('释放蓝牙资源错误<' + error.title + '>: ' + error.message)
  }
},
currentTimestamp : 0,
 onFirstChannelChange(data) {
  // console.log('onFirstChannelChange')
  let that = this

  let buffer = that.waveData ? that.waveData : new ArrayBuffer(0)
  // @ts-ignore
  that.waveData = buffer.concat(data)
  // console.log('data: ' + that.ab2hex(that.data.waveData))
  let ecg = that.data.ecgPannel
  // ecg.drawWave(data)
  const now = Date.now();
  if (now - this.currentTimestamp >= 33) {
    this.currentTimestamp = now;
    ecg.drawWaveDark(data);
  }
  // ecg.drawWaveAnimation(data, that.data.completed)
},

startCount() {
  console.log('startCount...')
  let that = this
  that.data.countTimer = setInterval(() => {
    that.data.count++
    if (that.data.count <= 2 * that.data.maxCount) {
      // console.log('count: ' + that.data.count, that.data.maxCount);
      // let circle: any = that.data.progressCircle;
      // circle.drawCircle('circle_draw1', 100, that.data.count);
      if (that.data.count >= 2 * that.data.maxCount) {
        that.data.count = 0
        // that.setData({ txt: '0' })
        if (that.data.countTimer) {
          clearInterval(that.data.countTimer)
          that.data.countTimer = undefined
        }

        that.data.completed = true
         that.closeBluetooth(()=>{
           console.log('prepare to upload data...')
           that.uploadData()
         })
      }
    }
  }, 1000)
},

closeBluetooth(cbOk) {
  // let that = this
  // if (that.data.completed) return


     wx.getConnectedBluetoothDevices({
      services: ['FFB1'],
      success:connectedDevices=>{
        console.log('getConnectedBluetoothDevices result: ' + connectedDevices.errMsg)
        connectedDevices.devices.forEach(d => {
          console.log(`close device<${d.name}> ${d.deviceId}`)
           wx.closeBLEConnection({
            deviceId: d.deviceId,
            success:res=>{
              console.log('closeBLEConnection result: ' + res.errMsg)
              cbOk && cbOk();
            },fail:err=>{
               cbOk && cbOk();
              console.log("closeBluetooth error -- %o", err)
            }
          })
          // await that.onDeviceConnect(false, d.deviceId)
        })

          wx.stopBluetoothDevicesDiscovery({
          success: res => {
            console.log('stopBluetoothDevicesDiscovery result: ' + res.errMsg)
          }, fail: err => {
            console.log("closeBluetooth error -- %o", err)
          }
        });
      },
      fail:err=>{
        console.log("closeBluetooth error -- %o", err)
      }
    })

},

reset() {
  let that = this

  if (that.data.countTimer) {
    clearInterval(that.data.countTimer)
    that.data.countTimer = undefined
    that.data.count = 0
  }

  if (that.data.progressCircle) {
    let circle = that.data.progressCircle
    circle.drawCircle('circle_draw1', 100, -1);
    that.preparePannelDark('');
    that.setData({txt: this.getOriginTxt()});
  }

  if (that.data.ecgPannel) {
    let ecg = that.data.ecgPannel
    ecg.resetPannel()
  }

  // that.data.completed = false
},

isStartBLEDevices : true,
 startBluetooth() {
    this.isStartBLEDevices = true;
     wx.startBluetoothDevicesDiscovery({
      services: ['FFB1'],
      allowDuplicatesKey: true,
      success:(discoverRes)=>{
        console.log(`wx.startBluetoothDevicesDiscovery result: ${discoverRes.errMsg}`)
      },
      fail:error=>{
        this.isStartBLEDevices = false
        console.log("startBluetooth error: %o", error)
      }
    })
},

uploadData() {
  console.log("uploadData...")
  let that = this

  try {
    wx.showToast({title: '处理中，请稍后', icon: 'none', duration: 35000});
    let dirPath = wx.env.USER_DATA_PATH + "/cache/bs-upload"
    let fileName = "rawdata"
    let filePath = `${dirPath}/${fileName}`


    fsp.access({
      path: dirPath
    }).then(res=>{
      console.log("fsp.access -- %o", res)

      console.log("先删除原来的文件，再创建新的上传文件...")
      fsp.removeSavedFile({
        filePath: filePath
      }).then(res=>{
        console.log("fsp.removeSavedFile result -- %o", res)
        if (!that.waveData) {
          throw new Error("上传数据为空...")
        }

        console.log("开始创建上传数据临时文件...")
        // @ts-ignore
        fsp.writeFile({
          filePath: filePath,
          // encoding: "binary",
          data: that.waveData
        }).then(res=>{
          console.log("fsp.writeFile result -- %o", res)

          fsp.getFileInfo({
            filePath: filePath,
          }).then(res=>{

            console.log("fsp.getFileInfo(%s) result -- %o", filePath, res)

            Protocol.checkHaveNetwork().then(() => {
              Protocol.uploadGatherFile({filePath}).then((data) => {
                // @ts-ignore
                getApp().globalData.tempGatherResult = data.result;
                that.app.$url.result.redirect({});
              }).catch((res) => {
                WXDialog.showDialog({
                  content: '网络断开，请检查网络后重新测试', confirmEvent: () => {
                    wx.navigateBack({delta: 1});
                  }
                });
                console.error('上传解析过程中报错', res);
              }).finally(() => {
                Toast.hiddenLoading();
              });
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

          }).catch(error=>{
            Toast.hiddenLoading();
            WXDialog.showDialog({content: '您的检测数据不完整，请重新测试',confirmEvent:()=>{
                wx.navigateBack({delta: 1});
              }});
            console.log("uploadData: %o", error)

          })

        }).catch(error=>{
          Toast.hiddenLoading();
          WXDialog.showDialog({content: '您的检测数据不完整，请重新测试',confirmEvent:()=>{
              wx.navigateBack({delta: 1});
            }});
          console.log("uploadData: %o", error)
        })




      }).catch(err => {
        console.log("fsp.removeSavedFile error -- %o", err)
      })






    }).catch(err => {
      console.log("fsp.access -- %o", err)
       fsp.mkdir({
        dirPath: dirPath,
        recursive: true
      }).then(ret=>{
        console.log("fsp.mkdir -- %o", ret)
      })
    })



  } catch (error) {
    Toast.hiddenLoading();
    WXDialog.showDialog({content: '您的检测数据不完整，请重新测试',confirmEvent:()=>{
        wx.navigateBack({delta: 1});
      }});
    console.log("uploadData: %o", error)
  }
},

onWaveFinish(e) {
  console.log('onWaveFinish...%o', e)

  let that = this

  try {
    if (that.data.completed) {
      console.log('prepare to upload data...')
      // FIXME: debug temp commented
      // await that.uploadData()
    }
  } catch (err) {
    console.log("onWaveFinish error: %o", err)
  }

},

showLoading() {
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
