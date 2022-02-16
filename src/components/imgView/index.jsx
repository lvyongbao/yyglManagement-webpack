import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'antd';
import './index.module.less';

const propTypes = {
  src: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};
const ImgView = ({ src, width, height }) => {
  const [stateIF, setStateIF] = useState(true);
  const img = new window.Image();
  img.src = src;
  img.onload = () => (img.height > img.width ? setStateIF(true) : setStateIF(false));
  return (
    <div className="imgView" style={{ width, height }}>
      {stateIF ? <Image height="100%" src={src} /> : <Image width="100%" src={src} />}
    </div>
  );
};

ImgView.propTypes = propTypes;
ImgView.defaultProps = {
  src: '',
  width: '100px',
  height: '100px',
};
export default ImgView;
