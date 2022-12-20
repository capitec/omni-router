(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };
  var __exportStar = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    return __exportStar(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // ../../node_modules/decode-uri-component/index.js
  var require_decode_uri_component = __commonJS((exports, module) => {
    "use strict";
    var token = "%[a-f0-9]{2}";
    var singleMatcher = new RegExp("(" + token + ")|([^%]+?)", "gi");
    var multiMatcher = new RegExp("(" + token + ")+", "gi");
    function decodeComponents(components, split) {
      try {
        return [decodeURIComponent(components.join(""))];
      } catch (err) {
      }
      if (components.length === 1) {
        return components;
      }
      split = split || 1;
      var left = components.slice(0, split);
      var right = components.slice(split);
      return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
    }
    function decode2(input) {
      try {
        return decodeURIComponent(input);
      } catch (err) {
        var tokens = input.match(singleMatcher) || [];
        for (var i = 1; i < tokens.length; i++) {
          input = decodeComponents(tokens, i).join("");
          tokens = input.match(singleMatcher) || [];
        }
        return input;
      }
    }
    function customDecodeURIComponent(input) {
      var replaceMap = {
        "%FE%FF": "\uFFFD\uFFFD",
        "%FF%FE": "\uFFFD\uFFFD"
      };
      var match = multiMatcher.exec(input);
      while (match) {
        try {
          replaceMap[match[0]] = decodeURIComponent(match[0]);
        } catch (err) {
          var result = decode2(match[0]);
          if (result !== match[0]) {
            replaceMap[match[0]] = result;
          }
        }
        match = multiMatcher.exec(input);
      }
      replaceMap["%C2"] = "\uFFFD";
      var entries = Object.keys(replaceMap);
      for (var i = 0; i < entries.length; i++) {
        var key = entries[i];
        input = input.replace(new RegExp(key, "g"), replaceMap[key]);
      }
      return input;
    }
    module.exports = function(encodedURI) {
      if (typeof encodedURI !== "string") {
        throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof encodedURI + "`");
      }
      try {
        encodedURI = encodedURI.replace(/\+/g, " ");
        return decodeURIComponent(encodedURI);
      } catch (err) {
        return customDecodeURIComponent(encodedURI);
      }
    };
  });

  // ../../node_modules/split-on-first/index.js
  var require_split_on_first = __commonJS((exports, module) => {
    "use strict";
    module.exports = (string, separator) => {
      if (!(typeof string === "string" && typeof separator === "string")) {
        throw new TypeError("Expected the arguments to be of type `string`");
      }
      if (separator === "") {
        return [string];
      }
      const separatorIndex = string.indexOf(separator);
      if (separatorIndex === -1) {
        return [string];
      }
      return [
        string.slice(0, separatorIndex),
        string.slice(separatorIndex + separator.length)
      ];
    };
  });

  // src/views/ViewFade.js
  var require_ViewFade = __commonJS(() => {
    var ViewFade = class extends HTMLElement {
      constructor() {
        super();
        this._router = Router.getInstance();
        this._createDOM();
      }
      _createDOM() {
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
				:host {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					overflow: auto;

					box-sizing: border-box;
					padding: 20px;

					--omni-router-page-background: #eeffee;
				}

				@media only screen and (max-height: 720px) {
					:host {
						justify-content: flex-start;
					}
				}

				.logo {
					font-size: 128px;
				}

				h1 {
					margin: 20px 0px;

					font-family: Arial, Helvetica, sans-serif;
					font-size: 32px;
					font-weight: bold;
				}

				p {
					margin: 20px 0px;

					font-family: Arial, Helvetica, sans-serif;
					font-size: 16px;
					font-weight: normal;

					text-align: center;
				}

				p:last-of-type {
					margin-top: 0px;
				}

				button {
					margin: 20px 0px;
					padding: 20px;

					border: none;
					border-radius: 10px;
					box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

					background-color: #ffffff;
				}
			</style>

			<div class="logo">\u{1F3DD}</div>

			<h1>Fade</h1>
			
			<p>\u{1F44B} Hey there, I animated into view with a <strong>fade</strong> animation!</p>
			<p>If you press back here or go back via the browser history, I'll <strong>fade</strong> out.</p>

			<button id="back">\u2B05 Go Back</button>
		`;
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector("#back").addEventListener("click", () => this._navigateBack());
      }
      _navigateBack() {
        this._router.pop();
      }
    };
    customElements.define("view-fade", ViewFade);
  });

  // src/views/ViewSlide.js
  var require_ViewSlide = __commonJS(() => {
    var ViewSlide = class extends HTMLElement {
      constructor() {
        super();
        this._router = Router.getInstance();
        this._createDOM();
      }
      _createDOM() {
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
				:host {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					overflow: auto;

					box-sizing: border-box;
					padding: 20px;

					--omni-router-page-background: #eeeeff;
				}

				@media only screen and (max-height: 720px) {
					:host {
						justify-content: flex-start;
					}
				}

				.logo {
					font-size: 128px;
				}

				h1 {
					margin: 20px 0px;

					font-family: Arial, Helvetica, sans-serif;
					font-size: 32px;
					font-weight: bold;
				}

				p {
					margin: 20px 0px;

					font-family: Arial, Helvetica, sans-serif;
					font-size: 16px;
					font-weight: normal;

					text-align: center;
				}

				p:last-of-type {
					margin-top: 0px;
				}

				button {
					margin: 20px 0px;
					padding: 20px;

					border: none;
					border-radius: 10px;
					box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

					background-color: #ffffff;
				}
			</style>

			<div class="logo">\u26F3</div>

			<h1>Slide</h1>
			
			<p>\u{1F44B} Hey there, I animated into view with a <strong>slide</strong> animation!</p>
			<p>If you press back here or go back via the browser history, I'll <strong>slide</strong> out.</p>

			<button id="back">\u2B05 Go Back</button>
		`;
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector("#back").addEventListener("click", () => this._navigateBack());
      }
      _navigateBack() {
        this._router.pop();
      }
    };
    customElements.define("view-slide", ViewSlide);
  });

  // src/views/ViewPop.js
  var require_ViewPop = __commonJS(() => {
    var ViewPop = class extends HTMLElement {
      constructor() {
        super();
        this._router = Router.getInstance();
        this._createDOM();
      }
      _createDOM() {
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
				:host {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					overflow: auto;

					box-sizing: border-box;
					padding: 20px;

					--omni-router-page-background: #ffeeee;
				}

				@media only screen and (max-height: 720px) {
					:host {
						justify-content: flex-start;
					}
				}

				.logo {
					font-size: 128px;
				}

				h1 {
					margin: 20px 0px;

					font-family: Arial, Helvetica, sans-serif;
					font-size: 32px;
					font-weight: bold;
				}

				p {
					margin: 20px 0px;

					font-family: Arial, Helvetica, sans-serif;
					font-size: 16px;
					font-weight: normal;

					text-align: center;
				}

				p:last-of-type {
					margin-top: 0px;
				}

				button {
					margin: 20px 0px;
					padding: 20px;

					border: none;
					border-radius: 10px;
					box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

					background-color: #ffffff;
				}
			</style>

			<div class="logo">\u{1F3AE}</div>

			<h1>Pop</h1>
			
			<p>\u{1F44B} Hey there, I animated into view with a <strong>pop</strong> animation!</p>
			<p>If you press back here or go back via the browser history, I'll <strong>pop</strong> out.</p>

			<button id="back">\u2B05 Go Back</button>
		`;
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector("#back").addEventListener("click", () => this._navigateBack());
      }
      _navigateBack() {
        this._router.pop();
      }
    };
    customElements.define("view-pop", ViewPop);
  });

  // src/views/ViewGuarded.js
  var require_ViewGuarded = __commonJS(() => {
    var ViewGuarded = class extends HTMLElement {
      constructor() {
        super();
        this._router = Router.getInstance();
        this._createDOM();
      }
      _createDOM() {
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
				:host {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					overflow: auto;

					box-sizing: border-box;
					padding: 20px;

					--omni-router-page-background: #eeffff;
				}

				@media only screen and (max-height: 720px) {
					:host {
						justify-content: flex-start;
					}
				}

				.logo {
					font-size: 128px;
				}

				h1 {
					margin: 20px 0px;

					font-family: Arial, Helvetica, sans-serif;
					font-size: 32px;
					font-weight: bold;
				}

				p {
					margin: 20px 0px;

					font-family: Arial, Helvetica, sans-serif;
					font-size: 16px;
					font-weight: normal;
				}

				button {
					margin: 20px 0px;
					padding: 20px;

					border: none;
					border-radius: 10px;
					box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

					background-color: #ffffff;
				}
			</style>

			<div class="logo">\u{1F3AF}</div>

			<h1>Guarded Route</h1>
			
			<p>\u{1F44B} Hey there, I'm protected by a guard function.</p>

			<button id="back">\u2B05 Go Back</button>
		`;
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector("#back").addEventListener("click", () => this._navigateBack());
      }
      _navigateBack() {
        this._router.pop();
      }
    };
    customElements.define("view-guarded", ViewGuarded);
  });

  // src/views/ViewFallback.js
  var require_ViewFallback = __commonJS(() => {
    var ViewFallback = class extends HTMLElement {
      constructor() {
        super();
        this._router = Router.getInstance();
        this._createDOM();
      }
      _createDOM() {
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
				:host {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					overflow: auto;

					box-sizing: border-box;
					padding: 20px;

					--omni-router-page-background: #ffffee;
				}

				@media only screen and (max-height: 720px) {
					:host {
						justify-content: flex-start;
					}
				}

				.logo {
					font-size: 128px;
				}

				h1 {
					margin: 20px 0px;

					font-family: Arial, Helvetica, sans-serif;
					font-size: 32px;
					font-weight: bold;
				}

				p {
					margin: 20px 0px;

					font-family: Arial, Helvetica, sans-serif;
					font-size: 16px;
					font-weight: normal;
				}

				button {
					margin: 20px 0px;
					padding: 20px;

					border: none;
					border-radius: 10px;
					box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

					background-color: #ffffff;
				}
			</style>

			<div class="logo">\u26C5</div>

			<h1>Page Not Found</h1>

			<p>Oops, looks like the page you are looking for does not exist.</p>

			<button id="back">\u2B05 Go Back</button>
		`;
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector("#back").addEventListener("click", () => this._navigateBack());
      }
      _navigateBack() {
        this._router.pop();
      }
    };
    customElements.define("view-fallback", ViewFallback);
  });

  // ../../node_modules/query-string/base.js
  var base_exports = {};
  __export(base_exports, {
    exclude: () => exclude,
    extract: () => extract,
    parse: () => parse,
    parseUrl: () => parseUrl,
    pick: () => pick,
    stringify: () => stringify,
    stringifyUrl: () => stringifyUrl
  });
  var import_decode_uri_component = __toModule(require_decode_uri_component());
  var import_split_on_first = __toModule(require_split_on_first());

  // ../../node_modules/filter-obj/index.js
  function includeKeys(object, predicate) {
    const result = {};
    if (Array.isArray(predicate)) {
      for (const key of predicate) {
        const descriptor = Object.getOwnPropertyDescriptor(object, key);
        if (descriptor?.enumerable) {
          Object.defineProperty(result, key, descriptor);
        }
      }
    } else {
      for (const key of Reflect.ownKeys(object)) {
        const descriptor = Object.getOwnPropertyDescriptor(object, key);
        if (descriptor.enumerable) {
          const value = object[key];
          if (predicate(key, value, object)) {
            Object.defineProperty(result, key, descriptor);
          }
        }
      }
    }
    return result;
  }

  // ../../node_modules/query-string/base.js
  var isNullOrUndefined = (value) => value === null || value === void 0;
  var strictUriEncode = (string) => encodeURIComponent(string).replace(/[!'()*]/g, (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
  var encodeFragmentIdentifier = Symbol("encodeFragmentIdentifier");
  function encoderForArrayFormat(options) {
    switch (options.arrayFormat) {
      case "index": {
        return (key) => (result, value) => {
          const index = result.length;
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          if (value === null) {
            return [
              ...result,
              [encode(key, options), "[", index, "]"].join("")
            ];
          }
          return [
            ...result,
            [encode(key, options), "[", encode(index, options), "]=", encode(value, options)].join("")
          ];
        };
      }
      case "bracket": {
        return (key) => (result, value) => {
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          if (value === null) {
            return [
              ...result,
              [encode(key, options), "[]"].join("")
            ];
          }
          return [
            ...result,
            [encode(key, options), "[]=", encode(value, options)].join("")
          ];
        };
      }
      case "colon-list-separator": {
        return (key) => (result, value) => {
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          if (value === null) {
            return [
              ...result,
              [encode(key, options), ":list="].join("")
            ];
          }
          return [
            ...result,
            [encode(key, options), ":list=", encode(value, options)].join("")
          ];
        };
      }
      case "comma":
      case "separator":
      case "bracket-separator": {
        const keyValueSep = options.arrayFormat === "bracket-separator" ? "[]=" : "=";
        return (key) => (result, value) => {
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          value = value === null ? "" : value;
          if (result.length === 0) {
            return [[encode(key, options), keyValueSep, encode(value, options)].join("")];
          }
          return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
        };
      }
      default: {
        return (key) => (result, value) => {
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          if (value === null) {
            return [
              ...result,
              encode(key, options)
            ];
          }
          return [
            ...result,
            [encode(key, options), "=", encode(value, options)].join("")
          ];
        };
      }
    }
  }
  function parserForArrayFormat(options) {
    let result;
    switch (options.arrayFormat) {
      case "index": {
        return (key, value, accumulator) => {
          result = /\[(\d*)]$/.exec(key);
          key = key.replace(/\[\d*]$/, "");
          if (!result) {
            accumulator[key] = value;
            return;
          }
          if (accumulator[key] === void 0) {
            accumulator[key] = {};
          }
          accumulator[key][result[1]] = value;
        };
      }
      case "bracket": {
        return (key, value, accumulator) => {
          result = /(\[])$/.exec(key);
          key = key.replace(/\[]$/, "");
          if (!result) {
            accumulator[key] = value;
            return;
          }
          if (accumulator[key] === void 0) {
            accumulator[key] = [value];
            return;
          }
          accumulator[key] = [...accumulator[key], value];
        };
      }
      case "colon-list-separator": {
        return (key, value, accumulator) => {
          result = /(:list)$/.exec(key);
          key = key.replace(/:list$/, "");
          if (!result) {
            accumulator[key] = value;
            return;
          }
          if (accumulator[key] === void 0) {
            accumulator[key] = [value];
            return;
          }
          accumulator[key] = [...accumulator[key], value];
        };
      }
      case "comma":
      case "separator": {
        return (key, value, accumulator) => {
          const isArray = typeof value === "string" && value.includes(options.arrayFormatSeparator);
          const isEncodedArray = typeof value === "string" && !isArray && decode(value, options).includes(options.arrayFormatSeparator);
          value = isEncodedArray ? decode(value, options) : value;
          const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map((item) => decode(item, options)) : value === null ? value : decode(value, options);
          accumulator[key] = newValue;
        };
      }
      case "bracket-separator": {
        return (key, value, accumulator) => {
          const isArray = /(\[])$/.test(key);
          key = key.replace(/\[]$/, "");
          if (!isArray) {
            accumulator[key] = value ? decode(value, options) : value;
            return;
          }
          const arrayValue = value === null ? [] : value.split(options.arrayFormatSeparator).map((item) => decode(item, options));
          if (accumulator[key] === void 0) {
            accumulator[key] = arrayValue;
            return;
          }
          accumulator[key] = [...accumulator[key], ...arrayValue];
        };
      }
      default: {
        return (key, value, accumulator) => {
          if (accumulator[key] === void 0) {
            accumulator[key] = value;
            return;
          }
          accumulator[key] = [...[accumulator[key]].flat(), value];
        };
      }
    }
  }
  function validateArrayFormatSeparator(value) {
    if (typeof value !== "string" || value.length !== 1) {
      throw new TypeError("arrayFormatSeparator must be single character string");
    }
  }
  function encode(value, options) {
    if (options.encode) {
      return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
    }
    return value;
  }
  function decode(value, options) {
    if (options.decode) {
      return (0, import_decode_uri_component.default)(value);
    }
    return value;
  }
  function keysSorter(input) {
    if (Array.isArray(input)) {
      return input.sort();
    }
    if (typeof input === "object") {
      return keysSorter(Object.keys(input)).sort((a, b) => Number(a) - Number(b)).map((key) => input[key]);
    }
    return input;
  }
  function removeHash(input) {
    const hashStart = input.indexOf("#");
    if (hashStart !== -1) {
      input = input.slice(0, hashStart);
    }
    return input;
  }
  function getHash(url) {
    let hash = "";
    const hashStart = url.indexOf("#");
    if (hashStart !== -1) {
      hash = url.slice(hashStart);
    }
    return hash;
  }
  function parseValue(value, options) {
    if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === "string" && value.trim() !== "")) {
      value = Number(value);
    } else if (options.parseBooleans && value !== null && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
      value = value.toLowerCase() === "true";
    }
    return value;
  }
  function extract(input) {
    input = removeHash(input);
    const queryStart = input.indexOf("?");
    if (queryStart === -1) {
      return "";
    }
    return input.slice(queryStart + 1);
  }
  function parse(query, options) {
    options = {
      decode: true,
      sort: true,
      arrayFormat: "none",
      arrayFormatSeparator: ",",
      parseNumbers: false,
      parseBooleans: false,
      ...options
    };
    validateArrayFormatSeparator(options.arrayFormatSeparator);
    const formatter = parserForArrayFormat(options);
    const returnValue = Object.create(null);
    if (typeof query !== "string") {
      return returnValue;
    }
    query = query.trim().replace(/^[?#&]/, "");
    if (!query) {
      return returnValue;
    }
    for (const parameter of query.split("&")) {
      if (parameter === "") {
        continue;
      }
      let [key, value] = (0, import_split_on_first.default)(options.decode ? parameter.replace(/\+/g, " ") : parameter, "=");
      value = value === void 0 ? null : ["comma", "separator", "bracket-separator"].includes(options.arrayFormat) ? value : decode(value, options);
      formatter(decode(key, options), value, returnValue);
    }
    for (const [key, value] of Object.entries(returnValue)) {
      if (typeof value === "object" && value !== null) {
        for (const [key2, value2] of Object.entries(value)) {
          value[key2] = parseValue(value2, options);
        }
      } else {
        returnValue[key] = parseValue(value, options);
      }
    }
    if (options.sort === false) {
      return returnValue;
    }
    return (options.sort === true ? Object.keys(returnValue).sort() : Object.keys(returnValue).sort(options.sort)).reduce((result, key) => {
      const value = returnValue[key];
      if (Boolean(value) && typeof value === "object" && !Array.isArray(value)) {
        result[key] = keysSorter(value);
      } else {
        result[key] = value;
      }
      return result;
    }, Object.create(null));
  }
  function stringify(object, options) {
    if (!object) {
      return "";
    }
    options = {
      encode: true,
      strict: true,
      arrayFormat: "none",
      arrayFormatSeparator: ",",
      ...options
    };
    validateArrayFormatSeparator(options.arrayFormatSeparator);
    const shouldFilter = (key) => options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === "";
    const formatter = encoderForArrayFormat(options);
    const objectCopy = {};
    for (const [key, value] of Object.entries(object)) {
      if (!shouldFilter(key)) {
        objectCopy[key] = value;
      }
    }
    const keys = Object.keys(objectCopy);
    if (options.sort !== false) {
      keys.sort(options.sort);
    }
    return keys.map((key) => {
      const value = object[key];
      if (value === void 0) {
        return "";
      }
      if (value === null) {
        return encode(key, options);
      }
      if (Array.isArray(value)) {
        if (value.length === 0 && options.arrayFormat === "bracket-separator") {
          return encode(key, options) + "[]";
        }
        return value.reduce(formatter(key), []).join("&");
      }
      return encode(key, options) + "=" + encode(value, options);
    }).filter((x) => x.length > 0).join("&");
  }
  function parseUrl(url, options) {
    options = {
      decode: true,
      ...options
    };
    const [url_, hash] = (0, import_split_on_first.default)(url, "#");
    return {
      url: url_?.split("?")?.[0] ?? "",
      query: parse(extract(url), options),
      ...options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
    };
  }
  function stringifyUrl(object, options) {
    options = {
      encode: true,
      strict: true,
      [encodeFragmentIdentifier]: true,
      ...options
    };
    const url = removeHash(object.url).split("?")[0] || "";
    const queryFromUrl = extract(object.url);
    const query = {
      ...parse(queryFromUrl, {sort: false}),
      ...object.query
    };
    let queryString = stringify(query, options);
    if (queryString) {
      queryString = `?${queryString}`;
    }
    let hash = getHash(object.url);
    if (object.fragmentIdentifier) {
      const urlObjectForFragmentEncode = new URL(url);
      urlObjectForFragmentEncode.hash = object.fragmentIdentifier;
      hash = options[encodeFragmentIdentifier] ? urlObjectForFragmentEncode.hash : `#${object.fragmentIdentifier}`;
    }
    return `${url}${queryString}${hash}`;
  }
  function pick(input, filter, options) {
    options = {
      parseFragmentIdentifier: true,
      [encodeFragmentIdentifier]: false,
      ...options
    };
    const {url, query, fragmentIdentifier} = parseUrl(input, options);
    return stringifyUrl({
      url,
      query: includeKeys(query, filter),
      fragmentIdentifier
    }, options);
  }
  function exclude(input, filter, options) {
    const exclusionFilter = Array.isArray(filter) ? (key) => !filter.includes(key) : (key, value) => !filter(key, value);
    return pick(input, exclusionFilter, options);
  }

  // ../../node_modules/query-string/index.js
  var query_string_default = base_exports;

  // ../../node_modules/regexparam/dist/index.mjs
  function parse2(str, loose) {
    if (str instanceof RegExp)
      return {keys: false, pattern: str};
    var c, o, tmp, ext, keys = [], pattern = "", arr = str.split("/");
    arr[0] || arr.shift();
    while (tmp = arr.shift()) {
      c = tmp[0];
      if (c === "*") {
        keys.push("wild");
        pattern += "/(.*)";
      } else if (c === ":") {
        o = tmp.indexOf("?", 1);
        ext = tmp.indexOf(".", 1);
        keys.push(tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length));
        pattern += !!~o && !~ext ? "(?:/([^/]+?))?" : "/([^/]+?)";
        if (!!~ext)
          pattern += (!!~o ? "?" : "") + "\\" + tmp.substring(ext);
      } else {
        pattern += "/" + tmp;
      }
    }
    return {
      keys,
      pattern: new RegExp("^" + pattern + (loose ? "(?=$|/)" : "/?$"), "i")
    };
  }

  // ../../dist/Router.js
  var Router = class {
    constructor() {
      this._routes = [];
      this._eventListeners = {
        "route-loaded": []
      };
      window.addEventListener("popstate", this._onPopState.bind(this));
    }
    static getInstance() {
      return this._instance || (this._instance = new Router());
    }
    get currentLocation() {
      return this._currentLocation;
    }
    get previousLocation() {
      return this._previousLocation;
    }
    get defaultRoute() {
      return this._routes.find((r) => r.isDefault);
    }
    get fallbackRoute() {
      return this._routes.find((r) => r.isFallback);
    }
    addEventListener(eventName, callback) {
      if (!eventName) {
        throw new Error("[Router] No event name provided.");
      }
      if (!Object.keys(this._eventListeners).includes(eventName)) {
        throw new Error(`[Router] Invalid event name provided. Valid options include: ${Object.keys(this._eventListeners).join(", ")}`);
      }
      if (!callback) {
        throw new Error("[Router] No callback function provided.");
      }
      this._eventListeners[eventName].push(callback);
    }
    removeEventListener(eventName, callback) {
      if (!eventName) {
        throw new Error("[Router] No event name provided.");
      }
      if (!Object.keys(this._eventListeners).includes(eventName)) {
        throw new Error(`[Router] Invalid event name provided. Valid options include: ${Object.keys(this._eventListeners).join(", ")}`);
      }
      if (!callback) {
        throw new Error("[Router] No callback function provided.");
      }
      this._eventListeners[eventName] = this._eventListeners[eventName].filter((listener) => listener !== callback);
    }
    addRoute(route) {
      if (!route) {
        throw new Error("[Router] No route provided");
      }
      if (!route.name) {
        throw new Error("[Router] No route name provided");
      }
      if (!route.path) {
        throw new Error("[Router] No route path provided");
      }
      if (this._routes.find((r) => r.name === route.name)) {
        throw new Error(`[Router] Route with name "${route.name}" already exists`);
      }
      if (this._routes.find((r) => r.path === route.path)) {
        throw new Error(`[Router] Route with path "${route.path}" already exists`);
      }
      this._routes.push(route);
      if (route.isDefault) {
        this.setDefault(route.name);
      }
      if (route.isFallback) {
        this.setFallback(route.name);
      }
    }
    getRouteForPath(pathOrUrl) {
      let path = pathOrUrl.replace(window.location.origin, "");
      if (path.indexOf("?") !== -1) {
        path = path.substring(0, path.indexOf("?"));
      }
      if (path.indexOf("#") !== -1) {
        path = path.substring(0, path.indexOf("#"));
      }
      if ((!path || path === "/") && this.defaultRoute) {
        return this.defaultRoute;
      }
      const lookupRoute = this._routes.find((r) => {
        if (parse2(r.path).pattern.test(path)) {
          return true;
        }
        return false;
      });
      if (lookupRoute) {
        return lookupRoute;
      }
      if (this.fallbackRoute) {
        return this.fallbackRoute;
      }
      console.error(`[Router] No route registered for path '${path}', unable to navigate.`);
      return null;
    }
    setDefault(name) {
      const route = this._routes.find((r) => r.name === name);
      if (route) {
        this._routes.forEach((r) => r.isDefault = false);
        route.isDefault = true;
        return true;
      }
      return false;
    }
    setFallback(name) {
      const route = this._routes.find((r) => r.name === name);
      if (route) {
        this._routes.forEach((r) => r.isFallback = false);
        route.isFallback = true;
        return true;
      }
      return false;
    }
    async load() {
      const route = this.getRouteForPath(window.location.href);
      if (!route) {
        return;
      }
      if (route.guard && !route.guard()) {
        console.warn(`[Router] Route "${route.name}" stopped by its guard function, unable to navigate.`);
        return;
      }
      await this._applyRoute(route);
    }
    async push(path, state = {}) {
      const route = this.getRouteForPath(path);
      if (!route) {
        return;
      }
      if (route.guard && !route.guard()) {
        console.warn(`[Router] Route "${route.name}" stopped by its guard function, unable to navigate.`);
        return;
      }
      history.pushState(state, route.name, path);
      await this._applyRoute(route);
    }
    async replace(path, state = {}) {
      const route = this.getRouteForPath(path);
      if (!route) {
        return;
      }
      if (route.guard && !route.guard()) {
        console.warn(`[Router] Route "${route.name}" stopped by its guard function, unable to navigate.`);
        return;
      }
      history.replaceState(state, route.name, path);
      await this._applyRoute(route);
    }
    pop() {
      history.back();
    }
    _onPopState() {
      const backPressed = true;
      const route = this.getRouteForPath(window.location.href);
      if (!route) {
        return;
      }
      void this._applyRoute(route, backPressed);
    }
    async _applyRoute(route, animateOut = false) {
      var _a, _b, _c, _d, _e, _f, _g;
      if (route.title) {
        document.title = route.title;
      }
      this._previousLocation = this._currentLocation;
      this._currentLocation = {
        href: window.location.href,
        protocol: (_a = window.location.protocol) === null || _a === void 0 ? void 0 : _a.replace(":", ""),
        host: window.location.hostname,
        port: Number(window.location.port) || void 0,
        path: window.location.pathname,
        query: ((_b = window.location.search) === null || _b === void 0 ? void 0 : _b.replace("?", "")) || void 0,
        hash: ((_c = window.location.hash) === null || _c === void 0 ? void 0 : _c.replace("#", "")) || void 0,
        pathParams: this._getPathParams(window.location.pathname, route.path) || void 0,
        queryParams: this._getQueryParams(window.location.search) || void 0,
        route
      };
      let animation;
      if (animateOut && ((_e = (_d = this._previousLocation) === null || _d === void 0 ? void 0 : _d.route) === null || _e === void 0 ? void 0 : _e.animation)) {
        animation = `${this._previousLocation.route.animation}-out`;
      } else if ((_f = this._currentLocation.route) === null || _f === void 0 ? void 0 : _f.animation) {
        animation = `${(_g = this._currentLocation.route) === null || _g === void 0 ? void 0 : _g.animation}-in`;
      }
      if (this.onNavigate) {
        await this.onNavigate(this._currentLocation, animation);
        for (const listener of this._eventListeners["route-loaded"]) {
          listener({
            previous: this._previousLocation,
            current: this._currentLocation
          });
        }
      }
    }
    _getPathParams(path, routePath) {
      var _a;
      const parsedPath = parse2(routePath);
      const matches = (_a = parsedPath.pattern.exec(path)) === null || _a === void 0 ? void 0 : _a.splice(1);
      if (!matches) {
        return null;
      }
      const pathParams = {};
      for (let i = 0; i < parsedPath.keys.length; i++) {
        pathParams[parsedPath.keys[i]] = matches[i] || null;
      }
      if (Object.keys(pathParams).length === 0) {
        return null;
      }
      return pathParams;
    }
    _getQueryParams(query) {
      const queryParams = query_string_default.parse(query);
      if (Object.keys(queryParams).length === 0) {
        return null;
      }
      return queryParams;
    }
  };

  // ../../dist/RouterOutlet.js
  var RouterOutlet = class extends HTMLElement {
    constructor() {
      super();
      this._animationQueue = [];
      this._router = Router.getInstance();
      this._isAnimating = false;
      const shadow = this.attachShadow({mode: "open"});
      const style = document.createElement("style");
      style.textContent = `
			:host {
				width: 100%;
				height: 100%;
				overflow: hidden;

				position: relative;
			}

			.page {
				width: 100%;
				height: 100%;

				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;

				background: var(--omni-router-page-background, #FFFFFF);
			}

			/** Fade In Animation */

			.fade-in {
				opacity: 0;
			}

			.fade-in.animate {
				animation: fadein var(--omni-router-animation-duration, 300ms) both;
				
				z-index: 100;
			}

			@keyframes fadein {
				from {
					opacity: 0;
				}
				to {
					opacity: 1;
				}
			}

			/* Fade Out Animation */

			.fade-out {
				opacity: 1;
			}

			.fade-out.animate {
				animation: fadeout var(--omni-router-animation-duration, 300ms) both;

				z-index: 100;
			}

			@keyframes fadeout {
				from {
					opacity: 1;
				}
				to {
					opacity: 0;
				}
			}

			/* Slide In Animation */

			.slide-in {
				transform: translateX(100%);
			}

			.slide-in.animate {
				animation: slidein var(--omni-router-animation-duration, 300ms) both;
				animation-timing-function: cubic-bezier(0, 0, 0.2, 1);

				z-index: 100;
			}

			@keyframes slidein {
				from {
					transform: translateX(100%);
				}
				to {
					transform: translateX(0px);
				}
			}

			/* Slide Out Animation */

			.slide-out {
				transform: translateX(0px);
			}

			.slide-out.animate {
				animation: slideout var(--omni-router-animation-duration, 300ms) both;
				animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);

				z-index: 100;
			}

			@keyframes slideout {
				from {
					transform: translateX(0px);
				}
				to {
					transform: translateX(100%);
				}
			}

			/* Pop In Animation */

			.pop-in {
				transform: translateY(100%);
			}

			.pop-in.animate {
				animation: popin var(--omni-router-animation-duration, 300ms) both;
				animation-timing-function: cubic-bezier(0, 0, 0.2, 1);

				z-index: 100;
			}

			@keyframes popin {
				from {
					transform: translateY(100%);
				}
				to {
					transform: translateY(0px);
				}
			}

			/* Pop Out Animation */

			.pop-out {
				transform: translateY(0px);
			}

			.pop-out.animate {
				animation: popout var(--omni-router-animation-duration, 300ms) both;
				animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);

				z-index: 100;
			}

			@keyframes popout {
				from {
					transform: translateY(0px);
				}
				to {
					transform: translateY(100%);
				}
			}
		`;
      shadow.appendChild(style);
    }
    connectedCallback() {
      this._router.onNavigate = (route, animation) => this.loadRoute(route, animation);
    }
    disconnectedCallback() {
      this._router.onNavigate = void 0;
    }
    async loadRoute(routedLocation, animation) {
      var _a, _b;
      const route = routedLocation.route;
      if (!route) {
        return;
      }
      if (((_b = (_a = this._currentLocation) === null || _a === void 0 ? void 0 : _a.route) === null || _b === void 0 ? void 0 : _b.name) === route.name) {
        return;
      }
      this._animationQueue.push({
        routedLocation,
        animation
      });
      if (!this._isAnimating) {
        await this._processNextQueueItem();
      }
    }
    async _processNextQueueItem() {
      const routeRequest = this._animationQueue.shift();
      if (!routeRequest) {
        this._isAnimating = false;
        return;
      }
      this._isAnimating = true;
      const routedLocation = routeRequest.routedLocation;
      const animation = routeRequest.animation;
      const route = routedLocation.route;
      if (!route) {
        this._isAnimating = false;
        return;
      }
      this._previousLocation = this._currentLocation;
      this._currentLocation = routedLocation;
      this.dispatchEvent(new CustomEvent("navigation-started", {
        detail: this._currentLocation,
        bubbles: true,
        composed: true
      }));
      if (route.load) {
        await route.load();
      }
      const oldRouteComponent = this._getCurrentRouteComponent();
      const newRouteComponent = document.createElement(route.name);
      newRouteComponent.classList.add("page");
      await new Promise((resolve) => {
        var _a, _b, _c, _d;
        if (animation === "fade-in" || animation === "slide-in" || animation === "pop-in") {
          newRouteComponent.classList.add(animation);
          newRouteComponent.addEventListener("animationend", () => {
            newRouteComponent.classList.remove(animation, "animate");
            if (oldRouteComponent) {
              oldRouteComponent.remove();
            }
            resolve();
          });
          (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.append(newRouteComponent);
          setTimeout(() => {
            newRouteComponent.classList.add("animate");
          }, 10);
        } else if (animation === "fade-out" || animation === "slide-out" || animation === "pop-out") {
          if (oldRouteComponent) {
            oldRouteComponent.classList.add(animation);
            oldRouteComponent.addEventListener("animationend", () => {
              oldRouteComponent.classList.remove(animation, "animate");
              oldRouteComponent.remove();
              resolve();
            });
            (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.prepend(newRouteComponent);
            setTimeout(() => {
              oldRouteComponent.classList.add("animate");
            }, 10);
          } else {
            (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.prepend(newRouteComponent);
            resolve();
          }
        } else {
          if (oldRouteComponent) {
            oldRouteComponent.remove();
          }
          (_d = this.shadowRoot) === null || _d === void 0 ? void 0 : _d.append(newRouteComponent);
          resolve();
        }
      });
      this.dispatchEvent(new CustomEvent("navigation-completed", {
        detail: this._currentLocation,
        bubbles: true,
        composed: true
      }));
      await this._processNextQueueItem();
    }
    _getCurrentRouteComponent() {
      if (!this.shadowRoot) {
        return null;
      }
      for (let i = 0; i < this.shadowRoot.children.length; i++) {
        const child = this.shadowRoot.children[i];
        if (child.tagName.toLowerCase() !== "style") {
          return child;
        }
      }
      return null;
    }
  };
  customElements.define("omni-router-outlet", RouterOutlet);

  // src/AppShell.js
  var AppShell = class extends HTMLElement {
    constructor() {
      super();
      this._lockActive = true;
      this._createDOM();
      this._router = Router.getInstance();
      this._router.addRoute({
        name: "view-fade",
        title: "Fade",
        path: "/fade",
        animation: "fade",
        load: () => Promise.resolve().then(() => __toModule(require_ViewFade())),
        isDefault: true
      });
      this._router.addRoute({
        name: "view-slide",
        title: "Slide",
        path: "/slide",
        animation: "slide",
        load: () => Promise.resolve().then(() => __toModule(require_ViewSlide()))
      });
      this._router.addRoute({
        name: "view-pop",
        title: "Pop",
        path: "/pop",
        animation: "pop",
        load: () => Promise.resolve().then(() => __toModule(require_ViewPop()))
      });
      this._router.addRoute({
        name: "view-guarded",
        title: "Guarded Route",
        path: "/guarded",
        load: () => Promise.resolve().then(() => __toModule(require_ViewGuarded())),
        guard: () => !this._isLocked()
      });
      this._router.addRoute({
        name: "view-fallback",
        title: "Fallback Route",
        path: "/error404",
        load: () => Promise.resolve().then(() => __toModule(require_ViewFallback())),
        isFallback: true
      });
      this._router.load();
    }
    _createDOM() {
      const template = document.createElement("template");
      template.innerHTML = `
			<style>
				:host {
					width: 100%;
					height: 100%;

					display: flex;
					flex-direction: column;
					justify-content: stretch;
					align-items: stretch;
				}

				.hidden {
					display: none;
				}

				/* Header */

				header {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: flex-start;

					padding: 40px 20px;

					background-color: #FFFFFF;

					transition: all .5s linear;
				}

				header > img {
					width: 150px;

					transition: all .5s linear;
				}

				header > h1 {
					font-family: Arial, Helvetica, sans-serif;
					font-size: 32px;
					font-weight: bold;

					padding: 0px;
					margin: 20px 0px 0px 0px;

					transition: all .5s linear;
				}

				@media only screen and (max-width: 1000px) {
					header {
						padding: 20px;
					}

					header > img {
						width: 64px;
					}

					header > h1 {
						font-size: 24px;
					}
				}

				@media only screen and (max-height: 700px) {
					header {
						display: none;
					}
				}

				/* Nav Bar */

				nav {
					display: flex;
					flex-direction: row;
					align-items: stretch;
					justify-content: flex-start;

					background-color: #209dee;
					
					font-family: Arial, Helvetica, sans-serif;
					font-size: 16px;
					font-weight: normal;

					padding: 0px 20px;

					flex-shrink: 0;
					flex-wrap: wrap;

					transition: all .5s linear;
				}

				nav > a {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: flex-start;

					padding: 0px 20px;

					color: #FFFFFF;
					
					font-family: Arial, Helvetica, sans-serif;
					font-size: 16px;
					font-weight: normal;

					text-decoration: none;

					height: 64px;

					cursor: pointer;
				}

				nav > a:hover {
					background-color: #1b86cb;
				}

				nav > a .emoji {
					font-size: 24px;
					margin-right: 10px;
				}

				nav > a > small {
					font-weight: bold;
					margin-left: 5px;
					display: inline;
				}

				nav > a > small.locked {
					color: #f7bd6a;
				}

				nav > a > small.unlocked {
					color: #76fc78;
				}

				nav > a.push-right {
					margin-left: auto;
				}

				@media only screen and (max-width: 1000px) {
					nav {
						padding: 0px;
						justify-content: center;
					}

					nav > a {
						height: 48px;
					}

					nav > a.push-right {
						margin-left: 0px;
					}
				}

				/* Content Area */

				omni-router-outlet {
					flex: 1 1 auto;
				}
			</style>

			<header>
				<img src="./assets/logo.png">
				<h1>Omni Router Demo</h1>
			</header>
			
			<nav>
				<a href="/"><span class="emoji">\u{1F3E0}</span>Default Route</a>
				<a href="/fade">Fade</a>
				<a href="/slide">Slide</a>
				<a href="/pop">Pop</a>
				<a href="/guarded">Guarded Route <small class="locked">[Locked]</small><small class="unlocked hidden">[Unlocked]</small></a>
				<a href="/some-missing-path">Fallback Route</a>

				<a id="login" class="push-right">Unlock Guard</a>
				<a id="logout" class="push-right hidden">Lock Guard</a>
			</nav>
			
			<omni-router-outlet></omni-router-outlet>
		`;
      this.attachShadow({mode: "open"});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.shadowRoot.querySelector("#login").addEventListener("click", () => this._unlock());
      this.shadowRoot.querySelector("#logout").addEventListener("click", () => this._lock());
      this.shadowRoot.querySelectorAll("a").forEach((link) => {
        const path = link.getAttribute("href");
        link.onclick = (e) => {
          e.preventDefault();
          if (path) {
            this._router.push(path);
          }
        };
      });
    }
    _unlock() {
      this.shadowRoot.querySelector("#login").classList.add("hidden");
      this.shadowRoot.querySelector("#logout").classList.remove("hidden");
      this.shadowRoot.querySelector("a small.locked").classList.add("hidden");
      this.shadowRoot.querySelector("a small.unlocked").classList.remove("hidden");
      this._lockActive = false;
    }
    _lock() {
      this.shadowRoot.querySelector("#login").classList.remove("hidden");
      this.shadowRoot.querySelector("#logout").classList.add("hidden");
      this.shadowRoot.querySelector("a small.locked").classList.remove("hidden");
      this.shadowRoot.querySelector("a small.unlocked").classList.add("hidden");
      this._lockActive = true;
    }
    _isLocked() {
      if (this._lockActive) {
        alert("Route locked. Unlock to navigate...");
      }
      return this._lockActive;
    }
  };
  customElements.define("app-shell", AppShell);
})();
