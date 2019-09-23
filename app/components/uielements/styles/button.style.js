import styled from "styled-components";
import { transition } from "../utils/style-utils";

const primaryColor = "#0072BC";
const primaryHoverColor = "#0063A3";
const successColor = "#6bcb65";
const successHoverColor = "#4FB249";
const greyColor = "#999";
const greyHoverColor = "#777";
const disabledprimaryColor = "rgba(0, 114, 188, 0.4)";
const disabledGreyColor = "rgba(119, 119, 119, 0.4)";
const disabledGreyHoverColor = "rgba(153, 153, 153, 0.4)";

const ghostColor = (color, isText, isBorder, disableColor) => {
  return props => {
    if (props.ghost) {
      if (isText || isBorder) return props.disabled ? disableColor || disabledprimaryColor : color;
      return "#fff";
    }
    return isText ? "#fff" : color;
  };
};

const palette = () => {
  return "";
};

const Buttons = ComponentName => styled(ComponentName)`
  &.ant-btn {
    display: inline-block;
    margin-bottom: 0;
    font-weight: 500;
    text-align: center;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    line-height: 1.5;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 4px;
    height: 30px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    color: ${palette("text", 1)};
    border-color: ${palette("border", 0)};
    ${transition()};

    &:hover {
      border-color: ${ghostColor(primaryHoverColor, false, true)};
      color: ${ghostColor(primaryHoverColor, true, false)};
    }

    > .anticon + span,
    > span + .anticon {
      margin: ${props => (props["data-rtl"] === "rtl" ? "0 0.5em 0 0" : "0 0 0 0.5em")};
    }

    .anticon-right {
      transform: ${props => (props["data-rtl"] === "rtl" ? "rotate(180deg)" : "rotate(0)")};
    }

    .anticon-left {
      transform: ${props => (props["data-rtl"] === "rtl" ? "rotate(180deg)" : "rotate(0)")};
    }

    &.ant-btn-primary {
      background-color: ${ghostColor(primaryColor, false, false)};
      border-color: ${ghostColor(primaryColor, false, true)};

      &:hover {
        background-color: ${ghostColor(primaryHoverColor, false, false)};
        border-color: ${ghostColor(primaryHoverColor, false, true)};
        color: ${ghostColor(primaryHoverColor, true, false)};
      }
    }
    &.ant-btn-grey {
      background-color: ${ghostColor(greyColor, false, false)};
      border-color: ${ghostColor(greyColor, false, true, disabledGreyColor)};

      &:hover {
        background-color: ${ghostColor(greyHoverColor, false, false, disabledGreyHoverColor)};
        border-color: ${ghostColor(greyHoverColor, false, true, disabledGreyHoverColor)};
        color: ${ghostColor(greyHoverColor, true, false, disabledGreyHoverColor)};
      }
    }
    &.ant-btn-successColor {
      background-color: ${successColor};
      border-color: ${successColor};
      color: #fff;

      &:hover {
        background-color: ${successHoverColor};
        border-color: ${successHoverColor};
        color: #fff;
      }
    }

    &.ant-btn-noborderPrimary {
      background-color: ${ghostColor(primaryColor, false, false)};
      border-color: transparent;
      color: ${ghostColor(primaryColor, true, false)};

      &:hover {
        color: ${ghostColor(primaryHoverColor, true, false)};
      }
    }

    &.ant-btn-noborderGrey {
      background-color: ${ghostColor(greyColor, false, false)};
      border-color: transparent;
      color: ${ghostColor(greyColor, true, false)};

      &:hover {
        color: ${ghostColor(greyHoverColor, true, false)};
      }
    }

    &.ant-btn-success {
      background-color: ${ghostColor(successColor, false, false)};
      border-color: ${ghostColor(successColor, false, true)};
      color: ${ghostColor(successColor, true, false)};

      &:hover {
        background-color: ${ghostColor(successHoverColor, false, false)};
        border-color: ${ghostColor(successHoverColor, false, true)};
        color: ${ghostColor(successHoverColor, true, false)};
      }
    }
    &.ant-btn-sm {
      padding: 0 15px;
      height: 28px;
      font-size: 12px;

      &.ant-btn-loading:not(.ant-btn-circle):not(.ant-btn-circle-outline) {
        padding: ${props => (props["data-rtl"] === "rtl" ? "0 24px 0 15px" : "0 15px 0 24px")};
        .anticon {
          margin: ${props => (props["data-rtl"] === "rtl" ? "0 -17px 0 0" : "0 0 0 -17px")};
        }
      }
    }

    &.ant-btn-lg {
      padding: 0 35px;
      font-size: 14px;
      height: 42px;
    }

    &.ant-btn-primary {
      color: ${ghostColor(primaryColor, true, false)};
      &.ant-btn-background-ghost {
        color: ${primaryColor};

        &:hover {
          color: ${ghostColor(primaryHoverColor, true, false)};
        }
      }

      &:hover {
        color: #fff;
      }
    }

    &.ant-btn-grey {
      color: ${ghostColor(greyColor, true, false, disabledGreyColor)};
      &.ant-btn-background-ghost {
        color: ${greyColor};

        &:hover {
          color: ${ghostColor(greyHoverColor, true, false, disabledGreyHoverColor)};
        }
      }

      &:hover {
        color: #fff;
      }
    }

    &.ant-btn-dashed {
      border-style: dashed;
      border-color: ${palette("border", 1)};

      &:hover {
        color: ${ghostColor(primaryColor, true, false)};
        border-color: ${ghostColor(primaryColor, false, true)};
      }
    }

    &.ant-btn-danger {
      background-color: ${palette("error", 0)};
      border-color: ${palette("error", 0)};
      color: #ffffff;

      &:hover {
        background-color: ${palette("error", 2)};
        border-color: ${palette("error", 2)};
      }

      &.ant-btn-background-ghost {
        color: ${palette("error", 0)};
        background-color: transparent;
        border-color: ${palette("error", 0)};

        &:hover {
          color: ${palette("error", 2)};
          border-color: ${palette("error", 2)};
        }
      }
    }

    &.ant-btn-circle,
    &.ant-btn-circle-outline {
      width: 35px;
      padding: 0;
      font-size: 14px;
      border-radius: 50%;
      height: 35px;

      &.ant-btn-sm {
        padding: 0;
        height: 28px;
        width: 28px;
        font-size: 12px;
      }

      &.ant-btn-lg {
        padding: 0;
        font-size: 14px;
        height: 42px;
        width: 42px;
      }
    }

    &.ant-btn.disabled,
    &.ant-btn[disabled],
    &.ant-btn.disabled:hover,
    &.ant-btn[disabled]:hover,
    &.ant-btn.disabled:focus,
    &.ant-btn[disabled]:focus,
    &.ant-btn.disabled:active,
    &.ant-btn[disabled]:active,
    &.ant-btn.disabled.active,
    &.ant-btn[disabled].active {
      color: ${palette("grayscale", 2)};
      background-color: #f7f7f7;
      border-color: ${palette("border", 0)};
      cursor: not-allowed;
    }

    &.ant-btn-loading:not(.ant-btn-circle):not(.ant-btn-circle-outline) .anticon {
      margin: ${props => (props["data-rtl"] === "rtl" ? "0 -14px 0 0" : "0 0 0 -14px")};
    }

    &.MtButton {
      display: inline-block;
      margin-bottom: 0;
      font-weight: 500;
      text-align: center;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      cursor: pointer;
      background-image: none;
      border: 0;
      white-space: nowrap;
      line-height: 1.5;
      padding: 0 25px;
      font-size: 13px;
      border-radius: 4px;
      height: 35px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      position: relative;
      color: #ffffff;
      background-color: ${ghostColor(primaryColor, false, false)};
      ${transition()};

      &:hover {
        background-color: ${ghostColor(primaryHoverColor, false, false)};
      }

      &.MtBtnSm {
        padding: 0 15px;
        height: 28px;
        font-size: 12px;
      }

      &.MtBtnLg {
        padding: 0 35px;
        font-size: 14px;
        height: 42px;
      }
    }
  }

  + .ant-btn-group {
    margin-left: ${props => (props["data-rtl"] === "rtl" ? "0" : "-1px")} !important;
    margin-right: ${props => (props["data-rtl"] === "rtl" ? "-1px" : "0")} !important;
  }
`;

