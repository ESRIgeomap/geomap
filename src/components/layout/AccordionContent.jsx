import CustomScroll from 'react-custom-scrollbars';

import styles from './index.css';

const AccordionContent = ({ children }) => {
  return <CustomScroll>{children}</CustomScroll>;
};

export default CustomScroll;
