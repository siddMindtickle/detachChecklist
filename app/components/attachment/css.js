import styled from "styled-components";
import theme from "@mindtickle/mt-ui-components/styles/theme";
import mixins from "@mindtickle/mt-ui-components/styles/mixins";
import "@mindtickle/mt-ui-components/styles/index.scss";
import { Modal } from "@mindtickle/mt-ui-components";

const StyledAttachmentNote = styled.div`
  ${mixins.smallActiveLink()};
  ${mixins.clearfix()};

  .snapsotNoteIcon {
    width: 15px;
    float: left;
    color: ${theme.colors.INDIGO};
    line-height: 24px;
    margin-right: 8px;
  }
  .snapsotNote {
    color: ${theme.colors.INDIGO};
    line-height: 22px;
    word-break: break-all;
  }
`;

const StyledAttachmentSection = styled.div`
  display: block;
  cursor: pointer;
  font-size: 14px;

  .styleAttachments {
    border: 1px solid ${theme.colors.ALTO};
    border-radius: 8px;
    text-align: center;
    padding: 6px 42px;
  }
  .snapsotNoteIcon {
    margin-right: 8px;
    ${mixins.displayIB()};
    color: ${theme.colors.SHARK};
  }
  .attached-item {
    ${mixins.displayIB()};
    margin-right: 15px;
    max-width: 400px;
    ${mixins.truncate()};
    float: left;
    line-height: 20px;
    a {
      color: ${theme.colors.SHARK};
      cursor: pointer;
      font-size: 14px;
    }
  }

  .deleteLinkStyle {
    ${mixins.displayIB()};
    color: ${theme.colors.OUTER_SPACE};
    cursor: pointer;
    font-size: 14px;
    margin-top: -2px;
  }
`;

const StyledAddNewAttachment = styled.div`
  ${mixins.displayIB};
  margin: 0px;
  ${mixins.clearfix};
  cursor: pointer;

  .snapsotNoteIcon {
    ${mixins.displayIB};
    margin-right: 5px;
    color: ${theme.colors.OUTER_SPACE};
  }
  .snapsotNote {
    ${mixins.displayIB};
    color: ${theme.colors.OUTER_SPACE};
    font-size: 13px;
  }
`;
const StyledAttachmentView = styled.div`
  .attachmentMore {
    cursor: pointer;
    ${mixins.actionLink()};
    text-align: center;
  }
`;

const StyledAttachmentGridItem = styled.div`
  float: left;
  cursor: pointer;
  width: 152px;
  margin: "0 24px 24px 0";
  padding: 6px 6px;

  .fileName {
    visibility: visible;
    cursor: default;
    ${mixins.whiteText()};
    ${mixins.truncate("152px")};
    border-radius: 0 0 6px 6px;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
  }
  .unSupportedFileIcon {
    ${mixins.darkText()};
    font-size: 50px;
  }
  @media (max-width: 768px) {
    width: 138px;
    margin: 0 10px 10px 0;
  }

  .deleteLinkStyle {
    position: absolute;
    bottom: -15px;
    right: -2px;
    cursor: pointer;
    ${mixins.displayIB()};
    color: ${theme.colors.OUTER_SPACE};
    font-size: 14px;
  }
  .downloadLink {
    display: none;
  }
  :hover {
    .fileName {
      visibility: hidden;
    }
    .downloadLink {
      width: inherit;
      height: inherit;
      display: inline-block;
      background-color: rgba(0, 0, 0, 0.5);
      ${mixins.whiteBoldText()};
      word-break: break-word;
      border-radius: 6px;
      padding: 6px;
      text-align: center;
    }
  }
`;

