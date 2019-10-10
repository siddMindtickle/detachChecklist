import styled from "styled-components";
import theme from "@mindtickle/mt-ui-components/styles/theme";
import mixins from "@mindtickle/mt-ui-components/styles/mixins";
import { Modal } from "@mindtickle/mt-ui-components";
const StyledAttachmentGridItem = styled.div`
  float: left;
  cursor: pointer;
  width: 152px;
  margin: "0 24px 24px 0";
  padding: 6px 6px;

  @media (max-width: 768px) {
    width: 138px;
    margin: 0 10px 10px 0;
  }

  .thumbnailImage {
    display: block;
    position: relative;
    top: 50%;
    left: 50%;
    max-width: 100%;
    max-height: 100%;
    transform: translateY(-50%) translateX(-50%);
    background-color: rgba(235, 235, 235, 0.5);
    border-radius: 6px;
  }
  .hoverTitle {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: inline-block;
    opacity: 0;
    ${mixins.whiteBoldText()};
    font-family: Arial, sans-serif !important;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    padding: 6px;
    text-align: center;
    word-break: break-word;
  }
  .fileName {
    visibility: visible;
    cursor: default;
    ${mixins.whiteText()};
    ${mixins.truncate("152px")};
    font-family: Arial, sans-serif !important;
    border-radius: 0 0 6px 6px;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
  }

  .actionIcon {
    opacity: 0;
    cursor: pointer;
    position: absolute;
    bottom: 5px;
    right: 10px;
    ${mixins.displayIB()};
    color: ${theme.colors.WHITE};
    font-size: 14px;
    font-weight: bold;
  }
  :hover {
    .fileName {
      visibility: hidden;
    }
    .hoverTitle {
      opacity: 1;
    }
    .actionIcon {
      opacity: 1;
    }
  }
`;

const StyledAttachmentView = styled.div`
  .attachmentMore {
    cursor: pointer;
    font-family: Arial, sans-serif !important;
    ${mixins.actionLink()};
    text-align: center;
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
    font-family: Arial, sans-serif !important;
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
      font-family: Arial, sans-serif !important;
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
    padding: 0px 32px 32px !important;
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

  &.modalVideo.ant-modal .ant-modal-content button.ant-modal-close {
    display: block;
    right: -30px;
    top: -35px;
    .ant-modal-close-icon {
      color: ${theme.colors.WHITE};
      font-size: 35px;
    }
    .ant-modal-close-icon::after {
      display: none;
    }
    svg {
      display: inline-block;
    }
  }
  @media (max-width: 576px) {
    &.modalVideo.ant-modal .ant-modal-content button.ant-modal-close {
      right: 0;
      top: -3px;
      margin: 12px;
      .ant-modal-close-icon::after {
        display: none;
      }
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
const StyledSimpleAttachment = styled.div`
  .fileName {
    ${mixins.actionLink()};
  }
`;
const StyledUploaderArea = styled.div`
  .inlineUploader {
    width: 582px;
    height: 400px;
  }
`;

export {
  StyledAttachmentGridItem,
  StyledAttachmentView,
  StyledCarouselItem,
  StyledGridModal,
  StyledModal,
  StyledSimpleAttachment,
  StyledUploaderArea
};
