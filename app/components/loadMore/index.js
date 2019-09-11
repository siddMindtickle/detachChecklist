import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Loader from "@components/loader";
import style from "./index.scss";

const LoadMore = ({ handleLoad, loading }) => {
  return (
    <div className={classnames("center_100_Percent", style.loadMore)} onClick={handleLoad}>
      {loading ? <Loader vCenter={true} /> : "Load More"}
    </div>
  );
};
LoadMore.propTypes = {
  handleLoad: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default LoadMore;
