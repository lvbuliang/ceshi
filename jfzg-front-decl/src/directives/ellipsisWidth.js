// directives/ellipsisWidth.js
export default {
  inserted(el) {
    updateWidth(el);
  },
  updated(el) {
    updateWidth(el);
  }
};

function updateWidth(el) {
  const parent = el.parentElement;
  if (parent) {
    const parentWidth = parent.clientWidth;
    el.style.maxWidth = `${parentWidth * 0.8}px`;
  }
}