<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <el-page-header content="添加角色" @back="$router.back()" />
      </div>
      <div class="right"></div>
    </header>
    <main class="add-main">
      <div class="a1">
        <el-steps direction="vertical" :active="active">
          <el-step title="角色信息"></el-step>
          <el-step title="权限信息"></el-step>
          <el-step title="检查并完成"></el-step>
        </el-steps>
      </div>
      <div class="a2">
        <h3 v-if="active == 1">角色信息</h3>
        <h3 v-if="active == 2">权限配置</h3>
        <h3 v-if="active == 3">检查并完成</h3>
        <div class="a3" v-if="active == 1">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item v-show="active == 1" label="角色名称" prop="roleName">
              <el-input v-model="ruleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item v-show="active == 1" label="角色描述" prop="remark">
              <el-input type="textarea" v-model="ruleForm.remark"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="a4" v-if="active == 2">
          <div class="right-item" v-for="(item) in alltree" :key="item.id">
            <div class="right-item-title">{{item.title}}</div>
            <el-tree
              :data="item.children"
              show-checkbox
              ref="tree"
              node-key="id"
              default-expand-all
              check-strictly
              :props="defaultProps"
            ></el-tree>
          </div>
        </div>
        <div class="a5" v-if="active == 3"></div>
      </div>
    </main>
    <footer class="add-footer">
      <el-button v-if="active != 1" @click="prev">上一步</el-button>
      <el-button type="primary" v-if="active != 3" @click="next">下一步</el-button>
      <el-button type="primary" v-if="active == 3" @click="add">确认添加</el-button>
    </footer>
  </div>
</template>

<script>
import { getAllTreeApi, getAddroleApi } from "@/api/role";
export default {
  components: {},
  data() {
    return {
      active: 1, //步骤条
      alltree: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      ruleForm: {
        roleName: "",
        remark: ""
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        remark: [{ required: true, message: "请输入角色描述", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 下一步
    next() {
      if (this.active == 2) {
        this.ruleForm.perms = [];
        this.$refs.tree.forEach(tree => {
          this.ruleForm.perms.push(tree.getCheckedKeys());
        });
        // 如果长度为零 没有选中任何东西
        if (this.ruleForm.perms.flat().length === 0) {
          this.$message({
            type: "error",
            message: "请至少选择一个权限点"
          });
        } else {
          // 进入到下一页
          this.active++;
        }
      }
      if (this.active == 3) return;
      if (this.active == 1) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.active++;
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    // 上一步
    prev() {
      this.active--;
    },
    // 获取树状表
    async getTree() {
      const res = await getAllTreeApi();
      // console.log(res.data);
      this.alltree = res.data;
    },
    // 添加
    async add() {
      const res = await getAddroleApi(this.ruleForm);
      this.$router.back();
    }
  },
  created() {
    this.getTree();
  },
  computed: {},
  filters: {},
  watch: {}
};
</script>

<style scoped lang="scss">
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px 100px;
    display: flex;

    .a1 {
      height: 300px;
      width: 30%;
    }
    .a2 {
      width: 60%;
      background-color: #fff;
      padding: 10px;
    }
    .a4 {
      display: flex;
      flex-wrap: wrap;
      .right-item {
        width: 30%;
        margin-bottom: 20px;
        border-right: 1px solid #ccc;
        .right-item-title {
          background-color: #dfe9f8;
          width: 80%;
          text-align: center;
          margin: 10px auto;
          padding: 10px 0;
        }
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
    z-index: 2;
  }
}
</style>
