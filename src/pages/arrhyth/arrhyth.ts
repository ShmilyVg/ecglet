import { APIs } from './../../apis/request';
// 此文件是由模板文件 ".dtpl/page/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板
import { pagify, MyPage, wxp, fsp } from 'base/'
import "../../extensions/ArrayBuffer.ext"

interface ArrhythData {
  windowHeight:number,
  logs: string[],
  deviceList: string[],
  lastDeviceId: string,
  connectingDeviceId: string,
  progressCircle?: Component,
  txt: string,
  count: number,
  maxCount: number,
  countTimer?: NodeJS.Timer,
  ecgPannel?: Component,
  waveData?: ArrayBuffer,
  connected: boolean,
  completed: boolean,
  btCheckTimer?: NodeJS.Timer
  showToast: boolean,
  toastMsg?: string,
  showLoading: boolean,
  canvasWidth:number,
  canvasHeight: number;
}
@pagify()
export default class extends MyPage {
  data: ArrhythData = {
    canvasHeight: 0,
    canvasWidth: 0,
    windowHeight:0,
    logs: [],
    deviceList: [],
    lastDeviceId: '',
    connectingDeviceId: '',
    progressCircle: undefined,
    txt: '等待设备连接...',
    count: 0,
    maxCount: 15,
    countTimer: undefined,
    ecgPannel: undefined,
    waveData: undefined,
    connected: false,
    completed: false,
    btCheckTimer: undefined,
    showToast: false,
    toastMsg: undefined,
    showLoading: true
  }
  // ArrayBuffer转16进度字符串示例
  // private ab2hex(buffer: ArrayBuffer) {
  // var hexArr = Array.prototype.map.call(
  //     new Uint8Array(buffer), (bit: number) => {
  //       return ('00' + bit.toString(16)).slice(-2)
  //     }
  //   )
  //   return hexArr.join('');
  // }

