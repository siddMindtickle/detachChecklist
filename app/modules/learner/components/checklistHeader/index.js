import React, { Component } from "react";
import classnames from "classnames";
import { Layout, Row, Col, Progress } from "antd";
import PropTypes from "prop-types";
import MtButton from "@uielements/button";
import MtSearch from "@uielements/searchInput";
import { getDueDateText } from "@utils/dateFormatter";
import { intlShape, injectIntl, FormattedHTMLMessage, FormattedMessage } from "react-intl";
import Icon from "@mindtickle/mt-ui-components/Icon";
import st from "./index.scss";

const { Header } = Layout;

class CheckListHeader extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    completedTasks: PropTypes.number.isRequired,
    totalTasks: PropTypes.number.isRequired,
    onSearch: PropTypes.func.isRequired,
    score: PropTypes.number.isRequired,
    totalScore: PropTypes.number.isRequired,
    onMobileBackBtn: PropTypes.func.isRequired,
    nodeSelected: PropTypes.bool,
    dueDate: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        value: PropTypes.number.isRequired,
        expired: PropTypes.bool.isRequired,
        canReAttempt: PropTypes.bool.isRequired
      })
    ])
  };

  static defaultProps = {
    nodeSelected: false
  };

  onChange = event => {
    this.props.onSearch(event.target.value);
  };

  handleMobileBackBtn = () => this.props.onMobileBackBtn(false);

  render() {
    const {
      completedTasks,
      totalTasks,
      dueDate,
      score,
      totalScore,
      nodeSelected,
      intl
    } = this.props;
    const progressPercentage = (completedTasks * 100) / totalTasks;
    return (
      <Header
        style={{
          padding: "0 0px",
          height: "auto",
          lineHeight: "32px",
          color: "#000",
          fontSize: "13px",
          position: "relative",
          borderBottom: "1px solid #eee"
        }}
      >
        <div
          className={classnames("floatL", {
            [st.mobile_show_right]: nodeSelected
          })}
          style={{ padding: "10px 15px" }}
        >
          <MtSearch
            className={st.mtSearch}
            placeholder={intl.formatMessage({
              id: "RM_CHECKLIST_SEARCH_TASK"
            })}
            onChange={this.onChange}
            size="large"
          />
          <div className={st.mtBack}>
            <MtButton
              className="floatL"
              style={{
                padding: "0px 10px 0px 0px"
              }}
              type="noborderPrimary"
              key="goTo Series"
              ghost
              onClick={this.handleMobileBackBtn}
            >
              <span className="F13" style={{ color: "#000" }} />
              <Icon type="ddArrowLeft" />
              <span className="marginL5 F13 blackColor">Back</span>
            </MtButton>
          </div>
        </div>
        <div className="floatR paddingR10">
          <div className="floatL">
            <Row>
              <Col xs={0} sm={0} md={24} lg={24} xl={24} xxl={24}>
                <div style={{ padding: "10px" }}>
                  <div className="floatL greyColor">{getDueDateText(dueDate, intl)}</div>
                  <div className="floatL marginL20">
                    <div className="color00 ellipsis lineHeight20 marginB2">
                      <FormattedMessage
                        id="RM_CHECKLIST_TASK_COMPLETED"
                        values={{
                          completedTasks,
                          totalTasks
                        }}
                      />
                    </div>
                    <div style={{ width: "130px", lineHeight: "0" }}>
                      <Progress percent={progressPercentage} showInfo={false} />
                    </div>
                  </div>
                  <div className="clear" />
                </div>
              </Col>
            </Row>
          </div>
          <div className="floatL ellipsis" style={{ padding: "10px" }}>
            <FormattedHTMLMessage
              id="RM_SCORE"
              values={{
                score,
                totalScore
              }}
            />
          </div>
          {/* <div className="floatL">{hofButton}</div> */}
          <div className="clear" />
        </div>
        <div className="clear" />
      </Header>
    );
  }
}

export default injectIntl(CheckListHeader);
