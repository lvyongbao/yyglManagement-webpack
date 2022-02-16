import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { getBasicFn } from '@utils';
import ImgView from '@components/imgView';
import logo from '@assets/img/logo.jpg';
import { Row, Col, Button } from 'antd';
import './index.module.less';

const propTypes = {
  lookClientDetail: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.objectOf(PropTypes.any).isRequired,
};
const namespace = 'lookClientDetail';
function LookDetail({ lookClientDetail, loading }) {
  const { lookClientDetailType, detailData } = lookClientDetail;

  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading });

  return (
    <div className="LookDetail">
      <Row>
        <Col span={12} className="m-textRt m-textTitle">
          一、客户基础
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt">
          客户税号：
        </Col>
        <Col span={12} className="m-textLf">
          21122321111111
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt">
          开户行：
        </Col>
        <Col span={12} className="m-textLf">
          -
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt">
          开户行帐号：
        </Col>
        <Col span={12} className="m-textLf">
          -
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt">
          详细地址：
        </Col>
        <Col span={12} className="m-textLf">
          金色西溪A座
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt m-textImg">
          营业执照：
        </Col>
        <Col span={12} className="m-textLf">
          <ImgView src={logo} />
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt m-textTitle">
          二、法定代表人信息
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt">
          姓名：
        </Col>
        <Col span={12} className="m-textLf">
          张曼
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt">
          身份证号码：
        </Col>
        <Col span={12} className="m-textLf">
          323233223222326543
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt">
          电话号码：
        </Col>
        <Col span={12} className="m-textLf">
          13434434385
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt m-textImg">
          身份证国徽面：
        </Col>
        <Col span={12} className="m-textLf">
          <ImgView src={logo} />
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt m-textImg">
          身份证人像面：
        </Col>
        <Col span={12} className="m-textLf">
          <ImgView src={logo} />
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt m-textTitle">
          三、联系人信息
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt">
          姓名：
        </Col>
        <Col span={12} className="m-textLf">
          张三
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt">
          电话号码：
        </Col>
        <Col span={12} className="m-textLf">
          1573435723
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt">
          电子邮箱：
        </Col>
        <Col span={12} className="m-textLf">
          1423557890@163.com
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt m-textTitle">
          四、其他信息
        </Col>
      </Row>
      <Row>
        <Col span={12} className="m-textRt">
          备注：
        </Col>
        <Col span={12} className="m-textLf">
          -
        </Col>
      </Row>
      <div className="f-tac">
        <Button
          onClick={() => {
            window.history.back();
          }}
        >
          返回
        </Button>
      </div>
    </div>
  );
}

LookDetail.propTypes = propTypes;
export default connect(({ lookClientDetail, loading }) => ({
  lookClientDetail,
  loading,
}))(LookDetail);
