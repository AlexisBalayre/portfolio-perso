import { version, useSSRContext, defineComponent, getCurrentInstance, computed, ref, h, resolveComponent, reactive, mergeProps, createApp, toRef, isRef, toRefs, defineAsyncComponent, provide, onErrorCaptured, unref, onServerPrefetch, inject } from 'vue';
import { $fetch as $fetch$1 } from 'ofetch';
import { createHooks } from 'hookable';
import { getContext } from 'unctx';
import { hasProtocol, isEqual, parseURL, joinURL, stringifyParsedURL, stringifyQuery, parseQuery } from 'ufo';
import { createError as createError$1, sendRedirect } from 'h3';
import { useHead as useHead$1, createHead as createHead$1 } from '@unhead/vue';
import { renderDOMHead, debouncedRenderDOMHead } from '@unhead/dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderSuspense, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { a as useRuntimeConfig$1 } from '../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'ohash';
import 'unstorage';
import 'defu';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';

const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const nuxtAppCtx = getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      var _a;
      if (prop === "public") {
        return target.public;
      }
      return (_a = target[prop]) != null ? _a : target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return null;
    }
    if (plugin.length > 1) {
      return (nuxtApp) => plugin(nuxtApp, nuxtApp.provide);
    }
    return plugin;
  }).filter(Boolean);
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const nuxtAppInstance = nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    const vm = getCurrentInstance();
    if (!vm) {
      throw new Error("nuxt instance unavailable");
    }
    return vm.appContext.app.$nuxt;
  }
  return nuxtAppInstance;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = useNuxtApp();
    nuxtApp.callHook("app:error", err);
    const error = useError();
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
const getDefault = () => null;
function useAsyncData(...args) {
  var _a, _b, _c, _d, _e, _f, _g;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, handler, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof handler !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  options.server = (_a = options.server) != null ? _a : true;
  options.default = (_b = options.default) != null ? _b : getDefault;
  options.lazy = (_c = options.lazy) != null ? _c : false;
  options.immediate = (_d = options.immediate) != null ? _d : true;
  const nuxt = useNuxtApp();
  const getCachedData = () => nuxt.isHydrating ? nuxt.payload.data[key] : nuxt.static.data[key];
  const hasCachedData = () => getCachedData() !== void 0;
  if (!nuxt._asyncData[key]) {
    nuxt._asyncData[key] = {
      data: ref((_g = (_f = getCachedData()) != null ? _f : (_e = options.default) == null ? void 0 : _e.call(options)) != null ? _g : null),
      pending: ref(!hasCachedData()),
      error: ref(nuxt.payload._errors[key] ? createError(nuxt.payload._errors[key]) : null)
    };
  }
  const asyncData = { ...nuxt._asyncData[key] };
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    if (nuxt._asyncDataPromises[key]) {
      if (opts.dedupe === false) {
        return nuxt._asyncDataPromises[key];
      }
      nuxt._asyncDataPromises[key].cancelled = true;
    }
    if (opts._initial && hasCachedData()) {
      return getCachedData();
    }
    asyncData.pending.value = true;
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler(nuxt));
        } catch (err) {
          reject(err);
        }
      }
    ).then((result) => {
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      if (options.transform) {
        result = options.transform(result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      asyncData.data.value = result;
      asyncData.error.value = null;
    }).catch((error) => {
      var _a2, _b2;
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      asyncData.error.value = error;
      asyncData.data.value = unref((_b2 = (_a2 = options.default) == null ? void 0 : _a2.call(options)) != null ? _b2 : null);
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      nuxt.payload.data[key] = asyncData.data.value;
      if (asyncData.error.value) {
        nuxt.payload._errors[key] = createError(asyncData.error.value);
      }
      delete nuxt._asyncDataPromises[key];
    });
    nuxt._asyncDataPromises[key] = promise;
    return nuxt._asyncDataPromises[key];
  };
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxt.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    onServerPrefetch(() => promise);
  }
  const asyncDataPromise = Promise.resolve(nuxt._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = "$s" + _key;
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (getCurrentInstance()) {
    return inject("_route", useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : to.path || "/";
  const isExternal = hasProtocol(toPath, true);
  if (isExternal && !(options == null ? void 0 : options.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `nagivateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      const redirectLocation = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, (options == null ? void 0 : options.redirectCode) || 302));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
function useHead(input, options) {
  return useNuxtApp()._useHead(input, options);
}
const NuxtComponentIndicator = "__nuxt_component";
async function runLegacyAsyncData(res, fn) {
  const nuxt = useNuxtApp();
  const route = useRoute();
  const vm = getCurrentInstance();
  const { fetchKey } = vm.proxy.$options;
  const key = typeof fetchKey === "function" ? fetchKey(() => "") : fetchKey || route.fullPath;
  const { data } = await useAsyncData(`options:asyncdata:${key}`, () => fn(nuxt));
  if (data.value && typeof data.value === "object") {
    Object.assign(await res, toRefs(reactive(data.value)));
  }
}
const defineNuxtComponent = function defineNuxtComponent2(options) {
  const { setup } = options;
  if (!setup && !options.asyncData && !options.head) {
    return {
      [NuxtComponentIndicator]: true,
      ...options
    };
  }
  return {
    [NuxtComponentIndicator]: true,
    ...options,
    setup(props, ctx) {
      const res = (setup == null ? void 0 : setup(props, ctx)) || {};
      const promises = [];
      if (options.asyncData) {
        promises.push(runLegacyAsyncData(res, options.asyncData));
      }
      if (options.head) {
        const nuxtApp = useNuxtApp();
        useHead(typeof options.head === "function" ? () => options.head(nuxtApp) : options.head);
      }
      return Promise.resolve(res).then(() => Promise.all(promises)).then(() => res).finally(() => {
        promises.length = 0;
      });
    }
  };
};
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  return defineComponent({
    name: componentName,
    props: {
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = computed(() => {
        return props.to || props.href || "";
      });
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, true);
      });
      const prefetched = ref(false);
      const el = void 0;
      return () => {
        var _a, _b, _c;
        if (!isExternal.value) {
          return h(
            resolveComponent("RouterLink"),
            {
              ref: void 0,
              to: to.value,
              ...prefetched.value && !props.custom ? { class: props.prefetchedClass || options.prefetchedClass } : {},
              activeClass: props.activeClass || options.activeClass,
              exactActiveClass: props.exactActiveClass || options.exactActiveClass,
              replace: props.replace,
              ariaCurrentValue: props.ariaCurrentValue,
              custom: props.custom
            },
            slots.default
          );
        }
        const href = typeof to.value === "object" ? (_b = (_a = router.resolve(to.value)) == null ? void 0 : _a.href) != null ? _b : null : to.value || null;
        const target = props.target || null;
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        const navigate = () => navigateTo(href, { replace: props.replace });
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href,
            navigate,
            route: router.resolve(href),
            rel,
            target,
            isExternal: isExternal.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el, href, rel, target }, (_c = slots.default) == null ? void 0 : _c.call(slots));
      };
    }
  });
}
const __nuxt_component_0 = defineNuxtLink({ componentName: "NuxtLink" });
function isObject(value) {
  return value !== null && typeof value === "object";
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isObject(value) && isObject(object[key])) {
      object[key] = _defu(value, object[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => arguments_.reduce((p, c) => _defu(p, c, "", merger), {});
}
const defuFn = createDefu((object, key, currentValue, _namespace) => {
  if (typeof object[key] !== "undefined" && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});
const inlineConfig = {};
defuFn(inlineConfig);
const components = {};
const _nuxt_components_plugin_mjs_KR1HBZs4kY = defineNuxtPlugin((nuxtApp) => {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
});
function createHead(initHeadObject) {
  const unhead = createHead$1();
  const legacyHead = {
    unhead,
    install(app) {
      if (app.config.globalProperties)
        app.config.globalProperties.$head = unhead;
      app.provide("usehead", unhead);
    },
    resolveTags() {
      return unhead.resolveTags();
    },
    headEntries() {
      return unhead.headEntries();
    },
    headTags() {
      return unhead.resolveTags();
    },
    push(input, options) {
      return unhead.push(input, options);
    },
    addEntry(input, options) {
      return unhead.push(input, options);
    },
    addHeadObjs(input, options) {
      return unhead.push(input, options);
    },
    addReactiveEntry(input, options) {
      const api = useHead$1(input, options);
      if (typeof api !== "undefined")
        return api.dispose;
      return () => {
      };
    },
    removeHeadObjs() {
    },
    updateDOM(document2, force) {
      if (force)
        renderDOMHead(unhead, { document: document2 });
      else
        debouncedRenderDOMHead(unhead, { delayFn: (fn) => setTimeout(() => fn(), 50), document: document2 });
    },
    internalHooks: unhead.hooks,
    hooks: {
      "before:dom": [],
      "resolved:tags": [],
      "resolved:entries": []
    }
  };
  unhead.addHeadObjs = legacyHead.addHeadObjs;
  unhead.updateDOM = legacyHead.updateDOM;
  unhead.hooks.hook("dom:beforeRender", (ctx) => {
    for (const hook of legacyHead.hooks["before:dom"]) {
      if (hook() === false)
        ctx.shouldRender = false;
    }
  });
  if (initHeadObject)
    legacyHead.addHeadObjs(initHeadObject);
  return legacyHead;
}
version.startsWith("2.");
const appHead = { "meta": [{ "charset": "utf-8" }, { "name": "viewport", "content": "width=device-width, initial-scale=1 viewport-fit=cover" }, { "hid": "description", "name": "description", "content": "Data engineer and full stack Web and Blockchain developer specialized in Web3 (Smart Contracts, DApp).", "id": "__meta-description" }, { "name": "format-detection", "content": "telephone=no" }, { "hid": "og:type", "name": "og:type", "content": "website" }, { "hid": "og:site_name", "name": "og:site_name", "content": "Alexis Balayre - Data Engineer | Full Stack Web and Blockchain Developer" }, { "hid": "og:title", "name": "og:title", "content": "Alexis Balayre - Data Engineer | Full Stack Web and Blockchain Developer" }, { "hid": "og:description", "name": "og:description", "content": "Data engineer and full stack Web and Blockchain developer specialized in Web3 (Smart Contracts, DApp).", "id": "__meta-og:description" }, { "hid": "og:image", "name": "og:image", "content": "https://alexis.balayre.com/preview.png" }, { "hid": "twitter:card", "name": "twitter:card", "content": "summary_large_image" }, { "hid": "twitter:site", "name": "twitter:site", "content": "@Belas_Eth" }, { "hid": "twitter:title", "name": "twitter:title", "content": "Alexis Balayre" }, { "hid": "twitter:description", "name": "twitter:description", "content": "Data engineer and full stack Web and Blockchain developer specialized in Web3 (Smart Contracts, DApp).", "id": "__meta-twitter:description" }, { "hid": "twitter:image", "name": "twitter:image", "content": "https://alexis.balayre.com/preview.png" }, { "hid": "keywords", "name": "keywords", "content": "Alexis Balayre, Blockchain, Solidity, Web3, Developer, Full Stack, Ethereum, DApp, Smart Contracts, Data, Data Engineer" }], "link": [{ "rel": "icon", "type": "image/x-icon", "href": "/favicon.ico" }, { "rel": "apple-touch-icon", "sizes": "180x180", "href": "/apple-touch-icon.png" }, { "rel": "icon", "sizes": "32x32", "href": "/favicon-32x32.png" }, { "rel": "icon", "sizes": "16x16", "href": "/favicon-16x16.png" }, { "rel": "manifest", "href": "/site.webmanifest" }, { "rel": "canonical", "href": "https://alexis.balayre.com/" }], "style": [], "script": [{ "src": "https://cdn.jsdelivr.net/npm/alpinejs@3.13.0/dist/cdn.min.js", "defer": true }], "noscript": [], "title": "Alexis Balayre - Data Engineer | Full Stack Web and Blockchain Developer", "htmlAttrs": { "lang": "en" } };
const node_modules_nuxt_dist_head_runtime_lib_vueuse_head_plugin_mjs_D7WGfuP1A0 = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  head.push(appHead);
  nuxtApp.vueApp.use(head);
  nuxtApp._useHead = useHead$1;
  {
    nuxtApp.ssrContext.renderMeta = async () => {
      const { renderSSRHead } = await import('@unhead/ssr');
      const meta = await renderSSRHead(head.unhead);
      return {
        ...meta,
        bodyScriptsPrepend: meta.bodyTagsOpen,
        bodyScripts: meta.bodyTags
      };
    };
  }
});
const globalMiddleware = [];
function getRouteFromPath(fullPath) {
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = parseURL(fullPath.toString());
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    params: {},
    name: void 0,
    matched: [],
    redirectedFrom: void 0,
    meta: {},
    href: fullPath
  };
}
const node_modules_nuxt_dist_app_plugins_router_mjs_PJLmOmdFeM = defineNuxtPlugin((nuxtApp) => {
  const initialURL = nuxtApp.ssrContext.url;
  const routes = [];
  const hooks = {
    "navigate:before": [],
    "resolve:before": [],
    "navigate:after": [],
    error: []
  };
  const registerHook = (hook, guard) => {
    hooks[hook].push(guard);
    return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
  };
  useRuntimeConfig().app.baseURL;
  const route = reactive(getRouteFromPath(initialURL));
  async function handleNavigation(url, replace) {
    try {
      const to = getRouteFromPath(url);
      for (const middleware of hooks["navigate:before"]) {
        const result = await middleware(to, route);
        if (result === false || result instanceof Error) {
          return;
        }
        if (result) {
          return handleNavigation(result, true);
        }
      }
      for (const handler of hooks["resolve:before"]) {
        await handler(to, route);
      }
      Object.assign(route, to);
      if (false)
        ;
      for (const middleware of hooks["navigate:after"]) {
        await middleware(to, route);
      }
    } catch (err) {
      for (const handler of hooks.error) {
        await handler(err);
      }
    }
  }
  const router = {
    currentRoute: route,
    isReady: () => Promise.resolve(),
    options: {},
    install: () => Promise.resolve(),
    push: (url) => handleNavigation(url),
    replace: (url) => handleNavigation(url),
    back: () => window.history.go(-1),
    go: (delta) => window.history.go(delta),
    forward: () => window.history.go(1),
    beforeResolve: (guard) => registerHook("resolve:before", guard),
    beforeEach: (guard) => registerHook("navigate:before", guard),
    afterEach: (guard) => registerHook("navigate:after", guard),
    onError: (handler) => registerHook("error", handler),
    resolve: getRouteFromPath,
    addRoute: (parentName, route2) => {
      routes.push(route2);
    },
    getRoutes: () => routes,
    hasRoute: (name) => routes.some((route2) => route2.name === name),
    removeRoute: (name) => {
      const index = routes.findIndex((route2) => route2.name === name);
      if (index !== -1) {
        routes.splice(index, 1);
      }
    }
  };
  nuxtApp.vueApp.component("RouterLink", {
    functional: true,
    props: {
      to: String,
      custom: Boolean,
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      ariaCurrentValue: String
    },
    setup: (props, { slots }) => {
      const navigate = () => handleNavigation(props.to, props.replace);
      return () => {
        var _a;
        const route2 = router.resolve(props.to);
        return props.custom ? (_a = slots.default) == null ? void 0 : _a.call(slots, { href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
          e.preventDefault();
          return navigate();
        } }, slots);
      };
    }
  });
  nuxtApp._route = route;
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  const initialLayout = useState("_layout");
  nuxtApp.hooks.hookOnce("app:created", async () => {
    router.beforeEach(async (to, from) => {
      var _a;
      to.meta = reactive(to.meta || {});
      if (nuxtApp.isHydrating) {
        to.meta.layout = (_a = initialLayout.value) != null ? _a : to.meta.layout;
      }
      nuxtApp._processingMiddleware = true;
      const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
      for (const middleware of middlewareEntries) {
        const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
        {
          if (result === false || result instanceof Error) {
            const error = result || createError$1({
              statusCode: 404,
              statusMessage: `Page Not Found: ${initialURL}`
            });
            return callWithNuxt(nuxtApp, showError, [error]);
          }
        }
        if (result || result === false) {
          return result;
        }
      }
    });
    router.afterEach(() => {
      delete nuxtApp._processingMiddleware;
    });
    await router.replace(initialURL);
    if (!isEqual(route.fullPath, initialURL)) {
      await callWithNuxt(nuxtApp, navigateTo, [route.fullPath]);
    }
  });
  return {
    provide: {
      route,
      router
    }
  };
});
const plugins_fontawesome_ts_cn2c4tOOHz = defineNuxtPlugin((nuxtApp) => {
  library.add(fas);
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);
});
const _plugins = [
  _nuxt_components_plugin_mjs_KR1HBZs4kY,
  node_modules_nuxt_dist_head_runtime_lib_vueuse_head_plugin_mjs_D7WGfuP1A0,
  node_modules_nuxt_dist_app_plugins_router_mjs_PJLmOmdFeM,
  plugins_fontawesome_ts_cn2c4tOOHz
];
const _imports_1 = "" + globalThis.__buildAssetsURL("AirflowLogo.c9c8f564.png");
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_1
}, Symbol.toStringTag, { value: "Module" }));
const _imports_8 = "" + globalThis.__buildAssetsURL("Neo4j-logo.4aa5a273.png");
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_8
}, Symbol.toStringTag, { value: "Module" }));
const _imports_0 = "" + globalThis.__buildAssetsURL("alexis.6024ce60.png");
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_0
}, Symbol.toStringTag, { value: "Module" }));
const cranfield_logo1 = "" + globalThis.__buildAssetsURL("cranfield_logo1.855c76ae.png");
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cranfield_logo1
}, Symbol.toStringTag, { value: "Module" }));
const cranfield_logo2 = "" + globalThis.__buildAssetsURL("cranfield_logo2.a494e9ce.png");
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cranfield_logo2
}, Symbol.toStringTag, { value: "Module" }));
const cs = "" + globalThis.__buildAssetsURL("cs.dcc4aead.png");
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cs
}, Symbol.toStringTag, { value: "Module" }));
const cvut = "" + globalThis.__buildAssetsURL("cvut.fa22fe0d.png");
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cvut
}, Symbol.toStringTag, { value: "Module" }));
const _imports_10 = "" + globalThis.__buildAssetsURL("docker-logo.40bb943f.png");
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_10
}, Symbol.toStringTag, { value: "Module" }));
const _imports_4 = "" + globalThis.__buildAssetsURL("elastic-logo.728d2908.png");
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_4
}, Symbol.toStringTag, { value: "Module" }));
const _imports_17 = "" + globalThis.__buildAssetsURL("ethersjs-logo.5133ecdd.png");
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_17
}, Symbol.toStringTag, { value: "Module" }));
const _imports_16 = "" + globalThis.__buildAssetsURL("foundry-logo.ec7e7d01.png");
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_16
}, Symbol.toStringTag, { value: "Module" }));
const garage = "" + globalThis.__buildAssetsURL("garage.7301a702.png");
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: garage
}, Symbol.toStringTag, { value: "Module" }));
const _imports_15 = "" + globalThis.__buildAssetsURL("hardhat-logo.e0de0332.png");
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_15
}, Symbol.toStringTag, { value: "Module" }));
const isep = "" + globalThis.__buildAssetsURL("isep.7df8674c.png");
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: isep
}, Symbol.toStringTag, { value: "Module" }));
const _imports_6 = "" + globalThis.__buildAssetsURL("kafka-logo.7a7ceede.png");
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_6
}, Symbol.toStringTag, { value: "Module" }));
const _imports_19 = "" + globalThis.__buildAssetsURL("nest-logo.eeb8abcf.png");
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_19
}, Symbol.toStringTag, { value: "Module" }));
const _imports_20 = "" + globalThis.__buildAssetsURL("nuxtjs-logo.4b9c19f0.png");
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_20
}, Symbol.toStringTag, { value: "Module" }));
const _imports_21 = "" + globalThis.__buildAssetsURL("react-logo.19291084.png");
const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_21
}, Symbol.toStringTag, { value: "Module" }));
const _imports_14 = "" + globalThis.__buildAssetsURL("remix-logo.9631d7c4.png");
const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_14
}, Symbol.toStringTag, { value: "Module" }));
const sleepn = "" + globalThis.__buildAssetsURL("sleepn.918acadf.png");
const __vite_glob_0_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: sleepn
}, Symbol.toStringTag, { value: "Module" }));
const _imports_13 = "" + globalThis.__buildAssetsURL("solidity-logo.b65ee12b.png");
const __vite_glob_0_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_13
}, Symbol.toStringTag, { value: "Module" }));
const _imports_11 = "" + globalThis.__buildAssetsURL("vs-logo.6baf5c58.png");
const __vite_glob_0_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_11
}, Symbol.toStringTag, { value: "Module" }));
const _imports_18 = "" + globalThis.__buildAssetsURL("web3js-logo.a494d673.png");
const __vite_glob_0_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _imports_18
}, Symbol.toStringTag, { value: "Module" }));
const __default__ = {
  name: "Timeline",
  props: {
    items: {
      type: Array,
      required: true
    }
  }
};
const _sfc_main$6 = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    const images = /* @__PURE__ */ Object.assign({ "../assets/img/AirflowLogo.png": __vite_glob_0_0, "../assets/img/Neo4j-logo.png": __vite_glob_0_1, "../assets/img/alexis.png": __vite_glob_0_2, "../assets/img/cranfield_logo1.png": __vite_glob_0_3, "../assets/img/cranfield_logo2.png": __vite_glob_0_4, "../assets/img/cs.png": __vite_glob_0_5, "../assets/img/cvut.png": __vite_glob_0_6, "../assets/img/docker-logo.png": __vite_glob_0_7, "../assets/img/elastic-logo.png": __vite_glob_0_8, "../assets/img/ethersjs-logo.png": __vite_glob_0_9, "../assets/img/foundry-logo.png": __vite_glob_0_10, "../assets/img/garage.png": __vite_glob_0_11, "../assets/img/hardhat-logo.png": __vite_glob_0_12, "../assets/img/isep.png": __vite_glob_0_13, "../assets/img/kafka-logo.png": __vite_glob_0_14, "../assets/img/nest-logo.png": __vite_glob_0_15, "../assets/img/nuxtjs-logo.png": __vite_glob_0_16, "../assets/img/react-logo.png": __vite_glob_0_17, "../assets/img/remix-logo.png": __vite_glob_0_18, "../assets/img/sleepn.png": __vite_glob_0_19, "../assets/img/solidity-logo.png": __vite_glob_0_20, "../assets/img/vs-logo.png": __vite_glob_0_21, "../assets/img/web3js-logo.png": __vite_glob_0_22 });
    const getImagePath = (filename) => {
      var _a;
      const imagePath = `../assets/img/${filename}`;
      return ((_a = images[imagePath]) == null ? void 0 : _a.default) || "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container w-full mt-6" }, _attrs))}><div class="justify-center"><div class="timeline"><ul class="list-none m-0 p-0"><!--[-->`);
      ssrRenderList(__props.items, (item, index) => {
        _push(`<li class="mb-12"><div class="${ssrRenderClass({ "right": index % 2 === 0, "left": index % 2 === 1, "containerBis": true })}"><div class="content bg-indigo-200/10 ing-offset-white ring-offset-1/2 ring-white/20 ring-1"><div class="flex items-center space-x-4"><img${ssrRenderAttr("src", getImagePath(item.logo))} alt="institution logo" class="w-14"><div><h4 class="text-lg md:text-xl font-semibold text-white"><span>${item.title}</span></h4><span class="text-sm font-semibold text-white">${ssrInterpolate(item.period)}</span></div></div><p class="mt-2 text-lg text-white text-left md:text-justify"><span>${item.description}</span></p></div></div></li>`);
      });
      _push(`<!--]--></ul></div></div></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Timeline.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$5 = {
  name: "Skills",
  props: {
    items: {
      type: Array,
      required: true
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "skills mt-6" }, _attrs))}><div class="container mx-auto px-4 rounded-xl lg:grid-cols-3 gap-8 bg-indigo-200/10 ing-offset-white ring-offset-1/2 ring-white/20 ring-1 p-6"><!--[-->`);
  ssrRenderList($props.items, (category) => {
    _push(`<div class="skill-category md:mb-8 mb-6"><h3 class="text-xl font-semibold mb-4 text-white">${ssrInterpolate(category.name)}</h3><div class="grid grid-cols-1 md:grid-cols-2"><!--[-->`);
    ssrRenderList(category.skills, (skill) => {
      _push(`<div class="p-4"><h4 class="text-lg text-white font-semibold mb-2">${ssrInterpolate(skill.name)}</h4><div class="flex items-center"><div class="progress-bar-container bg-[#09162E] w-full h-2 rounded-full overflow-hidden"><div class="h-full bg-blue-500" style="${ssrRenderStyle({ width: skill.percentage + "%" })}"></div></div><span class="text-sm text-white ml-2">${ssrInterpolate(skill.percentage)}%</span></div></div>`);
    });
    _push(`<!--]--></div></div>`);
  });
  _push(`<!--]--></div></section>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Skills.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$4]]);
const _sfc_main$4 = defineComponent({
  components: {
    FontAwesomeIcon
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
});
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_font_awesome_icon = resolveComponent("font-awesome-icon");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "service-card shadow rounded-xl p-6 flex flex-col items-center bg-indigo-200/10 ing-offset-white ring-offset-1/2 ring-white/20 ring-1" }, _attrs))} data-v-b6723657><div class="icon text-4xl mb-4 text-white" data-v-b6723657>`);
  _push(ssrRenderComponent(_component_font_awesome_icon, { icon: _ctx.icon }, null, _parent));
  _push(`</div><h3 class="title text-xl font-semibold mb-4 text-white text-center" data-v-b6723657>${ssrInterpolate(_ctx.title)}</h3><p class="description text-center text-white" data-v-b6723657>${ssrInterpolate(_ctx.description)}</p></div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ServiceCard.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-b6723657"]]);
const _sfc_main$3 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid justify-center content-center justify-items-center rounded-2xl h-2/4 lg:w-1/5 w-3/5 bg-gradient-to-r from-cyan-500/80 to-blue-500/80" }, _attrs))}><p class="lg:p-8 p-6 text-white justify-self-center text-lg lg:text-2xl text-center">Transaction in progress...</p><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="lg:w-20 lg:h-20 h-10 w-10 animate-spin"><path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd"></path></svg></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ModalTxProgress.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "p-4 self-end h-fit content-center w-full" }, _attrs))}><p class="text-sm text-center font-sans text-white"> Copyright \xA9 2023 Alexis Balayre. All Rights Reserved. </p></footer>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);
const _imports_2 = "" + globalThis.__buildAssetsURL("apache-logo.0542e495.svg");
const _imports_3 = "" + globalThis.__buildAssetsURL("cassandra_logo.a38ac4b8.svg");
const _imports_5 = "" + globalThis.__buildAssetsURL("InfluxDB-Logo.da9eb05a.svg");
const _imports_7 = "" + globalThis.__buildAssetsURL("MongoDB-Logo.3f6d4305.svg");
const _imports_9 = "" + globalThis.__buildAssetsURL("spark-logo.e458d725.svg");
const _imports_12 = "" + globalThis.__buildAssetsURL("typescript-logo.57dfde8f.svg");
const _sfc_main$1 = defineNuxtComponent({
  components: {
    Timeline: _sfc_main$6,
    Skills: __nuxt_component_1,
    ServiceCard: __nuxt_component_2
  },
  data: () => ({
    hash: "",
    wallet: "",
    formation: [
      {
        logo: "cranfield_logo2.png",
        title: 'Cranfield University - <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://www.cranfield.ac.uk/courses/taught/computational-intelligence-for-data-analytics" target="_blank">MSc in Computational and Software Techniques in Engineering</a>',
        description: "Cranfield University is a renowned British postgraduate university located in Cranfield, Bedfordshire, England. I am currently specialising in Computational Intelligence for Data Analytics.",
        period: "Sept. 2023 - Sept. 2024"
      },
      {
        logo: "isep.png",
        title: 'ISEP - <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://en.isep.fr/studying-at-isep/isep-engineering-master-degree/" target="_blank">Engineering Master Degree</a>',
        description: "ISEP is a French digital engineering school located in Paris. I am currently specializing in data intelligence.",
        period: "2021 - 2024"
      },
      {
        logo: "cvut.png",
        title: "CVUT - Academic Semester Abroad",
        description: "Academic semester in English at the Czech Technical University in Prague.",
        period: "Feb. 2021 - Jun. 2021"
      },
      {
        logo: "isep.png",
        title: 'ISEP - <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://en.isep.fr/cii/" target="_blank">International Integrated Cycle</a>',
        description: "Preparatory years at the ISEP engineering school in Paris.",
        period: "2019 - 2021"
      }
    ],
    experience: [
      {
        logo: "garage.png",
        title: 'Vice President of the <a class="font-bold">Blockchain Lab</a> at <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://garageisep.com/" target="_blank">Garage ISEP</a>',
        description: "Garage ISEP is the student association of ISEP dedicated to technology (Blockchain, Artificial Intelligence, ...). Organization of workshops and conferences to learn and master Blockchain technologies.",
        period: "Sept. 2022 - Sept. 2023"
      },
      {
        logo: "cs.png",
        title: 'Blockchain Developer at <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://coinshares.com/" target="_blank">CoinShares</a>',
        description: "CoinShares is Europe's largest and oldest crypto asset investment company, managing billions of dollars in assets. Discovery of Decentralized Finance within the DeFi team and realization of missions to build a decentralized asset management tool.",
        period: "Sept. 2022 - Jan. 2023"
      },
      {
        logo: "sleepn.png",
        title: 'Blockchain Developer at <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://github.com/SleepnClub/Sleepn-Contracts" target="_blank">Sleepn</a>',
        description: 'Sleepn is a decentralized sleep tracking application that allows you to earn money by sleeping. Sleepn won 2 prizes at the <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://showcase.ethglobal.com/hackmoney2022/sleepn-27hyu" target="_blank">2022 ETHGlobal HackMoney hackathon</a> : "<a class="text-lg font-bold">Polygon \u2014 Best App</a>" and "<a class="text-lg font-bold">Superfluid \u2014 Best Use With Another Partner</a>".',
        period: "May 2022 - Oct. 2023"
      }
    ],
    skillCategories: [
      {
        name: "Programming Languages",
        skills: [
          {
            name: "JavaScript",
            percentage: 100
          },
          {
            name: "Solidity",
            percentage: 100
          },
          {
            name: "Python",
            percentage: 90
          },
          {
            name: "TypeScript",
            percentage: 90
          },
          {
            name: "Java",
            percentage: 70
          },
          {
            name: "Rust",
            percentage: 50
          }
        ]
      },
      {
        name: "Frontend",
        skills: [
          {
            name: "ReactJS ",
            percentage: 80
          },
          {
            name: "React Native",
            percentage: 80
          },
          {
            name: "TailwindCSS",
            percentage: 80
          },
          {
            name: "VueJS (Framework Nuxt)",
            percentage: 75
          },
          {
            name: "HTML / CSS",
            percentage: 70
          }
        ]
      },
      {
        name: "Backend",
        skills: [
          {
            name: "NodeJS (Framework NestJS)",
            percentage: 90
          }
        ]
      },
      {
        name: "Blockchain",
        skills: [
          {
            name: "Hardhat",
            percentage: 100
          },
          {
            name: "Foundry",
            percentage: 100
          },
          {
            name: "Remix",
            percentage: 100
          },
          {
            name: "Chainlink",
            percentage: 100
          },
          {
            name: "Transaction tracking (Etherscan, Polygonscan, ...)",
            percentage: 100
          },
          {
            name: "The Graph",
            percentage: 90
          },
          {
            name: "Cosmos SDK",
            percentage: 80
          }
        ]
      },
      {
        name: "Databases",
        skills: [
          {
            name: "MongoDB",
            percentage: 100
          },
          {
            name: "MySQL",
            percentage: 100
          },
          {
            name: "PostgreSQL",
            percentage: 90
          },
          {
            name: "Cassandra",
            percentage: 90
          },
          {
            name: "InfluxDB",
            percentage: 80
          },
          {
            name: "Neo4j",
            percentage: 70
          }
        ]
      },
      {
        name: "Data Engineering Tools",
        skills: [
          {
            name: "Apache Airflow",
            percentage: 90
          },
          {
            name: "Elasticsearch",
            percentage: 90
          },
          {
            name: "Kibana",
            percentage: 90
          },
          {
            name: "Apache Spark",
            percentage: 80
          },
          {
            name: "Apache Kafka",
            percentage: 70
          }
        ]
      },
      {
        name: "Hosting Services",
        skills: [
          {
            name: "Digital Ocean",
            percentage: 90
          },
          {
            name: "Cloudflare",
            percentage: 90
          },
          {
            name: "AWS",
            percentage: 70
          }
        ]
      },
      {
        name: "Server Management",
        skills: [
          {
            name: "Docker",
            percentage: 90
          }
        ]
      }
    ],
    services: [
      {
        id: 0,
        title: "Data Analytics & Visualization",
        description: "Leverage the power of data to make informed decisions and gain a competitive edge with my data analytics and visualization services.",
        icon: "chart-bar"
      },
      {
        id: 1,
        title: "Data Science & Machine Learning",
        description: "Harness the power of data science and machine learning to gain valuable insights and make informed decisions.",
        icon: "brain"
      },
      {
        id: 2,
        title: "Pipeline Development & Automation",
        description: "Setting up data pipelines and automating data processing tasks to ensure the seamless flow of data across your organization.",
        icon: "code"
      },
      {
        id: 3,
        title: "Advanced Smart Contract Expertise",
        description: "Delve into a comprehensive suite of services, including development, deployment, security testing, and gas optimization for high-performance smart contracts.",
        icon: "file-contract"
      },
      {
        id: 4,
        title: "Customized NFT & Cryptocurrency Offerings",
        description: "Benefit from meticulously designed NFT collections and personalized cryptocurrencies, tailor-made to suit the unique requirements of each project.",
        icon: "coins"
      },
      {
        id: 5,
        title: "Cutting-Edge DApp, API & Blockchain Solutions",
        description: "Experience seamless integration through the development and implementation of decentralized applications, web/mobile apps, APIs, and sophisticated blockchain transaction tracing capabilities.",
        icon: "cogs"
      }
    ]
  }),
  methods: {
    async mintNFT() {
      document.getElementById("modal").classList.toggle("hidden");
      console.log("Minting NFT for address: " + this.wallet);
      const result = await this.asyncData();
      if (result.result.success == true) {
        console.log("NFT minted successfully");
        console.log("Transaction hash: " + result.result.hash);
        this.hash = result.result.hash;
        document.getElementById("link").href = "https://polygonscan.com/tx/" + this.hash;
        document.getElementById("success").classList.toggle("hidden");
      } else {
        console.log("NFT minting failed");
        document.getElementById("error").classList.toggle("hidden");
      }
      document.getElementById("modal").classList.toggle("hidden");
    },
    async asyncData() {
      return {
        result: await $fetch("https://api.balayre.xyz/contracts/mintNft", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          },
          cache: "no-cache",
          body: JSON.stringify({
            wallet: this.wallet
          })
        })
      };
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Timeline = _sfc_main$6;
  const _component_Skills = __nuxt_component_1;
  const _component_ServiceCard = __nuxt_component_2;
  const _component_ModalTxProgress = __nuxt_component_3;
  const _component_Footer = __nuxt_component_4;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-[#09162E] grid min-w-screen h-full min-h-screen max-w-screen overflow-x-hidden" }, _attrs))}><div class="grid-flow-col grid lg:pb-5 w-screen h-fit md:pt-8 pb-4 md:pl-8 md:pr-8 pt-4 pl-4 pr-4"><h1 class="font-sans lg:text-2xl text-xl text-center text-white font-medium justify-self-start"> Alexis Balayre </h1><div class="justify-self-end flex"><a class="lg:pl-4 lg:pr-4 lg-2 pr-2" href="tel:+33695831470"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-8 h-8"><path fill-rule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clip-rule="evenodd"></path></svg></a><a class="lg:pl-4 lg:pr-4 lg-2 pr-2" href="mailTo:alexis@balayre.xyz"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-8 h-8"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"></path><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"></path></svg></a><a class="lg:pl-4 lg:pr-4 lg-2 pr-2" href="https://github.com/AlexisBal" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" class="w-8 h-8" fill="white"><path fill="white" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg></a><a class="lg:pl-4 lg:pr-4 lg-2 pr-2" href="https://fr.linkedin.com/in/alexis-balayre" target="_blank"><svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="white"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg></a><a class="lg:pl-4" href="https://twitter.com/Belas_Eth" target="_blank"><svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg></a></div></div><div class="ring-offset-white ring-offset-1/2 ring-white/20 ring-1 bg-indigo-200/10 grid p-6 md:pl-8 md:pr-8 mr-8 ml-8 md:ml-20 md:mr-20 mt-5 md:mt-10 md:mt-4 rounded-xl md:w-1/2 justify-self-center md:mt-20 mb-16"><div class="w-1/5 w-1/5 rounded-full justify-self-center"><img class="h-full w-full rounded-full"${ssrRenderAttr("src", _imports_0)} alt="profile-picture"></div><div class="justify-self-center mt-6"><div x-data="{
        text: &#39;&#39;,
        textArray : [&#39;Data Engineer&#39;, &#39;Blockchain Developer&#39;, &#39;Full Stack Developer&#39;],
        textIndex: 0,
        charIndex: 0,
        typeSpeed: 110,
        cursorSpeed: 550,
        pauseEnd: 1500,
        pauseStart: 20,
        direction: &#39;forward&#39;,
    }" x-init="$nextTick(() =&gt; {
        let typingInterval = setInterval(startTyping, $data.typeSpeed);
    
        function startTyping(){
            let current = $data.textArray[ $data.textIndex ];
            
            // check to see if we hit the end of the string
            if($data.charIndex &gt; current.length){
                    $data.direction = &#39;backward&#39;;
                    clearInterval(typingInterval);
                    
                    setTimeout(function(){
                        typingInterval = setInterval(startTyping, $data.typeSpeed);
                    }, $data.pauseEnd);
            }   
                
            $data.text = current.substring(0, $data.charIndex);
            
            if($data.direction == &#39;forward&#39;)
            {
                $data.charIndex += 1;
            } 
            else 
            {
                if($data.charIndex == 0)
                {
                    $data.direction = &#39;forward&#39;;
                    clearInterval(typingInterval);
                    setTimeout(function(){
                        $data.textIndex += 1;
                        if($data.textIndex &gt;= $data.textArray.length)
                        {
                            $data.textIndex = 0;
                        }
                        typingInterval = setInterval(startTyping, $data.typeSpeed);
                    }, $data.pauseStart);
                }
                $data.charIndex -= 1;
            }
        }
                    
        setInterval(function(){
            if($refs.cursor.classList.contains(&#39;hidden&#39;))
            {
                $refs.cursor.classList.remove(&#39;hidden&#39;);
            } 
            else 
            {
                $refs.cursor.classList.add(&#39;hidden&#39;);
            }
        }, $data.cursorSpeed);

    })" class="flex items-center justify-center mx-auto text-center max-w-7xl text-white"><div class="relative flex items-center justify-center h-auto"><p class="text-2xl text-white leading-tight" x-text="text"></p><span class="absolute right-0 w-2 -mr-2 bg-black h-3/4" x-ref="cursor"></span></div></div></div><div class="justify-self-center mt-6"><p class="text-lg text-left md:text-justify self-center text-white"> My name is Alexis Balayre and I am a French <a class="text-lg font-bold">digital engineering</a> student specialising in <a class="text-lg font-bold">Data Intelligence</a>. I am currently doing an <a class="text-lg font-bold">MSc in Computational and Software Techniques in Engineering - Computational Intelligence for Data Analytics</a> at <a class="text-lg font-bold">Cranfield University</a>. <br><br> I am also a <a class="text-lg font-bold">Full Stack Web</a> and<a class="text-lg font-bold"> Blockchain Developer</a> specialized in <a class="text-lg font-bold">Web3</a>. I realize all the missions related to the creation of a <a class="text-lg font-bold">decentralized application (DApp)</a> from <a class="text-lg font-bold">smart contracts</a> to the <a class="text-lg font-bold">user interface</a>. </p></div></div><div class="justify-self-center mr-8 ml-8 md:ml-20 md:mr-20"><h2 class="text-2xl font-bold text-center text-white">Education</h2>`);
  _push(ssrRenderComponent(_component_Timeline, { items: _ctx.formation }, null, _parent));
  _push(`</div><div class="justify-self-center mr-8 ml-8 md:ml-20 md:mr-20 mt-10"><h2 class="text-2xl font-bold text-center text-white">Experience</h2>`);
  _push(ssrRenderComponent(_component_Timeline, { items: _ctx.experience }, null, _parent));
  _push(`</div><div class="justify-self-center mr-8 ml-8 md:ml-20 md:mr-20 mt-10"><h2 class="text-2xl font-bold text-center text-white">Skills</h2>`);
  _push(ssrRenderComponent(_component_Skills, { items: _ctx.skillCategories }, null, _parent));
  _push(`</div><div class="justify-self-center mr-8 ml-8 md:ml-20 md:mr-20 mt-16"><h2 class="text-2xl font-bold text-center text-white">Services</h2><div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6"><!--[-->`);
  ssrRenderList(_ctx.services, (service) => {
    _push(ssrRenderComponent(_component_ServiceCard, {
      key: service.id,
      icon: service.icon,
      title: service.title,
      description: service.description
    }, null, _parent));
  });
  _push(`<!--]--></div></div><div class="ring-offset-white ring-offset-1/2 ring-white/20 ring-1 bg-indigo-200/10 h-fit w-screen max-w-screen p-6 flex overflow-hidden md:mt-16 mt-10"><div class="flex w-screen max-w-screen animate-slidein"><img class="lg:h-10 lg:w-20 w-10 h-5 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_1)} alt="AirflowLogo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_2)} alt="apache-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_3)} alt="cassandra-logo"><img class="lg:h-10 lg:w-20 w-10 h-5 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_4)} alt="elastic-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_5)} alt="influxDB-logo"><img class="lg:h-10 lg:w-20 w-10 h-5 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_6)} alt="kafka-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_7)} alt="mongoDB-logo"><img class="lg:h-15 lg:w-20 w-10 h-5 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_8)} alt="neo4j-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_9)} alt="spark-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_10)} alt="docker-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_11)} alt="vs-code-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_12)} alt="typescript-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_13)} alt="solidity-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-4 self-center"${ssrRenderAttr("src", _imports_14)} alt="remix-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_15)} alt="hardhat-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"${ssrRenderAttr("src", _imports_16)} alt="foundry-logo"><img class="lg:h-20 lg:w-24 w-12 h-10 ml-8 self-center"${ssrRenderAttr("src", _imports_17)} alt="ethersjs-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"${ssrRenderAttr("src", _imports_18)} alt="web3js-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"${ssrRenderAttr("src", _imports_19)} alt="nest-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"${ssrRenderAttr("src", _imports_20)} alt="nuxtjs-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"${ssrRenderAttr("src", _imports_21)} alt="react-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"${ssrRenderAttr("src", _imports_10)} alt="docker-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_11)} alt="vs-code-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_12)} alt="typescript-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_13)} alt="solidity-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-4 self-center"${ssrRenderAttr("src", _imports_14)} alt="remix-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"${ssrRenderAttr("src", _imports_15)} alt="hardhat-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"${ssrRenderAttr("src", _imports_16)} alt="foundry-logo"><img class="lg:h-20 lg:w-24 w-12 h-10 ml-8 self-center"${ssrRenderAttr("src", _imports_17)} alt="ethersjs-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"${ssrRenderAttr("src", _imports_18)} alt="web3js-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"${ssrRenderAttr("src", _imports_19)} alt="nest-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"${ssrRenderAttr("src", _imports_20)} alt="nuxtjs-logo"><img class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"${ssrRenderAttr("src", _imports_21)} alt="react-logo"></div></div><div class="ring-offset-white ring-offset-1/2 ring-white/20 ring-1 bg-indigo-200/10 grid md:mt-20 mt-10 ml-8 mr-8 mb-5 md:mb-10 p-6 md:p-8 lg:w-3/6 h-fit rounded-xl justify-self-center">`);
  _push(ssrRenderComponent(_component_ModalTxProgress, {
    class: "hidden absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4",
    id: "modal"
  }, null, _parent));
  _push(`<h2 class="lg:text-3xl text-2xl font-bold text-center text-white"> Receive a free NFT </h2><p class="text-lg mt-4 font-medium text-left text-white"> Enter your Ethereum wallet address </p><p class="text-lg font-medium text-left text-red-500 hidden" id="error"> An error has occurred, please check your address! </p><p class="text-lg font-medium text-left text-green-500 hidden" id="success"> Successful transaction: See on <a id="link" class="underline decoration-sky-500 font-bold">polygonscan</a></p><input class="mt-2 justify-self-center p-2 rounded-lg md:rounded w-full"${ssrRenderAttr("value", _ctx.wallet)} placeholder="Your Wallet Address"><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-1/2 justify-self-center mt-6"> Mint NFT </button></div>`);
  _push(ssrRenderComponent(_component_Footer, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const ErrorComponent = defineAsyncComponent(() => import('./_nuxt/error-component.a3276c1a.mjs').then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    provide("_route", useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        callWithNuxt(nuxtApp, showError, [err]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);

export { _export_sfc as _, __nuxt_component_0 as a, entry$1 as default, useHead as u };
//# sourceMappingURL=server.mjs.map
