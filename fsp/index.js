/******************************************************************
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/

const PROMISABLE = { FUNCS: ["access","accessSync","appendFile","appendFileSync","saveFile","saveFileSync","getSavedFileList","removeSavedFile","copyFile","copyFileSync","getFileInfo","mkdir","mkdirSync","readFile","readFileSync","readdir","readdirSync","rename","renameSync","rmdir","rmdirSync","stat","statSync","unlink","unlinkSync","unzip","writeFile","writeFileSync"] };
const fsp = {}

const fs = wx.getFileSystemManager()

Object.getOwnPropertyNames(fs).forEach(key => {
  let desc = Object.getOwnPropertyDescriptor(fs, key)
  if (desc) {
    if (PROMISABLE.FUNCS.indexOf(key) >= 0) {
      Object.defineProperty(fsp, key, {
        configurable: desc.configurable,
        enumerable: desc.enumerable,
        get() {
          // @ts-ignore
          return fspromisify(fs[key], fs)
        }
      })
    } else {
      Object.defineProperty(fsp, key, desc)
    }
  }
})

function fspromisify(func, context, callbackIndex = 0) {
  return (...args) => new Promise((resolve, reject) => {
    let { success, fail, complete, ...arg } = (args[callbackIndex] || {})

    args[callbackIndex] = {
      ...arg,
      success: (res) => {
        resolve(res)
        if (success) success(res)
      },
      fail: (err) => {
        reject(err)
        if (fail) fail(err)
      },
      complete
    }

    func.call(context, ...args)
  })
}

export { fsp }