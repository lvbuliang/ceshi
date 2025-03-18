/**
 * 计算表格高度
 * @param {Array} refs - 需要计算高度的元素引用数组
 * @param {number} val - 需要减去的额外高度
 * @returns {number} - 计算后的表格高度
 */
export const getCommonTableHeight = (...refs) => {
     
    let tableH = 0;
    // 获取最外层容器（.wl-scroll）的高度
    const container = document.querySelector('.wl-scroll');
    if (!container) {
        console.error('未找到具有 .wl-scroll 类名的元素');
        return 0;
    }
    const containerH = container.offsetHeight;
    console.log('containerH:', containerH);
    
    // 计算传入元素的总高度
    let totalRefHeight = 0;
    refs.forEach((ref) => {
        if (ref) {
            console.log('ref.offsetHeight:', ref.offsetHeight);
            totalRefHeight += ref.offsetHeight;
        }
    });
    console.log('totalRefHeight:', totalRefHeight);

    // 计算表格高度
    tableH = containerH - totalRefHeight;

    console.log('表格高度为:', tableH);
    return tableH - 95; 
};