const StyledModal = styled(Modal)`
  &.modalVideo .ant-modal-mask {
    z-index: ${mixins.zIndex.GET_SUPPORT - 2} !important;
  }
  &.modalVideo .ant-modal-wrap {
    z-index: ${mixins.zIndex.GET_SUPPORT - 1} !important;
  }

  &.modalVideo.ant-modal .ant-modal-content {
    border-radius: 0px;
    background-color: transparent;
    box-shadow: none;

    .ant-modal-body {
      height: 540px;
    }
  }
  &.modalVideo.ant-modal .ant-modal-content button.ant-modal-close {
    right: -100px;
    top: -100px;
    .ant-modal-close-icon {
      color: ${theme.colors.WHITE};
      font-size: 35px;
    }
  }
  .topSubmissionCarousel {
    padding: 0;
  }
  .ant-carousel {
    .slick-slider {
      padding: 0 5em;
      .slick-arrow.slick-prev,
      .slick-arrow.slick-next {
        background-color: transparent;
        font-size: 60px;
        width: 60px;
        height: 45px;
      }
      .slick-arrow.slick-next {
        right: -25px;
      }
      :after,
      :before {
        display: none;
      }
    }
    .slick-slide {
      height: 540px;
      & > div {
        height: inherit;
      }
    }
  }

  @media (max-width: 576px) {
    &.modalVideo.ant-modal .ant-modal-content button.ant-modal-close {
      right: 0;
      top: -3px;
      margin: 12px;
      .ant-modal-close-icon {
        color: ${theme.colors.ICON};
        font-size: 20px;
      }
    }
    &.modalVideo.ant-modal .ant-modal-content .ant-modal-body {
      height: auto;
    }
    .ant-carousel {
      .slick-slider {
        padding: 0;
      }
      .slick-slide {
        height: 100vh;
      }
    }
  }
  @media screen and (max-width: 1024px) and (min-width: 577px) {
    &.modalVideo.ant-modal .ant-modal-content button.ant-modal-close {
      right: -74px;
      top: -94px;
    }
    .ant-carousel {
      .slick-slide {
        height: 540px;
        & > div {
          height: inherit;
        }
      }
    }
  }
`;

const StyledCarouselItem = styled.div`
  position: relative;
  height: inherit;
  .carouselItemHeader {
    position: relative;
    width: 100%;
    ${mixins.clearfix()};
    margin-bottom: 16px;
  }
  .carouselItemName {
    ${mixins.truncate("400px")};
    ${mixins.whiteBoldText()};
    font-weight: 500;
    float: left;
  }
  .carouselItemDownload .icon-Download {
    font-size: 16px;
    font-weight: bold;
    color: ${theme.colors.WHITE};
    float: right;
    cursor: pointer;
  }
  .carousalViewer {
    height: calc(100% - 50px);
  }
  @media (max-width: 576px) {
    & {
      height: calc(100vh - 40px);
    }
    .carouselItemHeader {
      margin-top: 5px;
      padding: 10px;
      width: 90%;
      margin-bottom: 0;
    }
    .carouselItemName {
      ${mixins.truncate("250px")};
      ${mixins.darkText()};
      margin-bottom: 0;
    }
    .carouselItemDownload {
      float: left;
      margin: 3px 0 0 10px;
      .icon-Download {
        font-weight: normal;
        color: ${theme.colors.ICON};
      }
    }
  }
  @media screen and (max-width: 1024px) and (min-width: 577px) {
    & {
      height: calc(400px - 40px);
    }
    .carouselItemName {
      color: ${theme.colors.WHITE};
    }
    .carouselItemDownload {
      color: ${theme.colors.WHITE};
    }
  }
`;

const StyledGridModal = styled(Modal)`
  .ant-modal-mask {
    z-index: ${mixins.zIndex.GET_SUPPORT - 2} !important;
  }
  .ant-modal-wrap {
    z-index: ${mixins.zIndex.GET_SUPPORT - 1} !important;
  }
  &.ant-modal .ant-modal-body {
    ${mixins.clearfix()};
    padding: 0px 32px 32px;
  }
`;

export {
  StyledAddNewAttachment,
  StyledAttachmentGridItem,
  StyledAttachmentNote,
  StyledAttachmentSection,
  StyledAttachmentView,
  StyledCarouselItem,
  StyledModal,
  StyledGridModal
};
