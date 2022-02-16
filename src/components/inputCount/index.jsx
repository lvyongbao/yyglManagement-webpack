import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import './index.module.less';

const { TextArea } = Input;
const propTypes = {
  value: PropTypes.string,
  maxLimit: PropTypes.number,
  inputType: PropTypes.string,
  onChange: PropTypes.func,
};
class CountInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curNum: 0,
      focusd: false,
    };
    this.textareaFocus = this.textareaFocus.bind(this);
    this.textareaBlur = this.textareaBlur.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { value } = this.props; // 这个方案是通过输出了props看到value值变化来实现的 有点low 后面发现有nextProps参数可以实现对比
    this.setState({ curNum: value ? value.length : 0 });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    nextProps.value !== value
      && this.setState({
        curNum: nextProps.value ? nextProps.value.length : 0,
      });
  }

  textareaFocus() {
    this.setState({
      focusd: true,
    });
  }

  textareaBlur() {
    this.setState({
      focusd: false,
    });
  }

  render() {
    const {
      maxLimit,
      onChange,
      inputType, // 传入‘textarea’则显示为文本域
      ...otherPops
    } = this.props;

    const { curNum, focusd } = this.state;
    // const thiz = this

    const CountInputProps = {
      maxLength: maxLimit || null,
      suffix: maxLimit ? <span style={{ opacity: '0.45' }}>{`${curNum}/${maxLimit}`}</span> : null,
      onChange: (e) => {
        onChange && onChange(e.target.value);
      },
      ...otherPops,
    };
    if (inputType === 'textarea') {
      return (
        <div className={`f-pr textAreaBox ${focusd ? 'textAreaBoxFocus' : ''}`}>
          <TextArea
            className="textArea"
            {...CountInputProps}
            onFocus={this.textareaFocus}
            onBlur={this.textareaBlur}
          />
          <span
            className="f-pa"
            style={{
              right: '10px', bottom: '0px', lineHeight: '20px', opacity: '0.45',
            }}
          >
            {`${curNum}/${maxLimit}`}

          </span>
        </div>
      );
    }
    return <Input {...CountInputProps} />;
  }
}

CountInput.propTypes = propTypes;
CountInput.defaultProps = {
  value: undefined,
  maxLimit: undefined,
  inputType: undefined,
  onChange: () => {},
};
export default CountInput;
