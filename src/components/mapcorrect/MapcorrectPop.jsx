import React, { Component } from 'react';
import { Input, Button, Radio, message } from 'antd';

const { TextArea } = Input;
const RadioGroup = Radio.Group;

// let num = 0;

// function numChange() {
//   num = Number(num) + 1;
// }
window.mapcorrectArr = { requestMapErrors: [] };

class MapcorrectPop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioValue: '位置错误',
      nr: null,
      bt: null,
      jcpop: [],
    };
    this.openSlt = this.openSlt.bind(this);
    this.closeSlt = this.closeSlt.bind(this);
    this.radioOnchange = this.radioOnchange.bind(this);
    this.mconChange = this.mconChange.bind(this);
    this.nronChange = this.nronChange.bind(this);
  }

  openSlt() {
    this.props.event.remove();
    const mapcorrectlist = document.getElementById('mapcorrectlist');
    const pp = document.createElement('p');
    pp.style.width = '380px';
    pp.style.height = '20px';
    const spanbt = document.createElement('span');
    if (document.getElementById('bt').value === '') {
      message.error('标题不能为空');
    }
    const spanlx = document.createElement('span');
    const spannr = document.createElement('span');
    if (document.getElementById('bt').value === '') {
      message.error('内容不能为空');
    }
    spanbt.style.display = 'inline-block';
    spanbt.style.width = '80px';
    spanbt.style.color = 'black';
    spanbt.style.overflow = 'hidden';
    spanbt.style.textOverflow = 'ellipsis';
    spanbt.style.whiteSpace = 'nowrap';
    spanlx.style.display = 'inline-block';
    spanlx.style.width = '100px';
    spanlx.style.color = 'black';
    spanlx.style.overflow = 'hidden';
    spanlx.style.textOverflow = 'ellipsis';
    spanlx.style.whiteSpace = 'nowrap';
    spannr.style.display = 'inline-block';
    spannr.style.width = '200px';
    spannr.style.color = 'black';
    spannr.style.overflow = 'hidden';
    spannr.style.textOverflow = 'ellipsis';
    spannr.style.whiteSpace = 'nowrap';
    if (
      document.getElementById('bt').value !== '' &&
      document.getElementById('nr').value !== ''
    ) {
      this.state.jcpop.push(
        this.state.bt,
        this.state.radioValue,
        this.state.nr,
      );
      mapcorrectlist.appendChild(pp);
      pp.appendChild(spanbt);
      pp.appendChild(spanlx);
      pp.appendChild(spannr);
      spanbt.innerHTML = this.state.jcpop[0];
      spanlx.innerHTML = this.state.jcpop[1];
      spannr.innerHTML = this.state.jcpop[2];
      // if (window.localStorage) {
      //   const storage = window.localStorage;
      //   const correctListarr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      //     'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
      //   const longth = correctListarr.length;
      //   for (let i = 0; i < longth; i += 1) {
      //     storage.setItem(correctListarr[num], this.state.jcpop);
      //   }
      // }
      const correctjson = {
        map_content: this.state.jcpop[2],
        map_type: this.state.jcpop[1],
        title: this.state.jcpop[0],
        x: this.props.point.longitude,
        y: this.props.point.latitude,
      };
      window.mapcorrectArr.requestMapErrors.push(correctjson);
      // numChange();
      this.props.view.popup.close();
    }
  }

  closeSlt() {
    this.props.view.popup.close();
    this.props.layer.removeAll();
    this.props.event.remove();
  }

  radioOnchange(e) {
    this.setState({
      radioValue: e.target.value,
    });
  }
  mconChange(e) {
    this.setState({
      bt: e.target.value,
    });
  }
  nronChange(e) {
    this.setState({
      nr: e.target.value,
    });
  }

  render() {
    return (
      <div>
        <p
          style={{
            height: '50px',
            padding: '0',
            margin: '0',
            fontSize: '16px',
            fontWeight: 'bold',
            lineHeight: '70px',
            borderBottom: '1px solid #C8C8C8',
            marginBottom: '10px',
          }}
        >
          地图纠错
        </p>
        <p style={{ display: 'flex' }}>
          <span
            style={{
              flex: 'auto',
              display: 'flex',
              width: '60px',
              height: '30px',
              textAlign: 'center',
              lineHeight: '30px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            标题
          </span>
          <Input
            id="bt"
            style={{ flex: 'auto', borderRadius: '0px' }}
            onChange={this.mconChange}
          />
        </p>
        <p style={{ display: 'flex' }}>
          <span
            style={{
              display: 'flex',
              width: '60px',
              height: '30px',
              textAlign: 'center',
              lineHeight: '30px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            类型
          </span>
          <RadioGroup
            onChange={this.radioOnchange}
            value={this.state.radioValue}
          >
            <Radio value={'位置错误'}>位置错误</Radio>
            <Radio value={'名称错误'}>名称错误</Radio>
            <Radio value={'其他错误'}>其他错误</Radio>
          </RadioGroup>
        </p>
        <p style={{ display: 'flex' }}>
          <span
            style={{
              flex: 'auto',
              display: 'flex',
              width: '60px',
              height: '30px',
              textAlign: 'center',
              lineHeight: '30px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            内容
          </span>
          <TextArea
            id="nr"
            placeholder="您最多可以输入200个字"
            style={{ flex: 'auto', borderRadius: '0px' }}
            onChange={this.nronChange}
          />
        </p>
        <p
          style={{
            textAlign: 'center',
            padding: '0',
            margin: '0',
          }}
        >
          <Button
            type="primary"
            onClick={this.openSlt}
            style={{ marginRight: '20px', borderRadius: '0px' }}
          >
            保存
          </Button>
          <Button onClick={this.closeSlt} style={{ borderRadius: '0px' }}>
            删除
          </Button>
        </p>
        <p
          style={{
            height: '20px',
          }}
        />
      </div>
    );
  }
}

export default MapcorrectPop;
