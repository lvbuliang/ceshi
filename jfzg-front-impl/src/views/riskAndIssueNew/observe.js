export function initResizeObserver(resizeObserver, model) {
  let widthB = 0;
  resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      // 执行你需要的操作
      widthB = entry.contentRect.width + "px";
    });
    // return widthB;
  });
  resizeObserver.observe(model);
}
export function destroyResizeObserver(resizeObserver) {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
}
// class
