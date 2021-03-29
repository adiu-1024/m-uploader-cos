import COS from 'cos-js-sdk-v5'
import { v4 as uuidv4 } from 'uuid'

import Utils from './utils'

class COSUpload {
  constructor({ pickId, ...config }) {
    this.$options = config
    this.events = {}
    !config.isPreview && this.init(pickId)
  }
  init(selector) {
    const el = document.querySelector(selector.startsWith('#') ? selector : `#${selector}`)
    el.addEventListener('change', this.handleChange.bind(this), false)
  }
  async handleChange() {
    const { isPreview = false } = this.$options
    const fileList = await Promise.all([...event.target.files].map(file => Utils.getVideoInfo(file, false))).then(result => result)
    event.target.value = ''
    if (isPreview) {
      this.$emit('getPreviewFileInfo', fileList)
    } else {
      this.handleUpload(fileList)
    }
  }
  async handleUpload(fileList) {
    const { tmpKeyUrl, headers, SliceSize = 1024 * 1024 * 20, getProgress = null } = this.$options
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
    const files = fileList.map(({ file, ...aside } = {}) => {
      const uuid = uuidv4().replace(/-/g, '')
      filesInfo.push({
        url: `${requestAddress}/${dir}/${uuid}`,
        file,
        ...aside
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
      onProgress: ({ percent, speed }) => {
        const percentage = parseInt(percent * 100)
        const uploadRate = ((speed / 1024 / 1024 * 100) / 100).toFixed(2) + ' Mb/s'
        if (typeof getProgress === 'function') {
          getProgress({ percentage, uploadRate })
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
}

export default COSUpload
