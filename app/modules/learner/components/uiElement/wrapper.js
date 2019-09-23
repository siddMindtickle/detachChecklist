import styled from "styled-components";

const ChecklistViewWrapper = styled.div`
  .ant-layout-header {
    padding: 0px;
    height: auto;
    line-height: 32px;
    /* temp fix for styles */
    background: #fff;
    font-size: 13px;
    position: relative;
  }
  .ant-menu-item:after {
    border-right: 0px;
  }
  .ant-progress-inner {
    background: #fff;
    border: 1px solid #6bcb65;
  }
  .ant-progress-bg,
  .ant-progress-success-bg {
    background: #6bcb65;
    height: 3px !important;
  }
  .ant-progress-line {
    font-size: 0;
  }
  .ant-card-body {
    padding: 20px 0px 10px !important;
  }
  .attachedFileBg {
    background: #e6e6e6;
    padding: 0 5px;
    border-radius: 3px;
  }
  .lbOwn {
    color: #f48414;
    background: #feeddc;
  }
  .lbOther {
    color: #f48414;
    background: #fafafa;
  }
  .lbRowHover:hover {
    background: #f7f7f7;
    cursor: pointer;
  }
  .Tag {
    border: 1px solid #000;
    padding: 0 0 0 5px;
    line-height: 20px;
    font-size: 12px;
    float: left;
    margin: 0 5px 5px 0;
    max-width: 250px;
  }
  .lbBadgeArea img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .lbHeight {
    height: calc(100vh - 114px);
    height: -moz-calc(100vh - 114px);
    height: -webkit-calc(100vh - 114px);
    overflow-y: auto;
  }
  .mobileCheckListSubHeader {
    background: #e6ebed;
    line-height: 20px;
    font-size: 14px;
    color: #000;
  }
  .abc {
  }
`;

export default ChecklistViewWrapper;
