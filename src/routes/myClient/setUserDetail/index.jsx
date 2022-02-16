import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import {
  Spin,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getBasicFn } from '@utils';
import Style from './index.module.less';
import GetForm from './getForm';
import PhoneModal from './phoneModal';

const namespace = 'setUser';
const propTypes = {
  setUser: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.objectOf(PropTypes.any).isRequired,
};
function SetUser({ setUser, loading }) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading });
  const {
    codeMsg, btnStatus, user, count, phoneModalVisible,
  } = setUser;

  // 绑定手机号
  const handleMobile = () => {
    dispatchAction({
      type: 'updateState',
      payload: {
        phoneModalVisible: true,
      },
    });
  };

  // 重绑手机号弹框
  const phoneModalProps = {
    codeMsg,
    btnStatus,
    user,
    count,
    loading,
    phoneModalVisible,
  };

  return (
    <div className={Style.wrap}>
      <div className={Style.content}>
        <div className={Style.title}>个人资料</div>
        <div className={Style.items}>
          <span className={Style.required}>*</span>
          真实姓名
          <span className={Style.body}>大宝</span>
        </div>
        <div className={Style.items}>
          <span className={Style.required}>*</span>
          手机号码
          <span className={Style.body}>18222222222</span>
          <span>
            <a onClick={handleMobile}>
              <EditOutlined style={{ margin: '0 12px' }} />
              重新绑定
            </a>
          </span>
        </div>
      </div>
      <div className={Style['password-content']}>
        <div className={Style.title}>密码修改</div>
        <div style={{ width: '660px' }}>
          <Spin spinning={getLoading()}>
            <GetForm />
          </Spin>
        </div>
      </div>
      <PhoneModal {...phoneModalProps} />
    </div>
  );
}
SetUser.propTypes = propTypes;
export default connect(({ setUser, loading }) => ({
  setUser,
  loading,
}))((SetUser));
