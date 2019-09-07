import { get } from "@mt-ui-core/utils/apiUtils";
import ApiUrls from "~/modules/TestModule/config/api.config";

const Service = {};

Service.getData = async () => {
  const api = ApiUrls.getData();
  const response = await get(api);
  return response;
};

export default Service;
