import React, { Component } from "react";
import classnames from "classnames";
import defaultThumbnail from "./images/defaultThumbnail.png";
import Icon from "@components/icon";
import PropTypes from "prop-types";

import {
  StyledAttachmentGridItem,
  StyledAttachmentView,
  StyledCarouselItem,
  StyledGridModal,
  StyledModal,
  StyledSimpleAttachment
} from "./css";

import { Carousel, FileViewer } from "@mindtickle/mt-ui-components";

import { isMobile, downloadURI, isIpad, isIpadPro, noop, smartEllipsis } from "@app/utils";

const AttachmentThumbnail = ({ attachment, onClick }) => {
  let thumbStyle = {
    position: "relative",
    width: "100%",
    height: "84px",
    borderRadius: "6px"
  };

  return (
    <StyledAttachmentGridItem>
      <div onClick={onClick} style={thumbStyle}>
        <img
          key={attachment.id}
          className="thumbnailImage"
          src={attachment.thumbPath}
          onError={e => {
            e.target.onerror = null;
            e.target.src = defaultThumbnail;
          }}
        />
        <span className="hoverTitle">{attachment.title}</span>
        <Icon
          type={"Download"}
          className="actionIcon"
          onClick={e => {
            e.stopPropagation();
            downloadURI(attachment.downloadUrl, attachment.title);
          }}
        />
      </div>
      <div className="fileName">{smartEllipsis(attachment.title, 20)}</div>
    </StyledAttachmentGridItem>
  );
};

AttachmentThumbnail.propTypes = {
  attachment: PropTypes.object,
  onClick: PropTypes.func
};

function getMediaTracks(media) {
  const { tracks, title, originalUrl, downloadUrl, uuid, id } = media;
  const { primaryTracks = [], secondaryTracks = [], defaultTrack } = tracks || {};
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
        <div className="carouselItemDownload" onClick={() => downloadURI(downloadUrl, title)}>
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

const AttachmentGrid = ({ attachments = [], onClose, onItemClick, title }) => {
  const content = attachments.map((attachment, index) => {
    return (
      <AttachmentThumbnail
        key={attachment.id}
        attachment={attachment}
        onClick={() => {
          onItemClick(index);
        }}
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
  attachments: PropTypes.array.isRequired,
  onItemClick: PropTypes.func,
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

const AttachmentsArea = ({
  attachments = [],
  truncateCount = 0,
  className,
  onClick = noop,
  filePreview = true
}) => {
  const __attachments = attachments.slice(0, truncateCount > 0 ? truncateCount : undefined);
  const isMore = attachments.length - __attachments.length;

  return (
    <StyledAttachmentView className={className}>
      {__attachments.map((attachment, index) => {
        return (
          <React.Fragment key={"attachment" + index}>
            <AttachmentThumbnail
              attachment={attachment}
              onClick={() => {
                filePreview
                  ? onClick({
                      isMoreClicked: false,
                      index
                    })
                  : downloadURI(attachment.downloadUrl, attachment.title);
              }}
            />
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

AttachmentsArea.propTypes = {
  attachments: PropTypes.array.isRequired,
  truncateCount: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
  filePreview: PropTypes.bool
};

export class AttachmentView extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired,
    filePreview: PropTypes.bool
  };
  state = {
    showingCarousel: false,
    showingAttachmentGrid: false,
    startIndex: 0
  };

  onClick = ({ isMoreClicked, index = 0 } = {}) => {
    if (!isMoreClicked) {
      this.openCarousel(index);
      return;
    }
    this.setState({
      showingAttachmentGrid: true
    });
  };

  openCarousel = index => {
    this.setState({
      showingCarousel: true,
      startIndex: index,
      showingAttachmentGrid: false
    });
  };

  onCarouselClose = () => {
    this.setState({
      showingCarousel: false,
      startIndex: 0,
      showingAttachmentGrid: false
    });
  };

  render() {
    const { showingCarousel, startIndex, showingAttachmentGrid } = this.state;
    const { attachments, filePreview } = this.props;
    return (
      <React.Fragment>
        <AttachmentsArea {...this.props} onClick={this.onClick} />
        {showingCarousel && (
          <AttachmentsCarousel
            attachments={attachments}
            initialSlide={startIndex}
            onClose={this.onCarouselClose}
          />
        )}
        {showingAttachmentGrid && (
          <AttachmentGrid
            attachments={attachments}
            onClose={this.onCarouselClose}
            onItemClick={
              filePreview ? this.openCarousel : index => downloadURI(attachments[index].downloadUrl)
            }
            title={"Attached Files"}
          />
        )}
      </React.Fragment>
    );
  }
}
export class SimpleAttachmentList extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired
  };

  render() {
    const { attachments } = this.props;
    return attachments.map((attachment, index) => {
      return (
        <StyledSimpleAttachment key={index}>
          <div className="floatL icon-attachment marginR10 marginT5" />
          <a
            href={attachment.downloadUrl}
            download={attachment.title}
            className="fileName"
            target="_blank"
            rel="noopener noreferrer"
          >
            {attachment.title}
          </a>
        </StyledSimpleAttachment>
      );
    });
  }
}

class Attachments extends Component {
  static propTypes = {
    attachedMedia: PropTypes.object,
    attachmentClassName: PropTypes.string,
    className: PropTypes.string,
    filePreview: PropTypes.bool,
    sectionTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    showThumbnails: PropTypes.bool,
    truncateCount: PropTypes.number
  };
  static defaultProps = {
    attachedMedia: {},
    filePreview: true,
    showThumbnails: true,
    sectionTitle: "Attached Files",
    truncateCount: 0 // 0 means do not truncate
  };

  attachmentProps = {};
  render() {
    const {
      attachedMedia,
      attachmentClassName,
      className,
      filePreview,
      sectionTitle,
      showThumbnails,
      truncateCount
    } = this.props;

    // Remove undefined media
    Object.keys(attachedMedia).forEach(
      key => attachedMedia[key] === undefined && delete attachedMedia[key]
    );
    const attachments = Object.values(attachedMedia);

    this.attachmentProps = {
      attachments,
      className: attachmentClassName,
      filePreview,
      sectionTitle,
      truncateCount
    };

    return (
      <div className={classnames(className)}>
        {attachments.length > 0 && sectionTitle}
        {showThumbnails && <AttachmentView {...this.attachmentProps} />}
        {!showThumbnails && <SimpleAttachmentList {...this.attachmentProps} />}
      </div>
    );
  }
}
export default Attachments;
