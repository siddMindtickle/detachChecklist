import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import ModuleLifeCycle from "@components/moduleLifeCycle";
import Breadcrumb from "@components/breadcrumb";
import ModuleStatus from "@components/moduleStatus";
import CopyUrlModal from "@components/copyUrl";

import { getModuleUrl, getAnalyticsUrl, ACCESS_LINK_URL } from "@utils/generateUrls";
import { reload } from "@utils";
import style from "./index.scss";

class ModuleHeader extends Component {
  static propTypes = {
    seriesData: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      permissions: PropTypes.object
    }).isRequired,
    moduleData: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isPublished: PropTypes.bool.isRequired,
      mappedSeries: PropTypes.array.isRequired
    }).isRequired,
    companyData: PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired,
    userData: PropTypes.shape({
      permissions: PropTypes.object.isRequired,
      isSiteOwner: PropTypes.bool.isRequired,
      taggingEnabled: PropTypes.bool.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      updateModule: PropTypes.func.isRequired,
      goToSeries: PropTypes.func.isRequired,
      onPreview: PropTypes.func.isRequired
    }),
    stages: PropTypes.object,
    stageRoutes: PropTypes.object.isRequired,
    moduleOperations: PropTypes.object.isRequired,
    hasUnpublishedChanges: PropTypes.bool.isRequired,
    baseUrl: PropTypes.string.isRequired,
    saving: PropTypes.bool,
    maxScore: PropTypes.number
  };
  state = {
    showUrl: false,
    moduleUrl: "",
    copied: false
  };

  updateModule = (operation, value) => {
    const { actions, moduleData, companyData, seriesData, moduleOperations } = this.props;
    let url = null;
    const { VIEW_ANALYTICS, MODULE_URL } = moduleOperations;
    switch (operation) {
      case VIEW_ANALYTICS:
        url = getAnalyticsUrl(ACCESS_LINK_URL.ANALYTICS, moduleData.id);
        reload(url);
        break;
      case MODULE_URL:
        url = getModuleUrl(companyData.url, moduleData.type, moduleData.id, seriesData.id);
        this.setState({ showUrl: true, moduleUrl: url });
        break;
      default:
        actions.updateModule(operation, value);
    }
  };

  getProps = () => {
    const {
      stages,
      saving,
      actions,
      baseUrl,
      userData,
      maxScore,
      moduleData,
      seriesData,
      stageRoutes,
      moduleOperations,
      hasUnpublishedChanges
    } = this.props;
    return {
      breadcrum: {
        seriesName: seriesData.name,
        moduleName: moduleData.name,
        goToSeries: actions.goToSeries,
        moduleType: moduleData.type,
        operations: moduleOperations,
        seriesCount: moduleData.mappedSeries.length,
        isPublished: moduleData.isPublished
      },
      lifecycle: {
        stages,
        baseUrl,
        stageRoutes,
        hasUnpublishedChanges,
        globalPermissions: userData.permissions,
        seriesPermissions: seriesData.permissions,
        isSiteOwner: userData.isSiteOwner
      },
      moduleStatus: {
        saving,
        baseUrl,
        maxScore,
        stageRoutes,
        moduleId: moduleData.id,
        seriesId: seriesData.id,
        previewOnClick: actions.onPreview
      }
    };
  };
  render() {
    const { showUrl, moduleUrl } = this.state;
    const { breadcrum, lifecycle, moduleStatus } = this.getProps();
    return (
      <div key="subheader" className={style.subHeader}>
        <Breadcrumb {...breadcrum} update={this.updateModule} />
        <div className={style.moduleStatus}>
          <ModuleLifeCycle {...lifecycle} />
          <ModuleStatus {...moduleStatus} />
        </div>
        {showUrl && (
          <CopyUrlModal
            key="copy"
            title={`${breadcrum.moduleType} URL`}
            text={moduleUrl}
            copy={() => this.setState({ copied: true })}
            close={() => this.setState({ showUrl: false, copied: false })}
            copied={this.state.copied}
          />
        )}
      </div>
    );
  }
}
export default withRouter(ModuleHeader);
