<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './logo'
import SidebarItem from './sidebar-item'

export default {
  name: 'GneteBaseSidebar',
  components: { SidebarItem, Logo },
  data() {
    return {
      variables: {
        menuBg: '#304156',
        menuText: '#bfcbd9',
        menuActiveText: '#409EFF'
      }
    }
  },
  computed: {
    ...mapGetters([
      'gneteBase'
    ]),
    routes() {
      const level = this.gneteBase.app.viewLevel
      return this.gneteBase.permission.routesMap[`lv_${level}`]
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      if (this.gneteBase.app.viewLevel !== 1) {
        return true
      }
      return this.gneteBase.settings.sidebarLogo
    },
    isCollapse() {
      return this.gneteBase.app.sidebar.status === 'mini'
    }
  }
}
</script>
