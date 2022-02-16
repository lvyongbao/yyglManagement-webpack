import React from 'react';
import { connect } from 'dva';
import {
  Form, Input, Button, Row, Col,
} from 'antd';
import PropTypes from 'prop-types';
import { getBasicFn } from '@utils';

const propTypes = {
  loading: PropTypes.objectOf(PropTypes.any).isRequired,
};

const namespace = 'setUser';
function GetForm({ loading }) {
  const { dispatchAction } = getBasicFn({ namespace, loading });

  const [form] = Form.useForm();

  // 提交
  const handleSubmit = (values) => {
    console.log('Success:', values);
  };
  return (
    <Form onFinish={handleSubmit} form={form} className="password">
      <Row>
        <Col span={24}>
          <Form.Item
            label="当前密码"
            name="pwd"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="新密码"
        name="newPwd"
        rules={[
          ({ getFieldValue }) => ({
            required: true,
            validator: (_, value) => {
              const pwd = getFieldValue('pwd');
              const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^\sA-Za-z0-9])\S{8,20}$/;
              if (!reg.test(value)) {
                return Promise.reject('密码长度8~20个字符且至少包含大写字母、小写字母、数字及特殊字符');
              } if (pwd === value) {
                return Promise.reject('新密码与当前密码相同');
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input.Password placeholder="请输入新密码" />
      </Form.Item>
      <Form.Item
        label="确认新密码"
        name="ensurePwd"
        rules={[
          ({ getFieldValue }) => ({
            required: true,
            validator: (_, value) => {
              const newpwd = getFieldValue('newPwd');
              if (value !== newpwd) {
                return Promise.reject('两次密码输入不一致，请重新输入');
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input.Password placeholder="再次输入新密码" />
      </Form.Item>
      <div style={{ marginLeft: '25%' }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </div>
    </Form>
  );
}
GetForm.propTypes = propTypes;
export default connect(({ loading }) => ({
  loading,
}))(GetForm);
