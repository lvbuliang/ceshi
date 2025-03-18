<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      \423432424242424 >
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getProjectDetail } from '@/api/planProject'
export default {
  name: 'DialogJd',
  components: {},
  mixins: [],
  props: {
    dialogTitle: {
      type: String,
      // default: '默认标题',
    },
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '默认标题',
      active: [],
      activeT: '全文比对', // 默认选中
      arr: [],
      testId: '',
      projectDescriptionText: '',
      businessNeeds: '',
    }
  },
  computed: {},
  watch: {},
  mounted() {
    // this.getMessage()
  },
  created() {
    this.testId = this.$route.query.id
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
          this.$emit('closeDialog')
        })
        .catch((_) => {})
    },
    getMessage() {
      getProjectDetail({ id: this.testId }).then((res) => {
        this.projectDescriptionText = res.data.projectDescriptionText
        this.businessNeeds = res.data.businessNeeds
        console.log('ceeeeeeeeeeeeeeeeee', res.data.projectDescriptionText)
        console.log('ceeeee45454545', res.data.businessNeeds)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog .el-dialog__header {
  text-align: left;
}
</style>
