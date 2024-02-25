<template>
  <div class="detail-enterprise">
    <header class="add-header">
      <el-page-header content="告警详情" @back="$router.back()" />
    </header>

    <div class="add-main">
      <div class="a1">
        <p>告警详情</p>
        <el-row>
          <el-col :span="12">告警时间：{{form.warningTime}}</el-col>
          <el-col :span="12">一体杆名称：{{form.poleName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">告警区域：{{form.areaName}}</el-col>
          <el-col :span="12">一体杆编号：{{form.poleNumber}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">故障类型：{{form.errorType}}</el-col>
          <el-col :span="12">
            处置状态：
            {{ form.handleStatus == 0?'未派单':form.handleStatus == 1?'已派单':form.handleStatus == 2?'已接单,':'已完成' }}
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="add-main">
      <div class="a1">
        <p>告警处理</p>
        <el-row>
          <el-col :span="12">处理人：{{form.handleUser}}</el-col>
          <el-col :span="12">联系方式：{{form.phonenumber}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">处理结果：{{form.handleResult}}</el-col>
          <el-col :span="12">完成时间：{{form.handleTime}}</el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getwarningDetailAPI } from "@/api/rod";
export default {
  components: {},
  data() {
    return {
      form: {}
    };
  },
  methods: {
    async getDetail() {
      const res = await getwarningDetailAPI(this.$route.query.id);
      this.form = res.data;
    }
  },
  mounted() {
    this.getDetail();
  },
  computed: {},
  filters: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.detail-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;
    .a1 {
      background-color: #fff !important;
      padding: 20px;
      box-sizing: border-box;
      .el-row {
        margin: 30px 0;
      }
    }
  }
}
</style>
