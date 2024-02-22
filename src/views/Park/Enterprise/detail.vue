<template>
  <div class="detail-enterprise">
    <header class="add-header">
      <el-page-header content="查看企业" @back="$router.back()" />
    </header>
    <div class="add-main">
      <div class="a1">
        <p>企业名称：{{form.name}}</p>
        <p>法人：{{form.legalPerson}}</p>
        <p>注册地址：{{form.registeredAddress}}</p>
        <p>所在行业：{{form.industryName}}</p>
        <p>营业执照：{{form.businessLicenseName}}</p>
        <p>企业联系人：{{form.contact}}</p>
        <p>联系电话：{{form.contactNumber}}</p>
      </div>
    </div>
    <div class="add-main">
      <div class="form-container">
        <div class="title">租赁记录</div>
        <div class="table-container">
          <el-table :data="form.rent" style="width: 100%" border>
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="name" label="租赁楼宇" width="180" />
            <el-table-column label="租赁起止时间" width="280">
              <template #default="{row}">{{ row.startTime }} - {{ row.endTime }}</template>
            </el-table-column>
            <el-table-column label="租赁合同(点击预览)">
              <template #default="{row}">
                <el-button type="text">
                  <a
                    :href="`${previewURL}${row.contractUrl}`"
                    target="_blank"
                  >{{ row.contractName }}</a>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="录入时间" />
            <el-table-column prop="address" label="操作">
              <template #default="{row}">
                <el-button type="text">
                  <a :href="row.contractUrl">合同下载</a>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { getEnterpriseDetail } from "@/api/park";
export default {
  components: {},
  data() {
    return {
      form: {},
      previewURL: "https://view.officeapps.live.com/op/view.aspx?src=" // 预览地址
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      const res = await getEnterpriseDetail(this.$route.query.id);
      this.form = res.data;
    }
  },
  computed: {},
  filters: {},
  watch: {}
};
</script>


<style scoped lang="scss">
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
    }

    .form-container {
      background-color: #fff;
      margin-bottom: 20px;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
    }
    .table-container {
      padding: 20px;
    }
    .preview {
      img {
        width: 100px;
      }
    }
  }
}
</style>
