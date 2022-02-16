import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import Style from './index.module.less';

const { Option } = Select;

const propTypes = {
  // userInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  handleOut: PropTypes.func.isRequired,
  // enterprise: PropTypes.objectOf(PropTypes.any).isRequired,
};
function Header({ userInfo, handleOut, enterprise }) {
  // const { userName, photo, enterpriseId, registerType } = userInfo;
  // const { enterpriseList, fristId } = enterprise;

  return (
    <div className={Style.header}>
      {/* 顶部菜单, 有驾驶舱菜单才出现 */}
      {/* {cockpitMenuData && cockpitMenuData.length > 0 && <TopNav />} */}
      <div>
        <div className={Style.headerIcon}>
          {/* {photo ? (
            <img src={photo} width="25" height="25" alt="" />
          ) : (
            <img src="" width="25" height="25" alt="" />
          )} */}
          <span style={{ padding: '0 10px' }}>大宝</span>
          {/* <Select
            value={fristId}
            className="companyDefault"
            style={{ maxWidth: 300, verticalAlign: 'baseline', marginRight: '16px' }}
            onChange={handleOut}
          >
            {enterpriseList &&
              enterpriseList.map((item) => (
                <Option
                  key={item.enterpriseId}
                  value={item.enterpriseId}
                  title={item.enterpriseName}
                >
                  {item.enterpriseName}
                </Option>
              ))}
          </Select> */}
          <span
            style={{ cursor: 'pointer', fontSize: '14px', color: '#1890FF' }}
            onClick={() => {
              handleOut('1');
            }}
          >
            退出
          </span>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = propTypes;

export default Header;
