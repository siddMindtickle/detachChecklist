import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import ReactDropdown from "react-bootstrap/lib/Dropdown";
import MenuItem from "react-bootstrap/lib/MenuItem";

import Icon from "@components/icon";
import Checkbox from "@components/checkbox";
import OpenSearch from "@components/openSearch";
import Loader from "@components/loader";
import { deepEqual, convertArrayToObject } from "@utils";
import style from "./index.scss";

const noop = () => undefined;

class Dropdown extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func,
    onToggle: PropTypes.func,
    disabled: PropTypes.bool,
    setTitle: PropTypes.bool,
    customIcon: PropTypes.string,
    className: PropTypes.string,
    horizontal: PropTypes.bool,
    noCaret: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    changeOption: PropTypes.bool,
    multiple: PropTypes.bool,
    search: PropTypes.bool,
    show: PropTypes.bool,
    loading: PropTypes.bool,
    selected: PropTypes.array,
    closeOnSelect: PropTypes.bool,
    showSelectedValues: PropTypes.bool,
    caretPosition: PropTypes.oneOf(["left", "right"])
  };
  static defaultProps = {
    onSelect: noop,
    onToggle: noop,
    horizontal: false,
    noCaret: false,
    setTitle: false,
    disabled: false,
    defaultOpen: false,
    loading: false,
    closeOnSelect: true,
    changeOption: false,
    selected: []
  };

  state = {
    title: this.props.title,
    options: this.props.options,
    selectedItems: {},
    show: !!this.props.show
  };

  onSelect = (value, event) => {
    const { onSelect, setTitle } = this.props;
    const title = event.target.dataset.title;
    if (setTitle) {
      this.setState({ title });
    }
    onSelect(value, event, { title });
  };
  onCheckboxClick = (clickedValue, event = {}) => {
    const { selectedItems: oldSelection } = this.state;
    const { onSelect, options, showSelectedValues } = this.props;

    let newSelection = { ...oldSelection };

    const aggregatedOption = options.find(option => option.isAggregatedValue);

    newSelection[clickedValue] = !newSelection[clickedValue];

    if (aggregatedOption && aggregatedOption.value === clickedValue) {
      newSelection = { [clickedValue]: newSelection[clickedValue] };
    } else {
      if (aggregatedOption) newSelection[aggregatedOption.value] = false;
    }

    const count = Object.keys(newSelection).filter(selectedItem => newSelection[selectedItem])
      .length;

    let titleText = count > 0 ? `${count} selected` : this.props.title;

    if (showSelectedValues && count > 0) {
      const allSelectedArray = [];
      Object.keys(newSelection).forEach(selectedItem => {
        let selectedOption = options.find(
          option => option.value === selectedItem && newSelection[selectedItem]
        );
        if (selectedOption) allSelectedArray.push(selectedOption.text);
      });
      titleText = allSelectedArray.join(", ");
    }

    let newState = {
      ...this.state,
      selectedItems: { ...newSelection },
      title: titleText
    };

    if (aggregatedOption) delete newSelection[aggregatedOption.value];

    const selectedValues = Object.keys(newSelection).reduce((selectedValues, selectedItem) => {
      if (newSelection[selectedItem]) selectedValues.push(selectedItem);
      return selectedValues;
    }, []);

    this.setState(newState);
    onSelect(selectedValues, event);
  };

  getItemInitialValue = value => {
    const { multiple } = this.props;
    const { selectedItems } = this.state;
    const initialValue = [];
    if (multiple) {
      initialValue.push(
        <Checkbox
          key={`${value}-checkbox`}
          checked={!!selectedItems[value]}
          onClick={event => {
            event.stopPropagation();
            this.onCheckboxClick(value, event);
          }}
        />
      );
    }
    return initialValue;
  };

  onToggle = (isOpen, event, source) => {
    if ((!this.props.closeOnSelect || this.props.multiple) && source.source == "select") return;
    this.setState({ show: isOpen });
    this.props.onToggle(isOpen, event);
  };

  onSearch = value => {
    const { options } = this.props;
    if (value) {
      const newOptions = options.filter(option => {
        return option.text.toLowerCase().includes(value.toLowerCase());
      });
      this.setState({ options: newOptions });
    } else {
      this.setState({ options });
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.props.title) {
      this.setState({ title: nextProps.title });
    }
    if (!deepEqual(nextProps.selected, this.props.selected) && nextProps.multiple) {
      this.setState({
        selectedItems: convertArrayToObject(nextProps.selected),
        title: `${nextProps.selected.length} selected`
      });
    }
    if (!nextProps.loading && nextProps.loading !== this.props.loading) {
      this.setState({ options: nextProps.options });
    }

    if (!deepEqual(nextProps.options, this.props.options) || nextProps.changeOption) {
      this.setState({ options: nextProps.options });
    }

    if (nextProps.show !== this.props.show) {
      this.setState({
        show: nextProps.show
      });
    }
  }

  render() {
    const {
      customIcon,
      className,
      id,
      horizontal,
      noCaret,
      disabled,
      defaultOpen,
      multiple,
      search,
      loading,
      caretPosition
    } = this.props;
    const { title, show, options } = this.state;
    var menulist = options.map((option, index) => {
      let item = this.getItemInitialValue(option.value);
      if (option.icon) item.push(<i key="icon" className={`icon-${option.icon}`} />);
      if (option.element) {
        item.push(option.element);
      } else {
        item.push(option.text);
      }

      return (
        <MenuItem
          eventKey={option.value}
          data-title={item}
          key={index}
          onSelect={(value, event) => {
            multiple && this.onCheckboxClick(value, event);
          }}
          {...option}
        >
          {item}
        </MenuItem>
      );
    });
    if (search) {
      menulist.unshift(<OpenSearch key="search" onSearch={this.onSearch} />);
    }
    if (loading) {
      menulist = [<Loader key="loader" size="sizeXSmall" vCenter={true} />];
    }
    return (
      <div className={classnames(style.dropdownCustom, className)}>
        <ReactDropdown
          onSelect={multiple ? noop : this.onSelect}
          id={id}
          disabled={disabled}
          defaultOpen={defaultOpen}
          onToggle={(...args) => this.onToggle(...args)}
          open={show}
        >
          <ReactDropdown.Toggle noCaret={!!customIcon || noCaret} className="caretStyle">
            <div className="titileDropdown">
              {customIcon && <Icon type={customIcon} className={className} />}
              {title}
            </div>
          </ReactDropdown.Toggle>

          <ReactDropdown.Menu
            className={classnames({
              horizontalMenu: horizontal,
              caretLeft: caretPosition == "left",
              caretRight: caretPosition == "right"
            })}
          >
            {/* {horizontal ? (
              <div className="customeListDiv">{menulist}</div>
            ) : ( */}
            {menulist}
            {/* )} */}
          </ReactDropdown.Menu>
        </ReactDropdown>
      </div>
    );
  }
}

export default Dropdown;
