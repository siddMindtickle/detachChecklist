import { Component } from "react";
import PropTypes from "prop-types";
import { infoToast as InfoToast } from "@utils/toast";

import { deepEqual, noop } from "@utils";
import { DEFAULT_OPTIONS, MESSAGES } from "./constants";
export default class AutoSave extends Component {
  static propTypes = {
    processor: PropTypes.func.isRequired,
    enqueue: PropTypes.func.isRequired,
    onComplete: PropTypes.func,
    time: PropTypes.number,
    saved: PropTypes.bool,
    retry: PropTypes.number,
    maxQueueLength: PropTypes.number
  };

  static defaultProps = {
    saved: false,
    onComplete: noop,
    time: DEFAULT_OPTIONS.TIME,
    maxQueueLength: DEFAULT_OPTIONS.QUEUE_LENGTH,
    retry: DEFAULT_OPTIONS.RETRY
  };

  autoSaveTimer = null;
  lastProcessData = {};
  retriedCount = 0;
  queue = [];

  processWithRetry = () => {
    const { processor, retry } = this.props;
    const processData = this.queue[0];
    this.retriedCount = deepEqual(processData, this.lastProcessData) ? this.retriedCount + 1 : 0;
    this.lastProcessData = processData;
    if (this.retriedCount <= retry) {
      processData && processor(processData);
    } else {
      InfoToast({
        message: MESSAGES.UPDATE_FAIL,
        autoHide: false,
        freeze: true,
        reloadBtn: true
      });
    }
  };

  saveDetails = () => {
    const { enqueue, maxQueueLength, onComplete } = this.props;
    const queueData = enqueue();
    if (queueData) {
      if (this.queue.length >= maxQueueLength) {
        InfoToast({ message: MESSAGES.QUEUE_FULL });
      }
      this.queue.push(queueData);
    } else if (!this.queue.length) {
      onComplete();
    }
    this.processWithRetry();
  };

  componentDidUpdate(prevProps) {
    const { saved } = this.props;
    if (deepEqual(this.props, prevProps)) return;

    if (saved) {
      this.queue.shift();
    }
  }

  forceEnqueue = () => {
    const queueData = this.props.enqueue(true);
    queueData && this.queue.push(queueData);
  };

  forceProcess = () => {
    const processData = this.queue[0];
    processData && this.props.processor(processData);
  };

  forceStop = () => {
    this.autoSaveTimer && clearInterval(this.autoSaveTimer);
    this.autoSaveTimer = null;
    this.queue = [];
  };

  componentDidMount() {
    const { enqueue, processor, time } = this.props;
    if (enqueue && processor) {
      this.autoSaveTimer = setInterval(() => {
        this.saveDetails();
      }, time);
    }
  }

  componentWillUnmount() {
    this.autoSaveTimer && clearInterval(this.autoSaveTimer);
    this.autoSaveTimer = null;
    this.props.onComplete();
  }
  render() {
    return null;
  }
}
