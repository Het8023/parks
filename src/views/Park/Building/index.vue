<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="楼宇名称">
          <el-input v-model="formInline.user" placeholder="请输入楼宇名称" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" v-auth-btn="'park:building:list'">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <hr />
    <el-button type="primary" @click="dakai" v-auth-btn="'park:building:add_edit'">添加楼宇</el-button>
    <br />

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="楼宇名称"></el-table-column>
      <el-table-column prop="floors" label="层数"></el-table-column>
      <el-table-column prop="area" label="在管面积(²)"></el-table-column>
      <el-table-column prop="propertyFeePrice" label="物业费(元/㎡)"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">{{ scope.row.status ? '已出租' : "空置中" }}</template>
      </el-table-column>
      <el-table-column prop="id" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editbuilding(scope.row.id)"
            v-auth-btn="'park:building:add_edit'"
          >编辑</el-button>
          <el-button
            type="text"
            @click="deletebuiding(scope.row.id)"
            v-auth-btn="'park:building:remove'"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, prev, pager,  next,sizes, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加编辑框 -->
    <el-dialog
      :title="dialogVisibleText"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="resetForm"
    >
      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="楼宇名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入楼宇名称"></el-input>
        </el-form-item>
        <el-form-item label="楼宇层数" prop="floors">
          <el-input v-model="ruleForm.floors" placeholder="请输入楼宇层数"></el-input>
        </el-form-item>
        <el-form-item label="在管面积" prop="area">
          <div>
            <el-input placeholder="请输入在管面积" v-model="ruleForm.area">
              <template slot="append">㎡</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="物业费" prop="propertyFeePrice">
          <div>
            <el-input placeholder="请输入物业费" v-model="ruleForm.propertyFeePrice">
              <template slot="append">元/㎡</template>
            </el-input>
          </div>
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
  getBuildingApi,
  getAddBuildingApi,
  getDelBuildingApi,
  getBuildingDetailApi,
  getEditBuildingApi
} from "@/api/park";
export default {
  components: {},
  data() {
    return {
      formInline: {
        user: ""
      },
      page: 1,
      pageSize: 10,
      tableData: [],
      total: 0,
      dialogVisible: false,
      dialogVisibleText: "",
      ruleForm: {
        name: "",
        floors: "",
        area: "",
        propertyFeePrice: ""
      },
      rules: {
        name: [{ required: true, message: "请输入楼宇名称", trigger: "blur" }],
        floors: [
          { required: true, message: "请输入楼宇层数", trigger: "blur" }
        ],
        area: [
          { required: true, message: "请输入楼宇在管面积", trigger: "blur" }
        ],
        propertyFeePrice: [
          { required: true, message: "请输入楼宇物业费", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      // console.log("搜索框", this.formInline.user);
      this.getlist();
    },
    // 获取表格列表数据
    async getlist() {
      this.tableData = [];
      const res = await getBuildingApi({
        name: this.formInline.user,
        page: this.page,
        pageSize: this.pageSize
      });
      // console.log(res);
      this.tableData = res.data.rows;
      this.total = res.data.total;
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getlist();
    },
    // 打开弹窗
    dakai() {
      this.dialogVisibleText = "添加楼宇";
      this.dialogVisible = true;
    },
    // 确定添加、修改
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.ruleForm.id) {
            // 修改
            const res = await getEditBuildingApi({
              id: this.ruleForm.id,
              name: this.ruleForm.name,
              floors: this.ruleForm.floors,
              area: this.ruleForm.area,
              propertyFeePrice: this.ruleForm.propertyFeePrice
            });
          } else {
            //  添加
            await getAddBuildingApi(this.ruleForm);
          }
          this.$refs[formName].resetFields();
          this.getlist();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      this.dialogVisible = false;
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false;
    },
    // 删除
    deletebuiding(id) {
      this.$confirm("是否确认删除当前楼宇?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await getDelBuildingApi(id);
          console.log(res);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getlist();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改楼宇
    async editbuilding(id) {
      const res = await getBuildingDetailApi(id);
      // console.log(res);
      this.dialogVisibleText = "编辑楼宇";
      this.dialogVisible = true;
      this.ruleForm = res.data;
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

<style lang="scss" scoped></style>
