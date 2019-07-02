import React, { useState } from 'react';
import { Button } from 'antd';
import searchIcon from './tjss.png';
import searchIcon1 from './tjss1.png';
import SearchBar from './components/SearchBar/index';
import styles from './index.css';

const SearchBtn = () => {
  const [visible, setVisible] = useState(false);

  function btnOnClick() {
    setVisible(!visible);
  }

  return (
    <React.Fragment>
      <Button onClick={btnOnClick} className={styles.btnStyle} style={{ backgroundColor: visible ? "#47b479" : "white" }}>
        <a className={styles.btnA} title="搜索">
          <img src={visible ? searchIcon1 : searchIcon} alt="" className={styles.btnImg} />
        </a>
      </Button>
      <SearchBar visible={visible} />
    </React.Fragment>
  );
};

export default SearchBtn;
