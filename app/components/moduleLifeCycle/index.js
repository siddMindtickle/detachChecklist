import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";

import { Defaults, LIFECYCLE_STAGES } from "@config/env.config";
import { getLifecycleStageUrl } from "@utils";
import { haveStageAccess } from "@utils/permissions";

import Icon from "@components/icon";
import Info from "@components/info";

import style from "./index.scss";
import { TOOLTIP } from "./constants";

class Stage extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    url: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    showChanges: PropTypes.bool.isRequired,
    tooltipPlacement: PropTypes.string
  };

  renderLink = () => {
    const { name, url, showChanges } = this.props;

    return (
      <Link
        to={url}
        className={classnames(style.stage, location.pathname.includes(url) ? style.active : "")}
      >
        <span className="floatL">{name}</span>
        {showChanges && <span className={style.notification}>!</span>}
      </Link>
    );
  };

  renderName = () => {
    const { name } = this.props;
    return <span className="dissableStage">{name}</span>;
  };

  renderIcon = () => {
    const { icon } = this.props;
    return (
      <Icon
        type={icon}
        className={classnames(`icon-${icon}`, "marginR10", "marginL10", style.arrowIcon)}
      />
    );
  };

  render() {
    const { icon, disabled, tooltipPlacement } = this.props;
    return (
      <div className={style.item}>
        {disabled ? (
          <Info
            node={this.renderName()}
            content={TOOLTIP.DISABLED_STAGE}
            placement={tooltipPlacement}
          />
        ) : (
          this.renderLink()
        )}
        {icon && this.renderIcon()}
      </div>
    );
  }
}

class ModuleLifeCycle extends Component {
  static propTypes = {
    hasUnpublishedChanges: PropTypes.bool,
    baseUrl: PropTypes.string.isRequired,
    stages: PropTypes.object.isRequired,
    stageRoutes: PropTypes.object.isRequired,
    globalPermissions: PropTypes.object.isRequired,
    seriesPermissions: PropTypes.object.isRequired,
    isSiteOwner: PropTypes.bool.isRequired
  };
  static defaultProps = {
    stages: Defaults.moduleLifeCycle
  };
  getStages = () => {
    const {
      hasUnpublishedChanges,
      baseUrl,
      globalPermissions,
      seriesPermissions,
      isSiteOwner,
      stages: stagesDisplayName,
      stageRoutes
    } = this.props;

    const stages = [];
    for (const [stage, displayName] of Object.entries(stagesDisplayName)) {
      const { [stage]: { placement } = {} } = TOOLTIP;
      stages.push({
        stage,
        name: displayName,
        url: getLifecycleStageUrl({ baseUrl, stage, routes: stageRoutes }),
        showChanges: LIFECYCLE_STAGES.PUBLISH == stage && !!hasUnpublishedChanges,
        disabled: !haveStageAccess(stage, globalPermissions, seriesPermissions, { isSiteOwner }),
        tooltipPlacement: placement
      });
    }
    return stages;
  };
  renderStage = () => {
    const stages = this.getStages();
    return stages.map((stage, index) => {
      return (
        <Stage
          key={`stage-${index}`}
          icon={index < stages.length - 1 ? "right_arrow_wide" : ""}
          {...this.props}
          {...stage}
        />
      );
    });
  };
  render() {
    return <div className={style.stageWrapper}>{this.renderStage()}</div>;
  }
}

export default ModuleLifeCycle;
