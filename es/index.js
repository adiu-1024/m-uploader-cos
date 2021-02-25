import COS from 'cos-js-sdk-v5'
import { v4 as uuidv4 } from 'uuid'

class COSUpload {
  constructor(config) {
    config.pickId = config.pickId.startsWith('#') ? config.pickId : `#${config.pickId}`
    this.events = {}
    this.$options = config
    this.init()
  }
  init() {
    const el = document.querySelector(this.$options.pickId)
    el.addEventListener('change', this.handleChange.bind(this), false)
  }
  handleChange(e) {
    this.$options.loading = true
    const fileList = [...e.target.files]
    e.target.value = ''
    fileList.length && this.handleUpload(fileList)
  }
  async handleUpload(fileList) {
    this.$emit('loading', true)
    const { tmpKeyUrl, authName = 'TOKEN', getProgress = null } = this.$options
    const {
      bucket, region, requestAddress, dir, startTime, expiredTime, credentials
    } = await fetch(tmpKeyUrl, {
      headers: {
        'Authorization': localStorage.getItem(authName)
      }
    }).then(res => res.json())
    const filesInfo = []
    const { tmpSecretId, tmpSecretKey, sessionToken } = credentials
    const files = fileList.map(file => {
      const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1)
      const newName = uuidv4().replace(/-/g, '') + '.' + fileExtension
      const key = dir + '/' + newName
      filesInfo.push({
        newname: newName,
        fileExtension: fileExtension,
        url: `${requestAddress}/${dir}/${newName}`,
        file
      })
      return { Bucket: bucket, Region: region, Key: key, Body: file }
    })
    this.$emit('handleFileChange', filesInfo)
    const cos = new COS({
      SecretId: tmpSecretId,
      SecretKey: tmpSecretKey,
      XCosSecurityToken: sessionToken,
      StartTime: startTime,
      ExpiredTime: expiredTime,
      UploadCheckContentMd5: true
    })
    cos.uploadFiles({
      files,
      SliceSize: 1024 * 1024,
      StorageClass: 'STANDARD',
      onProgress: data => {
        const percentage = parseInt(data.percent * 100)
        const speed = ((data.speed / 1024 / 1024 * 100) / 100).toFixed(2) + ' Mb/s'
        if (typeof getProgress === 'function') {
          getProgress({ percentage, speed })
        }
        if (percentage == 100) {
          this.$emit('loading', false)
        }
      }
    })
  }
  $on(key, fn) {
    (this.events[key] || (this.events[key] = [])).push(fn)
  }
  $emit(key, ...args) {
    const cbs = this.events[key]
    cbs && cbs.forEach(cb => cb.call(this, ...args))
  }
  $off(key) {
    delete this.events[key]
  }
}

export default COSUpload
