import Vue from "vue";
import store from "@/store";

Vue.directive("auth-btn", {
  inserted(el, binding) {
    // console.log("el->", el);
    // console.log("binding->", binding.value);
    // 1. 先获取到按钮所绑定的值
    const val = binding.value;

    console.log("val", val);
    // 2. 获取后台返回的按钮权限数据列表
    const periss = store.state.user.userInfo.permissions;
    // 3. 判断按钮所绑定的值是否存在于后端返回按钮权限列表中
    const isValid = periss.includes(val);

    console.log("isva", isValid);
    // 4. 不存在, 则移除当前这个按钮
    if (!isValid) {
      el.parentNode.removeChild(el);
    }
  },
});
