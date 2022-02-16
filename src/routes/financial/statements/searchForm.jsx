import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import PropTypes from 'prop-types';
import moment from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const propTypes = {
  statements: PropTypes.objectOf(PropTypes.any).isRequired,
  onSearch: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  getDates: PropTypes.func.isRequired,
  disabledDate: PropTypes.func.isRequired,
};
function SearchForm({ statements, onSearch, onReset, disabledDate, getDates }) {
  const [form] = Form.useForm();
  const { setFieldsValue } = form;

  const { statementsSearchData } = statements;
  const { status, endTime, startTime, settlementNo } = statementsSearchData;

  // 首次进入
  useEffect(() => {
    setFieldsValue({
      status,
      settlementNo,
      time: [startTime ? moment(startTime) : undefined, endTime ? moment(endTime) : undefined],
    });
  }, [status, settlementNo, startTime, endTime, setFieldsValue]);

  return (
    <Form layout="inline" onFinish={onSearch} form={form}>
      <Form.Item label="结算单号：" name="settlementNo">
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item label="状态：" name="status">
        <Select placeholder="请选择">
          <Option value={0}>待确认</Option>
          <Option value={1}>待核销</Option>
          <Option value={2}>已核销</Option>
          <Option value={3}>确认失败</Option>
        </Select>
      </Form.Item>
      <Form.Item label="创建时间：" name="time">
        <RangePicker
          locale={locale}
          disabledDate={disabledDate}
          onCalendarChange={(val) => getDates(val)}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
      </Form.Item>
      <Form.Item>
        <Button
          onClick={() => {
            onReset(form);
          }}
        >
          重置
        </Button>
      </Form.Item>
    </Form>
  );
}
SearchForm.propTypes = propTypes;
export default connect(({ statements }) => ({
  statements,
}))(SearchForm);
