"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _cosJsSdkV = _interopRequireDefault(require("cos-js-sdk-v5"));

var _uuid = require("uuid");

var _utils = _interopRequireDefault(require("./utils"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var COSUpload = /*#__PURE__*/function () {
  function COSUpload(_ref) {
    var pickId = _ref.pickId,
        config = (0, _objectWithoutProperties2["default"])(_ref, ["pickId"]);
    (0, _classCallCheck2["default"])(this, COSUpload);
    this.$options = config;
    this.events = {};
    !config.isPreview && this.init(pickId);
  }

  (0, _createClass2["default"])(COSUpload, [{
    key: "init",
    value: function init(selector) {
      var el = document.querySelector(selector.startsWith('#') ? selector : "#".concat(selector));
      el.addEventListener('change', this.handleChange.bind(this), false);
    }
  }, {
    key: "handleChange",
    value: function () {
      var _handleChange = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var _this$$options$isPrev, isPreview, fileList;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$$options$isPrev = this.$options.isPreview, isPreview = _this$$options$isPrev === void 0 ? false : _this$$options$isPrev;
                _context.next = 3;
                return Promise.all((0, _toConsumableArray2["default"])(event.target.files).map(function (file) {
                  return _utils["default"].getVideoInfo(file, false);
                })).then(function (result) {
                  return result;
                });

              case 3:
                fileList = _context.sent;
                event.target.value = '';

                if (isPreview) {
                  this.$emit('getPreviewFileInfo', fileList);
                } else {
                  this.handleUpload(fileList);
                }

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function handleChange() {
        return _handleChange.apply(this, arguments);
      }

      return handleChange;
    }()
  }, {
    key: "handleUpload",
    value: function () {
      var _handleUpload = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(fileList) {
        var _this$$options, tmpKeyUrl, headers, _this$$options$SliceS, SliceSize, _this$$options$getPro, getProgress, _yield$fetch$then, bucket, region, requestAddress, dir, credentials, filesInfo, tmpSecretId, tmpSecretKey, sessionToken, files, cos;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$$options = this.$options, tmpKeyUrl = _this$$options.tmpKeyUrl, headers = _this$$options.headers, _this$$options$SliceS = _this$$options.SliceSize, SliceSize = _this$$options$SliceS === void 0 ? 1024 * 1024 * 20 : _this$$options$SliceS, _this$$options$getPro = _this$$options.getProgress, getProgress = _this$$options$getPro === void 0 ? null : _this$$options$getPro;
                _context2.next = 3;
                return fetch(tmpKeyUrl, {
                  mode: 'cors',
                  credentials: 'same-origin',
                  headers: headers
                }).then(function (response) {
                  var ok = response.ok,
                      status = response.status,
                      statusText = response.statusText;

                  if (!ok) {
                    return Promise.reject({
                      status: status,
                      statusText: statusText
                    });
                  } else {
                    return response.json();
                  }
                });

              case 3:
                _yield$fetch$then = _context2.sent;
                bucket = _yield$fetch$then.bucket;
                region = _yield$fetch$then.region;
                requestAddress = _yield$fetch$then.requestAddress;
                dir = _yield$fetch$then.dir;
                credentials = _yield$fetch$then.credentials;
                filesInfo = [];
                tmpSecretId = credentials.tmpSecretId, tmpSecretKey = credentials.tmpSecretKey, sessionToken = credentials.sessionToken;
                files = fileList.map(function () {
                  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                      file = _ref2.file,
                      aside = (0, _objectWithoutProperties2["default"])(_ref2, ["file"]);

                  var uuid = (0, _uuid.v4)().replace(/-/g, '');
                  filesInfo.push(_objectSpread({
                    url: "".concat(requestAddress, "/").concat(dir, "/").concat(uuid),
                    file: file
                  }, aside));
                  return {
                    Bucket: bucket,
                    Region: region,
                    Key: "".concat(dir, "/").concat(uuid),
                    Body: file
                  };
                });
                this.$emit('getUploadFileInfo', filesInfo);
                cos = new _cosJsSdkV["default"]({
                  SecretId: tmpSecretId,
                  SecretKey: tmpSecretKey,
                  XCosSecurityToken: sessionToken,
                  UploadCheckContentMd5: true
                });
                cos.uploadFiles({
                  files: files,
                  SliceSize: SliceSize,
                  StorageClass: 'STANDARD',
                  onProgress: function onProgress(_ref3) {
                    var percent = _ref3.percent,
                        speed = _ref3.speed;
                    var percentage = parseInt(percent * 100);
                    var uploadRate = (speed / 1024 / 1024 * 100 / 100).toFixed(2) + ' Mb/s';

                    if (typeof getProgress === 'function') {
                      getProgress({
                        percentage: percentage,
                        uploadRate: uploadRate
                      });
                    }
                  }
                });

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
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
      var _this = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var cbs = this.events[key];
      cbs && cbs.forEach(function (cb) {
        return cb.call.apply(cb, [_this].concat(args));
      });
    }
  }]);
  return COSUpload;
}();

var _default = COSUpload;
exports["default"] = _default;