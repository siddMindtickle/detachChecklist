import classnames from "classnames";
import Icon from "@components/icon";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Button from "@components/button";
import Uploader from "@components/uploader";

import {
  StyledAddNewAttachment,
  StyledAttachmentNote,
  StyledAttachmentSection,
  StyledAttachmentView,
  StyledAttachmentGridItem,
  StyledModal,
  StyledCarouselItem,
  StyledGridModal
} from "./css";

import { Carousel, FileViewer } from "@mindtickle/mt-ui-components";

import {
  isMobile,
  downloadURI,
  getFileTypeIcon,
  isIpad,
  isIpadPro,
  noop,
  parseMedia,
  smartEllipsis
} from "@app/utils";

const AttachmentPreview = ({ attachment, onClick, removeAttachment }) => {
  // Note: do not use 'background:' explicitly https://github.com/facebook/react/pull/4661
  let thumbStyle = {
    position: "relative",
    width: "100%",
    height: "84px",
    borderRadius: "6px",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50%",
    // get this done from img tag
    backgroundColor: "rgb(235,235,235)",
    backgroundImage: "url('" + attachment.thumbPath + "')"
  };
  // clone object
  let fallbackStyle = JSON.parse(JSON.stringify(thumbStyle));
  fallbackStyle.zIndex = "-1";
  fallbackStyle.position = "absolute";
  fallbackStyle.top = 0;
  fallbackStyle.left = 0;
  fallbackStyle.backgroundImage =
    "url('https://s3-ap-southeast-1.amazonaws.com/mtapps-cdn.mindtickle.com/selfserve/prod/images/error_page_logo.png')";
  (fallbackStyle.backgroundColor = "rgb(235,235,235"), (fallbackStyle.height = "100%");
  fallbackStyle.width = "100%";
  return (
    <StyledAttachmentGridItem>
      <div onClick={onClick} style={thumbStyle}>
        <div className="fallBackImage" style={fallbackStyle} />
        <span className="downloadLink">{attachment.title}</span>
        <Icon
          type="delete"
          className="deleteLinkStyle"
          onClick={e => {
            e.stopPropagation();
            removeAttachment(attachment.id);
          }}
        />
      </div>
      <div className="fileName">{smartEllipsis(attachment.title, 20)}</div>
    </StyledAttachmentGridItem>
  );
};

AttachmentPreview.propTypes = {
  attachment: PropTypes.object,
  onClick: PropTypes.func,
  removeAttachment: PropTypes.func
};

function getMediaTracks(media) {
  const { tracks, title, originalUrl, uuid, id } = media;
  const { primaryTracks = [], secondaryTracks = [], defaultTrack } = tracks || {};
  const download = () => {
    downloadURI(originalUrl, title);
  };
  let style = {
    height: isMobile() ? 232 : 486,
    width: "100%"
  };

  if (isMobile()) {
    style = {
      ...style,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      position: "absolute"
    };
  }

  return (
    <StyledCarouselItem key={id}>
      <div className="carouselItemHeader">
        <div className="carouselItemName">{title}</div>
        <div className="carouselItemDownload" onClick={download}>
          <Icon type="Download" className="icon-Download" />
        </div>
      </div>
      <FileViewer
        key={"file-" + id}
        className={"carousalViewer"}
        style={style}
        primaryTracks={primaryTracks}
        secondaryTracks={secondaryTracks}
        defaultTrack={defaultTrack}
        title={title}
        src={originalUrl || primaryTracks[0].src}
        uuid={uuid}
      />
    </StyledCarouselItem>
  );
}

const AttachmentNote = ({ text }) => (
  <StyledAttachmentNote>
    <span className="snapsotNoteIcon">
      <span className="icon-attachment" />
    </span>
    <span title={text} className="snapsotNote">
      {text}
    </span>
  </StyledAttachmentNote>
);

AttachmentNote.propTypes = {
  text: PropTypes.string.isRequired
};

