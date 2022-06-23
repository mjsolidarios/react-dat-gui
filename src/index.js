import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import cx from 'classnames';
import isUndefined from 'lodash.isundefined';
import set from 'lodash.set';
import './style/dat.scss';

export default class DatGui extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    onUpdate: PropTypes.func.isRequired,
    liveupdate: PropTypes.bool,
    labelwidth: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    liveupdate: true,
    className: null,
    style: null,
    labelwidth: '40%'
  };

  handleUpdateValue = (path, value) => {
    const { data, onUpdate } = this.props;
    const dataUpdated = set(cloneDeep(data), path, value);

    onUpdate(dataUpdated);
  };

  renderChildren() {
    const { children, data } = this.props;

    return React.Children.toArray(children).map((child, i) => {
      const liveupdate = isUndefined(child.props.liveupdate)
        ? this.props.liveupdate
        : child.props.liveupdate;
      const labelwidth = isUndefined(child.props.labelwidth)
        ? this.props.labelwidth
        : child.props.labelwidth;

      return cloneElement(child, {
        key: i,
        data,
        liveupdate,
        labelwidth,
        _onupdatevalue: this.handleUpdateValue
      });
    });
  }

  render() {
    const { style, className } = this.props;
    const classNames = cx('react-dat-gui', className);

    return (
      <div className={classNames} style={style}>
        <ul className="dg main">{this.renderChildren()}</ul>
      </div>
    );
  }
}

export { default as DatString } from './components/DatString';
export { default as DatNumber } from './components/DatNumber';
export { default as DatBoolean } from './components/DatBoolean';
export { default as DatButton } from './components/DatButton';
export { default as DatFolder } from './components/DatFolder';
export { default as DatSelect } from './components/DatSelect';
export { default as DatColor } from './components/DatColor';
export { default as DatPresets } from './components/DatPresets';
