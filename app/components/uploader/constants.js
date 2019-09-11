export const SUPPORTED_UPLOADER = {
  THUMB: "thumb",
  DOCUMENT: "document"
};

export const UPLOADER_DETAILS = {
  [SUPPORTED_UPLOADER.THUMB]: {
    type: "thumb",
    query: "uploadType=thumb&croppedIn=CHECKLIST_THUMB",
    events: {
      uploaded: "uploaded.module.thumb.image",
      close: "cancel.upload.module.thumb.image"
    }
  },
  [SUPPORTED_UPLOADER.DOCUMENT]: {
    type: "supportingDoc",
    query: "uploadType=supportingDoc",
    events: {
      uploaded: "uploaded.lo.supporting.doc",
      close: "cancel.lo.supporting.doc"
    }
  }
};

export const GET_UPLOADER_URL = type => {
  const query = UPLOADER_DETAILS[type].query;
  if (!query) return;
  return `/new-uploader?${query}`;
};
