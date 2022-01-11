var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop2 in b || (b = {}))
    if (__hasOwnProp.call(b, prop2))
      __defNormalProp(a, prop2, b[prop2]);
  if (__getOwnPropSymbols)
    for (var prop2 of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop2))
        __defNormalProp(a, prop2, b[prop2]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop2 in source)
    if (__hasOwnProp.call(source, prop2) && exclude.indexOf(prop2) < 0)
      target[prop2] = source[prop2];
  if (source != null && __getOwnPropSymbols)
    for (var prop2 of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop2) < 0 && __propIsEnum.call(source, prop2))
        target[prop2] = source[prop2];
    }
  return target;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import BigNumber$1, { BigNumber } from "@waves/bignumber";
import React, { useState, useEffect, useCallback } from "react";
import { isNil, prop, curry, pipe, tap } from "ramda";
import "@waves/ts-types";
import { Flex, Box, AddressLabel, AddressAvatar, Text, Button, Select, Selected, List, Tooltip, Icon, iconQuestion, iconTransferCircle, iconTransferArrow, iconMassTransfer, AssetLogo, useBoundedTooltip, iconAliasTransaction, Tabs, TabsList, Tab, TabPanels, TabPanel, BoxWithIcon, iconSmartMini, iconBurnTransaction, AssetLogoWithIcon, Copy, iconCancelLeaseTransaction, iconDataTransaction, iconInvoke, Heading, iconIssueTransaction, ExternalLink, Checkbox, Label, iconLeaseTransaction, iconSignMessage, LightCopy, iconReissueTransaction, Help as Help$1, iconSetAssetScript, iconSponsorshipEnableTransaction, iconSponsorshipDisableTransaction, iconSponsorshipMini, DotLoader } from "@waves.exchange/react-uikit";
import { Global } from "@emotion/core";
import { libs } from "@waves/waves-transactions";
const MAX_ALIAS_LENGTH = 30;
const WAVES = {
  ticker: "WAVES",
  assetId: "WAVES",
  name: "Waves",
  decimals: 8,
  description: "",
  issueHeight: 0,
  issueTimestamp: new Date("2016-04-11T21:00:00.000Z").getTime(),
  reissuable: false,
  scripted: false,
  minSponsoredFee: null,
  quantity: BigNumber.toBigNumber(1e8).mul(Math.pow(10, 8)).toFixed(),
  issuer: "WAVES",
  minSponsoredAssetFee: null,
  logo: ""
};
const NAME_MAP = {
  issue: 3,
  transfer: 4,
  reissue: 5,
  burn: 6,
  exchange: 7,
  lease: 8,
  cancelLease: 9,
  alias: 10,
  massTransfer: 11,
  data: 12,
  setScript: 13,
  sponsorship: 14,
  setAssetScript: 15,
  invoke: 16,
  updateAssetInfo: 17
};
const SPONSORED_TYPES = [
  NAME_MAP.transfer,
  NAME_MAP.invoke
];
var constantsModule = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  MAX_ALIAS_LENGTH,
  WAVES,
  NAME_MAP,
  SPONSORED_TYPES
});
const useHandleFeeSelect = (tx) => {
  const [txJSON, setTxJSON] = useState(JSON.stringify(tx, null, 2));
  useEffect(() => setTxJSON(JSON.stringify(tx, null, 2)), [tx, tx.id]);
  return [
    useCallback((fee, feeAssetId) => {
      tx.fee = fee;
      tx["feeAssetId"] = feeAssetId;
      setTxJSON(JSON.stringify(tx, null, 2));
    }, [tx]),
    txJSON
  ];
};
var hooksModule = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  useHandleFeeSelect
});
const onContentLoad = new Promise((resolve2) => {
  document.addEventListener("DOMContentLoaded", resolve2);
});
function loadScript(url) {
  return onContentLoad.then(() => new Promise((resolve2, reject) => {
    const script = document.createElement("script");
    script.addEventListener("load", resolve2);
    script.addEventListener("error", reject);
    script.src = url;
    document.head.appendChild(script);
  }));
}
function hasScript(url) {
  return !!document.querySelector('script[src="' + url + '"]');
}
function runByPath(path, args) {
  let obj = window;
  const parts = path.split(".");
  const isFunc = obj[path] && typeof obj[path] === "function";
  if (parts.length === 1 && isFunc) {
    return obj[path].apply(obj, args);
  }
  parts.slice(-1).forEach(function(part) {
    obj = obj[part];
  });
  if (obj[parts[parts.length - 1]] && typeof obj[parts[parts.length - 1]] === "function") {
    obj[parts[parts.length - 1]].apply(obj, args);
  }
}
const _Analytics = class {
  constructor() {
    __publicField(this, "loaded");
    __publicField(this, "events", []);
    __publicField(this, "apiList", []);
    __publicField(this, "defaultParams", Object.create(null));
    __publicField(this, "isActive", false);
    __publicField(this, "isActivated", false);
    __publicField(this, "apiReadyList", []);
    if (_Analytics.instance) {
      return _Analytics.instance;
    }
    _Analytics.instance = this;
  }
  init(defaultParams) {
    Object.assign(this.defaultParams, defaultParams);
  }
  addApi(data) {
    this.apiList.push(data);
  }
  addDefaultParams(params) {
    Object.assign(this.defaultParams, params);
  }
  deactivate() {
    this.isActive = false;
  }
  activate() {
    if (!this.isActivated) {
      const apiLoadList = this.apiList.map((item) => {
        return loadScript(item.libraryUrl).then(() => {
          runByPath(item.initializeMethod, [
            item.apiToken,
            item.initializeOptions
          ]);
        }).then(() => {
          this.apiReadyList.push({
            type: item.type,
            send: function(name, params) {
              runByPath(item.sendMethod, [name, params]);
            }
          });
          return true;
        }).catch(() => {
          console.error("Invalid analytics config", item);
          return false;
        });
      });
      this.loaded = Promise.all(apiLoadList);
    }
    this.loaded.then(() => {
      const events = [...this.events];
      this.events = [];
      events.forEach((event) => this._sendEvent(event));
      this.isActive = true;
    });
    this.isActivated = true;
  }
  send(data) {
    const event = __spreadProps(__spreadValues({}, data), {
      params: __spreadValues(__spreadValues({}, this.defaultParams), data.params)
    });
    if (this.isActive && this.isActivated) {
      this._sendEvent(event);
    } else {
      this.events.push(event);
    }
  }
  _sendEvent(data) {
    if (!data.name) {
      throw new Error("Wrong format, has no event name!");
    }
    const type = data.target || "all";
    this.apiReadyList.filter(function(item) {
      return type === "all" ? true : item.type === type;
    }).forEach(function(item) {
      return item.send(data.name, __spreadValues({}, data.params));
    });
  }
};
let Analytics = _Analytics;
__publicField(Analytics, "instance");
const analytics = new Analytics();
const assetPropFactory = (assets) => (assetId, property) => isNil(assetId) ? prop(property, WAVES) : prop(property, assets[assetId]);
const cleanAddress = (address) => {
  return address.replace(/alias:.:/, "");
};
function isAddress(address) {
  return cleanAddress(address).length > MAX_ALIAS_LENGTH;
}
const fixRecipient = curry((networkByte, data) => {
  const address = cleanAddress(data.recipient);
  if (isAddress(address)) {
    return __spreadProps(__spreadValues({}, data), { recipient: address });
  } else {
    return __spreadProps(__spreadValues({}, data), {
      recipient: `alias:${String.fromCharCode(networkByte)}:${address}`
    });
  }
});
const getEnvAwareUrl = (pathname) => {
  const origin = window.location.origin.includes("localhost") ? "https://waves.exchange" : window.location.origin;
  if (!pathname)
    return origin;
  if (!pathname.startsWith("/"))
    throw new Error("Pathname should start with /");
  return `${origin}${pathname}`;
};
const getTxAliases = (tx) => {
  switch (tx.type) {
    case NAME_MAP.invoke:
      return isAddress(tx.dApp) ? [] : [tx.dApp];
    case NAME_MAP.transfer:
    case NAME_MAP.lease:
      return isAddress(tx.recipient) ? [] : [tx.recipient];
    case NAME_MAP.massTransfer:
      return tx.transfers.reduce((acc, transfer) => {
        if (!isAddress(transfer.recipient)) {
          acc.push(transfer.recipient);
        }
        return acc;
      }, []);
    default:
      return [];
  }
};
const isAlias = (address) => {
  return cleanAddress(address).length <= MAX_ALIAS_LENGTH;
};
function isSafari() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isSafariUA = userAgent.includes("safari") && !userAgent.includes("chrome");
  const iOS = navigator.platform != null && /iPad|iPhone|iPod/.test(navigator.platform);
  return iOS || isSafariUA;
}
function isBrave() {
  var _a;
  return !!((_a = navigator.brave) == null ? void 0 : _a.isBrave);
}
function resolve(path, base) {
  return new URL(path, base).toString();
}
const reg = new RegExp('((?!\\\\)"\\w+"):\\s*(-?[\\d|\\.]{14,})', "g");
function parse(json) {
  return JSON.parse(json.replace(reg, `$1:"$2"`));
}
const request = typeof fetch === "function" ? fetch : require("node-fetch");
function request$1(params) {
  return request(resolve(params.url, params.base), updateHeaders(params.options)).then(parseResponse);
}
function parseResponse(r) {
  return r.text().then((message) => r.ok ? parse(message) : Promise.reject(tryParse(message)));
}
function tryParse(message) {
  try {
    return JSON.parse(message);
  } catch (e) {
    return message;
  }
}
function updateHeaders(options = Object.create(null)) {
  return Object.assign({ credentials: "include" }, options);
}
function isObject(obj) {
  if (typeof obj === "object" && obj !== null) {
    if (typeof Object.getPrototypeOf === "function") {
      const prototype = Object.getPrototypeOf(obj);
      return prototype === Object.prototype || prototype === null;
    }
    return Object.prototype.toString.call(obj) === "[object Object]";
  }
  return false;
}
const keys = (obj) => Object.keys(obj);
const deepAssign = (...objects) => objects.reduce((target, merge) => {
  keys(merge).forEach((key) => {
    if (Array.isArray(target[key]) && Array.isArray(merge[key])) {
      target[key] = Array.from(new Set(target[key].concat(merge[key])));
    } else if (isObject(target[key]) && isObject(merge[key])) {
      target[key] = deepAssign(target[key], merge[key]);
    } else {
      target[key] = merge[key];
    }
  });
  return target;
}, objects[0] || {});
const FIELDS = ["amount", "matcherFee", "price", "fee", "minSponsoredAssetFee", "quantity", "sellMatcherFee", "buyMatcherFee"];
function stringify(data) {
  return JSON.stringify(data, function(key, value) {
    if (FIELDS.includes(key)) {
      return `!${value}!`;
    } else if (key === "value" && this["type"] === "integer") {
      return `!${value}!`;
    } else {
      return value;
    }
  }, 0).replace(/"\!(-?\d+)\!"/g, "$1");
}
function fetchCalculateFee(base, tx, options = Object.create(null)) {
  return request$1({
    base,
    url: "/transactions/calculateFee",
    options: deepAssign(Object.assign({}, options), {
      method: "POST",
      body: stringify(tx),
      headers: {
        "Content-Type": "application/json"
      }
    })
  });
}
const loadFeeByTransaction = curry((base, tx) => fetchCalculateFee(base, tx).then((info) => __spreadProps(__spreadValues({}, tx), { fee: info.feeAmount })).catch(() => __spreadValues({}, tx)));
const loadLogoInfo = curry((networkByte, data) => Promise.all(data.map((asset) => {
  const network = String.fromCharCode(networkByte) === "W" ? "" : "testnet.";
  const fetchLogoUrl = `https://${network}waves.exchange/static/icons/assets/${asset.assetId}.svg`;
  return fetch(fetchLogoUrl).then((response) => {
    if (response.ok) {
      return __spreadProps(__spreadValues({}, asset), { logo: fetchLogoUrl });
    }
    return asset;
  });
})));
const getPrintableNumber = (number, decimals) => {
  return BigNumber$1.toBigNumber(number).div(Math.pow(10, decimals)).roundTo(decimals).toFixed();
};
const getCoins = (n, decimals) => {
  return BigNumber$1.toBigNumber(n).mul(Math.pow(10, decimals)).toFixed();
};
class Queue {
  constructor(maxLength) {
    __publicField(this, "_actions", []);
    __publicField(this, "_maxLength");
    __publicField(this, "_active");
    this._maxLength = maxLength;
  }
  get length() {
    return this._actions.length + (this._active == null ? 0 : 1);
  }
  push(action) {
    if (this._actions.length >= this._maxLength) {
      throw new Error("Cant't push action! Queue is full!");
    }
    return new Promise((resolve2, reject) => {
      const onEnd = () => {
        this._active = void 0;
        const index = this._actions.map(prop("action")).indexOf(actionCallback);
        if (index !== -1) {
          this._actions.splice(index, 1);
        }
        this.run();
      };
      const actionCallback = () => action().then(pipe(tap(onEnd), resolve2), pipe(tap(onEnd), reject));
      this._actions.push({ action: actionCallback, reject });
      if (this.length === 1) {
        this.run();
      }
    });
  }
  clear(error) {
    error = error || new Error("Rejection with clear queue!");
    const e = typeof error === "string" ? new Error(error) : error;
    this._actions.splice(0, this._actions.length).forEach((item) => item.reject(e));
    this._active = void 0;
  }
  canPush() {
    return this._actions.length < this._maxLength;
  }
  run() {
    const item = this._actions.shift();
    if (item == null) {
      return void 0;
    }
    this._active = item.action();
  }
}
const toArray = (data) => Array.isArray(data) ? data : [data];
function toFormat(num, id, hash) {
  const asset = id != null ? hash[id] : WAVES;
  if (asset == null) {
    throw new Error("Asset not found!");
  }
  return `${getPrintableNumber(num, asset.decimals)} ${asset.name}`;
}
var utilsModule = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  onContentLoad,
  loadScript,
  hasScript,
  runByPath,
  analytics,
  assetPropFactory,
  cleanAddress,
  fixRecipient,
  getEnvAwareUrl,
  getTxAliases,
  isAddress,
  isAlias,
  isSafari,
  isBrave,
  loadFeeByTransaction,
  loadLogoInfo,
  getPrintableNumber,
  getCoins,
  Queue,
  toArray,
  toFormat
});
const getAlias = (address) => {
  return isAlias(address) ? cleanAddress(address) : "";
};
const getIconType = (tx, user, userAliases) => {
  if (tx.type === 11)
    return "mass";
  const isSenderMe = tx.senderPublicKey == null || tx.senderPublicKey === user.publicKey;
  if (isAlias(tx.recipient)) {
    return isSenderMe ? userAliases.includes(getAlias(tx.recipient)) ? "circular" : "send" : "receive";
  } else {
    return isSenderMe ? tx.recipient === user.address ? "circular" : "send" : "receive";
  }
};
var iconTransferHelpers = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  getIconType
});
const Confirmation = (_a) => {
  var _b = _a, {
    address,
    canConfirm = true,
    name,
    balance,
    children,
    onReject,
    onConfirm
  } = _b, rest = __objRest(_b, [
    "address",
    "canConfirm",
    "name",
    "balance",
    "children",
    "onReject",
    "onConfirm"
  ]);
  return /* @__PURE__ */ React.createElement(Flex, __spreadValues({
    backgroundColor: "main.$800",
    width: "520px",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "$6",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.15)"
  }, rest), /* @__PURE__ */ React.createElement(Flex, {
    px: "$40",
    justifyContent: "space-between",
    alignItems: "center",
    height: "65px",
    borderBottom: "1px solid",
    borderBottomColor: "basic.$1000"
  }, /* @__PURE__ */ React.createElement(Box, {
    mr: "$10"
  }, /* @__PURE__ */ React.createElement(AddressLabel, {
    isShort: true,
    address,
    name,
    withCopy: true
  }, /* @__PURE__ */ React.createElement(AddressAvatar, {
    address,
    variantSize: "large"
  }))), /* @__PURE__ */ React.createElement(Flex, {
    flexDirection: "column",
    alignItems: "flex-end"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "footnote1",
    color: "basic.$500"
  }, "Balance"), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0"
  }, balance))), /* @__PURE__ */ React.createElement(Box, {
    maxHeight: "630px",
    overflowY: "auto"
  }, children), /* @__PURE__ */ React.createElement(Flex, {
    borderTop: "1px solid",
    borderTopColor: "main.$700",
    px: "$40",
    py: "$20"
  }, /* @__PURE__ */ React.createElement(Button, {
    flexGrow: 1,
    variant: "danger",
    variantSize: "medium",
    onClick: onReject
  }, "Reject"), /* @__PURE__ */ React.createElement(Button, {
    ml: "$20",
    flexGrow: 1,
    variant: "primary",
    variantSize: "medium",
    disabled: !canConfirm,
    onClick: onConfirm
  }, "Confirm")));
};
const DataEntry = ({ data }) => /* @__PURE__ */ React.createElement(Box, {
  mb: "$20",
  px: "15px",
  bg: "basic.$900",
  borderRadius: "$4"
}, /* @__PURE__ */ React.createElement(Flex, {
  py: "13px",
  borderBottom: "1px solid",
  borderColor: "main.$500"
}, /* @__PURE__ */ React.createElement(Box, {
  width: "35%"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500"
}, "Key test")), /* @__PURE__ */ React.createElement(Box, {
  width: "50%"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500"
}, "Value")), /* @__PURE__ */ React.createElement(Box, {
  width: "15%"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500"
}, "Type"))), /* @__PURE__ */ React.createElement(Box, {
  maxHeight: "165px",
  overflow: "hidden",
  overflowY: "auto",
  mr: "5px"
}, data.map((item, i) => /* @__PURE__ */ React.createElement(Flex, {
  key: item.key,
  borderTop: i === 0 ? 0 : "1px dashed",
  borderColor: "main.$500",
  py: "13px"
}, /* @__PURE__ */ React.createElement(Box, {
  width: "35%"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0",
  isTruncated: true,
  display: "inline-block",
  maxWidth: "100%",
  pr: "$20",
  verticalAlign: "middle"
}, item.key)), /* @__PURE__ */ React.createElement(Box, {
  width: "50%"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0",
  isTruncated: true,
  display: "inline-block",
  maxWidth: "100%",
  pr: "$20",
  verticalAlign: "middle"
}, String(item.value || ""))), /* @__PURE__ */ React.createElement(Box, {
  width: "15%"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0"
}, item["type"] || ""))))));
const DataJson = ({ data }) => /* @__PURE__ */ React.createElement(Box, {
  borderRadius: "$4",
  bg: "basic.$900",
  p: "15px",
  maxHeight: "165px",
  overflowY: "auto",
  color: "standard.$0"
}, /* @__PURE__ */ React.createElement(Text, {
  as: "pre",
  m: "0",
  variant: "body2",
  fontFamily: "Menlo, Monaco, Consolas, Courier New, monospace"
}, typeof data === "string" ? data : JSON.stringify(data, null, 2)));
const checkIsEnoughBalance = (balance, fee) => {
  return BigNumber.toBigNumber(balance).gte(BigNumber.toBigNumber(fee).div(Math.pow(10, WAVES.decimals)));
};
const hasParamsFee = (fee) => typeof fee === "string" || typeof fee === "number";
const isWaves = (feeId) => feeId === "WAVES";
const isFeeAssetId = (feeAssetId) => typeof feeAssetId !== "undefined";
const isNonDefaultFeeAssetId = (feeAssetId) => typeof feeAssetId === "string";
const formatFee = (fee, decimals) => getPrintableNumber(fee, decimals);
const getFeeOptions = ({
  txFee,
  txMeta,
  paramsFeeAssetId,
  availableWavesBalance,
  paramsFee: txParamsFee
}) => {
  const getAssetProp = assetPropFactory(txMeta.assets);
  const wavesFeeOption = {
    id: null,
    name: WAVES.name,
    ticker: WAVES.ticker,
    value: formatFee(txFee, WAVES.decimals)
  };
  let defaultFeeOption;
  let feeAsset;
  if (!isWaves(paramsFeeAssetId) && (isFeeAssetId(paramsFeeAssetId) || hasParamsFee(txParamsFee))) {
    if (isNonDefaultFeeAssetId(paramsFeeAssetId)) {
      feeAsset = txMeta.assets[paramsFeeAssetId];
      defaultFeeOption = {
        name: getAssetProp(paramsFeeAssetId, "name"),
        id: paramsFeeAssetId,
        ticker: "",
        value: formatFee(txFee, feeAsset.decimals)
      };
    } else {
      defaultFeeOption = wavesFeeOption;
    }
    return [defaultFeeOption];
  }
  defaultFeeOption = wavesFeeOption;
  const metaFeeOptions = txMeta.feeList.map((f) => ({
    name: getAssetProp(f.feeAssetId, "name"),
    id: String(f.feeAssetId),
    ticker: "",
    value: formatFee(f.feeAmount, getAssetProp(f.feeAssetId, "decimals"))
  }));
  const isEnoughBalance = checkIsEnoughBalance(availableWavesBalance, txFee);
  const hasNonDefaultFees = metaFeeOptions.length > 0;
  let feeOptions;
  if (hasNonDefaultFees) {
    feeOptions = isEnoughBalance ? [defaultFeeOption].concat(metaFeeOptions) : metaFeeOptions.filter(({ id }) => id !== WAVES.assetId);
  } else {
    feeOptions = [defaultFeeOption];
  }
  return feeOptions;
};
const FeeSelect = (_c) => {
  var _d = _c, {
    txMeta,
    fee: txFee,
    onFeeSelect,
    availableWavesBalance,
    as: _as
  } = _d, rest = __objRest(_d, [
    "txMeta",
    "fee",
    "onFeeSelect",
    "availableWavesBalance",
    "as"
  ]);
  const txFeeAssetId = txMeta.params.feeAssetId;
  const getAssetProp = assetPropFactory(txMeta.assets);
  const [feeOptions, setFeeOptions] = useState(getFeeOptions({
    txFee,
    paramsFee: txMeta.params.fee,
    txMeta,
    paramsFeeAssetId: txFeeAssetId,
    availableWavesBalance
  }));
  useCallback(() => {
    setFeeOptions(getFeeOptions({
      txFee,
      paramsFee: txMeta.params.fee,
      txMeta,
      paramsFeeAssetId: txFeeAssetId,
      availableWavesBalance
    }));
  }, [availableWavesBalance, txFee, txFeeAssetId, txMeta]);
  const [selectedFeeOption, setSelectedFeeOption] = useState(feeOptions[0]);
  useEffect(() => {
    setSelectedFeeOption(feeOptions[0]);
  }, [feeOptions]);
  useEffect(() => {
    if (selectedFeeOption) {
      const feeAssetId = selectedFeeOption.id;
      const fee = getCoins(selectedFeeOption.value, getAssetProp(selectedFeeOption.id, "decimals"));
      onFeeSelect(fee, feeAssetId);
    }
  }, [selectedFeeOption]);
  const handleFeeSelect = useCallback((feeOption) => {
    setSelectedFeeOption(feeOption);
  }, [getAssetProp, onFeeSelect]);
  return /* @__PURE__ */ React.createElement(Box, __spreadValues({}, rest), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    display: "block",
    mb: "$5"
  }, "Fee"), feeOptions.length > 1 ? /* @__PURE__ */ React.createElement(Select, {
    placement: "top",
    renderSelected: (open) => /* @__PURE__ */ React.createElement(Selected, {
      selected: selectedFeeOption,
      opened: open
    })
  }, /* @__PURE__ */ React.createElement(List, {
    onSelect: handleFeeSelect,
    options: feeOptions
  })) : /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0"
  }, selectedFeeOption.value, " ", selectedFeeOption.name));
};
const Help = (_e) => {
  var _f = _e, {
    children,
    popperOptions
  } = _f, rest = __objRest(_f, [
    "children",
    "popperOptions"
  ]);
  return /* @__PURE__ */ React.createElement(Tooltip, __spreadValues({
    arrowSize: "4px",
    hasArrow: true,
    arrowColor: "#5A81EA",
    offset: 4,
    maxWidth: "360px",
    label: () => /* @__PURE__ */ React.createElement(Box, {
      borderTop: "4px solid",
      borderTopColor: "primary.$300",
      backgroundColor: "#4a5060",
      borderRadius: "$4",
      p: 15,
      color: "standard.$0",
      width: "max-content",
      maxWidth: "400px"
    }, children),
    placement: "bottom",
    popperOptions: __spreadProps(__spreadValues({}, popperOptions), {
      modifiers: [
        {
          name: "flip",
          enabled: false
        },
        ...popperOptions && popperOptions["modifiers"] || []
      ]
    })
  }, rest), /* @__PURE__ */ React.createElement(Flex, {
    size: "14px",
    backgroundColor: "basic.$500",
    borderRadius: "circle",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer"
  }, /* @__PURE__ */ React.createElement(Icon, {
    iconSize: "potty",
    icon: iconQuestion,
    color: "standard.$1000"
  })));
};
const IconTransfer = (_g) => {
  var _h = _g, { type } = _h, rest = __objRest(_h, ["type"]);
  switch (type) {
    case "mass":
      return /* @__PURE__ */ React.createElement(Icon, __spreadValues({
        icon: iconMassTransfer,
        color: "#FFAF00"
      }, rest));
    case "send":
      return /* @__PURE__ */ React.createElement(Icon, __spreadValues({
        icon: iconTransferArrow,
        color: "#FFAF00"
      }, rest));
    case "receive":
      return /* @__PURE__ */ React.createElement(Icon, __spreadValues({
        sx: { transform: "rotate(180deg)" },
        icon: iconTransferArrow,
        color: "#81C926"
      }, rest));
    case "circular":
      return /* @__PURE__ */ React.createElement(Icon, __spreadValues({
        icon: iconTransferCircle,
        color: "#EF4829"
      }, rest));
    default:
      return null;
  }
};
const COLOR_MAP = {
  integer: "#b5cea9",
  string: "#cf9178",
  binary: "#cf9178",
  boolean: "#579cd6"
};
const pseudoElemStyles = {
  color: "#d4d4d4",
  fontSize: "$13",
  lineHeight: "$18",
  fontFamily: "Menlo, Monaco, Consolas, Courier New, monospace",
  display: "inline"
};
const wrapperStylesStart = {
  ":before": __spreadProps(__spreadValues({}, pseudoElemStyles), {
    content: '"("'
  })
};
const wrapperStylesEnd = {
  ":after": __spreadProps(__spreadValues({}, pseudoElemStyles), {
    content: '")"'
  })
};
const getAttrStyles = (attrType, isLast) => ({
  variant: "body2",
  fontFamily: "Menlo, Monaco, Consolas, Courier New, monospace",
  color: COLOR_MAP[attrType],
  ":after": !isLast ? __spreadProps(__spreadValues({}, pseudoElemStyles), { content: '",\xA0"' }) : {}
});
const formatText = (text) => String(text).length >= 5 ? `${String(text).slice(0, 4)}...` : String(text);
const getAttrContent = (type, value) => {
  switch (type) {
    case "integer":
      return formatText(value);
    case "boolean":
      return String(value);
    case "string":
      return `'${formatText(value)}'`;
    case "binary":
      return "'base64:...'";
    default:
      return null;
  }
};
const InvokeFunction = (_i) => {
  var _j = _i, {
    args,
    name
  } = _j, rest = __objRest(_j, [
    "args",
    "name"
  ]);
  return /* @__PURE__ */ React.createElement(Flex, __spreadValues({
    sx: wrapperStylesEnd,
    fontSize: "$13",
    lineHeight: "$18"
  }, rest), /* @__PURE__ */ React.createElement(Text, {
    isTruncated: true
  }, /* @__PURE__ */ React.createElement(Text, {
    sx: pseudoElemStyles
  }, name), /* @__PURE__ */ React.createElement(Text, {
    sx: wrapperStylesStart
  }, args.map(({ type, value }, index) => /* @__PURE__ */ React.createElement(Text, {
    key: index,
    sx: getAttrStyles(type, index === args.length - 1)
  }, getAttrContent(type, value))))));
};
const InvokePayment = ({
  assetId,
  amount,
  name,
  logo,
  isLast
}) => /* @__PURE__ */ React.createElement(Flex, {
  alignItems: "center",
  color: "standard.$0",
  p: "$10",
  borderBottomWidth: isLast ? "0" : "1px",
  borderBottomColor: "main.$500",
  borderBottomStyle: "dashed"
}, /* @__PURE__ */ React.createElement(AssetLogo, {
  mr: "$10",
  logo,
  assetId,
  name,
  size: 26
}), /* @__PURE__ */ React.createElement(Text, {
  variant: "body2"
}, name), /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  flex: "2",
  textAlign: "right"
}, amount));
const TransactionDetails = ({ tx }) => /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Flex, {
  justifyContent: "space-between",
  py: "14px",
  borderBottom: "1px solid",
  borderTop: "1px solid",
  borderColor: "main.$700"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500"
}, "Type"), /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0"
}, tx.type)), /* @__PURE__ */ React.createElement(Flex, {
  justifyContent: "space-between",
  py: "14px",
  borderBottom: "1px solid",
  borderColor: "main.$700"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500"
}, "Version"), /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0"
}, tx.version)), /* @__PURE__ */ React.createElement(Flex, {
  justifyContent: "space-between",
  py: "14px",
  borderBottom: "1px solid",
  borderColor: "main.$700"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500"
}, "TX Id"), /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0"
}, tx.id)), /* @__PURE__ */ React.createElement(Flex, {
  justifyContent: "space-between",
  py: "14px",
  borderBottom: "1px solid",
  borderColor: "main.$700"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500"
}, "Timestamp"), /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0"
}, tx.timestamp)));
var Roboto = "data:font/woff2;base64,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";
var RobotoLight = "data:font/woff2;base64,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";
var RobotoMedium = "data:font/woff2;base64,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";
const GlobalCSS = () => {
  return /* @__PURE__ */ React.createElement(Global, {
    styles: [
      {
        "@font-face": {
          fontFamily: "Roboto",
          fontStyle: "normal",
          fontWeight: 300,
          fontDisplay: "swap",
          src: `url(${RobotoLight}) format("woff2")`
        }
      },
      {
        "@font-face": {
          fontFamily: "Roboto",
          fontStyle: "normal",
          fontWeight: 400,
          fontDisplay: "swap",
          src: `url(${Roboto}) format("woff2")`
        }
      },
      {
        "@font-face": {
          fontFamily: "Roboto",
          fontStyle: "normal",
          fontWeight: 700,
          fontDisplay: "swap",
          src: `url(${RobotoMedium}) format("woff2")`
        }
      },
      {
        "*": {
          boxSizing: "border-box"
        },
        html: {
          height: "100%"
        },
        body: {
          fontFamily: "Roboto, sans-serif",
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          WebkitOverflowScrolling: "touch"
        },
        "@supports (-webkit-touch-callout: none)": {
          body: {
            minHeight: "-webkit-fill-available"
          }
        },
        button: {
          fontFamily: "Roboto, sans-serif"
        },
        "#root": {
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "520px",
          minHeight: "100%",
          maxHeight: ["100vh", "initial"]
        },
        "#overlay": {
          position: "fixed",
          zIndex: -1,
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#000",
          opacity: 0.6
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#495060",
          borderRadius: "4px"
        },
        "::-webkit-scrollbar": {
          width: "3px",
          height: "3px"
        },
        "::-webkit-scrollbar-corner": {
          opacity: 0
        },
        "::-webkit-scrollbar-track-piece": {
          marginBottom: "5px",
          marginTop: "5px"
        },
        "::placeholder": {
          color: "#959dae"
        }
      }
    ]
  });
};
const iconTransferUtils = __spreadValues({}, iconTransferHelpers);
const getAmountAsset = (assetId, assets) => assetId === null || assetId === void 0 ? WAVES : assets[assetId];
const getAssetName = (assetId, assets) => {
  return assetId === null || assetId === "WAVES" || assetId === void 0 ? WAVES.name : assets[assetId].name;
};
const getFeeAsset = (txType, assets, txFeeAssetId) => {
  if (txFeeAssetId === "WAVES" || txFeeAssetId === null || typeof txFeeAssetId === "undefined") {
    return WAVES;
  }
  return assets[txFeeAssetId];
};
const getRecipientAddress = (recipient, aliases) => isAlias(recipient) ? aliases[recipient] : recipient;
const getRawTransfersList = (aliases, massTransfers) => {
  return massTransfers.map(({ amount, recipient }) => ({
    name: recipient,
    address: getRecipientAddress(recipient, aliases),
    amount
  }));
};
const getTotalTransferAmount = (rawTransferList, decimals) => {
  const sum = rawTransferList.reduce((sum2, { amount }) => {
    return BigNumber$1.toBigNumber(amount).add(sum2);
  }, BigNumber$1.toBigNumber(0));
  return getPrintableNumber(sum.toString(), decimals);
};
const getTransferList = (rawTransferList, decimals) => rawTransferList.map((item) => __spreadProps(__spreadValues({}, item), {
  amount: getPrintableNumber(item.amount, decimals)
}));
const getFeeAssetName = (txType, assets, feeAssetId) => {
  return txType === 11 || feeAssetId === "undefined" || feeAssetId === null ? WAVES.name : getAssetName(getFeeAsset(txType, assets, feeAssetId).assetId, assets);
};
const getPrintableTxFee = ({
  txType,
  txFee,
  assets,
  txFeeAssetId
}) => `${getPrintableNumber(txFee, getFeeAsset(txType, assets, txFeeAssetId).decimals)} ${getFeeAssetName(txType, assets, txFeeAssetId)}`;
const getTransferViewData = ({
  txRecipient,
  txAssetId,
  txFee,
  txFeeAssetId,
  txAmount,
  assets,
  aliases
}) => {
  const { name, decimals } = getAmountAsset(txAssetId, assets);
  return {
    totalTransferAmount: `${getPrintableNumber(txAmount, decimals)} ${name}`,
    transferList: [
      {
        name: txRecipient,
        address: getRecipientAddress(txRecipient, aliases),
        amount: getPrintableNumber(txAmount, decimals)
      }
    ],
    fee: getPrintableTxFee({
      txType: NAME_MAP.transfer,
      txFee,
      assets,
      txFeeAssetId
    })
  };
};
const getMassTransferViewData = ({
  txTransfers,
  txAssetId,
  txFee,
  assets,
  aliases
}) => {
  const { name, decimals } = getAmountAsset(txAssetId, assets);
  const rawTransferList = getRawTransfersList(aliases, txTransfers);
  return {
    totalTransferAmount: `${getTotalTransferAmount(rawTransferList, decimals)} ${name}`,
    transferList: getTransferList(rawTransferList, decimals),
    fee: getPrintableTxFee({
      txType: NAME_MAP.transfer,
      txFee,
      assets
    })
  };
};
const getViewData = (tx, { aliases, assets }) => {
  const transferViewData = tx.type === 4 ? getTransferViewData({
    aliases,
    assets,
    txAssetId: tx.assetId,
    txRecipient: tx.recipient,
    txAmount: tx.amount,
    txFee: tx.fee,
    txFeeAssetId: tx.feeAssetId
  }) : getMassTransferViewData({
    aliases,
    assets,
    txAssetId: tx.assetId,
    txTransfers: tx.transfers,
    txFee: tx.fee
  });
  let attachment = "";
  try {
    attachment = libs.crypto.bytesToString(libs.crypto.base58Decode((tx == null ? void 0 : tx.attachment) || ""));
  } catch (e) {
  }
  return __spreadProps(__spreadValues({}, transferViewData), {
    attachment
  });
};
const isTransferMeta = (meta) => meta.params.type === NAME_MAP.transfer;
var transferHelpers = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  getAmountAsset,
  getAssetName,
  getFeeAsset,
  getRecipientAddress,
  getRawTransfersList,
  getTotalTransferAmount,
  getTransferList,
  getFeeAssetName,
  getPrintableTxFee,
  getTransferViewData,
  getMassTransferViewData,
  getViewData,
  isTransferMeta
});
function batchPage(props) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    onClick: props.onCancel
  }), /* @__PURE__ */ React.createElement("div", {
    className: "logo"
  }), /* @__PURE__ */ React.createElement("div", null, "Confirm TX"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, "Sign from"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(AddressAvatar, {
    address: props.user.address
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, "Type"), /* @__PURE__ */ React.createElement("span", null, "Batch")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, "Transaction Count"), /* @__PURE__ */ React.createElement("span", null, props.list.length)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: props.onCancel
  }, "Cancel"), /* @__PURE__ */ React.createElement("button", {
    onClick: props.onConfirm
  }, "Ok")));
}
const SignAliasComponent = ({
  userAddress,
  userName,
  userBalance,
  userHasScript,
  tx,
  fee,
  onConfirm,
  onReject
}) => {
  const {
    boundaryRef: helpTooltipBoundaryRef,
    popperOptions: helpTooltipPopperOptions
  } = useBoundedTooltip({
    left: 60,
    right: 60
  });
  const { boundaryRef, popperOptions } = useBoundedTooltip({});
  return /* @__PURE__ */ React.createElement("div", {
    ref: helpTooltipBoundaryRef
  }, /* @__PURE__ */ React.createElement(Confirmation, {
    address: userAddress,
    name: userName,
    balance: userBalance,
    onReject,
    onConfirm
  }, /* @__PURE__ */ React.createElement(Flex, {
    px: "$40",
    py: "$20",
    bg: "main.$900"
  }, /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "circle",
    bg: "rgba(90, 174, 249, 0.1)",
    height: 60,
    width: 60
  }, /* @__PURE__ */ React.createElement(Icon, {
    icon: iconAliasTransaction,
    size: 40,
    color: "#00aef9"
  })), /* @__PURE__ */ React.createElement(Flex, {
    ml: "$20",
    flexDirection: "column",
    justifyContent: "center"
  }, /* @__PURE__ */ React.createElement(Text, {
    fontSize: 26,
    lineHeight: "32px",
    color: "standard.$0"
  }, "Sign Alias TX"))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
    borderBottom: "1px solid",
    borderColor: "main.$700",
    bg: "main.$900",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Main")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Details")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
    bg: "main.$800",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(TabPanel, {
    ref: boundaryRef
  }, /* @__PURE__ */ React.createElement(Flex, {
    mb: "$5"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mr: "$5"
  }, "Alias"), /* @__PURE__ */ React.createElement(Help, {
    showDelay: 1500,
    popperOptions: __spreadProps(__spreadValues({
      strategy: "fixed"
    }, helpTooltipPopperOptions), {
      modifiers: [
        {
          name: "flip",
          enabled: false
        },
        ...helpTooltipPopperOptions && helpTooltipPopperOptions["modifiers"] || []
      ]
    })
  }, /* @__PURE__ */ React.createElement(Box, {
    maxWidth: "400px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1",
    color: "standard.$0"
  }, "About Alias"), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    as: "p"
  }, "An Alias is a nickname for your address. You can use an Alias instead of an address to make transactions."), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    as: "p"
  }, "Your Alias must be between 4 and 30 characters long and must contain only lowercase Latin letters, digits and symbols (@, -, _) and dot.")))), /* @__PURE__ */ React.createElement(AddressLabel, {
    address: userAddress,
    alias: tx.alias,
    withCopy: true,
    mb: "$20"
  }, userHasScript ? /* @__PURE__ */ React.createElement(BoxWithIcon, {
    icon: iconSmartMini,
    iconLabel: "Smart Account",
    popperOptions
  }, /* @__PURE__ */ React.createElement(AddressAvatar, {
    address: userAddress,
    variantSize: "large"
  })) : /* @__PURE__ */ React.createElement(AddressAvatar, {
    address: userAddress,
    variantSize: "large"
  })), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mb: "$5",
    display: "block"
  }, "Fee"), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    display: "block"
  }, fee)), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(TransactionDetails, {
    tx
  })), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
    data: tx
  }))))));
};
const SignBurn = ({
  userAddress,
  userName,
  userBalance,
  tx,
  fee,
  onCancel,
  onConfirm,
  burnAmount,
  assetId,
  assetName,
  isSmartAsset
}) => {
  const { boundaryRef, popperOptions } = useBoundedTooltip({ left: 40 });
  return /* @__PURE__ */ React.createElement("div", {
    ref: boundaryRef
  }, /* @__PURE__ */ React.createElement(Confirmation, {
    address: userAddress,
    name: userName,
    balance: userBalance,
    onReject: onCancel,
    onConfirm
  }, /* @__PURE__ */ React.createElement(Flex, {
    px: "$40",
    py: "$20",
    bg: "main.$900"
  }, /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "circle",
    bg: "rgba(255, 175, 0, 0.1)",
    height: 60,
    width: 60,
    flexShrink: 0
  }, /* @__PURE__ */ React.createElement(Icon, {
    icon: iconBurnTransaction,
    size: 40,
    color: "#FFAF00"
  })), /* @__PURE__ */ React.createElement(Flex, {
    ml: "$20",
    flexDirection: "column",
    overflowX: "hidden"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1",
    color: "basic.$500"
  }, "Sign Burn TX"), /* @__PURE__ */ React.createElement(Text, {
    fontSize: 26,
    lineHeight: "32px",
    color: "standard.$0",
    isTruncated: true
  }, burnAmount))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
    borderBottom: "1px solid",
    borderColor: "main.$700",
    bg: "main.$900",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Main")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Details")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
    bg: "main.$800",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(Flex, {
    flexDirection: "column",
    bg: "main.$800"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500"
  }, "Asset ID"), /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    mt: "$5"
  }, /* @__PURE__ */ React.createElement(AssetLogoWithIcon, {
    icon: iconSmartMini,
    iconLabel: "Smart asset",
    iconVisible: isSmartAsset,
    assetId,
    name: assetName,
    size: 30,
    flexShrink: 0,
    popperOptions
  }), /* @__PURE__ */ React.createElement(Copy, {
    ml: "$10",
    inititialTooltipLabel: "Copy Asset ID",
    copiedTooltipLabel: "Copied!",
    text: assetId
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    isTruncated: true
  }, assetId))), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mt: "$20",
    display: "block"
  }, "Fee"), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    display: "block",
    mt: "$5"
  }, fee))), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(TransactionDetails, {
    tx
  })), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
    data: tx
  }))))));
};
const SignCancelLeaseComponent = ({
  userAddress,
  userBalance,
  userName,
  amount,
  tx,
  fee,
  onReject,
  onConfirm
}) => /* @__PURE__ */ React.createElement(Confirmation, {
  address: userAddress,
  name: userName,
  balance: userBalance,
  onReject,
  onConfirm
}, /* @__PURE__ */ React.createElement(Flex, {
  px: "$40",
  py: "$20",
  bg: "main.$900"
}, /* @__PURE__ */ React.createElement(Flex, {
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "circle",
  bg: "rgba(239, 72, 41, 0.1)",
  height: 60,
  width: 60
}, /* @__PURE__ */ React.createElement(Icon, {
  icon: iconCancelLeaseTransaction,
  size: 40,
  color: "#ef4829"
})), /* @__PURE__ */ React.createElement(Flex, {
  ml: "$20",
  flexDirection: "column"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1",
  color: "basic.$500"
}, "Sign Lease Cancel TX"), /* @__PURE__ */ React.createElement(Text, {
  fontSize: 26,
  lineHeight: "32px",
  color: "standard.$0"
}, amount))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
  borderBottom: "1px solid",
  borderColor: "main.$700",
  bg: "main.$900",
  mb: "$30",
  px: "$40"
}, /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "Main")), /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "Details")), /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
  bg: "main.$800",
  mb: "$30",
  px: "$40"
}, /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(Text, {
  mt: "$20",
  variant: "body2",
  color: "basic.$500"
}, "Lease ID"), /* @__PURE__ */ React.createElement(Copy, {
  inititialTooltipLabel: "Copy Lease ID",
  copiedTooltipLabel: "Copied!",
  text: tx.leaseId,
  mb: "$20"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0",
  display: "block"
}, tx.leaseId)), /* @__PURE__ */ React.createElement(Text, {
  mt: "$20",
  variant: "body2",
  color: "basic.$500"
}, "Fee"), /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0",
  display: "block"
}, fee)), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(TransactionDetails, {
  tx
})), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
  data: tx
})))));
const SignDataComponent = ({
  userAddress,
  userName,
  userBalance,
  tx,
  fee,
  onConfirm,
  onReject
}) => /* @__PURE__ */ React.createElement(Confirmation, {
  address: userAddress,
  name: userName,
  balance: userBalance,
  onReject,
  onConfirm
}, /* @__PURE__ */ React.createElement(Flex, {
  px: "$40",
  py: "$20",
  bg: "main.$900"
}, /* @__PURE__ */ React.createElement(Flex, {
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "circle",
  bg: "rgba(90, 129, 234, 0.1)",
  height: 60,
  width: 60
}, /* @__PURE__ */ React.createElement(Icon, {
  icon: iconDataTransaction,
  size: 40,
  color: "primary.$300"
})), /* @__PURE__ */ React.createElement(Flex, {
  ml: "$20",
  flexDirection: "column"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1",
  color: "basic.$500"
}, "On-chain"), /* @__PURE__ */ React.createElement(Text, {
  fontSize: 26,
  lineHeight: "32px",
  color: "standard.$0"
}, "Sign Data TX"))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
  borderBottom: "1px solid",
  borderColor: "main.$700",
  bg: "main.$900",
  mb: "$30",
  px: "$40"
}, /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "Main")), /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "Details")), /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
  bg: "main.$800",
  mb: "$30",
  px: "$40"
}, /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500",
  display: "block",
  mb: "$5"
}, "Data"), /* @__PURE__ */ React.createElement(DataEntry, {
  data: tx.data
}), /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500",
  mb: "$5",
  display: "block"
}, "Fee"), /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0",
  display: "block"
}, fee)), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(TransactionDetails, {
  tx
})), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
  data: tx
})))));
const SignInvoke = ({
  userAddress,
  userName,
  userBalance,
  dAppAddress,
  dAppName,
  meta,
  call,
  payment,
  tx,
  onCancel,
  onConfirm,
  handleFeeSelect,
  txJSON
}) => {
  var _a, _b;
  const { boundaryRef, popperOptions } = useBoundedTooltip({});
  return /* @__PURE__ */ React.createElement(Confirmation, {
    address: userAddress,
    name: userName,
    balance: `${getPrintableNumber(userBalance, WAVES.decimals)} Waves`,
    onReject: onCancel,
    onConfirm
  }, /* @__PURE__ */ React.createElement(Flex, {
    py: "$20",
    px: "$40",
    bg: "main.$900"
  }, /* @__PURE__ */ React.createElement(Flex, {
    borderRadius: "circle",
    width: "60px",
    height: "60px",
    bg: "rgba(255, 175, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    mr: "$20"
  }, /* @__PURE__ */ React.createElement(Icon, {
    size: "40px",
    icon: iconInvoke,
    color: "#FFAF00"
  })), payment && /* @__PURE__ */ React.createElement(Flex, {
    justifyContent: "center",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1",
    color: "basic.$500",
    mb: "$3"
  }, "Sign Invoke Script TX"), /* @__PURE__ */ React.createElement(Heading, {
    variant: "heading2",
    color: "standard.$0"
  }, payment.length > 0 ? payment.length : "No", " ", "Payments"))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
    borderBottom: "1px solid",
    borderColor: "main.$700",
    bg: "main.$900",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Main")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Details")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
    bg: "main.$800",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(Box, {
    mb: "$20",
    ref: boundaryRef
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mb: "$3",
    as: "div"
  }, "dApp"), /* @__PURE__ */ React.createElement(AddressLabel, {
    address: dAppAddress,
    alias: dAppName,
    withCopy: true,
    mt: "$5"
  }, /* @__PURE__ */ React.createElement(BoxWithIcon, {
    icon: iconSmartMini,
    iconLabel: "Script account",
    popperOptions
  }, /* @__PURE__ */ React.createElement(AddressAvatar, {
    address: dAppAddress
  })))), payment && payment.length > 0 && /* @__PURE__ */ React.createElement(Box, {
    mb: "$20"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    as: "div",
    mb: "$5"
  }, "Payments"), /* @__PURE__ */ React.createElement(Box, {
    p: "$5",
    bg: "basic.$900",
    borderRadius: "$4"
  }, /* @__PURE__ */ React.createElement(Flex, {
    flexDirection: "column",
    borderRadius: "$4",
    bg: "basic.$900",
    px: "$5",
    maxHeight: "165px",
    overflowY: "auto"
  }, payment.map((pay, i) => /* @__PURE__ */ React.createElement(InvokePayment, __spreadProps(__spreadValues({
    key: pay.assetId || "WAVES"
  }, pay), {
    isLast: i === payment.length - 1
  })))))), /* @__PURE__ */ React.createElement(Box, {
    mb: "$20"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    as: "div",
    mb: "$5"
  }, "Call function"), /* @__PURE__ */ React.createElement(InvokeFunction, {
    borderRadius: "$4",
    bg: "basic.$900",
    p: "15px",
    color: "basic.$500",
    as: "div",
    overflowX: "auto",
    args: (_a = call == null ? void 0 : call.args) != null ? _a : [],
    name: (_b = call == null ? void 0 : call.function) != null ? _b : "default"
  })), /* @__PURE__ */ React.createElement(FeeSelect, {
    mt: "$20",
    txMeta: meta,
    fee: tx.fee,
    onFeeSelect: handleFeeSelect,
    availableWavesBalance: userBalance
  })), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(TransactionDetails, {
    tx
  })), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
    data: txJSON
  })))));
};
const SignIssueComponent = ({
  fee,
  assetId,
  assetName,
  assetDescription,
  assetType,
  assetScript,
  decimals,
  userAddress,
  userName,
  userBalance,
  issueAmount,
  onReject,
  onConfirm,
  onTermsCheck,
  canConfirm,
  tx
}) => {
  const {
    boundaryRef: helpTooltipBoundaryRef,
    popperOptions: helpTooltipPopperOptions
  } = useBoundedTooltip({
    left: 60,
    right: 60
  });
  const {
    boundaryRef: assetLogoWithIconTooltipBoundaryRef,
    popperOptions: assetLogoWithIconPopperOptions
  } = useBoundedTooltip({ left: 0 });
  return /* @__PURE__ */ React.createElement("div", {
    ref: helpTooltipBoundaryRef
  }, /* @__PURE__ */ React.createElement(Confirmation, {
    address: userAddress,
    name: userName,
    balance: userBalance,
    onReject,
    onConfirm,
    canConfirm
  }, /* @__PURE__ */ React.createElement(Flex, {
    px: "$40",
    py: "$20",
    bg: "main.$900"
  }, /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "circle",
    bg: "rgba(38, 193, 201, 0.1)",
    height: 60,
    width: 60,
    flexShrink: 0
  }, /* @__PURE__ */ React.createElement(Icon, {
    icon: iconIssueTransaction,
    size: 40,
    color: "#26c1c9"
  })), /* @__PURE__ */ React.createElement(Flex, {
    ml: "$20",
    flexDirection: "column",
    overflowX: "hidden"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1",
    color: "basic.$500"
  }, "Sign Issue TX"), /* @__PURE__ */ React.createElement(Text, {
    fontSize: 26,
    lineHeight: "32px",
    color: "standard.$0",
    isTruncated: true
  }, issueAmount))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
    borderBottom: "1px solid",
    borderColor: "main.$700",
    bg: "main.$900",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Main")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Details")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
    bg: "main.$800",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(Flex, {
    flexDirection: "column",
    bg: "main.$800",
    ref: assetLogoWithIconTooltipBoundaryRef
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500"
  }, "Asset ID"), /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    mt: "$5"
  }, /* @__PURE__ */ React.createElement(AssetLogoWithIcon, {
    assetId,
    name: assetName,
    size: "30px",
    flexShrink: 0,
    icon: iconSmartMini,
    iconVisible: Boolean(assetScript),
    iconLabel: "Smart asset",
    popperOptions: assetLogoWithIconPopperOptions
  }), /* @__PURE__ */ React.createElement(Copy, {
    ml: "$10",
    inititialTooltipLabel: "Copy Asset ID",
    copiedTooltipLabel: "Copied!",
    text: assetId
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    isTruncated: true
  }, assetId))), assetDescription ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Text, {
    mt: "$20",
    variant: "body2",
    color: "basic.$500"
  }, "Asset Description"), /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    mt: "$5",
    p: "15px",
    variant: "body2",
    color: "standard.$0",
    bg: "basic.$900",
    borderRadius: "$4",
    maxHeight: "85px",
    overflowY: "auto"
  }, assetDescription)) : null, /* @__PURE__ */ React.createElement(Flex, {
    mt: 25
  }, /* @__PURE__ */ React.createElement(Flex, {
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Text, {
    mt: "$25",
    mr: "3px",
    variant: "body2",
    color: "basic.$500"
  }, "Asset Type"), /* @__PURE__ */ React.createElement(Help, {
    popperOptions: helpTooltipPopperOptions
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1",
    fontWeight: 700,
    display: "block"
  }, "This field defines the total tokens supply that your asset will contain."), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    display: "block",
    mt: "5px"
  }, "Reissuability allows for additional tokens creation that will be added to the total token supply of asset."), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    display: "block",
    mt: "5px"
  }, "A non-reissuable asset will be permanently limited to the total token supply defined during this steps."))), /* @__PURE__ */ React.createElement(Text, {
    mt: "5px",
    variant: "body2",
    color: "standard.$0"
  }, assetType)), /* @__PURE__ */ React.createElement(Flex, {
    ml: 30,
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Text, {
    mt: "$25",
    mr: "3px",
    variant: "body2",
    color: "basic.$500"
  }, "Decimals"), /* @__PURE__ */ React.createElement(Help, {
    popperOptions: helpTooltipPopperOptions
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1",
    fontWeight: 700
  }, "This field defines the number of decimals your asset token will be divided in."))), /* @__PURE__ */ React.createElement(Text, {
    mt: "5px",
    variant: "body2",
    color: "standard.$0"
  }, decimals))), assetScript ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    mr: "3px",
    mt: 25
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mr: "3px"
  }, "Smart Asset Script"), /* @__PURE__ */ React.createElement(Help, {
    showDelay: 1500,
    popperOptions: helpTooltipPopperOptions
  }, /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    variant: "body1",
    fontWeight: 700
  }, "A Smart Asset is an asset with an attached script that places conditions on every transaction made for the token in question."), /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    variant: "body2",
    mt: "5px"
  }, "Each validation of a transaction by a Smart Asset's script increases the transaction fee by 0.004 WAVES. For example, if a regular tx is made for a Smart Asset, the cost is 0.001 + 0.004 = 0.005 WAVES. If an exchange transaction is made, the cost is 0.003 + 0.004 = 0.007 WAVES.", /* @__PURE__ */ React.createElement(ExternalLink, {
    mt: "$5",
    variant: "body2",
    display: "block",
    href: "https://docs.wavesplatform.com/en/building-apps/smart-contracts/smart-assets",
    target: "_blank"
  }, "Learn more")))), /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    mt: "$5",
    p: "15px",
    variant: "body2",
    color: "standard.$0",
    bg: "basic.$900",
    borderRadius: "$4",
    maxHeight: "185px",
    overflowY: "auto"
  }, assetScript)) : null, /* @__PURE__ */ React.createElement(Box, {
    p: 15,
    border: "1px dashed",
    borderColor: "main.$500",
    backgroundColor: "main.$800",
    mt: 20
  }, /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    variant: "body1",
    color: "standard.$0"
  }, "You agree that:"), /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    mt: "5px",
    variant: "body2",
    color: "basic.$300"
  }, "I) You will not use the token for fraudulent purposes;"), /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    variant: "body2",
    color: "basic.$300"
  }, "II) You will not duplicate, fully or in part, the name of an existing cryptocurrency or a well-known company with the aim of misleading users;"), /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    variant: "body2",
    color: "basic.$300"
  }, "III) You will not use names of states, other administrative units or municipal insitutions for the token's name with the aim of misleading users;"), /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    variant: "body2",
    color: "basic.$300"
  }, "IV) You will not set a script on a smart asset that limits exchange transactions on Waves.Exchange by asset quantity;"), /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    variant: "body2",
    color: "basic.$300"
  }, "V) You will not give false information in a smart asset's description concerning the rules governing the token's use, which do not correspond to those of the script installed on it;")), /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "flex-start",
    mt: 20
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    id: "terms",
    onChange: onTermsCheck
  }), /* @__PURE__ */ React.createElement(Label, {
    htmlFor: "terms",
    pl: "10px",
    color: "basic.$500",
    textAlign: "justify",
    fontSize: "13px",
    lineHeight: "18px"
  }, 'I understand that in the case of non-compliance with the rules, my token will be categorised as "Suspicious", and will be available for search only by ID')), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mt: "$20",
    display: "block"
  }, "Fee"), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    display: "block",
    mt: "$5"
  }, fee))), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(TransactionDetails, {
    tx
  })), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
    data: tx
  }))))));
};
const SignLeaseComponent = ({
  recipientAddress,
  recipientName,
  userAddress,
  userBalance,
  userName,
  tx,
  amount,
  fee,
  onReject,
  onConfirm
}) => /* @__PURE__ */ React.createElement(Confirmation, {
  address: userAddress,
  name: userName,
  balance: userBalance,
  onReject,
  onConfirm
}, /* @__PURE__ */ React.createElement(Flex, {
  px: "$40",
  py: "$20",
  bg: "main.$900"
}, /* @__PURE__ */ React.createElement(Flex, {
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "circle",
  bg: "rgba(129, 201, 38, 0.1)",
  height: 60,
  width: 60
}, /* @__PURE__ */ React.createElement(Icon, {
  icon: iconLeaseTransaction,
  size: 40,
  color: "#81C926"
})), /* @__PURE__ */ React.createElement(Flex, {
  ml: "$20",
  flexDirection: "column"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1",
  color: "basic.$500"
}, "Sign Lease TX"), /* @__PURE__ */ React.createElement(Text, {
  fontSize: 26,
  lineHeight: "32px",
  color: "standard.$0"
}, amount))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
  borderBottom: "1px solid",
  borderColor: "main.$700",
  bg: "main.$900",
  mb: "$30",
  px: "$40"
}, /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "Main")), /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "Details")), /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
  bg: "main.$800",
  mb: "$30",
  px: "$40"
}, /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(Flex, {
  flexDirection: "column"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500"
}, "Recipient"), /* @__PURE__ */ React.createElement(AddressLabel, {
  address: recipientAddress,
  alias: recipientName,
  withCopy: true,
  mt: "$5"
}, /* @__PURE__ */ React.createElement(AddressAvatar, {
  address: recipientAddress
})), /* @__PURE__ */ React.createElement(Text, {
  mt: "$20",
  variant: "body2",
  color: "basic.$500"
}, "Fee"), /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0",
  display: "block"
}, fee))), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(TransactionDetails, {
  tx
})), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
  data: tx
})))));
const SignMessageComponent = ({
  userAddress,
  userName,
  userBalance,
  data,
  onReject,
  onConfirm
}) => /* @__PURE__ */ React.createElement(Confirmation, {
  address: userAddress,
  name: userName,
  balance: userBalance,
  onReject,
  onConfirm
}, /* @__PURE__ */ React.createElement(Flex, {
  px: "$40",
  py: "$20",
  bg: "main.$900"
}, /* @__PURE__ */ React.createElement(Flex, {
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "circle",
  bg: "rgba(255, 175, 0, 0.1)",
  height: 60,
  width: 60
}, /* @__PURE__ */ React.createElement(Icon, {
  size: "60px",
  icon: iconSignMessage,
  color: "primary.$300"
})), /* @__PURE__ */ React.createElement(Flex, {
  ml: "$20",
  flexDirection: "column"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1",
  color: "basic.$500"
}, "Off-chain"), /* @__PURE__ */ React.createElement(Text, {
  fontSize: 26,
  lineHeight: "32px",
  color: "standard.$0"
}, "Sign Message"))), /* @__PURE__ */ React.createElement(Flex, {
  px: "$40",
  py: "$30",
  flexDirection: "column",
  bg: "main.$800",
  borderTop: "1px solid",
  borderTopColor: "basic.$1000"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500",
  mb: "$5"
}, "Message"), /* @__PURE__ */ React.createElement(Flex, {
  bg: "basic.$900",
  borderRadius: "$4",
  py: "15px",
  pl: "15px",
  pr: "5px",
  flexDirection: "column",
  alignItems: "flex-end"
}, /* @__PURE__ */ React.createElement(Box, {
  width: "100%",
  maxHeight: "147px",
  overflow: "hidden",
  overflowY: "auto",
  pr: "10px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0"
}, data)), /* @__PURE__ */ React.createElement(LightCopy, {
  text: data,
  mr: "15px",
  fontSize: 13,
  color: "primary.$300",
  lineHeight: "18px",
  cursor: "pointer"
}, "Copy"))));
const SignReissueComponent = ({
  userAddress,
  userName,
  userBalance,
  tx,
  reissueAmount,
  reissueAsset,
  fee,
  onConfirm,
  onReject
}) => {
  const {
    boundaryRef: assetLogoWithIconTooltipBoundaryRef,
    popperOptions: assetLogoWithIconPopperOptions
  } = useBoundedTooltip({ left: 0 });
  return /* @__PURE__ */ React.createElement(Confirmation, {
    address: userAddress,
    name: userName,
    balance: userBalance,
    onReject,
    onConfirm
  }, /* @__PURE__ */ React.createElement(Flex, {
    px: "$40",
    py: "$20",
    bg: "main.$900"
  }, /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "circle",
    bg: "rgba(129, 201, 38, 0.1)",
    height: 60,
    width: 60
  }, /* @__PURE__ */ React.createElement(Icon, {
    icon: iconReissueTransaction,
    size: 40,
    color: "#81c926"
  })), /* @__PURE__ */ React.createElement(Flex, {
    ml: "$20",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1",
    color: "basic.$500"
  }, "Sign Reissue TX"), /* @__PURE__ */ React.createElement(Text, {
    fontSize: 26,
    lineHeight: "32px",
    color: "standard.$0"
  }, reissueAmount))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
    borderBottom: "1px solid",
    borderColor: "main.$700",
    bg: "main.$900",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Main")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Details")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
    bg: "main.$800",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(Box, {
    mb: "$20",
    ref: assetLogoWithIconTooltipBoundaryRef
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mb: "$5",
    display: "block"
  }, "Asset ID"), /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(AssetLogoWithIcon, {
    assetId: reissueAsset.assetId,
    name: reissueAsset.name,
    size: "30px",
    flexShrink: 0,
    icon: iconSmartMini,
    iconVisible: reissueAsset.scripted,
    iconLabel: "Smart asset",
    popperOptions: assetLogoWithIconPopperOptions
  }), /* @__PURE__ */ React.createElement(Copy, {
    text: reissueAsset.assetId,
    inititialTooltipLabel: "Copy",
    copiedTooltipLabel: "Copied!",
    ml: "$10"
  }, /* @__PURE__ */ React.createElement(Text, {
    color: "standard.$0",
    variant: "body2"
  }, reissueAsset.assetId)))), /* @__PURE__ */ React.createElement(Flex, {
    mb: "$5"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mr: "$5"
  }, "Asset Type"), /* @__PURE__ */ React.createElement(Help$1, {
    align: "left",
    direction: "bottom"
  }, /* @__PURE__ */ React.createElement(Box, {
    maxWidth: "400px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1",
    color: "standard.$0"
  }, "This field defines the total tokens supply that your asset will contain."), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    as: "p"
  }, "Reissuability allows for additional tokens creation that will be added to the total token supply of asset."), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    as: "p"
  }, "A non-reissuable asset will be permanently limited to the total token supply defined during these steps.")))), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    mb: "$20",
    display: "block"
  }, tx.reissuable ? "Reissuable" : "Non-reissuable"), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mb: "$5",
    display: "block"
  }, "Fee"), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    display: "block"
  }, fee)), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(TransactionDetails, {
    tx
  })), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
    data: tx
  })))));
};
const SignSetAccountScriptComponent = ({
  userAddress,
  userName,
  userBalance,
  userHasScript,
  tx,
  fee,
  accountScript,
  onCancel,
  onConfirm
}) => {
  const {
    boundaryRef: helpTooltipBoundaryRef,
    popperOptions: helpTooltipPopperOptions
  } = useBoundedTooltip({
    left: 60,
    right: 60
  });
  const { boundaryRef, popperOptions } = useBoundedTooltip({});
  return /* @__PURE__ */ React.createElement("div", {
    ref: helpTooltipBoundaryRef
  }, /* @__PURE__ */ React.createElement(Confirmation, {
    address: userAddress,
    name: userName,
    balance: userBalance,
    onReject: onCancel,
    onConfirm
  }, /* @__PURE__ */ React.createElement(Flex, {
    px: "$40",
    py: "$20",
    bg: "main.$900",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "circle",
    bg: "rgba(129, 201, 38, 0.1)",
    height: 60,
    width: 60,
    flexShrink: 0
  }, /* @__PURE__ */ React.createElement(Icon, {
    icon: iconSetAssetScript,
    size: 40,
    color: "#81C926"
  })), /* @__PURE__ */ React.createElement(Flex, {
    ml: "$20",
    flexDirection: "column",
    overflowX: "hidden"
  }, /* @__PURE__ */ React.createElement(Text, {
    fontSize: 26,
    lineHeight: "32px",
    color: "standard.$0"
  }, "Sign Set Account Script TX"))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
    borderBottom: "1px solid",
    borderColor: "main.$700",
    bg: "main.$900",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Main")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Details")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
    bg: "main.$800",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(Flex, {
    flexDirection: "column",
    bg: "main.$800"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500"
  }, "Account"), /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    mt: "$5",
    ref: boundaryRef
  }, /* @__PURE__ */ React.createElement(AddressLabel, {
    address: userAddress,
    withCopy: true
  }, userHasScript ? /* @__PURE__ */ React.createElement(BoxWithIcon, {
    icon: iconSmartMini,
    iconLabel: "Smart Account",
    popperOptions
  }, /* @__PURE__ */ React.createElement(AddressAvatar, {
    address: userAddress,
    variantSize: "large"
  })) : /* @__PURE__ */ React.createElement(AddressAvatar, {
    address: userAddress,
    variantSize: "large"
  }))), /* @__PURE__ */ React.createElement(Flex, {
    mt: "$20",
    mb: "$5",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mr: "3px"
  }, "Smart Account Script"), /* @__PURE__ */ React.createElement(Help, {
    showDelay: 1500,
    popperOptions: __spreadProps(__spreadValues({
      strategy: "fixed"
    }, helpTooltipPopperOptions), {
      modifiers: [
        {
          name: "flip",
          enabled: false
        },
        ...helpTooltipPopperOptions && helpTooltipPopperOptions["modifiers"] || []
      ]
    })
  }, /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    variant: "body1",
    fontWeight: 700
  }, "A smart account is an account that has an account script attached to it."), /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    variant: "body2",
    mt: "5px"
  }, "If the transaction is sent from a smart account, the transaction fee is increased by 0.004 WAVES. So if the transaction fee is 0.001 WAVES, the owner of the smart account will pay 0.001 + 0.004 = 0.005 WAVES", /* @__PURE__ */ React.createElement(ExternalLink, {
    mt: "$5",
    variant: "body2",
    display: "block",
    href: "https://docs.wavesplatform.com/en/building-apps/smart-contracts/what-is-smart-account#expression"
  }, "Learn more")))), /* @__PURE__ */ React.createElement(Flex, {
    bg: "basic.$900",
    borderRadius: "$4",
    py: "15px",
    pl: "15px",
    pr: "5px",
    flexDirection: "column",
    alignItems: "flex-end"
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "100%",
    maxHeight: "165px",
    overflow: "auto",
    pr: "10px"
  }, /* @__PURE__ */ React.createElement(Text, {
    as: "pre",
    variant: "body2",
    color: "standard.$0",
    m: 0
  }, accountScript)), /* @__PURE__ */ React.createElement(LightCopy, {
    text: accountScript || "",
    mr: "15px",
    fontSize: 13,
    color: "primary.$300",
    lineHeight: "18px",
    cursor: "pointer"
  }, "Copy")), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mt: "$20",
    display: "block"
  }, "Fee"), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    display: "block",
    mt: "$5"
  }, fee))), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(TransactionDetails, {
    tx
  })), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
    data: tx
  }))))));
};
const SignSetAssetScript = ({
  userAddress,
  userName,
  userBalance,
  tx,
  fee,
  onCancel,
  onConfirm,
  assetId,
  assetName,
  assetScript
}) => {
  const {
    boundaryRef: helpTooltipBoundaryRef,
    popperOptions: helpTooltipPopperOptions
  } = useBoundedTooltip({
    left: 60,
    right: 60
  });
  const {
    boundaryRef: smartAssetLogoTooltipBoundaryRef,
    popperOptions: smartAssetLogoPopperOptions
  } = useBoundedTooltip({ left: 0 });
  return /* @__PURE__ */ React.createElement("div", {
    ref: helpTooltipBoundaryRef
  }, /* @__PURE__ */ React.createElement(Confirmation, {
    address: userAddress,
    name: userName,
    balance: userBalance,
    onReject: onCancel,
    onConfirm
  }, /* @__PURE__ */ React.createElement(Flex, {
    px: "$40",
    py: "$20",
    bg: "main.$900",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "circle",
    bg: "rgba(129, 201, 38, 0.1)",
    height: 60,
    width: 60,
    flexShrink: 0
  }, /* @__PURE__ */ React.createElement(Icon, {
    icon: iconSetAssetScript,
    size: 40,
    color: "#81C926"
  })), /* @__PURE__ */ React.createElement(Flex, {
    ml: "$20",
    flexDirection: "column",
    overflowX: "hidden"
  }, /* @__PURE__ */ React.createElement(Text, {
    fontSize: 26,
    lineHeight: "32px",
    color: "standard.$0"
  }, "Sign Set Asset Script TX"))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
    borderBottom: "1px solid",
    borderColor: "main.$700",
    bg: "main.$900",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Main")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Details")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
    bg: "main.$800",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(Flex, {
    flexDirection: "column",
    bg: "main.$800",
    ref: smartAssetLogoTooltipBoundaryRef
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500"
  }, "Asset ID"), /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    mt: "$5"
  }, /* @__PURE__ */ React.createElement(AssetLogoWithIcon, {
    icon: iconSmartMini,
    iconLabel: "Smart asset",
    iconVisible: Boolean(assetScript),
    assetId,
    name: assetName,
    size: "30px",
    flexShrink: 0,
    popperOptions: __spreadValues({
      strategy: "fixed"
    }, smartAssetLogoPopperOptions)
  }), /* @__PURE__ */ React.createElement(Copy, {
    ml: "$10",
    inititialTooltipLabel: "Copy Asset ID",
    copiedTooltipLabel: "Copied!",
    text: assetId
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    isTruncated: true
  }, assetId))), /* @__PURE__ */ React.createElement(Flex, {
    mt: "$20",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mr: "3px"
  }, "Smart Asset Script"), /* @__PURE__ */ React.createElement(Help, {
    showDelay: 1500,
    popperOptions: __spreadProps(__spreadValues({
      strategy: "fixed"
    }, helpTooltipPopperOptions), {
      modifiers: [
        {
          name: "flip",
          enabled: false
        },
        ...helpTooltipPopperOptions && helpTooltipPopperOptions["modifiers"] || []
      ]
    })
  }, /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    variant: "body1",
    fontWeight: 700
  }, "A Smart Asset is an asset with an attached script that places conditions on every transaction made for the token in question."), /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    variant: "body2",
    mt: "5px"
  }, "Each validation of a transaction by a Smart Asset's script increases the transaction fee by 0.004 WAVES. For example, if a regular tx is made for a Smart Asset, the cost is 0.001 + 0.004 = 0.005 WAVES. If an exchange transaction is made, the cost is 0.003 + 0.004 = 0.007 WAVES.", /* @__PURE__ */ React.createElement(ExternalLink, {
    mt: "$5",
    variant: "body2",
    display: "block",
    href: "https://docs.wavesplatform.com/en/building-apps/smart-contracts/smart-assets"
  }, "Learn more")))), /* @__PURE__ */ React.createElement(Text, {
    display: "block",
    mt: "$5",
    p: "15px",
    variant: "body2",
    color: "standard.$0",
    bg: "basic.$900",
    borderRadius: "$4",
    maxHeight: "185px",
    overflowY: "auto"
  }, assetScript), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mt: "$20",
    display: "block"
  }, "Fee"), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    display: "block",
    mt: "$5"
  }, fee))), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(TransactionDetails, {
    tx
  })), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
    data: tx
  }))))));
};
const SignSponsorshipComponent = ({
  userAddress,
  userBalance,
  userName,
  tx,
  fee,
  sponsorAsset,
  sponsorCharge,
  isSponsorshipEnable,
  onReject,
  onConfirm
}) => {
  const { boundaryRef, popperOptions } = useBoundedTooltip({ left: 40 });
  return /* @__PURE__ */ React.createElement("div", {
    ref: boundaryRef
  }, /* @__PURE__ */ React.createElement(Confirmation, {
    address: userAddress,
    name: userName,
    balance: `${getPrintableNumber(userBalance, WAVES.decimals)} Waves`,
    onReject,
    onConfirm
  }, /* @__PURE__ */ React.createElement(Flex, {
    px: "$40",
    py: "$20",
    bg: "main.$900"
  }, isSponsorshipEnable ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "circle",
    bg: "rgba(129, 201, 38, 0.1)",
    height: 60,
    width: 60
  }, /* @__PURE__ */ React.createElement(Icon, {
    icon: iconSponsorshipEnableTransaction,
    size: 40,
    color: "#81c926"
  })), /* @__PURE__ */ React.createElement(Flex, {
    ml: "$20",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Text, {
    fontSize: "26px",
    lineHeight: "32px",
    color: "standard.$0"
  }, "Sign Enable Sponsorship TX"))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "circle",
    bg: "rgba(248, 183, 0, 0.1)",
    height: 60,
    width: 60
  }, /* @__PURE__ */ React.createElement(Icon, {
    icon: iconSponsorshipDisableTransaction,
    size: 40,
    color: "warning.$500"
  })), /* @__PURE__ */ React.createElement(Flex, {
    ml: "$20",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Text, {
    fontSize: "26px",
    lineHeight: "32px",
    color: "standard.$0"
  }, "Sign Disable Sponsorship TX")))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
    borderBottom: "1px solid",
    borderColor: "main.$700",
    bg: "main.$900",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Main")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "Details")), /* @__PURE__ */ React.createElement(Tab, {
    mr: "32px",
    pb: "12px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body1"
  }, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
    bg: "main.$800",
    mb: "$30",
    px: "$40"
  }, /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(Flex, {
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mb: "$5"
  }, "Asset Id"), /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center",
    mb: "$20"
  }, /* @__PURE__ */ React.createElement(AssetLogoWithIcon, {
    assetId: sponsorAsset.assetId,
    name: sponsorAsset.name,
    icon: iconSponsorshipMini,
    iconLabel: "Sponsorship",
    iconVisible: Number(sponsorAsset.minSponsoredAssetFee) > 0,
    logo: "logo" in sponsorAsset ? sponsorAsset.logo : void 0,
    size: "30px",
    flexShrink: 0,
    popperOptions
  }), /* @__PURE__ */ React.createElement(Copy, {
    text: sponsorAsset.assetId,
    inititialTooltipLabel: "Copy",
    copiedTooltipLabel: "Copied!",
    ml: "$10"
  }, /* @__PURE__ */ React.createElement(Text, {
    color: "standard.$0",
    variant: "body2"
  }, sponsorAsset.assetId))), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mb: "$5"
  }, "Sponsor Transaction Charge"), /* @__PURE__ */ React.createElement(Text, {
    color: "standard.$0",
    variant: "body2",
    mb: "$20"
  }, sponsorCharge), isSponsorshipEnable && /* @__PURE__ */ React.createElement(Flex, {
    p: "15px",
    mb: "20px",
    flexDirection: "column",
    border: "1px dashed",
    borderColor: "#ffaf00",
    borderRadius: "$4"
  }, /* @__PURE__ */ React.createElement(Text, {
    color: "#ffaf00",
    variant: "body1",
    mb: "$5"
  }, "Users will be able to pay transaction fees in", " ", sponsorAsset.name), /* @__PURE__ */ React.createElement(Text, {
    color: "basic.$300",
    variant: "body2"
  }, "For each transaction, 0.001 WAVES will be deducted from your balance and ", sponsorAsset.name, " will be credited to your account. If you have the script account you will be cost 0.001 + 0.004 WAVES. The amount of ", sponsorAsset.name, " to be charged to users for transactions is set by you when you enable Sponsorship (enter the amount in the form above). Sponsorship will only work if you have a balance of at least 1.005 WAVES. If your balance falls below this amount, you will be unable to sponsor transactions.")), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    mb: "$5"
  }, "Fee"), /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "standard.$0"
  }, fee))), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(TransactionDetails, {
    tx
  })), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
    data: tx
  }))))));
};
const SignTransfer = ({
  userAddress,
  userBalance,
  userName,
  attachment,
  transferAmount,
  iconType,
  tx,
  meta,
  onReject,
  onConfirm,
  handleFeeSelect,
  txJSON,
  transferList,
  transferFee,
  isMassTransfer
}) => /* @__PURE__ */ React.createElement(Confirmation, {
  address: userAddress,
  name: userName,
  balance: `${getPrintableNumber(userBalance, WAVES.decimals)} Waves`,
  onReject,
  onConfirm
}, /* @__PURE__ */ React.createElement(Flex, {
  px: "$40",
  py: "$20",
  bg: "main.$900"
}, /* @__PURE__ */ React.createElement(Flex, {
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "circle",
  bg: "rgba(255, 175, 0, 0.1)",
  height: 60,
  width: 60
}, /* @__PURE__ */ React.createElement(IconTransfer, {
  type: iconType,
  size: 40
})), /* @__PURE__ */ React.createElement(Flex, {
  ml: "$20",
  flexDirection: "column"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1",
  color: "basic.$500"
}, !isMassTransfer ? "Sign Transfer TX" : "Sign MassTransfer TX"), /* @__PURE__ */ React.createElement(Text, {
  fontSize: 26,
  lineHeight: "32px",
  color: "standard.$0"
}, transferAmount))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
  borderBottom: "1px solid",
  borderColor: "main.$700",
  bg: "main.$900",
  mb: "$30",
  px: "$40"
}, /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "Main")), /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "Details")), /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
  bg: "main.$800",
  mb: "$30",
  px: "$40"
}, /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(Flex, {
  flexDirection: "column"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500"
}, !isMassTransfer ? "Recipient" : "Recipients"), !isMassTransfer ? /* @__PURE__ */ React.createElement(AddressLabel, {
  address: transferList[0].address,
  alias: transferList[0].name,
  withCopy: true,
  mt: "$5"
}, /* @__PURE__ */ React.createElement(AddressAvatar, {
  address: transferList[0].address
})) : /* @__PURE__ */ React.createElement(Box, {
  sx: {
    "& > * + *": {
      borderTop: "1px dashed",
      borderColor: "main.$500"
    }
  },
  mt: "$5",
  p: 15,
  backgroundColor: "basic.$900",
  borderRadius: "$4",
  maxHeight: 240,
  overflowY: "auto"
}, transferList.map(({ address, amount, name }, i) => /* @__PURE__ */ React.createElement(Flex, {
  key: i,
  alignItems: "center",
  justifyContent: "space-between",
  pt: i > 0 ? "7px" : 0,
  pb: i < transferList.length - 1 ? "7px" : 0
}, /* @__PURE__ */ React.createElement(AddressLabel, {
  address,
  alias: name,
  mt: "$5"
}, /* @__PURE__ */ React.createElement(AddressAvatar, {
  address
})), /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0"
}, amount)))), attachment ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Text, {
  mt: "$20",
  variant: "body2",
  color: "basic.$500"
}, "Attachment"), /* @__PURE__ */ React.createElement(Text, {
  mt: "$5",
  p: "15px",
  variant: "body2",
  color: "standard.$0",
  bg: "basic.$900",
  borderRadius: "$4"
}, attachment)) : null, isMassTransfer && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "basic.$500",
  display: "block",
  mt: "$20",
  mb: "$5"
}, "Fee"), /* @__PURE__ */ React.createElement(Text, {
  variant: "body2",
  color: "standard.$0"
}, transferFee)), meta && !isMassTransfer && /* @__PURE__ */ React.createElement(FeeSelect, {
  mt: "$20",
  txMeta: meta,
  fee: tx.fee,
  onFeeSelect: handleFeeSelect,
  availableWavesBalance: userBalance
}))), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(TransactionDetails, {
  tx
})), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
  data: txJSON
})))));
const SignTypedDataComponent = ({
  userAddress,
  userName,
  userBalance,
  data,
  onReject,
  onConfirm
}) => /* @__PURE__ */ React.createElement(Confirmation, {
  address: userAddress,
  name: userName,
  balance: userBalance,
  onReject,
  onConfirm
}, /* @__PURE__ */ React.createElement(Flex, {
  px: "$40",
  py: "$20",
  bg: "main.$900"
}, /* @__PURE__ */ React.createElement(Flex, {
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "circle",
  bg: "rgba(255, 175, 0, 0.1)",
  height: 60,
  width: 60
}, /* @__PURE__ */ React.createElement(Icon, {
  size: "60px",
  icon: iconSignMessage,
  color: "primary.$300"
})), /* @__PURE__ */ React.createElement(Flex, {
  ml: "$20",
  flexDirection: "column"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1",
  color: "basic.$500"
}, "Off-chain"), /* @__PURE__ */ React.createElement(Text, {
  fontSize: 26,
  lineHeight: "32px",
  color: "standard.$0"
}, "Sign Data"))), /* @__PURE__ */ React.createElement(Tabs, null, /* @__PURE__ */ React.createElement(TabsList, {
  borderBottom: "1px solid",
  borderColor: "main.$700",
  mb: "$30",
  px: "$40",
  bg: "main.$900"
}, /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "Data")), /* @__PURE__ */ React.createElement(Tab, {
  mr: "32px",
  pb: "12px"
}, /* @__PURE__ */ React.createElement(Text, {
  variant: "body1"
}, "JSON"))), /* @__PURE__ */ React.createElement(TabPanels, {
  mb: "$30",
  px: "$40",
  bg: "main.$800"
}, /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataEntry, {
  data
})), /* @__PURE__ */ React.createElement(TabPanel, null, /* @__PURE__ */ React.createElement(DataJson, {
  data
})))));
const Preload = () => {
  return /* @__PURE__ */ React.createElement(Flex, {
    backgroundColor: "main.$800",
    width: "520px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "$6",
    height: "584px"
  }, /* @__PURE__ */ React.createElement(DotLoader, null));
};
function SignCustom(props) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    onClick: props.onCancel
  }), /* @__PURE__ */ React.createElement("div", {
    className: "logo"
  }), /* @__PURE__ */ React.createElement("div", null, props.title), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, "Sign from"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(AddressAvatar, {
    address: props.sender
  }))), props.data, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: props.onCancel
  }, "Cancel"), /* @__PURE__ */ React.createElement("button", {
    onClick: props.onConfirm
  }, "Ok")));
}
const transferUtils = __spreadValues({}, transferHelpers);
const hooks = __spreadValues({}, hooksModule);
const CONSTANTS = __spreadValues({}, constantsModule);
const utils = __spreadValues({}, utilsModule);
export { CONSTANTS, Confirmation, DataEntry, DataJson, FeeSelect, GlobalCSS, Help, IconTransfer, InvokeFunction, InvokePayment, Preload, SignAliasComponent, SignBurn, SignCancelLeaseComponent, SignCustom, SignDataComponent, SignInvoke, SignIssueComponent, SignLeaseComponent, SignMessageComponent, SignReissueComponent, SignSetAccountScriptComponent, SignSetAssetScript, SignSponsorshipComponent, SignTransfer, SignTypedDataComponent, TransactionDetails, batchPage, hooks, iconTransferUtils, transferUtils, utils };
