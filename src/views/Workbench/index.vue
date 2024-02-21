<template>
  <div class="app-container">
    <div class="dashboard-text">name: {{ info.userName }}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name", 'info']),
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  // background-color: #eee;
  height: calc(100vh - 60px);
}
</style>
