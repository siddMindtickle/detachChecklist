import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import MenuItem from "react-bootstrap/lib/MenuItem";

import Input from "@components/input";
import { debounce } from "@utils";

import style from "./index.scss";
import Form from "@containers/form";
import TextField from "@containers/form/components/textField";
import SubmitButton from "@containers/form/components/submitButton";
import FieldContainer from "@containers/form/components/fieldContainer";

import { DEFAULT_INPUT_WAIT } from "../../config/constants";

export default class NewLearnerForm extends Component {
  static propTypes = {
    addToLearnerList: PropTypes.func.isRequired,
    search: PropTypes.func,
    searchedLearners: PropTypes.array
  };
  state = {
    email: "",
    name: "",
    dropDownOptions: [],
    expanded: false
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.searchedLearners !== nextProps.searchedLearners) {
      const dropDownOptions = nextProps.searchedLearners.map(({ email }) => {
        return (
          <MenuItem key={email} eventKey={email} onSelect={this.onSelectLearner}>
            {email}
          </MenuItem>
        );
      });
      this.setState({ dropDownOptions });
    }
  }

  setWrapperRef = node => (this.wrapperRef = node);

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ expanded: false });
    }
  };

  emailChange = debounce(email => {
    if (email) {
      this.props.search(email);
    }
    this.setState({ email, expanded: !!email });
  }, DEFAULT_INPUT_WAIT);

  nameChange = debounce(name => {
    this.setState({ name });
  }, DEFAULT_INPUT_WAIT);

  onEmailChange = event => this.emailChange(event.target.value);

  onNameChange = event => this.nameChange(event.target.value);

  addToList = data => {
    const {
      email: { value: email }
    } = data;
    const name = this.state.name;
    this.props.addToLearnerList(email, name);
    this.setState({ dropDownOptions: [], email: "", name: "" });
  };

  onSelectLearner = eventkey =>
    this.setState({ email: eventkey, dropDownOptions: [], expand: false });

  render() {
    const { email, name, dropDownOptions, expanded, className } = this.state;

    return (
      <Form
        name="addInviteNewLearners"
        className={classnames("addInviteNewLearnersInput", className)}
        onSubmit={this.addToList}
      >
        <TextField
          name="email"
          placeholder="Email Id"
          className={style.inputBox}
          validate={["required", "email"]}
          onChange={this.onEmailChange}
          value={email}
        />
        <Input
          name="name"
          placeholder="Full name (Optional)"
          className={style.fullNameInput}
          onChange={this.onNameChange}
          value={name}
        />

        <div
          ref={this.setWrapperRef}
          className={classnames("addInviteDropdown", {
            expanded: expanded && !!dropDownOptions.length
          })}
        >
          {dropDownOptions}
        </div>

        <FieldContainer className="marginT20">
          <SubmitButton name="submit" buttonType="DefaultSm">
            Add To List
          </SubmitButton>
        </FieldContainer>
      </Form>
    );
  }
}
