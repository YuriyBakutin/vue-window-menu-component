<template>
  <li class="separator"
      v-bind:class="{ l0: isL0, l1: isL1, l2: isL2, nolevel: isNoL }"></li>
</template>

<script>
import nextKey from './id-gen'
import MenuEventBus from './menu-event-bus.js'
const MENU_BLOCK_MARGIN = 20
const NBSP = '\u00A0'
const IS_MISSING = -1

// isInactive
// isSeparator

export default {
  name: 'separator',
  data: function () {
    return {
      itemKey: null,
      parentName: null,
      menuLevel: null,
      menuEventBusHandlers: {}
    }
  },
  props: {
    isInactive: {
      type: [Boolean, String],
      default: false
    },
    isSeparator: {
      type: [Boolean, String],
      default: false
    }
  },
  computed: {
    isL0: function () {
      return this.menuLevel === 0
    },
    isL1: function () {
      return this.menuLevel === 1
    },
    isL2: function () {
      return this.menuLevel === 2
    },
    isNoL: function () {
      return this.menuLevel === null
    }
  },
  created () {
    this.$nextTick(
      function () {
        MenuEventBus.$on(
          this.$parent.itemKey + '_menuLevel',
          this.menuEventBusHandlers[this.$parent.itemKey + '_menuLevel'] = (
            (parentMenuLevel) => {
              this.menuLevel = parentMenuLevel + 1
              MenuEventBus.$emit(
                this.itemKey + '_menuLevel',
                this.menuLevel
              )
              MenuEventBus.$off(
                this.$parent.itemKey + '_menuLevel',
                this.menuEventBusHandlers[this.$parent.itemKey + '_menuLevel']
              )
            }
          )
        )
      }
    )
  },
  beforDestroy () {
    for (let eventName in this.menuEventBusHandlers) {
      MenuEventBus.$off(
        eventName,
        this.menuEventBusHandlers[eventName]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import "_theme";
$menuHeight: $menuFontSize * 2;
* {
  margin: 0;
  padding: 0;
  cursor: default;
}
li{
  position: relative;
  padding-left: 4px;
  height: $menuHeight;
  &.l1 {
    line-height: $menuHeight;
    background-color: $l1BackgroundColor;
  }
  &.l2 {
    line-height: $menuHeight;
    background-color: $l2BackgroundColor;
  }
  &.separator {
    height: $separatorHeight;
  }
}

</style>
