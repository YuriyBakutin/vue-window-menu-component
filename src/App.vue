<template>
  <div id="app">
    <windowmenu
      locale="ru"
      v-on:menuItemActivate="menuEventHandler">
    </windowmenu>
  </div>
</template>

<script>
import windowmenu from './components/menu/window-menu.vue'

export default {
  name: 'app',
  data: function () {
    return {
      elName: "App"
    }
  },
  components: {
    windowmenu,
  },
  methods: {
    menuEventHandler (item) {
      console.log('itemActivateName: ' + item.itemName)
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
