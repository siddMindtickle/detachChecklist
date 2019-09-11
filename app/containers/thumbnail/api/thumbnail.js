import { get, post } from "@utils/apiUtils";
import ApiUrls from "../config/api.config";
import { THUMB_CATEGORIES, SIZE } from "../config/constants";
const ThumbnailService = {};

export const parseThumbnails = ({ thumbnails }) => {
  return thumbnails.reduce((result, thumb) => {
    if (thumb) {
      result[thumb.id] = {
        thumbId: thumb.id,
        thumbTitle: thumb.title,
        thumbUrl: thumb.processed_path,
        thumbType: thumb.type,
        uploadedAt: thumb.uploadedAt
      };
    }
    return result;
  }, {});
};

ThumbnailService.getThumbnails = async ({ companyId, size = SIZE }) => {
  const urlObj = ApiUrls.getThumbnails({
    companyId,
    query: {
      cropped: THUMB_CATEGORIES.join(","),
      size
    }
  });
  const { library: thumbnails = [] } = await get(urlObj);
  return parseThumbnails({ thumbnails });
};

ThumbnailService.removeThumbnail = async ({ companyId, thumb: { thumbId } }) => {
  const urlObj = ApiUrls.removeThumbnail({
    companyId,
    thumbId
  });
  await get(urlObj);
  return {
    [thumbId]: null
  };
};

ThumbnailService.renameThumbnail = async ({ companyId, thumb = {} }) => {
  const urlObj = ApiUrls.renameThumbnail({
    companyId,
    thumbId: thumb.thumbId
  });
  await post(urlObj, {
    body: {
      thumbName: thumb.thumbTitle
    }
  });
  return {
    [thumb.thumbId]: thumb
  };
};

export default ThumbnailService;
