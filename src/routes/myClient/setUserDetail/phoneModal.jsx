import React from 'react';
import PropTypes from 'prop-types';
import { trim } from 'lodash';
import {
  Modal, Spin, message, Form, Input, Button,
} from 'antd';
import { getBasicFn } from '@utils';

const namespace = 'setUser';

const propTypes = {
  // user: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.objectOf(PropTypes.any).isRequired,
  phoneModalVisible: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired,
  btnStatus: PropTypes.bool.isRequired,
  codeMsg: PropTypes.string.isRequired,
};

function PhoneModal({
  user, loading, phoneModalVisible, count, btnStatus, codeMsg,
}) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading });

  const [form] = Form.useForm();

  let timer;
  const djs = () => {
    let num = count;
    timer = setInterval(() => {
      if (num > 0) {
        dispatchAction({
          type: 'updateState',
          payload: {
            count: (num -= 1),
            codeMsg: `剩余${num}s`,
          },
        });
      } else {
        dispatchAction({
          type: 'updateState',
          payload: {
            count: 60,
            codeMsg: '重新获取',
            btnStatus: false,
          },
        });
        clearInterval(timer);
      }
    }, 1000);
  };

  const getCode = () => {
    if (!btnStatus && form.getFieldValue('mobile')) {
      form
        .validateFields(['mobile'])
        .then((value) => {
          dispatchAction({
            type: 'updateState',
            payload: {
              btnStatus: true,
            },
          });
          djs();
        });
    }
  };

  const modalProps = {
    title: '换绑手机号码',
    visible: phoneModalVisible,
    maskClosable: false,
    width: 420,
    okText: '提交',
    onCancel() {
      form.resetFields();
      dispatchAction({
        type: 'updateState',
        payload: {
          phoneModalVisible: false,
        },
      });
      clearInterval(timer);
    },
    onOk() {
      form
        .validateFields()
        .then((values) => {
          console.log('Validate:', values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    afterClose() {
      form.resetFields();
      clearInterval(timer);
      dispatchAction({
        type: 'updateState',
        payload: {
          phoneModalVisible: false,
        },
      });
    },
  };
  return (
    <Modal {...modalProps}>
      <Spin spinning={getLoading('setName')}>
        <Form form={form}>
          <Form.Item
            label="手机号码："
            name="mobile"
            initialValue="18222222222"
            rules={[
              { required: true, message: '请输入手机号码' },
              {
                pattern: '^0?(13|14|15|16|17|18|19)[0-9]{9}$',
                message: '请输入正确的手机号码',
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="code"
            style={{ marginLeft: '77px' }}
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  if (!trim(value)) {
                    return Promise.reject('请输入短信验证码');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="输入短信验证码" style={{ width: '140px' }} />
          </Form.Item>
          <Button
            type="primary"
            disabled={btnStatus}
            onClick={getCode}
            style={{
              marginLeft: 15,
              width: '120px',
              position: 'relative',
              top: '-56px',
              right: '-215px',
            }}
          >
            {codeMsg}
          </Button>
        </Form>
      </Spin>
    </Modal>
  );
}
PhoneModal.propTypes = propTypes;

export default (PhoneModal);
