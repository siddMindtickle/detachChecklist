import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { deepmerge } from "@utils";

import Icon from "@components/icon";
import ModuleIcon from "@components/moduleIcon";
import Dropdown from "@components/dropdown";
import Input from "@components/input";
import withRoundButtons from "@hocs/withButtons";
import { showConfirmBox } from "@utils/alert";
import style from "./index.scss";
import { MODULE_OPTIONS, OPERATIONS, ARCHIVE_OPTION, DISCARD_OPTION } from "./constants";
import { CONFIRM_MESSAGES } from "./constants";

const RenameModule = withRoundButtons(Input);

class Breadcrumb extends Component {
  static propTypes = {
    seriesName: PropTypes.string.isRequired,
    moduleType: PropTypes.string.isRequired,
    moduleName: PropTypes.string.isRequired,
    isPublished: PropTypes.bool.isRequired,
    update: PropTypes.func.isRequired,
    operations: PropTypes.object,
    seriesCount: PropTypes.number.isRequired,
    goToSeries: PropTypes.func.isRequired
  };

  static defaultProps = {
    operations: {},
    isPublished: false
  };

  state = {
    rename: false
  };

  operations = deepmerge(OPERATIONS, this.props.operations);

  onSelect = value => {
    const { MODULE_URL, VIEW_ANALYTICS, DISCARD, ARCHIVE } = this.operations;
    const { update, moduleType, isPublished, seriesCount } = this.props;
    switch (value) {
      case "rename":
        this.setState({ rename: true });
        break;
      case "module-url":
        update(MODULE_URL);
        break;
      case "view-analytics":
        update(VIEW_ANALYTICS);
        break;
      case "discard":
        showConfirmBox(CONFIRM_MESSAGES.DISCARD({ moduleType, isPublished, seriesCount }), {
          callback: confirmed => confirmed && update(DISCARD)
        });
        break;
      case "archive":
        showConfirmBox(CONFIRM_MESSAGES.ARCHIVE({ moduleType, isPublished, seriesCount }), {
          callback: confirmed => confirmed && update(ARCHIVE)
        });
        break;
    }
  };

  onRename = value => {
    const { moduleName, update } = this.props;
    value == moduleName ? this.onCancel() : update(this.operations.RENAME, value);
  };
  onCancel = () => {
    this.setState({ rename: false });
  };

  getModuleOptions = () => {
    const { isPublished } = this.props;
    const options = [...MODULE_OPTIONS];
    const extraOption = isPublished ? ARCHIVE_OPTION : DISCARD_OPTION;
    options.push(extraOption);
    return options;
  };
  componentDidUpdate(prevProps) {
    if (this.props.moduleName !== prevProps.moduleName) {
      this.setState({ rename: false });
    }
  }

  render() {
    const { seriesName, moduleName, goToSeries, isPublished, moduleType } = this.props;
    const { rename } = this.state;
    return (
      <div className={style.bc_subHeader}>
        <div className={style.bc_breadCrumbSection}>
          <Icon type="series_outline" className={classnames("marginR10", style.bc_icon)} />
          <span
            className={classnames("marginR10", "displayIM", "bc_seriesNameStyle")}
            onClick={goToSeries}
          >
            {seriesName}
          </span>
          <Icon type="right_arrow" className={classnames("marginR10", style.bc_icon)} />
          <ModuleIcon key="moduleType" moduleType={moduleType} className={"marginR10"} />
          <span key="moduleText" className={style.bc_moduleText}>
            {rename ? (
              <RenameModule
                name="rename_module"
                ok={this.onRename}
                cancel={this.onCancel}
                maxLength={50}
                componentClassName={classnames(style.bc_inputCustomClass)}
                className={classnames(style.bc_inputPlacholderBlocks)}
                value={moduleName}
              />
            ) : null}
          </span>
          {!rename && [
            <div
              key="moduleOptions"
              className={classnames(style.bc_dropDownBlock, "bc_breadcrumDropdownStyle")}
            >
              <Dropdown
                options={this.getModuleOptions()}
                id="breadcrumb_dropdown"
                title={moduleName}
                onSelect={this.onSelect}
              />
            </div>,
            <div key="draft" className="bc_draftStyle">
              {!isPublished && "Draft"}
            </div>
          ]}
        </div>
      </div>
    );
  }
}

export default Breadcrumb;
