import React from "react";
import { intl } from "../../utils";

import style from "./index.scss";

const AttachmentNote = () => (
  <div className={style.attachmentNoteIcon}>
    <span className={style.snapsotNoteIcon}>
      <span className="icon-attachment" />
    </span>
    <span className={style.snapsotNote}>
      {intl.formatMessage({
        id: "SUPPORT_ATTACHMENT_MSG"
      })}
    </span>
  </div>
);

export default AttachmentNote;
