globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { eventHandler, setHeaders, sendRedirect, defineEventHandler, handleCacheHeaders, createEvent, getRequestHeader, getRequestHeaders, setResponseHeader, createError, createApp, createRouter as createRouter$1, lazyEventHandler, toNodeListener } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withQuery, joinURL, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage } from 'unstorage';
import defu from 'defu';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routeRules":{"/__nuxt_error":{"cache":false}},"envPrefix":"NUXT_"},"public":{}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config$1 = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config$1;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
const timingMiddleware = eventHandler((event) => {
  const start = globalTiming.start();
  const _end = event.res.end;
  event.res.end = function(chunk, encoding, cb) {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!event.res.headersSent) {
      event.res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(event.res, chunk, encoding, cb);
    return this;
  }.bind(event.res);
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(createRouter({ routes: config.nitro.routeRules }));
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(event, routeRules.redirect.to, routeRules.redirect.statusCode);
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(path);
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      if (!pending[key]) {
        entry.value = void 0;
        entry.integrity = void 0;
        entry.mtime = void 0;
        entry.expires = void 0;
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      if (validate(entry)) {
        useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      const url = event.req.originalUrl || event.req.url;
      const friendlyName = decodeURI(parseURL(url).pathname).replace(/[^a-zA-Z0-9]/g, "").substring(0, 16);
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    let _resSendBody;
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
      getHeader(name) {
        return resHeaders[name];
      },
      setHeader(name, value) {
        resHeaders[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(resHeaders);
      },
      hasHeader(name) {
        return name in resHeaders;
      },
      removeHeader(name) {
        delete resHeaders[name];
      },
      getHeaders() {
        return resHeaders;
      },
      end(chunk, arg2, arg3) {
        if (typeof chunk === "string") {
          _resSendBody = chunk;
        }
        if (typeof arg2 === "function") {
          arg2();
        }
        if (typeof arg3 === "function") {
          arg3();
        }
        return this;
      },
      write(chunk, arg2, arg3) {
        if (typeof chunk === "string") {
          _resSendBody = chunk;
        }
        if (typeof arg2 === "function") {
          arg2();
        }
        if (typeof arg3 === "function") {
          arg3();
        }
        return this;
      },
      writeHead(statusCode, headers2) {
        this.statusCode = statusCode;
        if (headers2) {
          for (const header in headers2) {
            this.setHeader(header, headers2[header]);
          }
        }
        return this;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event) || _resSendBody;
    const headers = event.res.getHeaders();
    headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
    headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || new Date().toUTCString();
    const cacheControl = [];
    if (opts.swr) {
      if (opts.maxAge) {
        cacheControl.push(`s-maxage=${opts.maxAge}`);
      }
      if (opts.staleMaxAge) {
        cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
      } else {
        cacheControl.push("stale-while-revalidate");
      }
    } else if (opts.maxAge) {
      cacheControl.push(`max-age=${opts.maxAge}`);
    }
    if (cacheControl.length) {
      headers["cache-control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.node.res.statusCode = errorObject.statusCode !== 200 && errorObject.statusCode || 500;
  if (errorObject.statusMessage) {
    event.node.res.statusMessage = errorObject.statusMessage;
  }
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.node.res.setHeader("Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    event.node.res.setHeader("Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  if (res.status && res.status !== 200) {
    event.node.res.statusCode = res.status;
  }
  if (res.statusText) {
    event.node.res.statusMessage = res.statusText;
  }
  event.node.res.end(await res.text());
});

const assets = {
  "/.DS_Store": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1804-p8WqLLHTANN1HNsbHIENqQkpa0w\"",
    "mtime": "2023-09-27T08:11:14.763Z",
    "size": 6148,
    "path": "../public/.DS_Store"
  },
  "/android-chrome-192x192.png": {
    "type": "image/png",
    "etag": "\"10987-8wo0Z1hkExY/j2uzsKcQqrTY/f8\"",
    "mtime": "2023-09-27T08:11:14.762Z",
    "size": 67975,
    "path": "../public/android-chrome-192x192.png"
  },
  "/android-chrome-512x512.png": {
    "type": "image/png",
    "etag": "\"56aed-P/Mcmqb305stbOI+tfaUQOR57cc\"",
    "mtime": "2023-09-27T08:11:14.762Z",
    "size": 355053,
    "path": "../public/android-chrome-512x512.png"
  },
  "/apple-touch-icon.png": {
    "type": "image/png",
    "etag": "\"ee25-9hmH/sqQamzE/peksJUcsypv7JQ\"",
    "mtime": "2023-09-27T08:11:14.761Z",
    "size": 60965,
    "path": "../public/apple-touch-icon.png"
  },
  "/favicon-16x16.png": {
    "type": "image/png",
    "etag": "\"377-Zb/wUnsVpfGoAoemOEtEriZ00Q0\"",
    "mtime": "2023-09-27T08:11:14.761Z",
    "size": 887,
    "path": "../public/favicon-16x16.png"
  },
  "/favicon-32x32.png": {
    "type": "image/png",
    "etag": "\"b28-9Ud74XFxkuNPINRS2ekpKGOSsEs\"",
    "mtime": "2023-09-27T08:11:14.760Z",
    "size": 2856,
    "path": "../public/favicon-32x32.png"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"3c2e-9bKEDaDHS9MT0Ce+28w1+N+8V0w\"",
    "mtime": "2023-09-27T08:11:14.760Z",
    "size": 15406,
    "path": "../public/favicon.ico"
  },
  "/preview.png": {
    "type": "image/png",
    "etag": "\"78b8c-1x8hOLad927reV8ha1sD0xKChbs\"",
    "mtime": "2023-09-27T08:11:14.760Z",
    "size": 494476,
    "path": "../public/preview.png"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"4e-Jvh8dKRVX15Y8SX3s4k9W2MIC9s\"",
    "mtime": "2023-09-27T08:11:14.759Z",
    "size": 78,
    "path": "../public/robots.txt"
  },
  "/site.webmanifest": {
    "type": "application/manifest+json",
    "etag": "\"1be-tXf8M8+JrTct2CxlTC1yCE8JDj0\"",
    "mtime": "2023-09-27T08:11:14.758Z",
    "size": 446,
    "path": "../public/site.webmanifest"
  },
  "/sitemap-alexis.xml": {
    "type": "application/xml",
    "etag": "\"e3-Loh8B/E+fmwIOW7vkZ48DjWjlOE\"",
    "mtime": "2023-09-27T08:11:14.758Z",
    "size": 227,
    "path": "../public/sitemap-alexis.xml"
  },
  "/_nuxt/AirflowLogo.c9c8f564.png": {
    "type": "image/png",
    "etag": "\"135c3-J5rZls8vbGLG7XQ23Wp1p5Jo4I0\"",
    "mtime": "2023-09-27T08:11:14.757Z",
    "size": 79299,
    "path": "../public/_nuxt/AirflowLogo.c9c8f564.png"
  },
  "/_nuxt/InfluxDB-Logo.da9eb05a.svg": {
    "type": "image/svg+xml",
    "etag": "\"10de-hDSqXe5CIKOFBJIM3EcoQGMIDQc\"",
    "mtime": "2023-09-27T08:11:14.757Z",
    "size": 4318,
    "path": "../public/_nuxt/InfluxDB-Logo.da9eb05a.svg"
  },
  "/_nuxt/MongoDB-Logo.3f6d4305.svg": {
    "type": "image/svg+xml",
    "etag": "\"29db-C1Qt9+kV1iufjfhXKBWiCgp0CNs\"",
    "mtime": "2023-09-27T08:11:14.756Z",
    "size": 10715,
    "path": "../public/_nuxt/MongoDB-Logo.3f6d4305.svg"
  },
  "/_nuxt/Neo4j-logo.4aa5a273.png": {
    "type": "image/png",
    "etag": "\"9006-wkSfydiUAsYx317/XlKY+WpLzxY\"",
    "mtime": "2023-09-27T08:11:14.756Z",
    "size": 36870,
    "path": "../public/_nuxt/Neo4j-logo.4aa5a273.png"
  },
  "/_nuxt/alexis.6024ce60.png": {
    "type": "image/png",
    "etag": "\"114002-NyglrOv4Wg7yOODNK1eYkMioiPY\"",
    "mtime": "2023-09-27T08:11:14.755Z",
    "size": 1130498,
    "path": "../public/_nuxt/alexis.6024ce60.png"
  },
  "/_nuxt/apache-logo.0542e495.svg": {
    "type": "image/svg+xml",
    "etag": "\"8922-pcrOr3jYBZ1CHotGB/CfoTNnmr0\"",
    "mtime": "2023-09-27T08:11:14.754Z",
    "size": 35106,
    "path": "../public/_nuxt/apache-logo.0542e495.svg"
  },
  "/_nuxt/cassandra_logo.a38ac4b8.svg": {
    "type": "image/svg+xml",
    "etag": "\"67cd-nwvtkJJPahvzlCjHuEY4IGYQp3U\"",
    "mtime": "2023-09-27T08:11:14.753Z",
    "size": 26573,
    "path": "../public/_nuxt/cassandra_logo.a38ac4b8.svg"
  },
  "/_nuxt/cranfield_logo1.855c76ae.png": {
    "type": "image/png",
    "etag": "\"e2c4-Iu33mMcBnUV5x2bpw+X7wy87TzY\"",
    "mtime": "2023-09-27T08:11:14.753Z",
    "size": 58052,
    "path": "../public/_nuxt/cranfield_logo1.855c76ae.png"
  },
  "/_nuxt/cranfield_logo2.a494e9ce.png": {
    "type": "image/png",
    "etag": "\"7ad6-yMt88UJaG2908j1FQRfzaZ5dDRY\"",
    "mtime": "2023-09-27T08:11:14.753Z",
    "size": 31446,
    "path": "../public/_nuxt/cranfield_logo2.a494e9ce.png"
  },
  "/_nuxt/cs.dcc4aead.png": {
    "type": "image/png",
    "etag": "\"7fea-pRR3+0kUGpPKWIjLTCE5/7Wqy7c\"",
    "mtime": "2023-09-27T08:11:14.752Z",
    "size": 32746,
    "path": "../public/_nuxt/cs.dcc4aead.png"
  },
  "/_nuxt/cvut.fa22fe0d.png": {
    "type": "image/png",
    "etag": "\"4cbd9-Yv3tX2tGg1os1NTLu4ZQ9XN/vlE\"",
    "mtime": "2023-09-27T08:11:14.752Z",
    "size": 314329,
    "path": "../public/_nuxt/cvut.fa22fe0d.png"
  },
  "/_nuxt/docker-logo.40bb943f.png": {
    "type": "image/png",
    "etag": "\"121ea-98OI7nC3B52oZB00EVX+rS4R1kI\"",
    "mtime": "2023-09-27T08:11:14.751Z",
    "size": 74218,
    "path": "../public/_nuxt/docker-logo.40bb943f.png"
  },
  "/_nuxt/elastic-logo.728d2908.png": {
    "type": "image/png",
    "etag": "\"1007c-GjDex/qkChHdzSZXg/KehJ8SFmc\"",
    "mtime": "2023-09-27T08:11:14.751Z",
    "size": 65660,
    "path": "../public/_nuxt/elastic-logo.728d2908.png"
  },
  "/_nuxt/entry.58e4425e.js": {
    "type": "application/javascript",
    "etag": "\"10f242-fi2xYLhWUzRDUgZvbCmJp/GT+3E\"",
    "mtime": "2023-09-27T08:11:14.750Z",
    "size": 1110594,
    "path": "../public/_nuxt/entry.58e4425e.js"
  },
  "/_nuxt/entry.ca5336b5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3159-d3Y4bfMKRa5M9PmXl16Jh45ZGoo\"",
    "mtime": "2023-09-27T08:11:14.749Z",
    "size": 12633,
    "path": "../public/_nuxt/entry.ca5336b5.css"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-09-27T08:11:14.749Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.32395125.js": {
    "type": "application/javascript",
    "etag": "\"8a8-zETuE385pksCLkNkkMtntCk2Ki0\"",
    "mtime": "2023-09-27T08:11:14.748Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.32395125.js"
  },
  "/_nuxt/error-500.3379da97.js": {
    "type": "application/javascript",
    "etag": "\"756-WblpmWzgzwXOGNvPn4X6d7cV6kM\"",
    "mtime": "2023-09-27T08:11:14.748Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.3379da97.js"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-09-27T08:11:14.748Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-component.a40fc3f1.js": {
    "type": "application/javascript",
    "etag": "\"475-7Gm/v7T5jERzEWZ5XZHciG/Np64\"",
    "mtime": "2023-09-27T08:11:14.747Z",
    "size": 1141,
    "path": "../public/_nuxt/error-component.a40fc3f1.js"
  },
  "/_nuxt/ethersjs-logo.5133ecdd.png": {
    "type": "image/png",
    "etag": "\"24b66-X4Cm7k39VuUzRtrIZTkfpsEqrkM\"",
    "mtime": "2023-09-27T08:11:14.747Z",
    "size": 150374,
    "path": "../public/_nuxt/ethersjs-logo.5133ecdd.png"
  },
  "/_nuxt/foundry-logo.ec7e7d01.png": {
    "type": "image/png",
    "etag": "\"389b-jy+u10WeyO2Ye0EYgMx/dRO+QfA\"",
    "mtime": "2023-09-27T08:11:14.747Z",
    "size": 14491,
    "path": "../public/_nuxt/foundry-logo.ec7e7d01.png"
  },
  "/_nuxt/garage.7301a702.png": {
    "type": "image/png",
    "etag": "\"18f68-dCAsW3n58Fcvtuh30dpOJ2313fM\"",
    "mtime": "2023-09-27T08:11:14.746Z",
    "size": 102248,
    "path": "../public/_nuxt/garage.7301a702.png"
  },
  "/_nuxt/hardhat-logo.e0de0332.png": {
    "type": "image/png",
    "etag": "\"e778-FWF7nI/yRtjE7qgp7JvfMdsHIoI\"",
    "mtime": "2023-09-27T08:11:14.746Z",
    "size": 59256,
    "path": "../public/_nuxt/hardhat-logo.e0de0332.png"
  },
  "/_nuxt/isep.7df8674c.png": {
    "type": "image/png",
    "etag": "\"e522-1aFUdJtf1lqUGkbVmaHlP7mCjVA\"",
    "mtime": "2023-09-27T08:11:14.746Z",
    "size": 58658,
    "path": "../public/_nuxt/isep.7df8674c.png"
  },
  "/_nuxt/kafka-logo.7a7ceede.png": {
    "type": "image/png",
    "etag": "\"b9c4-aaRn3RAZrlKP3tsi6tvlEpZptFw\"",
    "mtime": "2023-09-27T08:11:14.745Z",
    "size": 47556,
    "path": "../public/_nuxt/kafka-logo.7a7ceede.png"
  },
  "/_nuxt/nest-logo.eeb8abcf.png": {
    "type": "image/png",
    "etag": "\"278b-jHCuUvVDwtz56aCs0WQ9/1D3+tc\"",
    "mtime": "2023-09-27T08:11:14.745Z",
    "size": 10123,
    "path": "../public/_nuxt/nest-logo.eeb8abcf.png"
  },
  "/_nuxt/nuxtjs-logo.4b9c19f0.png": {
    "type": "image/png",
    "etag": "\"2204b-3Q6RO+mLtHd50qRrkCaSW9LQWec\"",
    "mtime": "2023-09-27T08:11:14.745Z",
    "size": 139339,
    "path": "../public/_nuxt/nuxtjs-logo.4b9c19f0.png"
  },
  "/_nuxt/react-logo.19291084.png": {
    "type": "image/png",
    "etag": "\"2e903-FroyPvOih7RDwthiLSjvWpex7EE\"",
    "mtime": "2023-09-27T08:11:14.744Z",
    "size": 190723,
    "path": "../public/_nuxt/react-logo.19291084.png"
  },
  "/_nuxt/remix-logo.9631d7c4.png": {
    "type": "image/png",
    "etag": "\"2494-FI2TMjx2IkXyGka9NerFlTGcF28\"",
    "mtime": "2023-09-27T08:11:14.743Z",
    "size": 9364,
    "path": "../public/_nuxt/remix-logo.9631d7c4.png"
  },
  "/_nuxt/sleepn.918acadf.png": {
    "type": "image/png",
    "etag": "\"1089-Z1bdkPbVbwd84Y/qe5GsN5QOz7o\"",
    "mtime": "2023-09-27T08:11:14.743Z",
    "size": 4233,
    "path": "../public/_nuxt/sleepn.918acadf.png"
  },
  "/_nuxt/solidity-logo.b65ee12b.png": {
    "type": "image/png",
    "etag": "\"a0de-gsGBmSMGNXqDftl3V4xIP/KUk7M\"",
    "mtime": "2023-09-27T08:11:14.743Z",
    "size": 41182,
    "path": "../public/_nuxt/solidity-logo.b65ee12b.png"
  },
  "/_nuxt/spark-logo.e458d725.svg": {
    "type": "image/svg+xml",
    "etag": "\"1401-UORZUWSr3D7IHPC2JiGoZFw+mvw\"",
    "mtime": "2023-09-27T08:11:14.742Z",
    "size": 5121,
    "path": "../public/_nuxt/spark-logo.e458d725.svg"
  },
  "/_nuxt/typescript-logo.57dfde8f.svg": {
    "type": "image/svg+xml",
    "etag": "\"645-JQFePLCXhNmaopOascljeJj3zJY\"",
    "mtime": "2023-09-27T08:11:14.742Z",
    "size": 1605,
    "path": "../public/_nuxt/typescript-logo.57dfde8f.svg"
  },
  "/_nuxt/vs-logo.6baf5c58.png": {
    "type": "image/png",
    "etag": "\"349c-nbc6BMUoOVbLKona5nYLKaF1yPo\"",
    "mtime": "2023-09-27T08:11:14.742Z",
    "size": 13468,
    "path": "../public/_nuxt/vs-logo.6baf5c58.png"
  },
  "/_nuxt/web3js-logo.a494d673.png": {
    "type": "image/png",
    "etag": "\"26888-l0kSFW7cJEX6ezudcOqv44185U4\"",
    "mtime": "2023-09-27T08:11:14.741Z",
    "size": 157832,
    "path": "../public/_nuxt/web3js-logo.a494d673.png"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = [];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  const encodingHeader = String(event.req.headers["accept-encoding"] || "");
  const encodings = encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort().concat([""]);
  if (encodings.length > 1) {
    event.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end();
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end();
      return;
    }
  }
  if (asset.type && !event.res.getHeader("Content-Type")) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.getHeader("ETag")) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.getHeader("Last-Modified")) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  if (asset.encoding && !event.res.getHeader("Content-Encoding")) {
    event.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size && !event.res.getHeader("Content-Length")) {
    event.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _lazy_2FeqHb = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_2FeqHb, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_2FeqHb, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(h.route.replace(/:\w+|\*\*/g, "_"));
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