const AttachmentGrid = ({ attachments = [], onItemClick, removeAttachment, title, onClose }) => {
  const content = attachments.map((attachment, index) => {
    return (
      <AttachmentPreview
        key={attachment.id}
        attachment={attachment}
        onClick={() => {
          onItemClick(index);
        }}
        removeAttachment={removeAttachment}
      />
    );
  });
  return (
    <StyledGridModal visible={true} footer={null} title={title} onCancel={onClose}>
      {content}
    </StyledGridModal>
  );
};

AttachmentGrid.propTypes = {
  attachments: PropTypes.array,
  onItemClick: PropTypes.func,
  removeAttachment: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onClose: PropTypes.func
};

const AttachmentsCarousel = ({ attachments = [], onClose, initialSlide }) => {
  const modalWidth = isIpad() || isIpadPro() ? 600 : 932;
  const breakpoints = {
    dots: false,
    speed: 500,
    slidesToShow: 1,
    infinite: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          infinite: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
          infinite: false
        }
      }
    ]
  };
  return (
    <StyledModal
      visible={true}
      className="modalVideo"
      onOk={onClose}
      onCancel={onClose}
      footer={null}
      width={modalWidth}
      bodyStyle={{ padding: 0, overflow: "hidden" }}
    >
      <Carousel {...breakpoints} initialSlide={initialSlide}>
        {attachments.map(getMediaTracks)}{" "}
      </Carousel>
    </StyledModal>
  );
};

AttachmentsCarousel.propTypes = {
  attachments: PropTypes.array.isRequired,
  onClose: PropTypes.func,
  initialSlide: PropTypes.number
};

const AttachmentViewSnippet = ({
  attachments = [],
  truncateCount = 0,
  className,
  onClick = noop,
  removeAttachment,
  preview
}) => {
  const __attachments = attachments.slice(0, truncateCount > 0 ? truncateCount : undefined);
  const isMore = attachments.length - __attachments.length;

  return (
    <StyledAttachmentView className={className}>
      {__attachments.map((attachment, index) => {
        const { render } = attachment;
        return (
          <React.Fragment key={"attachment" + index}>
            {render && render(attachment)}
            {!render &&
              preview && (
                <AttachmentPreview
                  attachment={attachment}
                  onClick={() => {
                    onClick({
                      isMoreClicked: false,
                      index
                    });
                  }}
                  removeAttachment={removeAttachment}
                />
              )}
            {!preview &&
              !render && (
                <a href={attachment.originalUrl} download>
                  <AttachmentNote text={attachment.title} />
                </a>
              )}{" "}
            {!preview && (
              <Icon
                type="delete"
                className="deleteLinkStyle"
                onClick={() => removeAttachment(attachment.id)}
              />
            )}
          </React.Fragment>
        );
      })}
      {isMore > 0 && (
        <span
          className="attachmentMore"
          onClick={() => {
            onClick({
              isMoreClicked: true
            });
          }}
        >
          + {isMore} More
        </span>
      )}
    </StyledAttachmentView>
  );
};

AttachmentViewSnippet.propTypes = {
  attachments: PropTypes.array,
  truncateCount: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
  removeAttachment: PropTypes.func.isRequired,
  preview: PropTypes.bool
};

const _AttachmentView = class AttachmentView extends Component {
  static propTypes = {
    attachments: PropTypes.array,
    removeAttachment: PropTypes.func.isRequired,
    preview: PropTypes.bool
  };
  state = {
    showCarousel: false,
    showAttachmentGrid: false,
    startIndex: 0
  };

  onClick = ({ isMoreClicked, index = 0 } = {}) => {
    if (!isMoreClicked) {
      this.openCarousel(index);
      return;
    }
    this.setState({
      showAttachmentGrid: true
    });
  };

  openCarousel = index => {
    this.setState({
      showCarousel: true,
      startIndex: index,
      showAttachmentGrid: false
    });
  };

  onCarouselClose = () => {
    this.setState({
      showCarousel: false,
      startIndex: 0,
      showAttachmentGrid: false
    });
  };

  render() {
    const { showCarousel, startIndex, showAttachmentGrid } = this.state;
    const { attachments, preview } = this.props;
    return (
      <React.Fragment>
        <AttachmentViewSnippet {...this.props} onClick={this.onClick} />

        {preview &&
          showCarousel && (
            <AttachmentsCarousel
              attachments={attachments}
              initialSlide={startIndex}
              onClose={this.onCarouselClose}
            />
          )}
        {showAttachmentGrid && (
          <AttachmentGrid
            attachments={attachments}
            title={"Attached Files"}
            onItemClick={this.openCarousel}
            removeAttachment={this.props.removeAttachment}
            onClose={this.onCarouselClose}
          />
        )}
      </React.Fragment>
    );
  }
};

