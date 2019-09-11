import React, { Component } from "react";
import PropTypes from "prop-types";

import { deepEqual } from "@utils";
import Loader from "@components/loader";

import { getCsvFields, downloadSample } from "../../utils";
import UploadLearnerList from "../../components/inviteUploadList";

export default class WrapperUploadList extends Component {
  static propTypes = {
    invite: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
    loaded: PropTypes.bool,
    hasError: PropTypes.bool,
    profileFields: PropTypes.array,
    managerFields: PropTypes.array,
    companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    defaultModuleRelevance: PropTypes.string,
    inviteToSeries: PropTypes.bool.isRequired,
    enabledFeatures: PropTypes.object
  };

  static defultProps = {};

  state = {
    csvData: {}
  };

  downloadSample = () => {
    const {
      csvData: { csvFields }
    } = this.state;
    const { companyId } = this.props;
    downloadSample(csvFields, companyId);
  };

  setCSVData = ({ profileFields, managerFields }) => {
    const {
      enabledFeatures: { moduleRelevanceEnabled }
    } = this.props;
    const csvData = getCsvFields(profileFields, managerFields, moduleRelevanceEnabled);
    this.setState({ csvData });
  };

  componentWillReceiveProps(nextProps) {
    const { profileFields, managerFields } = nextProps;
    if (
      !deepEqual(profileFields, this.props.profileFields) ||
      !deepEqual(managerFields, this.props.managerFields)
    ) {
      this.setCSVData(nextProps);
    }
  }

  componentDidMount() {
    const { loaded, getData } = this.props;
    loaded ? this.setCSVData(this.props) : getData();
  }

  componentWillUnmount() {}

  render() {
    const { csvData = {} } = this.state;
    const { invite, close, loaded, hasError, inviteToSeries, enabledFeatures } = this.props;
    return loaded && !hasError ? (
      <UploadLearnerList
        invite={invite}
        close={close}
        csvData={csvData}
        downloadSample={this.downloadSample}
        inviteToSeries={inviteToSeries}
        enabledFeatures={enabledFeatures}
      />
    ) : (
      <Loader vCenter={true} />
    );
  }
}
