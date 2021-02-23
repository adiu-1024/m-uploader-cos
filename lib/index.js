"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _cosJsSdkV = _interopRequireDefault(require("cos-js-sdk-v5"));

var _uuid = require("uuid");

var Index = /*#__PURE__*/function () {
  function Index(config) {
    (0, _classCallCheck2["default"])(this, Index);
    config.pickId = config.pickId.startsWith('#') ? config.pickId : "#".concat(config.pickId);
    this.events = {};
    this.$options = config;
    this.init();
  }

  (0, _createClass2["default"])(Index, [{
    key: "init",
    value: function init() {
      var el = document.querySelector(this.$options.pickId);
      el.addEventListener('change', this.handleChange.bind(this), false);
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      this.$options.loading = true;
      var fileList = (0, _toConsumableArray2["default"])(e.target.files);
      e.target.value = '';
      fileList.length && this.handleUpload(fileList);
    }
  }, {
    key: "handleUpload",
    value: function () {
      var _handleUpload = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(fileList) {
        var _this = this;

        var _this$$options, tmpKeyUrl, _this$$options$tokenN, tokenName, _this$$options$getPro, getProgress, _yield$fetch$then, bucket, region, requestAddress, dir, startTime, expiredTime, credentials, filesInfo, tmpSecretId, tmpSecretKey, sessionToken, files, cos;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.$emit('loading', true);
                _this$$options = this.$options, tmpKeyUrl = _this$$options.tmpKeyUrl, _this$$options$tokenN = _this$$options.tokenName, tokenName = _this$$options$tokenN === void 0 ? 'TOKEN' : _this$$options$tokenN, _this$$options$getPro = _this$$options.getProgress, getProgress = _this$$options$getPro === void 0 ? null : _this$$options$getPro;
                _context.next = 4;
                return fetch(tmpKeyUrl, {
                  headers: {
                    'Authorization': localStorage.getItem(tokenName)
                  }
                }).then(function (res) {
                  return res.json();
                });

              case 4:
                _yield$fetch$then = _context.sent;
                bucket = _yield$fetch$then.bucket;
                region = _yield$fetch$then.region;
                requestAddress = _yield$fetch$then.requestAddress;
                dir = _yield$fetch$then.dir;
                startTime = _yield$fetch$then.startTime;
                expiredTime = _yield$fetch$then.expiredTime;
                credentials = _yield$fetch$then.credentials;
                filesInfo = [];
                tmpSecretId = credentials.tmpSecretId, tmpSecretKey = credentials.tmpSecretKey, sessionToken = credentials.sessionToken;
                files = fileList.map(function (file) {
                  var fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
                  var newName = (0, _uuid.v4)().replace(/-/g, '') + '.' + fileExtension;
                  var key = dir + '/' + newName;
                  filesInfo.push({
                    newname: newName,
                    fileExtension: fileExtension,
                    url: "".concat(requestAddress, "/").concat(dir, "/").concat(newName),
                    file: file
                  });
                  return {
                    Bucket: bucket,
                    Region: region,
                    Key: key,
                    Body: file
                  };
                });
                this.$emit('handleFileChange', filesInfo);
                cos = new _cosJsSdkV["default"]({
                  SecretId: tmpSecretId,
                  SecretKey: tmpSecretKey,
                  XCosSecurityToken: sessionToken,
                  StartTime: startTime,
                  ExpiredTime: expiredTime,
                  UploadCheckContentMd5: true
                });
                cos.uploadFiles({
                  files: files,
                  SliceSize: 1024 * 1024,
                  StorageClass: 'STANDARD',
                  onProgress: function onProgress(data) {
                    var progress = parseInt(data.percent * 100);
                    var speed = (data.speed / 1024 / 1024 * 100 / 100).toFixed(2) + ' Mb/s';

                    if (typeof getProgress === 'function') {
                      getProgress({
                        progress: progress,
                        speed: speed
                      });
                    }

                    if (progress == 100) {
                      _this.$emit('loading', false);
                    }
                  }
                });

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function handleUpload(_x) {
        return _handleUpload.apply(this, arguments);
      }

      return handleUpload;
    }()
  }, {
    key: "$on",
    value: function $on(key, fn) {
      (this.events[key] || (this.events[key] = [])).push(fn);
    }
  }, {
    key: "$emit",
    value: function $emit(key) {
      var _this2 = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var cbs = this.events[key];
      cbs && cbs.forEach(function (cb) {
        return cb.call.apply(cb, [_this2].concat(args));
      });
    }
  }, {
    key: "$off",
    value: function $off(key) {
      delete this.events[key];
    }
  }]);
  return Index;
}();

var _default = Index;
exports["default"] = _default;