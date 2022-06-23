import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import isString from 'lodash.isstring';
import cx from 'classnames';

const DEFAULT_PRESET_KEY = 'Default';

export default class DatPresets extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.object.isRequired,
    path: PropTypes.string,
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    labelwidth: PropTypes.string.isRequired,
    liveupdate: PropTypes.bool.isRequired,
    onUpdate: PropTypes.func.isRequired
  };

  static defaultProps = {
    className: null,
    style: null,
    path: null
  };

  constructor() {
    super();
    this.state = {
      defaultPreset: null,
      options: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextValue = cloneDeep(nextProps.data);
    const defaultPreset = prevState.defaultPreset
      ? prevState.defaultPreset
      : nextValue;

    return {
      defaultPreset,
      options: [
        { [DEFAULT_PRESET_KEY]: defaultPreset },
        ...nextProps.options.filter(preset => {
          return Object.keys(preset)[0] !== DEFAULT_PRESET_KEY;
        })
      ]
    };
  }

  handleChange = event => {
    const value = JSON.parse(event.target.value);
    const { liveupdate, onUpdate } = this.props;

    if (liveupdate) onUpdate(value);
  };

  render() {
    const { path, label, labelwidth, className, style } = this.props;
    const { options } = this.state;
    const labelText = isString(label) ? label : path;

    return (
      <li className={cx('cr', 'presets', className)} style={style}>
        <label>
          <span className="label-text" style={{ width: labelwidth }}>
            {labelText}
          </span>
          <select
            onChange={this.handleChange}
            style={{ width: `calc(100% - ${labelwidth})` }}
          >
            {options.map(preset => {
              return Object.keys(preset).map(key => {
                return (
                  <option key={key} value={JSON.stringify(preset[key])}>
                    {key}
                  </option>
                );
              });
            })}
          </select>
        </label>
      </li>
    );
  }
}
