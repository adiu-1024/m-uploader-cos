import COS from 'cos-js-sdk-v5'
import { v4 as uuidv4 } from 'uuid'

class COSUpload {
  constructor(config) {
    config.pickId = config.pickId.startsWith('#') ? config.pickId : `#${config.pickId}`
    this.$options = config
    this.events = {}
    this.init()
  }
  init() {
    const el = document.querySelector(this.$options.pickId)
    el.addEventListener('change', this.handleChange.bind(this), false)
  }
  handleChange() {
    const { isPreview = false } = this.$options
    const fileList = [...event.target.files]
    event.target.value = ''
    if (isPreview) {
      this.$emit('getPreviewFileInfo', fileList)
    } else {
      this.handleUpload(fileList)
    }
  }
  async handleUpload(fileList) {
    this.$emit('loading', true)
    const { tmpKeyUrl, headers, SliceSize = 1024 * 1024, getProgress = null } = this.$options
    const {
      bucket, region, requestAddress, dir, credentials
    } = await fetch(tmpKeyUrl, {
      mode: 'cors',
      credentials: 'same-origin',
      headers,
    }).then(response => {
      const { ok, status, statusText } = response
      if (!ok) {
        return Promise.reject({ status, statusText })
      } else {
        return response.json()
      }
    })
    const filesInfo = []
    const { tmpSecretId, tmpSecretKey, sessionToken } = credentials
    const files = fileList.map(file => {
      const uuid = uuidv4().replace(/-/g, '')
      filesInfo.push({
        url: `${requestAddress}/${dir}/${uuid}`,
        file,
      })
      return { Bucket: bucket, Region: region, Key: `${dir}/${uuid}`, Body: file }
    })
    this.$emit('getUploadFileInfo', filesInfo)
    const cos = new COS({
      SecretId: tmpSecretId,
      SecretKey: tmpSecretKey,
      XCosSecurityToken: sessionToken,
      UploadCheckContentMd5: true
    })
    cos.uploadFiles({
      files,
      SliceSize,
      StorageClass: 'STANDARD',
      onProgress: data => {
        const percentage = parseInt(data.percent * 100)
        const speed = ((data.speed / 1024 / 1024 * 100) / 100).toFixed(2) + ' Mb/s'
        if (typeof getProgress === 'function') {
          getProgress({ percentage, speed })
        }
        if (percentage == 100) {
          this.fileList = null
          this.$emit('loading', false)
          this.$off()
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
  $off() {
    this.events = null
  }
}

export default COSUpload
