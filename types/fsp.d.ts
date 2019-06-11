export namespace fsp {

namespace access {
  type Params = {
    /**
     * 要判断是否存在的文件/目录路径
     */
    path: string
  }
}
/**
 * @since 1.9.9
 *
 * 判断文件/目录是否存在。
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.access.html
 */
function access(OBJECT: access.Params): Promise<any>;

/**
 * @since 1.9.9
 *
 * `FileSystemManager.access` 的同步版本。
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.accessSync.html
 */
function accessSync(path: string): string;

namespace appendFile {
  type Params = {
    /**
     * 要追加内容的文件路径
     */
    filePath: string
    /**
     * 要追加的文本或二进制数据
     */
    data: string | ArrayBuffer
    /**
     * 指定写入文件的字符编码。默认值utf8。合法值ascii、base64、binary、hex、ucs2/ucs-2/utf16le/utf-16le、utf-8/utf8、latin1
     *
     * @default utf8
     */
    encoding?: string
  }
}
/**
 * @since 2.1.0
 * 低版本需做[兼容处理](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
 *
 * 在文件结尾追加内容。
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.appendFile.html
 */

function appendFile(OBJECT: appendFile.Params): Promise<any>;

/**
 * @since 2.1.0
 * 低版本需做[兼容处理](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
 *
 * `FileSystemManager.appendFile`的同步版本。
 *
 * @param filePath 要追加内容的文件路径
 * @param data 要追加的文本或二进制数据
 * @param encoding 指定写入文件的字符编码。合法值ascii、base64、binary、hex、ucs2/ucs-2/utf16le/utf-16le、utf-8/utf8、latin1
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.appendFileSync.html
 */
function appendFileSync(filePath: string, data: string | ArrayBuffer, encoding: string): string;

namespace saveFile {
  type Promised = {
    /**
     * 存储后的文件路径
     */
    savedFilePath: number
  }
  type Params = {
    /**
     * 临时存储文件路径
     */
    tempFilePath: string
    /**
     * 要存储的文件路径
     */
    filePath?: string
  }
}
/**
 * @since 1.9.9
 *
 * 保存临时文件到本地。此接口会移动临时文件，因此调用成功后，tempFilePath 将不可用。
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.saveFile.html
 */
function saveFile(OBJECT: saveFile.Params): Promise<saveFile.Promised>;

/**
 * @since 1.9.9
 *
 * `FileSystemManager.saveFile`的同步版本。
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.saveFileSync.html
 */
function saveFileSync(tempFilePath: string, filePath: string): number;

namespace getSavedFileList {
  type FileList = {
    /**
     * 本地路径
     */
    filePath: string
    /**
     * 本地文件大小，以字节为单位
     */
    size: number
    /**
     * 文件保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
     */
    createTime: number
  }
  type Promised = {
    fileList: Array<FileList>
  }
  type Params = {}
}
/**
 * @since 1.9.9
 *
 * 获取该小程序下已保存的本地缓存文件列表。
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.getSavedFileList.html
 */
function getSavedFileList(OBJECT: getSavedFileList.Params): Promise<getSavedFileList.Promised>

namespace removeSavedFile {
  type Params = {
    /**
     * 需要删除的文件路径
     */
    filePath: string
  }
}
/**
 * @since 1.9.9
 *
 * 删除该小程序下已保存的本地缓存文件。
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.removeSavedFile.html
 */
function removeSavedFile(OBJECT: removeSavedFile.Params): Promise<any>

namespace copyFile {
  type Params = {
    /**
     * 源文件路径，只可以是普通文件
     */
    srcPath: string
    /**
     * 目标文件路径
     */
    destPath: string
  }
}
/**
 * @since 1.9.9
 *
 * 复制文件
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.copyFile.html
 *
 */
function copyFile(OBJECT: copyFile.Params): Promise<any>

/**
 * @since 1.9.9
 *
 * `FileSystemManager.copyFile` 的同步版本
 *
 * @param srcPath 源文件路径，只可以是普通文件
 * @param destPath 目标文件路径
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.copyFileSync.html
 */
function copyFileSync(srcPath: string, destPath: string): string

namespace getFileInfo {
  type Promised = {
    /**
     * 文件大小，以字节为单位
     */
    size: number
  }
  type Params = {
    /**
     * 要读取的文件路径
     */
    filePath: string
  }
}
/**
 * @since 1.9.9
 *
 * 获取该小程序下的 本地临时文件 或 本地缓存文件 信息
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.getFileInfo.html
 */
function getFileInfo(OBJECT: getFileInfo.Params): Promise<getFileInfo.Promised>

namespace mkdir {
  type Params = {
    dirPath: string
    recursive?: boolean
  }
}
/**
 * @since 1.9.9
 *
 * 创建目录
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.mkdir.html
 */
function mkdir(OBJECT: mkdir.Params): Promise<any>

/**
 * @since 1.9.9
 *
 * `FileSystemManager.mkdir`的同步版本
 * @param dirPath 创建的目录路径
 * @param recursive 基础库 @since 2.3.0 开始支持，低版本需做[兼容处理](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)。是否在递归创建该目录的上级目录后再创建该目录。如果对应的上级目录已经存在，则不创建该上级目录。如 dirPath 为 a/b/c/d 且 recursive 为 true，将创建 a 目录，再在 a 目录下创建 b 目录，以此类推直至创建 a/b/c 目录下的 d 目录。
 */
function mkdirSync(dirPath: string, recursive: boolean): string

namespace readFile {
  type Promised = {
    /**
     * 文件内容
     */
    data: string | ArrayBuffer
  }
  type Params = {
    /**
     * 要读取的文件的路径
     */
    filePath: string
    /**
     * 指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容。合法值ascii、base64、binary、hex、ucs2/ucs-2/utf16le/utf-16le、utf-8/utf8、latin1
     */
    encoding?: string
  }
}
/**
 * @since 1.9.9
 *
 * 读取本地文件内容
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.readFile.html
 */
function readFile(OBJECT: readFile.Params): Promise<readFile.Promised>

/**
 * @see 1.9.9
 *
 * `FileSystemManager.readFile`的同步版本
 *
 * @param filePath 要读取的文件的路径
 * @param encoding 指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容。合法值ascii、base64、binary、hex、ucs2/ucs-2/utf16le/utf-16le、utf-8/utf8、latin1
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.readFileSync.html
 */
function readFileSync(filePath: string, encoding?: string): string | ArrayBuffer

namespace readdir {
  type Promised = {
    /**
     * 指定目录下的文件名数组
     */
    files: Array<string>
  }
  type Params = {
    /**
     * 要读取的目录路径
     */
    dirPath: string
  }
}
/**
 * @see 1.9.9
 *
 * 读取目录内文件列表
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.readdir.html
 */
function readdir(OBJECT: readdir.Params): Promise<readdir.Promised>

/**
 * `FileSystemManager.readdir`的同步版本
 *
 * @param dirPath 要读取的目录路径
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.readdirSync.html
 */
function readdirSync(dirPath: string): string | Array<string>

namespace writeFile {
  type Params = {
    /**
     * 要写入的文件路径
     */
    filePath: string
    /**
     * 要写入的文本或二进制数据
     */
    data: string | ArrayBuffer
    /**
     * 指定写入文件的字符编码。合法值ascii、base64、binary、hex、ucs2/ucs-2/utf16le/utf-16le、utf-8/utf8、latin1
     *
     * @default utf8
     */
    encoding?: string
  }
}
/**
 * @since 1.9.9
 *
 * 写文件
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/FileSystemManager.writeFile.html
 */
function writeFile(OBJECT: writeFile.Params): Promise<any>

/**
 * @since 1.9.9
 *
 * `FileSystemManager.writeFile`的同步版本
 *
 * @param filePath 要写入的文件路径
 * @param data 要写入的文本或二进制数据
 * @param encoding 指定写入文件的字符编码。合法值ascii、base64、binary、hex、ucs2/ucs-2/utf16le/utf-16le、utf-8/utf8、latin1
 */
function writeFileSync(filePath: string, data: string | ArrayBuffer, encoding?: string): string

}