const RadioButtons = ComponentName => styled(ComponentName)`
  .ant-radio-button-wrapper {
    height: 35px;
    line-height: 33px;
    color: ${palette("text", 1)};
    border: 1px solid ${palette("border", 0)};
    border-left: 0;
    background: #fff;
    padding: 0 20px;

    &:hover,
    &.ant-radio-button-wrapper-focused {
      color: ${ghostColor(primaryColor, true, false)};
    }

    &.ant-radio-button-wrapper-checked {
      background: #fff;
      border-color: ${ghostColor(primaryColor, false, true)};
      color: ${ghostColor(primaryColor, true, false)};
      box-shadow: -1px 0 0 0 ${ghostColor(primaryColor, false, true)};
    }
  }
`;

const ButtonsGroup = ComponentName => styled(ComponentName)`
  &.ant-btn-group {
    .ant-btn {
      margin: 0;
      margin-right: 0;
      display: inline-block;
      margin-bottom: 0;
      font-weight: 500;
      text-align: center;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      cursor: pointer;
      background-image: none;
      border: 1px solid transparent;
      border-color: ${palette("border", 1)};
      white-space: nowrap;
      line-height: 1.5;
      padding: 0 8px;
      font-size: 14px;
      border-radius: 4px;
      height: 36px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      position: relative;
      ${transition()};

      &:hover {
        border-color: ${ghostColor(primaryHoverColor, false, true)};
      }

      &.ant-btn-dashed {
        border-style: dashed;

        &:hover {
          border-color: ${ghostColor(primaryHoverColor, false, true)};
        }
      }

      &.ant-btn-primary {
        border-color: ${ghostColor(primaryColor, false, true)};
        &.ant-btn-background-ghost {
          color: ${ghostColor(primaryColor, true, false)};
          &:hover {
            color: ${ghostColor(primaryHoverColor, true, false)};
          }
        }

        &:hover {
          border-color: ${ghostColor(primaryHoverColor, false, true)};
        }
      }

      &.ant-btn-grey {
        border-color: ${ghostColor(greyColor, false, true)};
        &.ant-btn-background-ghost {
          color: ${ghostColor(greyColor, true, false)};
          &:hover {
            color: ${ghostColor(greyHoverColor, true, false)};
          }
        }

        &:hover {
          border-color: ${ghostColor(greyHoverColor, false, true)};
        }
      }

      &.ant-btn-successColor {
        border-color: ${successColor};

        &.ant-btn-background-ghost {
          color: ${successColor};

          &:hover {
            color: ${successHoverColor};
          }
        }

        &:hover {
          border-color: ${successHoverColor};
        }
      }
    }

    > .ant-btn:first-child:not(:last-child) {
      border-radius: ${props => (props["data-rtl"] === "rtl" ? "0 4px 4px 0" : "4px 0 0 4px")};
    }

    > .ant-btn:last-child:not(:first-child) {
      border-radius: ${props => (props["data-rtl"] === "rtl" ? "4px 0 0 4px" : "0 4px 4px 0")};
    }

    .ant-btn-primary:last-child:not(:first-child),
    .ant-btn-primary + .ant-btn-primary {
      border-left-color: ${props =>
        props["data-rtl"] === "rtl" ? palette("primary", 0) : palette("primary", 2)};
      border-right-color: ${props =>
        props["data-rtl"] === "rtl" ? palette("primary", 2) : palette("primary", 0)};
    }

    .ant-btn-grey:last-child:not(:first-child),
    .ant-btn-grey + .ant-btn-grey {
      border-left-color: ${props =>
        props["data-rtl"] === "rtl" ? palette("grey", 0) : palette("grey", 2)};
      border-right-color: ${props =>
        props["data-rtl"] === "rtl" ? palette("grey", 2) : palette("grey", 0)};
    }

    .ant-btn-primary:first-child:not(:last-child) {
      border-left-color: ${props =>
        props["data-rtl"] === "rtl" ? palette("primary", 2) : palette("primary", 0)};
      border-right-color: ${props =>
        props["data-rtl"] === "rtl" ? palette("primary", 0) : palette("primary", 2)};
    }

    .ant-btn-grey:first-child:not(:last-child) {
      border-left-color: ${props =>
        props["data-rtl"] === "rtl" ? palette("grey", 2) : palette("grey", 0)};
      border-right-color: ${props =>
        props["data-rtl"] === "rtl" ? palette("grey", 0) : palette("grey", 2)};
    }

    .ant-btn + .ant-btn,
    + .ant-btn {
      margin-left: ${props => (props["data-rtl"] === "rtl" ? "0" : "-1px")} !important;
      margin-right: ${props => (props["data-rtl"] === "rtl" ? "-1px" : "0")} !important;
    }

    &.ant-btn-group-lg {
      > .ant-btn {
        padding: 0 35px;
        font-size: 14px;
        height: 42px;
      }
    }

    &.ant-btn-group-sm {
      > .ant-btn {
        padding: 0 15px;
        height: 28px;
        font-size: 12px;
      }
    }
  }

  &.ant-btn-group + &.ant-btn-group {
    margin-left: ${props => (props["data-rtl"] === "rtl" ? "0" : "-1px")} !important;
    margin-right: ${props => (props["data-rtl"] === "rtl" ? "-1px" : "0")} !important;
  }
`;

const GhostButtons = ComponentName => styled(ComponentName)`
  .ant-btn-background-ghost {
    background: transparent !important;
    border-color: #fff;
    color: #fff;
  }
  .ant-btn-primary {
    color: ${ghostColor(primaryColor, true, false)};
    background-color: transparent;
    border-color: ${ghostColor(primaryColor, false, true)};
    &:hover {
      color: ${ghostColor(primaryHoverColor, true, false)};
    }

    .ant-btn-grey {
      color: ${ghostColor(greyColor, true, false)};
      background-color: transparent;
      border-color: ${ghostColor(greyColor, false, true)};
      &:hover {
        color: ${ghostColor(greyHoverColor, true, false)};
      }


    &.ant-btn-successColor {
      color: ${successColor};
      background-color: transparent;
      border-color: ${successColor};
      &:hover {
        color: ${successHoverColor};
      }
    }
  }
`;

export { Buttons, ButtonsGroup, RadioButtons, GhostButtons };
