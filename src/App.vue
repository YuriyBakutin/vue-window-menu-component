<template>
  <div id="app">
    <windowmenu
      locale="en"
      v-on:menuItemActivate="menuEventHandler">
    </windowmenu>
    <div id="bottomArea"></div>
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
#bottomArea {
  width: 100%;
  height: 100%;
  background-color: blue;
}
</style>
