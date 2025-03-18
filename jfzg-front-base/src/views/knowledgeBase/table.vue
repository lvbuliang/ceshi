<template>
  <table class="knowledgeBaseTable">
    <tr>
      <td class="label">项目名称</td>
      <td colspan="3">{{ viewData.projectName }}</td>
      <td class="label">项目编号</td>
      <td>{{ viewData.projectCode }}</td>
    </tr>
    <tr>
      <td class="label">上传人</td>
      <td>{{ viewData.createPerson }}</td>
      <td class="label">文件大小</td>
      <td>{{ viewData.fileSizeName }}</td>
      <td class="label">上传时间</td>
      <td>{{ viewData.createTime }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    viewData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>
 table,table tr th, table tr td { border:1px solid #EEE; }
.knowledgeBaseTable {

  border-collapse: collapse;
  margin-bottom: 24px;
  width: 100%;
  tr {
    td {
      width: 16.6%;
      height: 40px;
      padding-left: 12px;
      line-height: 40px;
      color: #666666;
      font-size: 14px;
     
     
    }
    .label {
      background: #fafafa;
    }
  }
}
</style>