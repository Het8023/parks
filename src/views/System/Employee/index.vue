<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="员工姓名">
        <el-input v-model="formInline.name" placeholder="请输入员工姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <hr />
    <el-button type="primary" @click="open">添加员工</el-button>
    <br />

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="员工姓名"></el-table-column>
      <el-table-column prop="userName" label="登录账号"></el-table-column>
      <el-table-column prop="phonenumber" label="联系方式"></el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">{{ scope.row.status == 1 ?'启用':'禁用' }}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template #default="scope">
          <el-button size="mini" type="text" @click="hx(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
          <el-button size="mini" type="text" @click="treset(scope.row.id)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="formInline.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="formInline.pageSize"
      layout="total, prev,  pager, next,sizes"
      :total="total"
    ></el-pagination>

    <!-- 添加编辑框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="40%" :before-close="resetForm">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="userName">
          <el-input v-model="ruleForm.userName" placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phonenumber">
          <el-input v-model="ruleForm.phonenumber" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item>
          <span>默认密码：123456</span>
        </el-form-item>
        <el-form-item label="分配角色" prop="roleId">
          <el-select v-model="ruleForm.roleId" style="width:100%">
            <el-option
              v-for="item in areaList"
              :key="item.roleId"
              :value="item.roleId"
              :label="item.roleName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="员工状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserListApi,
  getroleListApi,
  getAdduserApi,
  getuserDetailApi,
  getEdituserApi,
  getDeluserApi,
  getresetPwdApi
} from "@/api/employee";
export default {
  components: {},
  data() {
    return {
      formInline: {
        name: "",
        page: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      dialogVisible: false,
      ruleForm: {
        name: "",
        userName: "",
        phonenumber: "",
        roleId: "",
        status: ""
      },
      rules: {
        name: [{ required: true, message: "请填写员工姓名", trigger: "blur" }],
        userName: [
          { required: true, message: "请填写登录账号", trigger: "blur" }
        ],
        phonenumber: [
          { required: true, message: "请填写联系方式", trigger: "blur" }
        ],
        roleId: [
          { required: true, message: "请选择分配角色", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择员工状态", trigger: "change" }
        ]
      },
      areaList: [] //角色下拉列表
    };
  },
  methods: {
    onSubmit() {
      this.getlist();
    },
    async getlist() {
      const res = await getUserListApi(this.formInline);
      this.tableData = res.data.rows;
      this.total = res.data.total;

      // 获取下拉列表
      const res1 = await getroleListApi();
      // console.log(res);
      this.areaList = res1.data;
    },
    // 分页
    handleSizeChange(val) {
      this.formInline.pageSize = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.formInline.page = val;
      this.getlist();
    },
    // 打开弹窗
    open() {
      this.dialogVisible = true;
    },
    // 确定添加
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.ruleForm.id) {
            // 编辑
            await getEdituserApi({
              id: this.ruleForm.id,
              name: this.ruleForm.name,
              userName: this.ruleForm.userName,
              phonenumber: this.ruleForm.phonenumber,
              roleId: this.ruleForm.roleId,
              status: this.ruleForm.status
            });
          } else {
            // 添加
            await getAdduserApi(this.ruleForm);
          }
          this.$refs[formName].resetFields();
          this.dialogVisible = false;
          this.getlist();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false;
    },
    // 回显
    async hx(id) {
      this.dialogVisible = true;
      const res = await getuserDetailApi(id);
      console.log(res);
      this.ruleForm = res.data;
    },
    // 删除
    del(id) {
      this.$confirm("删除员工后，该员工账号将无法登录，是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(id);
          const res = await getDeluserApi(id);
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
    // 重置密码
    treset(id) {
      this.$confirm("确定将密码重置为“123456”？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(id);
          const res = await getresetPwdApi({ id });
          console.log(res);
          this.getlist();
          this.$message({
            type: "success",
            message: "重置成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置"
          });
        });
    }
  },
  created() {
    this.getlist();
  },
  computed: {},
  filters: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>
