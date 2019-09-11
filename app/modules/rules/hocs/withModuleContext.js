import React from "react";

import ModuleContext from "../components/ModuleContext";

export default function(WrappedComponent) {
  return function ComponentWithContext(componentProps) {
    return (
      <ModuleContext.Consumer>
        {props => <WrappedComponent {...componentProps} context={props} />}
      </ModuleContext.Consumer>
    );
  };
}
