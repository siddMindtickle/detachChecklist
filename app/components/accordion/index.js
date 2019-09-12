import React, { Component } from "react";
import PanelGroup from "react-bootstrap/lib/PanelGroup";
import Panel from "react-bootstrap/lib/Panel";
import PropTypes from "prop-types";

import Button from "@components/button";
import Icon from "@components/icon";
import MenuItem from "react-bootstrap/lib/MenuItem";
import "./index.scss";

class Accordion extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  state = {
    activeKey: this.props.options[0].value,
    open: false
  };

  handleSelect = activeKey => {
    this.setState({ activeKey });
  };

  onMenuSelection = eventKey => {
    const { activeKey } = this.state;
    if (activeKey) {
      this.props.onSelect(activeKey, eventKey);
      this.setState({ open: false });
    }
  };

  parseOptionChildren = options => {
    return options.map(({ title, value }) => {
      return (
        <MenuItem key={value} eventKey={value} onSelect={this.onMenuSelection}>
          {title}
        </MenuItem>
      );
    });
  };

  onBtnClick = () => {
    this.setState({ open: !this.state.open });
  };

  UNSAFE_componentWillMount() {
    const { options } = this.props;
    this.options = options.map(({ value, title, children }) => {
      return (
        <Panel eventKey={value} key={value}>
          <Panel.Heading className="ac_panelHeading">
            <Panel.Title toggle>
              <span className="ac_panelListdropdown">{title}</span>
              <Icon type="Down_arrow" className="ac_panelDownArrow" />
              <Icon type="Up_arrow" className="ac_panelUpArrow" />
            </Panel.Title>
          </Panel.Heading>
          {children && <Panel.Body collapsible>{this.parseOptionChildren(children)}</Panel.Body>}
        </Panel>
      );
    });
    this.setState({
      activeKey: options[0].value,
      open: false
    });
  }

  render() {
    const { activeKey, open } = this.state;
    const { title } = this.props;
    return (
      <div className="ac_wrapper">
        <Button type="PrimarySm" onClick={this.onBtnClick}>
          {title}
        </Button>
        {open && (
          <PanelGroup
            accordion
            id="accordion-controlled"
            activeKey={activeKey}
            onSelect={this.handleSelect}
          >
            {this.options}
          </PanelGroup>
        )}
      </div>
    );
  }
}

export default Accordion;
