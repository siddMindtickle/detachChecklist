import "promise-polyfill/src/polyfill";
const availablePolyfills = [
  {
    test: () => !window.fetch,
    load: async () => {
      let fetch;
      try {
        fetch = await import(/* webpackChunkName: "polyfills/polyfills-fetch" */ "whatwg-fetch");
      } catch (err) {
        throw new Error(err);
      }
      return {
        fetch
      };
    }
  }
];

const loadPolyfills = () => {
  if (availablePolyfills.some(polyfill => polyfill.test())) {
    let polyfillFns = [];

    availablePolyfills.forEach(polyfill => {
      if (polyfill.test()) {
        polyfillFns.push(polyfill.load());
      }
    });

    return Promise.all(polyfillFns);
  } else {
    return Promise.resolve();
  }
};

export default loadPolyfills;
