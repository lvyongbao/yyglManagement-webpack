import React from 'react';
import { connect } from 'dva';
import {
  Form, Input, Button, DatePicker,
} from 'antd';
import PropTypes from 'prop-types';
import { getBasicFn } from '@utils';

const { RangePicker } = DatePicker;

const propTypes = {
  // myClient: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.objectOf(PropTypes.any).isRequired,
};

const namespace = 'myClient';
function SearchForm({ myClient, loading }) {
  const { dispatchAction } = getBasicFn({ namespace, loading });

  const [form] = Form.useForm();

  // 搜索提交
  const handleSubmit = (values) => {
    console.log('Success:', values);
  };
  // 表单重置
  const resets = () => {
    form.resetFields();
  };
  const onChange = (dates, dateStrings) => {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  };

  return (
    <Form layout="inline" onFinish={handleSubmit} form={form}>
      <Form.Item label="客户名称：" name="quickSearch">
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item label="添加时间：" name="time">
        <RangePicker
          onChange={onChange}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
      </Form.Item>
      <Form.Item>
        <Button onClick={resets}>重置</Button>
      </Form.Item>
    </Form>
  );
}
SearchForm.propTypes = propTypes;
export default connect(({ myClientRecords, loading }) => ({
  myClientRecords,
  loading,
}))(SearchForm);
