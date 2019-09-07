import { handleQueryStringForApi } from "@mt-ui-core/utils";

let apiUrls = {
  getData() {
    return {
      url: `/zen`
    };
  }
};

export default handleQueryStringForApi(apiUrls);