  private async onDeviceConnect(connected: boolean, devId: string) {
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
          that.reset()
          that.preparePannelDark('');
          // await wxp.showLoading({
          //   title: "等待设备接通...",
          //   mask: true
          // })
          that.showLoading()
        }

      } else {
        console.log("设备连接成功...")

        // await wxp.hideLoading()
        that.hideLoading()

        // 每次重新连接，采集数据缓存清空一次
        that.data.waveData = undefined

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
  }

  async onLoad(options: any) {
    // console.log(await wxp.getUserInfo())
    console.log('onLoad')
    let that = this;
    that.setDataSmart({windowHeight: wxp.getSystemInfoSync().windowHeight});

    try {
      // 设置设备发现监听回调
      wxp.onBluetoothDeviceFound(async res => {
        console.log('onBluetoothDeviceFound:')
        res.devices.forEach(device => {
          console.log('Found device: ', device)
        })

        // that.setDataSmart({ deviceList: res.devices })
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
          let ret = await wxp.createBLEConnection({
            deviceId: selectDeviceId
          })
          console.log('return: ' + ret.errMsg)
          // that.setDataSmart({ lastDeviceId:  selectDeviceId })
          that.data.lastDeviceId = selectDeviceId

          // await that.onDeviceConnect(true, selectDeviceId)

          let services = await wxp.getBLEDeviceServices({
            deviceId: selectDeviceId
          })
          console.log('getBLEDeviceServices result: ' + services.errMsg)
          services.services.forEach(v => {
            console.log('service: ' + v.uuid + ' isPrimary: ' + v.isPrimary)
          })

          let matchServices = services.services.filter(v => {
            return v.uuid.includes('0000FFB1')
          })
          if (matchServices.length > 0) {
            let characteristics = await wxp.getBLEDeviceCharacteristics({
              deviceId: selectDeviceId,
              serviceId: matchServices[0].uuid
            })
            console.log('getBLEDeviceCharacteristics results: ' + characteristics.errMsg)

            characteristics.characteristics.forEach(v => {
              console.log('characteristic: ' + v.uuid + ', properties: ' + v.properties)
            })
            let matchCharacteristics = characteristics.characteristics.filter(v => {
              return v.uuid.includes('FFB2')
            })
            if (matchCharacteristics.length > 0) {
              let res = await wxp.notifyBLECharacteristicValueChange({
                deviceId: selectDeviceId,
                serviceId: matchServices[0].uuid,
                characteristicId: matchCharacteristics[0].uuid,
                state: true
              })
              console.log('notifyBLECharacteristicValueChange result: ' + res.errMsg)
            }
          }
        } catch (error) {
          console.log('error: %o', error)
        }
      })

      wxp.onBLEConnectionStateChange(async res => {
        console.log(`wxp.onBLEConnectionStateChange... <${res.deviceId}>: ${res.connected}`)
        await that.onDeviceConnect(res.connected, res.deviceId)
      })

      wxp.onBluetoothAdapterStateChange(async res => {
        console.log(`onBluetoothAdapterStateChanged: (available = ${res.available}), (discovering = ${res.discovering})`)
        try {
          if (res.available) {
            // 关闭蓝牙检测未打开提示

            if (!res.discovering && !that.data.completed) {
              await that.startBluetooth()
            }
          } else {
            // 蓝牙适配中断或关闭
            let that = this

            that.reset()

            let res = await wxp.showModal({
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

      wxp.onBLECharacteristicValueChange(async res => {
        if (res.serviceId.includes('FFB1')) {
          if (res.characteristicId.includes('FFB2')) {
            await that.onFirstChannelChange(res.value)
          }
        }
      })

      // 初始化蓝牙
      await wxp.openBluetoothAdapter()
      .catch(async err => {
        if (err.errCode == 10001) {
          console.log(`wxp.openBluetoothAdapter error: ${err.errMsg}`)
          // that.showToast('蓝牙没有打开，请在快捷面板或设置中打开蓝牙！')
          let res = await wxp.showModal({
            title: "提醒",
            content: "蓝牙没有打开，请在快捷面板或设置中打开蓝牙！",
            showCancel: false,
            confirmColor: "#0d69b1"
          })
          if (res.confirm) {

          }
        }
      })

    } catch (error) {
      console.log('蓝牙错误: %o', error)
    }
  }

  async onShow() {
    console.log('onShow...')

    let that = this
    try {
      // await wxp.showLoading({
      //   title: "等待设备接通...",
      //   mask: true
      // })
      that.showLoading()

      that.reset()

      that.data.completed = false

      await that.startBluetooth()
    } catch (error) {
      console.log('蓝牙错误<' + error.title + '>：' + error.message)
    }
  }

  async onHide() {
    console.log('onHide...')

    let that = this

    await that.closeBluetooth()

    that.reset()
    that.data.completed = true
  }

  async onReady() {
    let that = this

    let query = that.createSelectorQuery()

    that.data.progressCircle = that.selectComponent('#circle1')
    let circle: any = that.data.progressCircle
    circle.drawCircleBg('circle_bg1', 100, 16)
    // setTimeout(()=>{
      query.select('#ecg').boundingClientRect((rect: any) => {
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


  }

  preparePannelDark(bgColor:string) {
    const ecg: any = this.data.ecgPannel || this.selectComponent('#ecg');
    ecg.preparePannelDark(this.data.canvasWidth, this.data.canvasHeight, bgColor || '');
  }
  async onUnload() {
    console.log('onUnload...')

    let that = this
    try {
      // await wxp.hideLoading()
      that.hideLoading()

      that.reset()

      let res = await wxp.closeBluetoothAdapter()
      console.log('关闭蓝牙适配: %o', res)
    } catch (error) {
      console.log('释放蓝牙资源错误<' + error.title + '>: ' + error.message)
    }
  }

  private async onFirstChannelChange(data: ArrayBuffer) {
    // console.log('onFirstChannelChange')
    let that = this

    let buffer = that.data.waveData ? that.data.waveData : new ArrayBuffer(0)
    that.data.waveData = buffer.concat(data)
    // console.log('data: ' + that.ab2hex(that.data.waveData))
    let ecg: any = that.data.ecgPannel
    // ecg.drawWave(data)
    ecg.drawWaveDark(data)
    // ecg.drawWaveAnimation(data, that.data.completed)
  }

  private startCount() {
    console.log('startCount...')
    let that = this
    that.data.countTimer = setInterval(async () => {
      that.data.count++
      if (that.data.count <= 2 * that.data.maxCount) {
        let circle: any = that.data.progressCircle
        circle.drawCircle('circle_draw1', 100, 16, that.data.count / this.data.maxCount)
        console.log('count: ' + that.data.count, that.data.maxCount);
        if (that.data.count < 2 * that.data.maxCount) {
          that.setDataSmart({ txt: `${2 * that.data.maxCount - that.data.count}秒` })
        } else {
          that.data.count = 0
          that.setDataSmart({ txt: '完成' })
          if (that.data.countTimer) {
            clearInterval(that.data.countTimer)
            that.data.countTimer = undefined
          }

          that.data.completed = true
          await that.closeBluetooth()

          console.log('prepare to upload data...')
          await that.uploadData()

        }
      }
    }, 1000)
  }

  private async closeBluetooth() {
    // let that = this
    // if (that.data.completed) return

    try {
      // that.data.completed = true

      let connectedDevices = await wxp.getConnectedBluetoothDevices({
        services: ['FFB1']
      })
      console.log('getConnectedBluetoothDevices result: ' + connectedDevices.errMsg)
      connectedDevices.devices.forEach(async d => {
        console.log(`close device<${d.name}> ${d.deviceId}`)
        let res = await wxp.closeBLEConnection({
          deviceId: d.deviceId
        })
        console.log('closeBLEConnection result: ' + res.errMsg)
        // await that.onDeviceConnect(false, d.deviceId)
      })

      let res = await wxp.stopBluetoothDevicesDiscovery()
      console.log('stopBluetoothDevicesDiscovery result: ' + res.errMsg)

      // res = await wxp.closeBluetoothAdapter()
      // console.log('关闭蓝牙适配: ' + res.errMsg)
    } catch (err) {
      console.log("closeBluetooth error -- %o", err)
    }

  }

  private reset() {
    let that = this

    if (that.data.countTimer) {
      clearInterval(that.data.countTimer)
      that.data.countTimer = undefined
      that.data.count = 0
    }

    if (that.data.progressCircle) {
      let circle: any = that.data.progressCircle
      circle.drawCircle('circle_draw1', 100, 16, 0)
      that.setDataSmart({txt: "等待设备接通..."})
    }

    if (that.data.ecgPannel) {
      let ecg: any = that.data.ecgPannel
      ecg.resetPannel()
    }

    // that.data.completed = false
  }

  private async startBluetooth() {
    try {
      let discoverRes = await wxp.startBluetoothDevicesDiscovery({
        services: ['FFB1'],
        allowDuplicatesKey: true
      })
      console.log(`wxp.startBluetoothDevicesDiscovery result: ${discoverRes.errMsg}`)
    } catch (error) {
      console.log("startBluetooth error: %o", error)
    }

  }

  private async uploadData() {
    console.log("uploadData...")
    let that = this

    try {
      let dirPath = (wx as any).env.USER_DATA_PATH + "/cache/bs-upload"
      let fileName = "rawdata"
      let filePath = `${dirPath}/${fileName}`


      let res = await fsp.access({
        path: dirPath
      }).catch(async err => {
        console.log("fsp.access -- %o", err)
        let ret = await fsp.mkdir({
          dirPath: dirPath,
          recursive: true
        })
        console.log("fsp.mkdir -- %o", ret)
      })
      console.log("fsp.access -- %o", res)

      console.log("先删除原来的文件，再创建新的上传文件...")
      res = await fsp.removeSavedFile({
        filePath: filePath
      }).catch(err => {
        console.log("fsp.removeSavedFile error -- %o", err)
      })
      console.log("fsp.removeSavedFile result -- %o", res)
      if (!that.data.waveData) {
        throw new Error("上传数据为空...")
      }

      console.log("开始创建上传数据临时文件...")
      res = await fsp.writeFile({
        filePath: filePath,
        // encoding: "binary",
        data: that.data.waveData
      })
      console.log("fsp.writeFile result -- %o", res)

      res = await fsp.getFileInfo({
        filePath: filePath
      })
      console.log("fsp.getFileInfo(%s) result -- %o", filePath, res)

      // let readRes = await fsp.readFile({
      //   filePath: filePath
      // })
      // if (typeof readRes.data === "string") {
      //   console.log(`string data: ${readRes.data}`)
      // } else if (readRes.data instanceof ArrayBuffer) {
      //   console.log(`ArrayBuffer data: ${that.ab2hex(readRes.data)}`)
      // }

      res = await APIs.default().uploadRequest({
        url: "bs/upload_file",
        filePath: filePath,
        name: "file",
        formData: {
          test_time: Math.floor(Date.now() / 1000),
          type: 1,
          condition: ""
        }
      })
      console.log("upload file(%s) -- %o", filePath, res)

      let jsonObj = JSON.parse(res)
      if (!jsonObj) {
        console.log("json object null...")
        return
      }
      if (jsonObj.resultcode == 0) {
        let data = jsonObj.data
        let rawData = data.rawData
        if (typeof rawData === "string") {
          rawData = JSON.parse(rawData)
        }
        console.log("upload response...%o", data)
        if (data.pdf_url) {
          that.app.$url.report.go({ reportUrl: data.pdf_url })
        }
      } else {
        throw new Error("返回错误结果...")
      }

    } catch (error) {
      console.log("uploadData: %o", error)
    }
  }

  async onWaveFinish(e: any) {
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

  }

  private showLoading() {
    // $Toast({
    //   content: '等待设备连接...',
    //   image: 'https://i.loli.net/2017/08/21/599a521472424.jpg', // '../../images/borsam_touch.png',
    //   duration: 0
    // });
    let that = this

    that.setDataSmart({
      showLoading: false
    })
  }

  private hideLoading() {
    // $Toast.hide()
    let that = this

    that.setDataSmart({
      showLoading: true
    })
  }

  bindload(e: any) {
    console.log('bindload event: %o', e)
  }

  binderror(e: any) {
    console.log('binderror event: %o', e)
  }

}
