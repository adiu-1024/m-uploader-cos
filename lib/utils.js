"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Utils = /*#__PURE__*/function () {
  function Utils() {
    (0, _classCallCheck2["default"])(this, Utils);
  }

  (0, _createClass2["default"])(Utils, null, [{
    key: "getVideoInfo",
    value: function getVideoInfo(file) {
      var captureImage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return new Promise(function (resolve, reject) {
        var name = file.name,
            type = file.type,
            size = file.size;
        var video = document.createElement('video');
        Object.assign(video, {
          src: URL.createObjectURL(file),
          currentTime: 1
        });

        if (captureImage) {
          video.addEventListener('loadeddata', function () {
            var _this = this;

            var width = this.videoWidth,
                height = this.videoHeight,
                duration = this.duration;
            var canvas = document.createElement('canvas');
            Object.assign(canvas, {
              width: width,
              height: height
            });
            canvas.getContext('2d').drawImage(this, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(function (blob) {
              URL.revokeObjectURL(_this.src);
              _this.src = '';
              resolve({
                file: file,
                blob: blob,
                name: name,
                type: type,
                size: size,
                width: width,
                height: height,
                duration: duration
              });
            }, 'image/jpeg', 0.95);
          });
        } else {
          video.addEventListener('loadedmetadata', function () {
            var width = this.videoWidth,
                height = this.videoHeight,
                duration = this.duration;
            URL.revokeObjectURL(this.src);
            this.src = '';
            resolve({
              file: file,
              name: name,
              type: type,
              size: size,
              width: width,
              height: height,
              duration: duration
            });
          });
        }

        video.onerror = function (error) {
          return reject(error.message);
        };
      });
    }
  }]);
  return Utils;
}();

var _default = Utils;
exports["default"] = _default;