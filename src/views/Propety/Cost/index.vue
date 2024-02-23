<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="企业名称：">
        <el-input v-model="formInline.enterpriseName" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="收费时间：">
        <el-date-picker
          v-model="formInline.data"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <hr />
    <el-button type="primary" @click="dialogVisible = true">添加账单</el-button>
    <br />

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="billNumber" label="账单编号"></el-table-column>
      <el-table-column prop="enterpriseName" label="企业名称"></el-table-column>
      <el-table-column prop="buildingName" label="租赁楼宇"></el-table-column>
      <el-table-column prop="propertyFeePrice" label="物业费(元/㎡)"></el-table-column>
      <el-table-column prop="paymentAmount" label="账单金额(元)"></el-table-column>
      <el-table-column prop="createTime" label="缴费时间"></el-table-column>
      <el-table-column prop="id" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="ck(scope.row.id)">查看</el-button>
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
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
    <el-dialog title="添加账单" :visible.sync="dialogVisible" width="40%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="选择租户" prop="enterpriseId">
          <el-select v-model="ruleForm.enterpriseId" placeholder="请选择租户">
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="租赁楼宇" prop="buildingId">
          <el-select v-model="ruleForm.buildingId" placeholder="请选择租户">
            <el-option
              v-for="item in buildingList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费周期" prop="Time">
          <el-date-picker
            v-model="ruleForm.Time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="支付金额" prop="paymentAmount">
          <el-input v-model="ruleForm.paymentAmount" disabled></el-input>
          <span style="display:none">{{getpayment}}</span>
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-select v-model="ruleForm.paymentMethod" placeholder="请选择支付方式">
            <el-option label="微信" value="1"></el-option>
            <el-option label="支付宝" value="2"></el-option>
            <el-option label="现金" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog title="提示" :visible.sync="dialogVisible1" width="40%">
      <el-form label-position="right" label-width="100px" :model="formLabelAlign">
        <el-form-item label="租户名称">
          <span>{{formLabelAlign.enterpriseName}}</span>
        </el-form-item>
        <el-form-item label="租赁楼宇">
          <span>{{formLabelAlign.buildingName}}</span>
        </el-form-item>
        <el-form-item label="缴费周期">
          <span>{{formLabelAlign.startTime}}至{{formLabelAlign.endTime}}</span>
        </el-form-item>
        <el-form-item label="物业费(元/㎡)">
          <span>{{formLabelAlign.propertyFeePrice}}</span>
        </el-form-item>
        <el-form-item label="账单金额(元)">
          <span>{{formLabelAlign.paymentAmount}}</span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span>{{formLabelAlign.paymentMethodValue}}</span>
        </el-form-item>
        <el-form-item label="缴费时间">
          <span>{{formLabelAlign.createTime}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPropertyfeeListApi,
  getAddPropertyfeeApi,
  getenterpriseApi,
  getbuildingApi,
  getpaymentApi,
  getpropertyfeeDetailApi,
  delpropertyfeeAPI
} from "@/api/propety";
export default {
  components: {},
  data() {
    return {
      formInline: {
        enterpriseName: "",
        data: "",
        page: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      dialogVisible: false,
      dialogVisible1: false,
      enterpriseList: [],
      buildingList: [],
      ruleForm: {
        enterpriseId: "",
        buildingId: "",
        Time: "",
        paymentAmount: "",
        paymentMethod: ""
      },
      rules: {
        enterpriseId: [
          { required: true, message: "请选择租户", trigger: "blur" }
        ],
        buildingId: [
          { required: true, message: "请选择租赁楼宇", trigger: "blur" }
        ],
        Time: [
          { required: true, message: "请选择日期范围", trigger: "change" }
        ],
        paymentAmount: [
          { required: true, message: "请输入支付金额", trigger: "blur" }
        ],
        paymentMethod: [
          { required: true, message: "请选择支付方式", trigger: "blur" }
        ]
      },
      // 查看
      formLabelAlign: {}
    };
  },
  methods: {
    onSubmit() {
      this.getlist();
    },
    // 获取列表
    async getlist() {
      let data = {
        enterpriseName: this.formInline.enterpriseName || "",
        page: this.formInline.page,
        pageSize: this.formInline.pageSize,
        start: this.formInline.data[0] || "",
        end: this.formInline.data[1] || ""
      };
      // 获取列表
      const res = await getPropertyfeeListApi(data);
      this.tableData = res.data.rows;
      this.total = res.data.total;
      // 获取企业列表
      const res1 = await getenterpriseApi();
      this.enterpriseList = res1.data;
      // 获取楼宇列表
      const res2 = await getbuildingApi();
      this.buildingList = res2.data;
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

    // 确认添加
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.ruleForm.startTime = this.ruleForm.Time[0];
          this.ruleForm.endTime = this.ruleForm.Time[1];
          delete this.ruleForm.Time;
          const res = await getAddPropertyfeeApi(this.ruleForm);
          // console.log(res);
          this.dialogVisible = false;
          this.getlist();
          this.$refs[formName].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    // 查看
    async ck(id) {
      const res = await getpropertyfeeDetailApi(id);
      this.formLabelAlign = res.data;
      this.dialogVisible1 = true;
      // console.log(res);
    },
    // 删除
    del(id) {
      this.$confirm("确认删除当前账单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await delpropertyfeeAPI(id);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getlist();
      });
    }
  },
  created() {
    this.getlist();
  },
  computed: {
    // 获取支付金额
    async getpayment() {
      if (
        this.ruleForm.Time[0] &&
        this.ruleForm.buildingId &&
        this.ruleForm.Time[1]
      ) {
        const res = await getpaymentApi({
          buildingId: this.ruleForm.buildingId,
          startTime: this.ruleForm.Time[0],
          endTime: this.ruleForm.Time[1]
        });
        // console.log(res);
        this.ruleForm.paymentAmount = res.data;
        return this.ruleForm.paymentAmount || "";
      }
    }
  },
  filters: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>
