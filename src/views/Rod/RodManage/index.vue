<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="一体杆名称：">
        <el-input v-model="formInline.poleName" placeholder="请输入一体杆名称"></el-input>
      </el-form-item>
      <el-form-item label="一体杆编号：">
        <el-input v-model="formInline.poleNumber" placeholder="请输入一体杆编号"></el-input>
      </el-form-item>
      <el-form-item label="运行状态">
        <el-select v-model="formInline.poleStatus" placeholder="请选择运行状态">
          <el-option label="全部" value="2"></el-option>
          <el-option label="正常" value="0"></el-option>
          <el-option label="异常" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加删除按钮 -->
    <div>
      <el-button type="primary" @click="dialogVisible = true;dialogVisibleText = '添加'">添加一体杆</el-button>
      <el-button>批量删除</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="poleName" label="一体杆名称"></el-table-column>
      <el-table-column prop="poleNumber" label="一体杆编号"></el-table-column>
      <el-table-column prop="poleIp" label="一体杆IP"></el-table-column>
      <el-table-column prop="areaName" label="安装区域"></el-table-column>
      <el-table-column prop="poleType" label="一体杆类型">
        <template #default="{row}">{{row.poleType == 'entrance'?'入口':'出口'}}</template>
      </el-table-column>
      <el-table-column prop="poleStatus" label="运行状态">
        <template #default="{row}">{{row.poleStatus? '异常':'正常'}}</template>
      </el-table-column>
      <el-table-column prop="id" label="操作">
        <template #default="{row}">
          <el-button type="text" @click="editInfo(row)">编辑</el-button>
          <el-button type="text" @click="deleteInfo(row.id)">删除</el-button>
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
      layout="total, prev, pager,  next,sizes, jumper"
      :total="total"
    ></el-pagination>

    <!-- 弹出框 -->
    <el-dialog :title="dialogVisibleText" :visible.sync="dialogVisible" width="40%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="一体杆名称" prop="poleName">
          <el-input v-model="ruleForm.poleName" placeholder="请输入一体杆名称"></el-input>
        </el-form-item>
        <el-form-item label="一体杆编号" prop="poleNumber">
          <el-input
            v-model="ruleForm.poleNumber"
            placeholder="请输入一体杆编号"
            :disabled="ruleForm.id?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="一体杆IP" prop="poleIp">
          <el-input v-model="ruleForm.poleIp" placeholder="请输入一体杆IP"></el-input>
        </el-form-item>
        <el-form-item label="关联区域" prop="areaId">
          <el-select v-model="ruleForm.areaId" placeholder="请输入关联区域" style="width:100%">
            <el-option
              v-for="item in areaIdList"
              :key="item.areaId"
              :value="item.areaId"
              :label="item.areaName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="一体杆类型" prop="poleType">
          <el-select v-model="ruleForm.poleType" placeholder="请输入一体杆类型" style="width:100%">
            <el-option label="入口" value="entrance"></el-option>
            <el-option label="出口" value="export"></el-option>
          </el-select>
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
  getInfoListApi,
  getDropListApi,
  getAddinfoApi,
  getDelInfoApi,
  getEditInfoApi
} from "@/api/rod";
export default {
  components: {},
  data() {
    return {
      formInline: {
        poleName: "",
        poleNumber: "",
        poleStatus: "",
        page: 1,
        pageSize: 10
      },
      tableData: [],
      multipleSelection: [],
      total: 0,
      dialogVisible: false,
      dialogVisibleText: "",
      areaIdList: [], //下拉列表
      ruleForm: {
        poleName: "",
        poleNumber: "",
        poleIp: "",
        areaId: "",
        poleType: ""
      },
      rules: {
        poleName: [
          { required: true, message: "请输入一体杆名称", trigger: "blur" }
        ],
        poleNumber: [
          { required: true, message: "请输入一体杆编号", trigger: "blur" }
        ],
        poleIp: [
          { required: true, message: "请输入一体杆IP", trigger: "blur" }
        ],
        areaId: [
          { required: true, message: "请输入关联区域", trigger: "blur" }
        ],
        poleType: [
          { required: true, message: "请输入一体杆类型", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      this.getlist();
    },
    // 获取选中的
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取列表
    async getlist() {
      if (this.formInline.poleStatus == "2") {
        this.formInline.poleStatus = "";
      }
      const res = await getInfoListApi(this.formInline);
      // console.log(res);
      this.tableData = res.data.rows;
      this.total = res.data.total;
    },
    // 获取关联区域下拉列表
    async getareaIdList() {
      const res = await getDropListApi();
      // console.log(res);
      this.areaIdList = res.data;
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
    // 确认添加、修改
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.ruleForm.id) {
            // 编辑
            const res = await getEditInfoApi({
              id: this.ruleForm.id,
              poleName: this.ruleForm.poleName,
              poleNumber: this.ruleForm.poleNumber,
              poleIp: this.ruleForm.poleIp,
              areaId: this.ruleForm.areaId,
              poleType: this.ruleForm.poleType
            });
          } else {
            // 添加
            const res = await getAddinfoApi(this.ruleForm);
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
    // 取消
    resetForm() {
      this.ruleForm = {
        poleName: "",
        poleNumber: "",
        poleIp: "",
        areaId: "",
        poleType: ""
      };
      this.dialogVisible = false;
    },
    // 删除
    deleteInfo(id) {
      this.$confirm("是否删除当前选中的一体杆?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await getDelInfoApi(id);
          // console.log(res);
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
    // 回显
    async editInfo(row) {
      this.dialogVisibleText = "编辑楼宇";
      this.dialogVisible = true;
      this.ruleForm = JSON.parse(JSON.stringify(row));
    }
  },
  created() {
    this.getlist();
    this.getareaIdList();
  },
  computed: {},
  filters: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>
