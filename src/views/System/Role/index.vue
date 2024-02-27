<template>
  <div class="app-container">
    <div class="left">
      <div class="left-list">
        <div
          class="left-item"
          v-for="(item) in role"
          :key="item.roleId"
          @click="active(item.roleId)"
          :class="activeIndex == item.roleId?'active':''"
        >
          <i class="el-icon-user" style="margin-right: 10px;"></i>
          <el-tooltip class="item" effect="dark" :content="item.remark" placement="top">
            <span>{{item.roleName}}</span>
          </el-tooltip>

          <el-dropdown
            style="float: right;margin-right: 10px;"
            trigger="click"
            @command="handleCommand($event,item.roleId)"
          >
            <i class="el-icon-setting"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">编辑角色</el-dropdown-item>
              <el-dropdown-item style="color:red" command="del">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button style="width:100%;margin-top:20px" @click="$router.push('/sys/add')">添加角色</el-button>
    </div>
    <div class="right">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="first">
          <div class="tree">
            <div class="right-item" v-for="(item) in alltree" :key="item.id">
              <div class="right-item-title">{{item.title}}</div>
              <el-tree
                :data="item.children"
                show-checkbox
                ref="tree"
                :default-checked-keys="checked"
                node-key="id"
                default-expand-all
                :props="defaultProps"
              ></el-tree>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="成员(0)" name="second">成员(0)</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getroleListApi,
  getAllTreeApi,
  getroleDetatilApi,
  getDelroleApi
} from "@/api/role";
export default {
  components: {},
  data() {
    return {
      role: [],
      activeIndex: 2,
      activeName: "first",
      alltree: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      checked: [] //默认选中的
    };
  },
  methods: {
    // 获取左侧列表和右侧树状图
    async getleft() {
      const res = await getroleListApi();
      // console.log(res);
      this.role = res.data;
      const res1 = await getAllTreeApi();
      // console.log(res1.data);
      this.alltree = res1.data;
      this.activeIndex = 2;
    },
    // 获取当前树状图选中的
    async getrightrole() {
      const res = await getroleDetatilApi(this.activeIndex);
      // console.log(res);
      // 合并id数组
      res.data.perms.forEach((item, index) => {
        if (item.length) {
          this.checked = this.checked.concat(item);
        }
      });
      console.log("123", this.checked);
    },
    // 切换样式
    active(id) {
      this.checked = [];
      this.$refs.tree.forEach((item, index) => {
        item.setCheckedKeys([]);
      });
      this.activeIndex = id;
      this.getrightrole();
    },
    handleCommand(e, id) {
      if (e == "del") {
        // 删除
        this.$confirm("删除后该角色下的用户权限失效，是否删除？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            console.log(id);
            const res = await getDelroleApi(id);
            this.getleft();
            this.getrightrole();
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
    }
  },
  created() {
    this.getleft();
    this.getrightrole();
  },
  computed: {},
  filters: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  .left {
    width: 20%;
    padding-right: 10px;
    box-sizing: border-box;
    border-right: 1px solid #ccc;
    height: 540px;

    .left-list {
      width: 100%;
      .left-item {
        padding: 15px;
      }
      .active {
        background-color: #edf5ff;
        color: #4770ff;
      }
    }
  }
  .right {
    width: 80%;
    .el-tabs {
      padding-left: 20px;
      height: 540px;
      .tree {
        width: 100%;
        display: flex;
        .right-item {
          width: 20%;
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
  }
}
</style>