export const AttachmentView = _AttachmentView;

const AttachedItem = ({ attachment, removeAttachment, attachmentClassName }) => {
  if (!attachment) return null;
  const { render, title, thumbPath, originalUrl } = attachment;
  return (
    <StyledAttachmentSection className={attachmentClassName}>
      <span className="attached-item">
        {render && render(attachment)}
        {!render && (
          <div className="styleAttachments">
            <a href={attachment.originalUrl} download={title}>
              {thumbPath ? (
                <img src={thumbPath} />
              ) : (
                <Icon type={getFileTypeIcon(originalUrl)} className="unSupportedFile" />
              )}
              {title}
            </a>
          </div>
        )}
      </span>
      <Icon
        type="delete"
        className="deleteLinkStyle"
        onClick={() => removeAttachment(attachment.id)}
      />
    </StyledAttachmentSection>
  );
};
AttachedItem.propTypes = {
  removeAttachment: PropTypes.func.isRequired,
  attachment: PropTypes.object,
  attachmentClassName: PropTypes.string
};

const AddNewAttachment = ({ text }) => {
  return (
    <StyledAddNewAttachment>
      <Button type="PrimarySm" className="uploadBtn">
        {text}
      </Button>
    </StyledAddNewAttachment>
  );
};

AddNewAttachment.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

AddNewAttachment.defaultProps = {
  text: "Upload Attachment(s)"
};
class Attachments extends Component {
  static propTypes = {
    add: PropTypes.func,
    attachedMedia: PropTypes.object.isRequired,
    attachmentClassName: PropTypes.string,
    className: PropTypes.string,
    isView: PropTypes.bool,
    maxUpload: PropTypes.number,
    onError: PropTypes.func,
    pollMediaStatus: PropTypes.bool,
    preview: PropTypes.bool,
    remove: PropTypes.func,
    target: PropTypes.node,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    truncateCount: PropTypes.number
  };
  static defaultProps = {
    add: () => {},
    attachedMedia: {},
    isView: true,
    maxUpload: 0,
    preview: true,
    remove: () => {},
    title: "Attached Files",
    truncateCount: 0
  };
  addAttachment = ({ mediaInfo }) => {
    const attachmentToAdd = parseMedia(mediaInfo);
    this.props.add(attachmentToAdd);
  };
  removeAttachment = id => {
    const attachmentToRemove = Object.values(this.props.attachedMedia).filter(
      (attachment = {}) => attachment.id == id
    )[0];
    this.props.remove(attachmentToRemove);
  };

  render() {
    const {
      attachedMedia,
      attachmentClassName,
      className,
      isView,
      maxUpload,
      onError,
      pollMediaStatus,
      target,
      text,
      title
    } = this.props;

    // remove undefined media
    Object.keys(attachedMedia).forEach(
      key => attachedMedia[key] === undefined && delete attachedMedia[key]
    );
    const attachments = Object.values(attachedMedia);
    return (
      <div className={classnames(className)}>
        {(attachments.length > 0 || maxUpload > 0) && title}

        {isView && (
          <AttachmentView
            {...this.props}
            attachments={attachments}
            removeAttachment={this.removeAttachment}
          />
        )}
        {!isView &&
          attachments.map((attachment, index) => {
            return (
              <AttachedItem
                key={index}
                attachmentClassName={attachmentClassName}
                attachment={attachment}
                removeAttachment={() => this.removeAttachment(attachment.id)}
              />
            );
          })}
        {attachments.length < maxUpload && (
          <Uploader
            onError={onError}
            pollMediaStatus={pollMediaStatus}
            target={target ? target : <AddNewAttachment text={text} />}
            type="DOCUMENT"
            update={this.addAttachment}
          />
        )}
      </div>
    );
  }
}
export default Attachments;
