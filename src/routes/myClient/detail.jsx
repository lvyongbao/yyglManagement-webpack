import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, Button, message, Input, Cascader, Upload,
} from 'antd';
import { connect } from 'dva';
import { cloneDeep } from 'lodash';
import { getBasicFn } from '@utils';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import CountInput from '@components/inputCount';
import Style from './index.module.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('图片格式仅支持jpg、jpeg、png！');
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('文件大小不能超过5M！');
  }
  return isJpgOrPng && isLt5M;
}

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const propTypes = {
  myClientDetail: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.objectOf(PropTypes.any).isRequired,
};
const namespace = 'myClientDetail';
function Detail({ myClientDetail, loading }) {
  const {
    myClientDetailType, detailData, imgUrl, uploadLoading,
  } = myClientDetail;

  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading });
  const [form] = Form.useForm();

  // 搜索提交
  const handleSubmit = (values) => {
    console.log('Success:', values);
  };
  // 表单重置
  const resets = () => {
    form.resetFields();
  };

  const onChange = (value) => {
    console.log(value);
  };

  const handleChange = (info, index) => {
    if (info.file.status === 'uploading') {
      dispatchAction({
        type: 'updateState',
        payload: {
          uploadLoading: true,
        },
      });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl) => dispatchAction({
        type: 'updateState',
        payload: {
          imgUrl: imageUrl,
          uploadLoading: false,
        },
      }));
    }
  };

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  const propsData = {
    name: 'avatar',
    listType: 'picture-card',
    className: 'avatar-uploader',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    showUploadList: false,
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <div className="form-detail">
      <Form
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 10 }}
        onFinish={handleSubmit}
        form={form}
        className={Style.addClient}
      >
        <div className={Style.formTitle}>
          <h4>一、客户基础信息</h4>
        </div>
        <Form.Item
          label="客户税号："
          name="taxcode"
          rules={[
            { required: true, message: '请输入客户税号' },
            {
              pattern: '^([a-zA-Z0-9]){10}([a-zA-Z0-9]{5,10})?$',
              message: '请输入正确的企业税号',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="客户名称："
          name="khname"
          rules={[{ required: true, message: '请输入客户名称' }]}
        >
          <CountInput placeholder="请输入" maxLimit={50} />
        </Form.Item>
        <Form.Item
          label="行政区划："
          name="cascader"
          rules={[{ required: true, message: '请选择行政区划' }]}
        >
          <Cascader placeholder="请选择" options={options} onChange={onChange} />
        </Form.Item>
        <Form.Item
          label="开户行："
          name="bank"
          rules={[
            { required: false },
            {
              pattern: '^[A-Za-z\u4e00-\u9fa5]+$',
              message: '请输入正确的开户行',
            },
          ]}
        >
          <CountInput placeholder="请输入" maxLimit={20} />
        </Form.Item>
        <Form.Item
          label="开户行帐号："
          name="bankcode"
          rules={[
            { required: false },
            {
              pattern: '^\\d+$',
              message: '请输入正确的开户行帐号',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="详细地址：" name="address">
          <CountInput placeholder="请输入" maxLimit={50} />
        </Form.Item>
        <Form.Item
          name="upload"
          label="营业执照："
          rules={[{ required: true, message: '请上传营业执照' }]}
          extra="请上传不超过 5M 的 JPG/JPEG/PNG 格式文件"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            {...propsData}
            beforeUpload={beforeUpload}
            onChange={(value) => {
              handleChange(value, 'zhizhao');
            }}
          >
            {imgUrl ? <img src={imgUrl} style={{ width: '100%', height: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
        <div className={Style.formTitle}>
          <h4>二、法定代表人信息</h4>
        </div>
        <Form.Item
          label="姓名："
          name="frname"
          rules={[
            { required: true, message: '请输入姓名' },
            {
              pattern: '^([A-Za-z]|[\u4E00-\u9FA5·])+$',
              message: '请输入正确的姓名',
            },
          ]}
        >
          <CountInput placeholder="请输入" maxLimit={30} />
        </Form.Item>
        <Form.Item
          label="身份证号码："
          name="sfzcode"
          rules={[
            { required: true, message: '请输入身份证号码' },
            {
              pattern:
                '^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$|^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$',
              message: '请输入正确的身份证号码',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="手机号码："
          name="phone"
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
          name="upload1"
          label="身份证国徽面："
          rules={[{ required: true, message: '请上传身份证国徽面' }]}
          extra="请上传不超过 5M 的 JPG/JPEG/PNG 格式文件"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload {...propsData} beforeUpload={beforeUpload} onChange={handleChange}>
            {imgUrl ? <img src={imgUrl} style={{ width: '100%', height: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item
          name="upload2"
          label="身份证人像面："
          rules={[{ required: true, message: '请上传身份证人像面' }]}
          extra="请上传不超过 5M 的 JPG/JPEG/PNG 格式文件"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload {...propsData} beforeUpload={beforeUpload} onChange={handleChange}>
            {imgUrl ? <img src={imgUrl} style={{ width: '100%', height: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
        <div className={Style.formTitle}>
          <h4>三、联系人信息</h4>
        </div>
        <Form.Item
          label="姓名："
          name="lxrname"
          rules={[
            { required: true, message: '请输入客户名称' },
            {
              pattern: '^([A-Za-z]|[\u4E00-\u9FA5·])+$',
              message: '请输入正确的姓名',
            },
          ]}
        >
          <CountInput placeholder="请输入" maxLimit={30} />
        </Form.Item>
        <Form.Item
          label="手机号码："
          name="lxrphone"
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
          label="电子邮箱："
          name="emai"
          rules={[
            { required: true, message: '请输入电子邮箱' },
            {
              pattern: '^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$',
              message: '请输入正确的电子邮箱',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <div className={Style.formTitle}>
          <h4>四、其他信息</h4>
        </div>
        <Form.Item label="备注：" name="remark">
          <CountInput
            inputType="textarea"
            autoSize={{ minRows: 5, maxRows: 5 }}
            placeholder="请输入"
            maxLimit={300}
          />
        </Form.Item>
        <div className={Style.detailButton}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button
            className={Style.goBack}
            onClick={() => {
              window.history.back();
            }}
          >
            返回
          </Button>
        </div>
      </Form>
    </div>
  );
}

Detail.propTypes = propTypes;
export default connect(({ myClientDetail, loading }) => ({
  myClientDetail,
  loading,
}))(Detail);
