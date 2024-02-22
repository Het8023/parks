<template>
  <div class="login-container">
    <div style="margin-bottom:20px">
      <el-button type="primary" @click="dialogVisible = true">增加停车计费规则</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="ruleNumber" label="计费规则编号"></el-table-column>
      <el-table-column prop="ruleName" label="计费规则名称"></el-table-column>
      <el-table-column prop="freeDuration" label="免费时长（分钟）"></el-table-column>
      <el-table-column prop="chargeCeiling" label="收费上限（元）">
        <template slot-scope="scope">
          <span>{{ scope.row.chargeCeiling?scope.row.chargeCeiling:'--'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="chargeType" label="计费方式">
        <template slot-scope="scope">
          <span>{{ scope.row.chargeType == 'duration'?'时长收费':scope.row.chargeType == 'turn'? '按次收费':'分段收费'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ruleNameView" label="计费规则"></el-table-column>
      <el-table-column prop="id" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="hx(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="sc(scope.row.id)">删除</el-button>
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
      layout="total, prev,  pager, next,sizes"
      :total="total"
    ></el-pagination>

    <!-- 弹出框 -->
    <el-dialog title="添加计费规则" :visible.sync="dialogVisible" width="40%" :before-close="resetForm">
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-position="top"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="计费规则编号" prop="ruleNumber">
          <el-input v-model="ruleForm.ruleNumber" placeholder="请输入计费规则编号"></el-input>
        </el-form-item>
        <el-form-item label="计费规则名称" prop="ruleName">
          <el-input v-model="ruleForm.ruleName" placeholder="请输入计费规则名称"></el-input>
        </el-form-item>
        <el-form-item label="计费方式(全天收费)" prop="chargeType">
          <el-radio v-model="ruleForm.chargeType" label="duration" border>时长收费</el-radio>
          <el-radio v-model="ruleForm.chargeType" label="turn" border>按次收费</el-radio>
          <el-radio v-model="ruleForm.chargeType" label="partition" border>分段收费</el-radio>
        </el-form-item>
        <el-form-item>
          <div class="a1">
            <div class="left">
              <p>免费时长</p>
              <p>
                <el-input v-model="ruleForm.freeDuration" placeholder="请输入免费时长"></el-input>分钟
              </p>
            </div>
            <div class="right">
              <p>收费上限</p>
              <p>
                <el-input v-model="ruleForm.chargeCeiling" placeholder="请输入收费上限"></el-input>元
              </p>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="计费规则" required>
          <div class="a2" v-if="ruleForm.chargeType == 'duration'">
            <span>每</span>
            <el-form-item prop="durationTime">
              <el-input v-model="ruleForm.durationTime" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="durationType">
              <el-select v-model="ruleForm.durationType" placeholder="请选择">
                <el-option label="分钟" value="minute"></el-option>
                <el-option label="小时" value="hour"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="durationPrice">
              <el-input v-model="ruleForm.durationPrice" placeholder="请输入"></el-input>
            </el-form-item>
            <span>元</span>
          </div>
          <div class="a3" v-if="ruleForm.chargeType == 'turn'">
            <span>每次</span>
            <el-form-item prop="turnPrice">
              <el-input v-model="ruleForm.turnPrice" placeholder="请输入金额"></el-input>
            </el-form-item>
            <span>元</span>
          </div>
          <div class="a4" v-if="ruleForm.chargeType == 'partition'">
            <p>
              <el-form-item prop="partitionFrameTime">
                <el-input v-model="ruleForm.partitionFrameTime" placeholder="请输入"></el-input>
              </el-form-item>
              <span>小时内,每小时收费</span>
              <el-form-item prop="partitionFramePrice">
                <el-input v-model="ruleForm.partitionFramePrice" placeholder="请输入"></el-input>
              </el-form-item>
              <span>元</span>
            </p>
            <p>
              <span>每增加</span>
              <el-form-item prop="partitionIncreaseTime">
                <el-input v-model="ruleForm.partitionIncreaseTime" placeholder="请输入"></el-input>
              </el-form-item>
              <span>小时，增加</span>
              <el-form-item prop="partitionIncreasePrice">
                <el-input v-model="ruleForm.partitionIncreasePrice" placeholder="请输入"></el-input>
              </el-form-item>
              <span>元</span>
            </p>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import {
  getRlueListApi,
  getAddruleApi,
  getruleDetailApi,
  getEditruleApi,
  getDelruleApi
} from "@/api/carRlue";
export default {
  components: {},
  data() {
    return {
      tableData: [],
      total: 0,
      page: {
        page: 1,
        pageSize: 10
      },
      dialogVisible: false,
      ruleForm: {
        ruleNumber: "", //计费规则编号
        ruleName: "", //计费规则名称
        chargeType: "duration", //计费方式
        freeDuration: "", //免费时长
        chargeCeiling: "", //收费上限
        durationTime: "", //每几个小时
        durationPrice: "", //每几个小时多少钱
        durationType: "", //单位
        turnPrice: "", //按次每次多少钱
        partitionFrameTime: "", //分段 多少小时内
        partitionFramePrice: "", //分段 多少小时内多少钱
        partitionIncreaseTime: "", //分段 超出多少时间
        partitionIncreasePrice: "" //分段 超出范围收费价钱
      },
      rules: {
        ruleNumber: [
          { required: true, message: "请输入计费规则编号", trigger: "blur" }
        ],
        ruleName: [
          { required: true, message: "请输入计费规则名称", trigger: "blur" }
        ],
        chargeType: [
          { required: true, message: "请输入计费方式", trigger: "blur" }
        ],
        durationTime: [
          { required: true, message: "请输入计费时间！", trigger: "blur" }
        ],
        durationType: [
          { required: true, message: "请选择计费时间单位！", trigger: "blur" }
        ],
        durationPrice: [
          { required: true, message: "请输入计费金额！", trigger: "blur" }
        ],
        turnPrice: [
          { required: true, message: "请输入计费金额！", trigger: "blur" }
        ],
        partitionFrameTime: [
          { required: true, message: "请输入计费金额！", trigger: "blur" }
        ],
        partitionFramePrice: [
          { required: true, message: "请输入计费金额！", trigger: "blur" }
        ],
        partitionIncreaseTime: [
          { required: true, message: "请输入计费金额！", trigger: "blur" }
        ],
        partitionIncreasePrice: [
          { required: true, message: "请输入计费金额！", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getlist() {
      const res = await getRlueListApi(this.page);
      // console.log(res);
      this.tableData = res.data.rows;
      this.total = res.data.total;
    },
    // 确认添加
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.ruleForm.id) {
            // 编辑
            const res = await getEditruleApi(this.ruleForm);
          } else {
            // 添加
            if (this.ruleForm.chargeType == "duration") {
              this.ruleForm.turnPrice = "";
              this.ruleForm.partitionFrameTime = "";
              this.ruleForm.partitionFramePrice = "";
              this.ruleForm.partitionIncreaseTime = "";
              this.ruleForm.partitionIncreasePrice = "";
            } else if (this.ruleForm.chargeType == "turn") {
              this.ruleForm.durationTime = "";
              this.ruleForm.durationType = "";
              this.ruleForm.durationPrice = "";
              this.ruleForm.partitionFrameTime = "";
              this.ruleForm.partitionFramePrice = "";
              this.ruleForm.partitionIncreaseTime = "";
              this.ruleForm.partitionIncreasePrice = "";
            } else if (this.ruleForm.chargeType == "partition") {
              this.ruleForm.turnPrice = "";
              this.ruleForm.durationTime = "";
              this.ruleForm.durationType = "";
              this.ruleForm.durationPrice = "";
            }
            const res = await getAddruleApi(this.ruleForm);
          }
          this.$refs.ruleForm.resetFields();
          this.dialogVisible = false;
          this.getlist();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
    // 回显
    async hx(id) {
      const res = await getruleDetailApi(id);
      this.dialogVisible = true;
      this.ruleForm = res.data;
    },
    // 取消
    resetForm() {
      // this.$refs.ruleForm.resetFields();
      this.ruleForm = {
        ruleNumber: "", //计费规则编号
        ruleName: "", //计费规则名称
        chargeType: "duration", //计费方式
        freeDuration: "", //免费时长
        chargeCeiling: "", //收费上限
        durationTime: "", //每几个小时
        durationPrice: "", //每几个小时多少钱
        durationType: "", //单位
        turnPrice: "", //按次每次多少钱
        partitionFrameTime: "", //分段 多少小时内
        partitionFramePrice: "", //分段 多少小时内多少钱
        partitionIncreaseTime: "", //分段 超出多少时间
        partitionIncreasePrice: "" //分段 超出范围收费价钱
      };
      this.dialogVisible = false;
    },
    // 删除
    sc(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await getDelruleApi(id);
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
.el-form-item {
  margin-bottom: 10px;
}
.login-container {
  padding: 20px;
  box-sizing: border-box;
}
::v-deep .el-table th {
  background-color: #f4f6f8;
}
.a1 {
  display: flex;
  p {
    line-height: 0;
  }
  .left,
  .right {
    width: 50%;
    .el-input {
      display: inline-block;
      width: 60%;
    }
  }
}
.a2 {
  display: flex;
  justify-content: space-around;
}
.a3 {
  display: flex;
  justify-content: flex-start;
}
.a4 {
  p {
    display: flex;
    justify-content: flex-start;
    .el-input {
      width: 90%;
      margin: 0 10px;
    }
  }
}
</style>
