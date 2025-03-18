// utils/yearPlanUtils.js

/**
 * 生成 yearPlanList 数据，默认以当前年份为中心
 */
class YearPlanManager {
    constructor() {
      this.yearPlanList = this.generateYearPlanList();
    }
  
    /**
     * 生成 yearPlanList 数据
     * @returns {Array} 包含对象的数组
     */
    generateYearPlanList() {
      const fixedData = [
        {
          value: "2023-2024年度计划",
          label: "2023-2024年度计划",
        },
      ];
  
      const currentYear = new Date().getFullYear(); // 获取当前年份
      const dynamicData = [];
  
      // 添加当前年份及其前一年和后一年的数据
      for (let i = currentYear - 1; i <= currentYear + 1; i++) {
        dynamicData.push({
          value: `${i}年度计划`,
          label: `${i}年度计划`,
        });
      }
  
      return [...fixedData, ...dynamicData];
    }
  
    /**
     * 获取 yearPlanList 数据
     * @returns {Array} 当前的 yearPlanList 数据
     */
    getYearPlanList() {
      return this.yearPlanList;
    }
  
    /**
     * 更新 yearPlanList 数据（可选）
     */
    updateYearPlanList() {
      this.yearPlanList = this.generateYearPlanList();
    }
  }
  
  // 创建单例实例
  const yearPlanManager = new YearPlanManager();
  
  // 暴露单例实例
  export default yearPlanManager;