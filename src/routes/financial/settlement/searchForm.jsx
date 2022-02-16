import React, { useEffect } from 'react';
import { connect } from 'dva';
import {
  Form, Select, Input, Button, TreeSelect,
} from 'antd';
import PropTypes from 'prop-types';

const { SHOW_PARENT } = TreeSelect;
const { Option } = Select;

const propTypes = {
  settlement: PropTypes.objectOf(PropTypes.any).isRequired,
  // getAllCompanyList: PropTypes.arrayOf(PropTypes.any).isRequired,
  onSearch: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};
function SearchForm({
  settlement, getAllCompanyList, onSearch, onReset,
}) {
  const { allProductList, settlementSearchData } = settlement;
  const { customerQuickSearch, productId, serviceIds } = settlementSearchData;

  const [form] = Form.useForm();
  const { setFieldsValue } = form;

  // 首次进入
  useEffect(() => {
    setFieldsValue({
      productId,
      customerQuickSearch,
      serviceIds,
    });
  }, [productId, customerQuickSearch, serviceIds, setFieldsValue]);

  // 服务单位props
  const tProps = {
    treeData: getAllCompanyList,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    treeDefaultExpandedKeys: ['F7A545749898009511926'],
    placeholder: '请选择',
    showSearch: false,
    style: {
      width: '100%',
    },
  };
  return (
    <Form layout="inline" onFinish={onSearch} form={form}>
      <Form.Item label="客户名称：" name="customerQuickSearch">
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item label="开通产品：" name="productId">
        <Select placeholder="请选择" allowClear>
          {allProductList.map(({ id, productName }) => (
            <Option value={id} key={id}>
              {productName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="服务单位：" name="serviceIds" className="specialTreeSelect">
        <TreeSelect {...tProps} />
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
export default connect(({ settlement }) => ({
  settlement,
}))(SearchForm);
