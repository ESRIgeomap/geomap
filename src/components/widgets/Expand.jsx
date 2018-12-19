import React, { Component } from 'react';
import { Tooltip } from 'antd';
import * as jsapi from '../../utils/jsapi';
import styles from './WidgetButtons.css';

const CSS = {
  base: 'esri-expand esri-widget',
  container: 'esri-expand__container',
  containerExpanded: 'esri-expand__container--expanded',
  panel: 'esri-expand__panel',
  button: 'esri-widget-button',
  text: 'esri-icon-font-fallback-text',
  icon: 'esri-collapse__icon',
  iconExpanded: 'esri-expand__icon--expanded',
  iconNumber: 'esri-expand__icon-number',
  iconNumberExpanded: 'esri-expand__icon-number--expanded',
  expandIcon: 'esri-icon-expand',
  collapseIcon: 'esri-icon-collapse',
  content: 'esri-expand__content',
  contentExpanded: 'esri-expand__content--expanded',
  expandMask: 'esri-expand__mask',
  expandMaskExpanded: 'esri-expand__mask--expanded',
};

async function isWidget(value) {
  const [Widget] = jsapi.load(['esri/widgets/Widget']);
  return value && value.isInstanceOf && value.isInstanceOf(Widget);
}

function isWidgetBase(value) {
  // naive type check

  return (
    value &&
    typeof value.postMixInProperties === 'function' &&
    typeof value.buildRendering === 'function' &&
    typeof value.postCreate === 'function' &&
    typeof value.startup === 'function'
  );
}

class Expand extends Component {
  constructor(props) {
    super(props);
    this.vm = null;
    this.state = {
      expanded: false,
    };
    this.toggle = this.toggle.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  componentDidMount() {
    this.renderContent();
    this.props.view.when(async view => {
      const [ExpandViewModel] = await jsapi.load(['esri/widgets/Expand/ExpandViewModel']);
      this.vm = new ExpandViewModel();
      this.vm.view = view;
    });
  }

  toggle() {
    this.vm.expanded = !this.vm.expanded;
    this.setState({
      expanded: this.vm.expanded,
    });
  }

  attachToNode(node) {
    const content = this;
    node.appendChild(content);
  }

  async renderContent() {
    const content = this.props.content;
    const div = this.contentDom;
    if (this.props.contentClass) {
      div.className = this.props.contentClass;
    }

    if (typeof content === 'string') {
      div.innerHTML = content;
    }

    const bWidget = await isWidget(content);
    if (bWidget) {
      div.appendChild(content.render());
    }

    if (content instanceof HTMLElement) {
      div.appendChild(content);
    }

    if (isWidgetBase(content)) {
      div.appendChild(content.domNode);
    }
  }

  render() {
    const expanded = this.state.expanded;

    const collapseIconClass = this.props.collapseIconClass || CSS.collapseIcon;
    const expandIconClass = this.props.expandIconClass || CSS.expandIcon;
    const expandIconClasses = expanded
      ? `${CSS.icon} ${CSS.iconExpanded} ${collapseIconClass}`
      : `${CSS.icon} ${expandIconClass}`;
    return (
      <div>
        <div className={expanded ? `${CSS.container} ${CSS.containerExpanded}` : CSS.container}>
          <div className={CSS.panel}>
            <Tooltip placement="left" title={this.props.title || '图层列表'}>
              <a className={styles.btn} onClick={this.toggle}>
                <span aria-hidden="true" className={expandIconClasses} />
              </a>
            </Tooltip>
          </div>
          <div className={expanded ? `${CSS.content} ${CSS.contentExpanded}` : CSS.content}>
            <div
              ref={node => {
                this.contentDom = node;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Expand;
