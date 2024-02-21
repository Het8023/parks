<template>
  <div class="login-container">
    <el-button type="primary" @click="dialogVisible = true">添加区域</el-button>
    <br />

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="areaName" label="区域名称"></el-table-column>
      <el-table-column prop="spaceNumber" label="车位数(个)"></el-table-column>
      <el-table-column prop="areaProportion" label="面积(㎡)"></el-table-column>
      <el-table-column prop="ruleName" label="计费规则">
        <template #default="{row}">
          <el-tooltip class="item" effect="dark" :content="row.hoverRuleName" placement="top">
            <span>{{row.ruleName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="id" label="操作">
        <template #default="{row}">
          <el-button type="text" @click="hx(row)">编辑</el-button>
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.pageSize"
      layout="total, prev, pager,  next,sizes, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加编辑框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="40%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="ruleForm.areaName" placeholder="请输入区域名称"></el-input>
        </el-form-item>
        <el-form-item label="车位数（个）" prop="spaceNumber">
          <el-input-number
            style="width:100%"
            v-model="ruleForm.spaceNumber"
            placeholder="请输入车位个数"
            controls-position="right"
            @change="handleChange"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="面积（㎡）" prop="areaProportion">
          <el-input v-model="ruleForm.areaProportion" placeholder="请输入面积"></el-input>
        </el-form-item>
        <el-form-item label="关联计费规则" prop="ruleId">
          <el-select v-model="ruleForm.ruleId" style="width:100%">
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :value="item.id"
              :label="item.ruleName"
            />
          </el-select>
          <!-- <el-input v-model="ruleForm.ruleId" placeholder="请选择"></el-input> -->
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAreaListApi,
  getAreaDropListApi,
  getAddAreaApi,
  getDelAreaApi,
  getEditAreaApi
} from "@/api/carArea";
export default {
  components: {},
  data() {
    return {
      tableData: [],
      page: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      dialogVisible: false,
      ruleForm: {
        areaName: "",
        spaceNumber: "",
        areaProportion: "",
        ruleId: "",
        remark: ""
      },
      rules: {
        areaName: [
          { required: true, message: "请输入区域名称", trigger: "blur" }
        ],
        spaceNumber: [
          { required: true, message: "请输入车位个数", trigger: "blur" }
        ],
        areaProportion: [
          { required: true, message: "请输入面积", trigger: "blur" }
        ],
        ruleId: [
          { required: true, message: "请选择关联计费规则", trigger: "blur" }
        ]
      },
      areaList: [] //收费规则下拉列表
    };
  },
  methods: {
    // 获取数据
    async getlist() {
      const res = await getAreaListApi(this.page);
      console.log(res);
      this.total = res.data.total;
      this.tableData = res.data.rows;
    },
    // 分页
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.page.page = val;
      this.getlist();
    },
    // 获取计费规则下拉列表
    async getAreaDropList() {
      const res = await getAreaDropListApi();
      // console.log(res);
      this.areaList = res.data.rows;
    },
    // 改变车位数
    handleChange(value) {
      console.log(value);
    },
    // 确定添加
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.ruleForm.id) {
            // 编辑
            await getEditAreaApi(this.ruleForm);
          } else {
            // 添加
            await getAddAreaApi(this.ruleForm);
          }

          this.dialogVisible = false;
          this.getlist();
          this.$refs[formName].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    // 删除
    del(id) {
      this.$confirm("是否确认删除当前区域?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(id);
          const res = getDelAreaApi(id);
          this.getlist();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 回显
    hx(row) {
      this.dialogVisible = true;
      // this.ruleForm.id = id;
      // console.log(row);
      this.ruleForm.areaName = row.areaName;
      this.ruleForm.spaceNumber = row.spaceNumber;
      this.ruleForm.areaProportion = row.areaProportion;
      this.ruleForm.ruleId = row.ruleId;
      this.ruleForm.remark = row.remark;
      this.ruleForm.id = row.id;
    }
  },
  created() {
    this.getlist();
    this.getAreaDropList();
  },
  computed: {},
  filters: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.login-container {
  padding: 20px;
  box-sizing: border-box;
}
</style>
