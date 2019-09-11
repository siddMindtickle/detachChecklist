import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import MenuItem from "react-bootstrap/lib/MenuItem";

import Button from "@components/button";
import Icon from "@components/icon";
import Input from "@components/input";
import Uploader from "@components/uploader";

import { parseThumbnails } from "../../api/thumbnail";
import withRoundButtons from "@hocs/withButtons";

import { HEADER_DISPLAY_NAMES, THUMB_TYPES, NO_CUSTOM_IMAGE } from "../../config/constants";
import style from "./index.scss";

const RenameThumb = withRoundButtons(Input);

class ThumbEl extends Component {
  static propTypes = {
    thumbnail: PropTypes.object.isRequired,
    selectedThumb: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    rename: PropTypes.func.isRequired
  };
  state = {
    edit: false
  };
  toggleEditMode = (edit = true) => {
    this.setState({ edit });
  };
  onCancel = () => {
    this.toggleEditMode(false);
  };
  onRename = value => {
    const { thumbnail, rename } = this.props;
    thumbnail.thumbTitle !== value && rename({ ...thumbnail, thumbTitle: value });
    this.onCancel();
  };
  getThumbEl = () => {
    const { thumbnail, type, remove } = this.props;
    if (type == THUMB_TYPES.MT) {
      return thumbnail.thumbTitle;
    } else {
      return this.state.edit ? (
        <RenameThumb
          name="rename_thumb"
          ok={this.onRename}
          cancel={this.onCancel}
          value={thumbnail.thumbTitle}
        />
      ) : (
        <div>
          <span className="th_title">{thumbnail.thumbTitle}</span>
          <span className="th_hoverSate">
            <Icon type="delete" onClick={() => remove(thumbnail)} />
            <Icon type="edit" onClick={() => this.toggleEditMode()} />
          </span>
          <div className="clear" />
        </div>
      );
    }
  };
  render() {
    const { thumbnail, onSelect, selectedThumb } = this.props;
    return (
      <MenuItem
        eventKey={thumbnail}
        onSelect={() => {
          onSelect(thumbnail);
        }}
        className={classnames({
          [style.active]: thumbnail.thumbId == selectedThumb.thumbId
        })}
      >
        {this.getThumbEl()}
      </MenuItem>
    );
  }
}

class ThumbnailList extends Component {
  static propTypes = {
    thumbnails: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedThumb: PropTypes.object.isRequired
  };
  render() {
    const { thumbnails, ...rest } = this.props;
    return (
      <ul>
        {Object.keys(thumbnails).map((section, index) => {
          return (
            <div key={index}>
              <MenuItem header>
                <div className="th_heading">{HEADER_DISPLAY_NAMES[section]}</div>
                <div className="th_legendLine" />
              </MenuItem>
              {thumbnails[section].length
                ? thumbnails[section].map((thumb, idx) => {
                    return <ThumbEl key={idx} thumbnail={thumb} type={section} {...rest} />;
                  })
                : NO_CUSTOM_IMAGE}
              <MenuItem />
            </div>
          );
        })}
      </ul>
    );
  }
}

export default class EditThumbnail extends Component {
  static propTypes = {
    thumbnails: PropTypes.shape({
      default: PropTypes.array,
      custom: PropTypes.array
    }),
    className: PropTypes.string,
    cancel: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    updateList: PropTypes.func.isRequired,
    selectedThumb: PropTypes.object.isRequired
  };

  state = {
    selectedThumb: this.props.selectedThumb
  };

  uploadBtn = () => {
    return (
      <Button key="cancel" type="DefaultSm" className={classnames("marginT20", "marginR10")}>
        Upload Custom Thumbnail
      </Button>
    );
  };
  updateThumbList = ({ mediaObj = {} }) => {
    const thumb = parseThumbnails({ thumbnails: [mediaObj] });
    this.props.updateList(thumb);
    parseThumbnails({ thumbnails: [mediaObj] });
    this.setState({ selectedThumb: Object.values(thumb)[0] });
  };

  render() {
    const { cancel, update, ...rest } = this.props;
    const { selectedThumb } = this.state;
    return [
      <div key="ThumbnailList" className="th_wrapper">
        <div className="th_Box">
          <div className="th_List">
            <ThumbnailList
              key="thumbnailList"
              {...rest}
              onSelect={value => {
                this.setState({ selectedThumb: value });
              }}
              selectedThumb={selectedThumb}
            />
          </div>
        </div>
        <div className="thumbnail">
          <img key="selectedThumbnail" src={this.state.selectedThumb.thumbUrl} />
        </div>
        <Uploader type="THUMB" update={this.updateThumbList} target={this.uploadBtn()} />
        {/* <span className="th_text">sample.jpg</span> */}
      </div>,
      <div className="modal_footerWrapper" key="thumbnailFooter">
        <Button name="cancelThumbnail" onClick={cancel} type="DefaultSm" className="marginR10">
          Cancel
        </Button>
        <Button
          name="updateThumbnail"
          type="PrimarySm"
          className="marginR10"
          onClick={() => update(this.state.selectedThumb)}
        >
          Done
        </Button>
      </div>
    ];
  }
}
