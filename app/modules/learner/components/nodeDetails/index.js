import React, { Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { Layout, Card } from "antd";
import { FormattedMessage } from "react-intl";

import InnerHTML from "@components/innerHTML";
import ChecklistOverview from "../../components/checklistOverview";
import ChecklistTask from "../../components/checklistTask";
import { NODE_TYPE } from "../../config/constants";

const { Content } = Layout;
const { Meta } = Card;
import st from "./index.scss";

const CardHeader = ({ type, node }) => {
  return (
    <Meta
      className={classnames("paddingL20 paddingR20 F13 lineHeight18", st.mobileStyle)}
      title={
        <div className="F13 bold lineHeight18">
          {type == NODE_TYPE.OVERVIEW ? <FormattedMessage id="TXT_DESC_HEADER_1" /> : node.name}
        </div>
      }
      description={
        node.description ? (
          <InnerHTML id={`description-${node.id}`} content={node.description} />
        ) : (
          ""
        )
      }
    />
  );
};
CardHeader.propTypes = {
  type: PropTypes.string.isRequired,
  node: PropTypes.object.isRequired
};

class NodeDetails extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    loadingTask: PropTypes.bool.isRequired,
    isSequentiallyLocked: PropTypes.bool.isRequired,
    actions: PropTypes.shape({
      start: PropTypes.func.isRequired,
      resume: PropTypes.func.isRequired,
      toggleComplete: PropTypes.func.isRequired,
      move: PropTypes.func.isRequired,
      gotoSeries: PropTypes.func.isRequired
    }).isRequired,
    className: PropTypes.string
  };

  renderDetails = () => {
    const { type, node, actions, isSequentiallyLocked } = this.props;
    return (
      <Card
        style={{
          margin: "10px"
        }}
        xs={16}
        sm={6}
        md={6}
        lg={6}
        xl={6}
        xxl={6}
      >
        <CardHeader type={type} node={node} />
        {NODE_TYPE.OVERVIEW == type && <ChecklistOverview {...node} actions={actions} />}
        {NODE_TYPE.TASK == type && (
          <ChecklistTask {...node} actions={actions} isSequentiallyLocked={isSequentiallyLocked} />
        )}
      </Card>
    );
  };

  renderLoader = () => {
    return (
      <Card loading style={{ height: "200px", margin: "10px" }}>
        {" "}
        Loading{" "}
      </Card>
    );
  };

  render() {
    const { loadingTask, className } = this.props;
    return (
      <Content className={className}>
        {loadingTask ? this.renderLoader() : this.renderDetails()}
      </Content>
    );
  }
}

export default NodeDetails;
