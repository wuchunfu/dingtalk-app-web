<template>
  <div>
    <div class="prizeList">
      <el-row type="flex" align="middle">
        <el-col :span="3">
          奖项详情
        </el-col>
        <el-col :span="8" style="float: right;margin-right: 30px">
          <el-button type="primary" @click="addPrizeDialogueVisible=true">新建奖项</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="prizeList"
        style="width: 100%"
      >
        <el-table-column
          prop="prizeTime"
          label="获奖时间"
          width="150"
        />
        <el-table-column
          prop="prizeName"
          label="奖项名称"
          width="200"
        />
        <el-table-column
          prop="level"
          label="级别"
          width="100"
        >
          <template slot-scope="scope">
            {{ levelConvertor[scope.row.level] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="200"
        />
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="primary" @click="modifyPrizeClick(scope.row)">修改</el-button>
            <el-button type="danger" @click="deletePrizeClick(scope.row)">删除</el-button>
          </template>

        </el-table-column>
      </el-table>
    </div>
    <!--      新增奖项-->
    <el-dialog
      title="新增奖项"
      :visible.sync="addPrizeDialogueVisible"
      width="30%"
    >
      <el-form ref="addPrizeForm" :model="addPrizeForm" :rules="rules" label-width="100px">
        <el-form-item prop="prizeName" label="获奖名称:">
          <el-col :span="12">
            <el-input v-model="addPrizeForm.prizeName" size="mini" />
          </el-col>
        </el-form-item>
        <el-form-item prop="prizeTime" label="获奖时间:">
          <el-col :span="12">
            <el-date-picker
              v-model="addPrizeForm.prizeTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 150px"
            />
          </el-col>
        </el-form-item>
        <el-form-item prop="level" label="级别:">
          <el-col :span="8">
            <el-select v-model="addPrizeForm.level" placeholder="请选择">
              <el-option label="校级" :value="0" />
              <el-option label="省级" :value="1" />
              <el-option label="国家级" :value="2" />
              <el-option label="国际级" :value="3" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="addPrizeForm.remark" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addPrizeDialogueVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPrize('addPrizeForm')">添加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改奖项信息"
      :visible.sync="modifyPrizeDialogueVisible"
      width="30%"
    >
      <el-form ref="modifyPrizeForm" :model="modifyPrizeForm" :rules="rules" label-width="100px">
        <el-form-item prop="prizeName" label="获奖名称:">
          <el-col :span="12">
            <el-input v-model="modifyPrizeForm.prizeName" size="mini" />
          </el-col>
        </el-form-item>
        <el-form-item prop="prizeTime" label="获奖时间:">
          <el-col :span="12">
            <el-date-picker
              v-model="modifyPrizeForm.prizeTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 150px"
            />
          </el-col>
        </el-form-item>
        <el-form-item prop="level" label="级别:">
          <el-col :span="8">
            <el-select v-model="modifyPrizeForm.level" placeholder="请选择">
              <el-option label="校级" :value="0" />
              <el-option label="省级" :value="1" />
              <el-option label="国家级" :value="2" />
              <el-option label="国际级" :value="3" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="modifyPrizeForm.remark" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="modifyPrizeDialogueVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmModifyPrize('modifyPrizeForm')">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserPrizes, addPrize, deletePrize, updatePrize } from '@/api/user'
export default {
  name: 'Prize',
  data() {
    return {
      addPrizeDialogueVisible: false,
      modifyPrizeDialogueVisible: false,
      prizeList: [],
      levelConvertor: ['校级', '省级', '国家级', '国际级'],
      addPrizeForm: {},
      modifyPrizeForm: {},
      rules: {
        prizeName: [{ required: true, message: '请输入奖项名称', trigger: 'blur' }],
        prizeTime: [{ required: true, message: '请输入获奖时间', trigger: 'blur' }],
        level: [{ required: true, message: '请输入奖项等级', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    getUserPrizes(sessionStorage.getItem('uid')).then(res => {
      this.prizeList = res.data
    })
  },
  methods: {
    async addPrize(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          var res = await addPrize(sessionStorage.getItem('uid'), this.addPrizeForm)
          this.addPrizeForm = {}
          if (res) {
            this.$message({
              showClose: true,
              message: '奖项信息添加成功！',
              type: 'success'
            })
          }
          getUserPrizes().then(res => {
            this.prizeList = res.data
          })
          this.addPrizeDialogueVisible = false
        } else {
          this.$notify({
            title: '添加失败',
            message: '请填写必要信息',
            type: 'warning'
          })
        }
      })
    },
    modifyPrizeClick(data) {
      console.log(data)
      this.modifyPrizeDialogueVisible = true
      this.modifyPrizeForm = JSON.parse(JSON.stringify(data))
    },
    async confirmModifyPrize(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          var res = await updatePrize(sessionStorage.getItem('uid'), this.modifyPrizeForm.id, this.modifyPrizeForm)
          if (res) {
            this.$message({
              showClose: true,
              message: '奖项信息修改成功！',
              type: 'success'
            })
          }
          this.modifyPrizeDialogueVisible = false
          getUserPrizes().then(res => {
            this.prizeList = res.data
          })
        } else {
          this.$notify({
            title: '修改失败',
            message: '请填写必要信息',
            type: 'warning'
          })
        }
      })
    },
    async deletePrizeClick(data) {
      await deletePrize(sessionStorage.getItem('uid'), data.id)
      this.$message({
        showClose: true,
        message: '奖项信息删除成功！',
        type: 'success'
      })
      getUserPrizes().then(res => {
        this.prizeList = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
