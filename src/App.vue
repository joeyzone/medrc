<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from "./components/HelloWorld.vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { menuConfig } from "../config/menu";
import { useRouter } from "vue-router";

const store = useStore();
const activeIndex = ref("");
const router = useRouter();

const account = computed(() => {
  return store.state.account;
});

const role = computed(() => {
  return store.state.role;
});

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
const gotoLogin = () => {
  router.push("/login");
};

const menuConfigData = ref(menuConfig);
</script>

<template>
  <!-- <p>{{ $route.path }}</p> -->
  <router-view v-if="$route.path === '/login'" />
  <!-- menu config -->
  <div v-else>
    <div>
      <el-container class="layout-container-demo" style="height: 500px">
        <el-header class="header-wrapper" @click="gotoLogin">{{
          account
        }}</el-header>
        <el-container class="main-wrapper">
          <el-aside width="200px">
            <!-- <h5 class="mb-2">
          <router-link to="/">共享系统</router-link>
        </h5> -->
            <el-scrollbar>
              <el-menu
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                :default-active="activeIndex"
              >
                <template v-for="item in menuConfigData" :key="item.index">
                  <el-sub-menu :index="item.index">
                    <template #title>
                      <el-icon>
                        <component :is="item.icon"></component>
                      </el-icon>
                      <span>{{ item.title }}</span>
                    </template>
                    <template
                      v-for="subitem in item.subItems"
                      :key="subitem.path"
                    >
                      <el-menu-item-group>
                        <!-- todo -->
                        <el-menu-item
                          v-show="
                            subitem.roles.includes(role) || role === 'root'
                          "
                          :index="subitem.path"
                        >
                          <router-link :to="subitem.path">{{
                            subitem.title
                          }}</router-link>
                        </el-menu-item>
                      </el-menu-item-group>
                    </template>
                  </el-sub-menu>
                </template>
              </el-menu>
            </el-scrollbar>
          </el-aside>
          <el-container>
            <el-main>
              <router-view />
            </el-main>
            <!-- <el-footer>Footer</el-footer> -->
          </el-container>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<style scoped lang="less">
html,
body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
  padding: 0;
  a {
    text-decoration: none;
    color: #2c3e50;
    // color: #13c2c2;
    &:hover {
    }
  }
  li.el-menu-item.is-active a {
    color: #13c2c2;
  }
  .header-wrapper {
    border: 1px solid #ddd;
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    background-color: #ddd;
  }
  .main-wrapper {
    padding-top: 60px;
  }
}

.login-link {
  margin-right: 20px;
}
.reg-link {
  margin-right: 20px;
}
.app-logo {
  height: 60px;
  vertical-align: middle;
}
.app-content {
  padding-top: 80px;
}
.top-title {
}
</style>
