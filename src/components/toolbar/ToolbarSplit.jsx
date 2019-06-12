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

export default connect(({ agsmap, spacequery, search, splitLayerList }) => {
    return {
        agsmap,
        spacequery,
        search,
        splitLayerList,
    };
})(ToolbarSplit);