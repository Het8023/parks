<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="企业名称">
          <el-input v-model="formInline.user" placeholder="请输入企业名称" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getlist">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <hr />
    <el-button type="primary" @click="$router.push('/exterpriseAdd')">添加企业</el-button>
    <br />

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" @expand-change="expandHandle">
      <el-table-column type="expand">
        <template #default="{row}">
          <el-table :data="row.rentList">
            <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
            <el-table-column label="租赁起始时间" prop="startTime">
              <template #default="scope">{{scope.row.startTime}}至{{scope.row.endTime}}</template>
            </el-table-column>
            <el-table-column label="合同状态" prop="status">
              <template #default="scope">
                <el-tag
                  :type="scope.row.status == 0?'warning':scope.row.status == 1?'success':scope.row.status == 2?'info':'danger'"
                >{{ scope.row.status == 0?'待生效':scope.row.status == 1?'生效中':scope.row.status == 2?'已到期':'已退租' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button size="mini" type="text" :disabled="scope.row.status === 3">续租</el-button>
                <el-button
                  size="mini"
                  type="text"
                  :disabled="scope.row.status === 3"
                  @click="outRent(scope.row.id)"
                >退租</el-button>
                <el-button size="mini" type="text" :disabled="scope.row.status !== 3">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="企业名称" prop="name"></el-table-column>
      <el-table-column label="联系人" prop="contact"></el-table-column>
      <el-table-column label="联系电话" prop="contactNumber"></el-table-column>
      <el-table-column label="操作" prop="id">
        <template slot-scope="scope">
          <el-button type="text" @click="addRent(scope.row.id)">添加合同</el-button>
          <el-button type="text">查看</el-button>
          <el-button type="text" @click="editRent(scope.row.id)">编辑</el-button>
          <el-button
            type="text"
            @click="delExterprise(scope.row.id)"
            :disabled="scope.row.existContractFlag == 1"
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
      layout="total, prev,  pager, next,sizes"
      :total="total"
    ></el-pagination>

    <!-- 添加合同 -->
    <el-dialog title="添加合同" :visible="rentDialogVisible" width="580px" @close="closeDialog">
      <!-- 表单区域 -->
      <div class="form-container">
        <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in buildList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload action="#" :http-request="uploadHandle">
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  getenterpriseApi,
  getenterpriseRentApi,
  delExterpriseAPI,
  getRentBuildListAPI,
  createRentAPI,
  uploadAPI,
  outRentAPI
} from "@/api/park";
export default {
  components: {},
  data() {
    return {
      formInline: {
        user: ""
      },
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      rentDialogVisible: false,
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: "", // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      },
      rentRules: {
        buildingId: [
          { required: true, message: "请选择楼宇", trigger: "change" }
        ],
        rentTime: [
          { required: true, message: "请选择租赁日期", trigger: "change" }
        ],
        contractId: [{ required: true, message: "请上传合同文件" }]
      },
      buildList: []
    };
  },
  methods: {
    // 获取企业列表
    async getlist() {
      const res = await getenterpriseApi({
        name: this.formInline.user,
        page: this.page,
        pageSize: this.pageSize
      });
      // console.log(res);
      // this.tableData = res.data.rows;
      // 获取数据时增加合同数据默认列表
      this.tableData = res.data.rows.map(item => {
        return {
          ...item,
          rentList: []
        };
      });
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
    // 展开行 给当前行合同赋值数据
    async expandHandle(row, rows) {
      // console.log("row", row);
      // console.log("rows", rows);
      const isExpend = rows.find(item => item.id === row.id);
      if (isExpend) {
        const res = await getenterpriseRentApi(row.id);
        // console.log(res);
        row.rentList = res.data;
      }
    },
    // 编辑
    editRent(id) {
      this.$router.push({
        path: "/exterpriseAdd",
        query: {
          id
        }
      });
    },
    // 删除
    delExterprise(id) {
      this.$confirm("确认删除该企业吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await delExterpriseAPI(id);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getlist();
      });
    },
    // 打开
    async addRent(id) {
      this.rentDialogVisible = true;
      this.rentForm.enterpriseId = id;
      const res = await getRentBuildListAPI();
      this.buildList = res.data;
    },
    // 关闭
    closeDialog() {
      this.rentDialogVisible = false;
    },
    // 上传合同
    async uploadHandle(fileData) {
      // 1. 处理FormData
      const { file } = fileData;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "contract");
      // 2. 上传并赋值
      const res = await uploadAPI(formData);
      const { id, url } = res.data;
      this.rentForm.contractId = id;
      this.rentForm.contractUrl = url;
      // 单独校验表单
      this.$refs.addForm.validate("contractId");
    },
    // 确认提交
    confirmAdd() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const {
            buildingId,
            contractId,
            contractUrl,
            enterpriseId,
            type
          } = this.rentForm;
          await createRentAPI({
            buildingId,
            contractId,
            contractUrl,
            enterpriseId,
            type,
            startTime: this.rentForm.rentTime[0],
            endTime: this.rentForm.rentTime[1]
          });
          // 更新列表
          this.getlist();
          // 关闭弹框
          this.rentDialogVisible = false;
        }
      });
    },
    // 退租
    outRent(rentId) {
      this.$confirm("确认退租吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 1. 调用接口
          await outRentAPI(rentId);
          // 2. 重新拉取列表
          this.getlist();
          this.$message({
            type: "success",
            message: "退租成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
