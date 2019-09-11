import React from "react";
import Header from "../components/header";

export const withHeader = Comp => ({ headerProps, props }) => [
  <Header key="header" {...headerProps} />,
  <Comp key="component" {...props} />
];

/*export const withHeader = Comp => ({ headerProps,props }) => [
  <Header key="header" {...headerProps} />,
  //<Comp key="component" {...props} />
];*/
