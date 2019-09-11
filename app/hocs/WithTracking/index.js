/*
* MixPanel tracking HOC
* Usage : 

1) const trackedComponent = withTracking({
  page: "Your page if nay",
  contextId: <>
})(YourAtomComponent)

2) const trackedComponent = withTracking()(YourAtomComponent)


<YourAtomComponent eventActions={{
  onClick: {
  event: "Your event name",
  data: "Your event data object"  // can be object or function
  }
}}/>
*/
import React, { Component } from "react";
import PropTypes from "prop-types";

import { getBaseProperties } from "@core/sagas/mixpanel";
import { mixpanelIdentityPath } from "@app/mixpanel/config";

export const mixpanelClient = {
  track: (event, data) => {
    console.log("MIX_PANEL EVENT: ", event, ", DATA: ", data); //eslint-disable-line
  }
};

const withTracking = (injectedProps = {}) => WrappedComponent => {
  const HOC = class HOC extends Component {
    static propTypes = {
      eventActions: PropTypes.object,
      contextId: PropTypes.string
    };

    constructor(props) {
      super(props);
      const { eventActions } = props;
      this.wrappedMethods = this.wrapMethodsForFrameworkEvents(eventActions);
    }

    wrapMethodsForFrameworkEvents = (eventActions = {}) => {
      const wrappedEvents = [];
      for (let e in eventActions) {
        const eventObj = eventActions[e];
        const { event, data: eventData } = eventObj;
        const self = this;
        const originalMethod = this.props[e];
        wrappedEvents[e] = function(...args) {
          const opData = originalMethod.apply(this, args);
          let trackData = eventData;
          const props = {}; // get original props
          const state = {}; // get origin state
          if (typeof eventData === "function") {
            trackData = eventData.apply(this, [opData, props, state, ...args]);
          }
          self.fireTracking(event, trackData);
        };
      }
      return wrappedEvents;
    };

    track = (event, mixpanelData) => {
      if (!process.env.isDev && window.mixpanel) {
        window.mixpanel.track(event, mixpanelData);
      } else {
        mixpanelClient.track(event, mixpanelData);
      }
    };

    static contextTypes = { store: PropTypes.object.isRequired };

    fireTracking = (event, trackData = {}) => {
      const { event: trackEvent, ...rest } = trackData;
      // Override event if event is runtime function of trackData
      const __event = trackEvent || event;

      // Do not track if no event presert
      if (!__event) {
        return;
      }
      const contextId = this.props.contextId || injectedProps.contextId;
      const { trackData: injectedTrackData } = injectedProps;
      const store = this.context.store.getState();
      const globalCommonData = getBaseProperties(mixpanelIdentityPath, store);

      let contextData = {};
      if (contextId) {
        const contextPath =
          (store[contextId.toLowerCase()] && store[contextId.toLowerCase()].mixpanel) || {};
        contextData = getBaseProperties(contextPath, store);
      }

      const mixpanelData = {
        ...globalCommonData,
        ...contextData,
        ...rest,
        ...injectedTrackData
      };
      this.track(__event, mixpanelData);
    };

    render() {
      const { eventActions, contextId, ...rest } = this.props; // eslint-disable-line no-unused-vars
      return <WrappedComponent {...rest} {...this.wrappedMethods} track={this.fireTracking} />;
    }
  };

  return HOC;
};

export default withTracking;
