<template>
  <div class="login-container">
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="车牌号码：">
          <el-input v-model="formInline.carNumber" placeholder="请输入车牌号码"></el-input>
        </el-form-item>
        <el-form-item label="缴纳状态：">
          <el-select v-model="formInline.paymentStatus" placeholder="未选择">
            <el-option label="全部" value="2"></el-option>
            <el-option label="已缴纳" value="1"></el-option>
            <el-option label="未缴纳" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="carNumber" label="车牌号码"></el-table-column>
      <el-table-column prop="chargeType" label="收费类型">
        <template slot-scope="scope">
          <span>{{ scope.row.chargeType == 'card'?'月卡':'临时停车' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parkingTime" label="停车总时长"></el-table-column>
      <el-table-column prop="actualCharge" label="缴纳费用（元）"></el-table-column>
      <el-table-column prop="paymentStatus" label="缴纳状态"></el-table-column>
      <el-table-column prop="paymentMethod" label="缴纳方式">
        <template slot-scope="scope">
          <span>{{ scope.row.paymentMethod == 'Alipay'?'支付宝':scope.row.paymentMethod == 'WeChat'?"微信":scope.row.paymentMethod == 'Cash'?'线下':'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentTime" label="缴纳时间"></el-table-column>
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
  </div>
</template>


<script>
import { getpaymentListApi } from "@/api/carPay";
export default {
  components: {},
  data() {
    return {
      formInline: {
        carNumber: "",
        paymentStatus: "",
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
      if (this.formInline.paymentStatus == 2) {
        this.formInline.paymentStatus = "";
      }
      const res = await getpaymentListApi(this.formInline);
      this.tableData = res.data.rows;
      this.total = res.data.total;
      // console.log(res);
    },
    // 分页
    handleSizeChange(val) {
      this.formInline.pageSize = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.formInline.page = val;
      this.getlist();
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
.login-container {
  padding: 20px;
  box-sizing: border-box;
}
::v-deep .el-table th {
  background-color: #f4f6f8; /* 你想要的颜色 */
}
</style>
