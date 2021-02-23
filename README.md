#### Installation and import
* Using npm
  ```cmd
  npm install m-uploader-cos
  ```

* Using yarn
  ```cmd
  yarn add m-uploader-cos
  ```

* ES6 import mode
  ```JS
  import COSUpload from 'm-uploader-cos'
  ```

#### Use examples
* Basic usage
  ```JS
  const COSUploader = new COSUpload({
    pickId: 'selector',  // id selector
    tokenName: 'ctoken',  // Token name of local storage
    tmpKeyUrl: '/api/upload/tmpKey'  // Get cos related configuration items through server interface
  })
  COSUploader.$on('loading', value => {
    console.log('cosUploading', value)
  })
  COSUploader.$on('handleFileChange', filesInfo => {
    console.log('filesInfo', filesInfo)
  })
  ```
* Get upload progress
  ```JS
  const COSUploader = new COSUpload({
    pickId: 'selector',
    tokenName: 'ctoken',
    tmpKeyUrl: '/api/upload/tmpKey',
    getProgress(percentage) {
      console.log(`Upload progress：${percentage}`)
    }
  })
  ```

#### 使用示例
* 基本用法
  ```JS
  const COSUploader = new COSUpload({
    pickId: 'selector',
    tokenName: 'ctoken',
    tmpKeyUrl: '/api/upload/tmpKey'
  })
  COSUploader.$on('loading', value => {
    console.log('cosUploading', value)
  })
  COSUploader.$on('handleFileChange', filesInfo => {
    console.log('filesInfo', filesInfo)
  })
  ```
* 获取进度
  ```JS
  const COSUploader = new COSUpload({
    pickId: 'selector',
    tokenName: 'ctoken',
    tmpKeyUrl: '/api/upload/tmpKey',
    getProgress(percentage) {
      console.log(`Upload progress：${percentage}`)
    }
  })
  ```
