import React from "react";

import style from "./index.scss";

const Copyright = () => (
  <div className={style.copyRightSection} key="copyRight">
    <span>© MindTickle</span>
    <a
      className={style.privacyPolicyText}
      target="_blank"
      rel="noopener noreferrer"
      href="http://www.mindtickle.com/privacy-policy"
    >
      Privacy policy
    </a>
  </div>
);

export default Copyright;
