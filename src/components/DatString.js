import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isString from 'lodash.isstring';
import result from 'lodash.result';
import cx from 'classnames';

export default class DatString extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.object.isRequired,
    path: PropTypes.string,
    label: PropTypes.string,
    labelwidth: PropTypes.string.isRequired,
    liveupdate: PropTypes.bool.isRequired,
    onUpdate: PropTypes.func,
    _onupdatevalue: PropTypes.func.isRequired
  };

  static defaultProps = {
    className: null,
    style: null,
    path: null,
    label: null,
    onUpdate: () => null
  };

  constructor() {
    super();
    this.state = {
      value: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextValue = result(nextProps.data, nextProps.path);

    if (prevState.value === nextValue) return null;

    return {
      value: nextValue
    };
  }

  handleChange = event => {
    const { value } = event.target;
    const { liveupdate } = this.props;

    if (liveupdate) this.update(value);
  };

  handleFocus = () => {
    document.addEventListener('keydown', this.handleKeyDown);
  };

  handleBlur = () => {
    document.removeEventListener('keydown', this.handleKeyDown);
    window.getSelection().removeAllRanges();

    const { liveupdate } = this.props;
    if (!liveupdate) this.update();
  };

  handleKeyDown = event => {
    const key = event.keyCode || event.which;
    const { liveupdate } = this.props;

    if (key === 13 && !liveupdate) this.update();
  };

  update(value) {
    const { _onupdatevalue, onUpdate, path } = this.props;
    _onupdatevalue(path, value);
    onUpdate(value);
  }

  render() {
    const { path, label, labelwidth, className, style } = this.props;
    const labelText = isString(label) ? label : path;

    return (
      <li className={cx('cr', 'string', className)} style={style}>
        <label>
          <span className="label-text" style={{ width: labelwidth }}>
            {labelText}
          </span>
          <input
            style={{ width: `calc(100% - ${labelwidth})` }}
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </label>
      </li>
    );
  }
}
