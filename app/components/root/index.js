import React from "react";
import UserAuthProvider from "mt-ui-core/containers/UserAuthProvider";

import Application from "@components/App";

const Root = () => {
  return (
    <UserAuthProvider>
      <Application />
    </UserAuthProvider>
  );
};

export default Root;
