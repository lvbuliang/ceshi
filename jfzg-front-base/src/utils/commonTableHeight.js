export const getCommonTableHeight = () => {
    let tableH = 0;
    let containerH = document.querySelector('.wl-scroll').offsetHeight;
  
    // let tabsH = document.querySelector('.tabs_box').offsetHeight;
    let searchH = 96;
    //let tbBottomH = document.querySelector('.sr_table_bottom').offsetHeight;
    let totalPagePadding = 40;
    let tbBottomH = 42;
    //tableH = containerH - (tabsH + searchH + totalPagePadding + tbBottomH + 24)
    tableH = containerH - (searchH + tbBottomH + totalPagePadding)
    console.log('表格高度为:' + tableH + '搜索高度为:' + searchH);
    
    return tableH;
  };
  