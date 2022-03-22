import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './index.module.less';

const propTypes = {
  children: PropTypes.node,
  placement: PropTypes.string,
  title: PropTypes.string,
};
const IconTooltip = ({ children, ...others }) => {
  const childrens = {
    ...children,
    props: {
      className: 'tooltipIcon',
      style: {
        marginLeft: '6px',
      },
    },
  };
  return <Tooltip {...others}>{childrens}</Tooltip>;
};

IconTooltip.propTypes = propTypes;
IconTooltip.defaultProps = {
  children: <InfoCircleOutlined />,
  placement: 'top',
  title: '信息填写有误',
};
export default IconTooltip;
