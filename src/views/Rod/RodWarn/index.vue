<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="一体杆名称:">
        <el-input v-model="formInline.poleName" placeholder="请输入一体杆名称"></el-input>
      </el-form-item>
      <el-form-item label="一体杆编号:">
        <el-input v-model="formInline.poleNumber" placeholder="请输入一体杆编号"></el-input>
      </el-form-item>
      <el-form-item label="处置状态:">
        <el-select v-model="formInline.handleStatus" placeholder="请选择处置状态">
          <el-option label="全部" value="4"></el-option>
          <el-option label="未派单" value="0"></el-option>
          <el-option label="已派单" value="1"></el-option>
          <el-option label="已接单" value="2"></el-option>
          <el-option label="已完成" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <hr />

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="poleName" label="一体杆名称"></el-table-column>
      <el-table-column prop="poleNumber" label="一体杆编号"></el-table-column>
      <el-table-column prop="errorType" label="故障类型"></el-table-column>
      <el-table-column prop="handleStatus" label="处置状态">
        <template
          #default="scope"
        >{{ scope.row.handleStatus == 0?'未派单':scope.row.handleStatus == 1?'已派单':scope.row.handleStatus == 2?'已接单,':'已完成' }}</template>
      </el-table-column>
      <el-table-column prop="warningTime" label="告警时间"></el-table-column>
      <el-table-column prop="id" label="操作">
        <template #default="scope">
          <el-button type="text" :disabled="scope.row.handleStatus != 0">派单</el-button>
          <el-button type="text" @click="detailWarn(scope.row.id)">详情</el-button>
          <el-button
            type="text"
            :disabled="scope.row.handleStatus != 3"
            @click="sc(scope.row.id)"
          >删除</el-button>
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
  </div>
</template>

<script>
import { getWarningListApi, getDelwarningApi } from "@/api/rod";
export default {
  components: {},
  data() {
    return {
      formInline: {
        poleName: "",
        poleNumber: "",
        handleStatus: "",
        page: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0
    };
  },
  methods: {
    onSubmit() {
      this.getlist();
    },
    // 获取列表
    async getlist() {
      if (this.formInline.handleStatus == 4) {
        this.formInline.handleStatus = "";
      }
      const res = await getWarningListApi(this.formInline);
      // console.log(res);
      this.tableData = res.data.rows;
      this.total = res.data.total;
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
    // 删除
    sc(id) {
      this.$confirm("是否确认删除当前告警记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await getDelwarningApi(id);
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
    // 详情
    detailWarn(id) {
      this.$router.push({
        path: "/warn/detail",
        query: {
          id
        }
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
