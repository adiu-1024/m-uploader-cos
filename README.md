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
    authName: 'TOKEN',  // Token name of local storage
    tmpKeyUrl: '/api/upload/tmpKey'  // Get cos related configuration items through server interface
  })
  COSUploader.$on('loading', value => {
    console.log('COSUploading', value)
  })
  COSUploader.$on('handleFileChange', filesInfo => {
    console.log('filesInfo', filesInfo)
  })
  ```
  Note: through handlefilechange to get the file information for other operations, such as MD5 encryption

* Get upload progress
  ```JS
  const COSUploader = new COSUpload({
    pickId: 'selector',
    authName: 'TOKEN',
    tmpKeyUrl: '/api/upload/tmpKey',
    getProgress({ percentage, speed }) {
      console.log(`Upload progress：${percentage}`)
    }
  })
  ```
  
