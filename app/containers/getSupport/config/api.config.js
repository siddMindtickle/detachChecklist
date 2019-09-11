import QueryString from "query-string";

let apiUrls = {
  postFeedback() {
    return {
      url: "/send-feedback",
      mock: "feedback"
    };
  }
};

const getUrl = (url, query) => {
  if (!query) return url;
  return `${url}?${query}`;
};

for (const [key, func] of Object.entries(apiUrls)) {
  apiUrls[key] = (() => {
    return options => {
      if (options && options.query) {
        let urlObj = func(options);
        urlObj.url = getUrl(urlObj.url, QueryString.stringify(options.query));
        return urlObj;
      }
      return func(options);
    };
  })();
}

export default apiUrls;
