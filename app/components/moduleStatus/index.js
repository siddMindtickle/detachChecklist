import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

// import Button from "@components/button";
import Icon from "@components/icon";
import Todos from "@containers/todos";
import { getLifecycleStageUrl, isUndefined } from "@utils";
import { LIFECYCLE_STAGES } from "@config/env.config";
import style from "./index.scss";

export default class ModuleStatus extends Component {
  static propTypes = {
    maxScore: PropTypes.number,
    saving: PropTypes.bool,
    stageRoutes: PropTypes.object.isRequired,
    previewOnClick: PropTypes.func,
    baseUrl: PropTypes.string.isRequired,
    moduleId: PropTypes.string.isRequired,
    seriesId: PropTypes.string.isRequired
  };
  static defaultProps = {
    saving: false,
    previewOnClick: () => undefined
  };
  render() {
    const {
      maxScore,
      saving,
      baseUrl,
      // previewOnClick,
      stageRoutes,
      moduleId,
      seriesId
    } = this.props;
    return (
      <div className={classnames(style.previewSection, "floatR")}>
        <span className={classnames({ "icon-tick": !saving }, style.tickIcon, "marginR10")} />
        <span className={classnames(style.italicText, "marginR20")}>
          {saving ? "Saving..." : "Saved"}
        </span>
        {!isUndefined(maxScore) && [
          <span key="maxScoreKey" className={classnames(style.maxScore)}>
            Max Score:
          </span>,
          <span key="maxScoreValue" className={classnames(style.scoreCount, "marginR20")}>
            {maxScore}
          </span>
        ]}
        <Todos
          moduleId={moduleId}
          seriesId={seriesId}
          target={<Icon type="todo" className={classnames(style.infoEdit, "marginR20")} />}
          baseUrl={getLifecycleStageUrl({
            baseUrl,
            routes: stageRoutes,
            stage: LIFECYCLE_STAGES.BUILD
          })}
        />

        {/*<Button type="DefaultSm" onClick={previewOnClick}>*/}
        {/*Preview*/}
        {/*</Button>*/}
      </div>
    );
  }
}
