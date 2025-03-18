// 立项管理
export const moduleCode = "7001"; // 模板code
export const permissionCode = "M005_017";

export function setTack(array) {
  let result = [];
  array.forEach((ele) => {
    // 创建一个新的 list 来存储重新排序后的对象
    const newList = [];

    const person = ele.list.find((subItem) => subItem.name === "操作人");
    const time = ele.list.find((subItem) => subItem.name === "操作时间");
    const approvalResult = ele.list.find(
      (subItem) => subItem.name === "审批结果"
    );

    if (person) {
      newList.push(person);
    }
    // 将 "操作时间" 插入到第二项
    if (time) {
      newList.push(time);
    }

    // 将 "审批结果" 插入到第三项
    if (approvalResult) {
      newList.push(approvalResult);
    }

    // 将剩余的对象按原顺序添加到 newList 中
    ele.list.forEach((subItem) => {
      if (
        subItem.name !== "操作时间" &&
        subItem.name !== "审批结果" &&
        subItem.name !== "操作人"
      ) {
        newList.push(subItem);
      }
    });

    // 更新 ele.list 为重新排序后的 newList
    ele.list = newList;
  });
  result = array;
  return result;
}
