import React from 'react';
import styles from './ToolbarSplit.css';
import { Button, Icon } from 'antd';
import { connect } from 'react-redux';

const ButtonGroup = Button.Group;

class ToolbarSplit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    /* 点击显示图层列表*/
    showLayerList = () => {
        this.props.dispatch({
          type: 'layerList/changeLayerListVisible',
          payload: !this.props.layerList.layerListVisible,
        });
      };

    /*退出分屏对比*/
    closeSplitLayer = () => {
        this.props.dispatch({
            type: 'layerList/changeSplitState',
            payload: false,
        });
        //退出分屏对比
        this.props.dispatch({
            type: 'agsmap/splitscreenChangeState',
            payload: false,
        });
    }

    render() {
        return (
            <div className={styles.toolbarSplit}>
                <ButtonGroup className={styles.buttonGroup}>
                    <Button className={styles.btnStyle} onClick={this.showLayerList}>
                        <Icon type="profile" />
                        数据选择
                    </Button>
                    <Button className={styles.btnStyle} onClick={this.closeSplitLayer}>
                        <Icon type="close-circle" />
                        退出
                    </Button>
                </ButtonGroup>
            </div>
        );
    }
}

ToolbarSplit.propTypes = {};

export default connect(({ agsmap ,layerList}) => {
    return {
      agsmap,
      layerList,
    };
})(ToolbarSplit);