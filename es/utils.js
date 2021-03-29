class Utils {
  static getVideoInfo(file, captureImage = true) {
    return new Promise((resolve, reject) => {
      const { name, type, size } = file
      const video = document.createElement('video')
      Object.assign(video, {
        src: URL.createObjectURL(file),
        currentTime: 1
      })
      if (captureImage) {
        video.addEventListener('loadeddata', function() {
          const { videoWidth: width, videoHeight: height, duration } = this
          const canvas = document.createElement('canvas')
          Object.assign(canvas, { width, height })
          canvas.getContext('2d').drawImage(this, 0, 0, canvas.width, canvas.height)
          canvas.toBlob(blob => {
            URL.revokeObjectURL(this.src)
            this.src = ''
            resolve({ file, blob, name, type, size, width, height, duration })
          }, 'image/jpeg', 0.95)
        })
      } else {
        video.addEventListener('loadedmetadata', function() {
          const { videoWidth: width, videoHeight: height, duration } = this
          URL.revokeObjectURL(this.src)
          this.src = ''
          resolve({ file, name, type, size, width, height, duration })
        })
      }
      video.onerror = error => reject(error.message)
    })
  }
}

export default Utils
