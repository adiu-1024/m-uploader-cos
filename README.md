#### Installing
* Using npm
  ```cmd
  npm install m-uploader-cos
  ```

* Using yarn
  ```cmd
  yarn add m-uploader-cos
  ```

* ES6 import
  ```JS
  import COSUpload from 'm-uploader-cos'
  ```

#### Use examples
* Proxy interception
  ```JS
  const handler = {
    construct(target, args) {
      const { headers = {}, ...config } = args[0]
      config.headers = Object.assign(headers, {
        'Authorization': localStorage.getItem('AUTH-TOKEN')
      })
      return new target(config)
    }
  }
  const ProxyCOSUpload = new Proxy(COSUpload, handler)
  export default ProxyCOSUpload
  ```

* Upload files directly
  ```JS
  const COSUploader = new COSUpload({
    pickId: 'selector',  // id selector
    tmpKeyUrl: '/api/upload/tmpKey'  // Get cos related configuration items through server interface
  })
  COSUploader.$on('getUploadFileInfo', filesInfo => {
    console.log('uploadFileInfo', filesInfo)
  })
  ```
  Note: through getUploadFileInfo to get the file information for other operations, such as MD5 encryption

* Preview local files before uploading
  ```JS
  const COSUploader = new COSUpload({
    pickId: 'selector',
    tmpKeyUrl: '/api/upload/tmpKey',
    isPreview: true,
  })
  COSUploader.$on('getPreviewFileInfo', filesInfo => {
    console.log('previewFileInfo', filesInfo)
  })
  COSUploader.$on('getUploadFileInfo', filesInfo => {
    console.log('uploadFileInfo', filesInfo)
  })
  COSUploader.handleUpload(uploadFiles)
  ```

* Get upload progress and rate
  ```JS
  const COSUploader = new COSUpload({
    pickId: 'selector',
    tmpKeyUrl: '/api/upload/tmpKey',
    getProgress({ percentage, speed }) {
      console.log(`Upload progress：${percentage}`)
      console.log(`Upload rate：${speed}`)
    }
  })
  ```
