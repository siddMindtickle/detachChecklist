import React from "react";
import PropTypes from "prop-types";

const Toolbar = ({ id }) => {
  return (
    <div id={id}>
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-link" />
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
    </div>
  );
};
Toolbar.propTypes = {
  id: PropTypes.string.isRequired
};

export default Toolbar;
