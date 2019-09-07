import React, { Component } from "react";
import PropTypes from "prop-types";

// import Layout from "~/components/Layout";
import style from "./list.scss";

class View extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  render() {
    return (
      // <Layout>
      <div className={style.mainDiv}>
        <pre>{JSON.stringify(this.props.data, undefined, 4)}</pre>
      </div>
      // </Layout>
    );
  }
}

export default View;
