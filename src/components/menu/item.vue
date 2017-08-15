<template>
  <li v-on:click.stop="itemHandler"
      v-on:mouseover="defineNextLevelMenuWidth"
      v-bind:class="{ l0: isL0, l1: isL1, l2: isL2, inactive: isInactive, nolevel: isNoL }">
    {{localisedItemName + (newThreeDots ? '…' : '')}}
    <div v-if="hotKey"
         class="hotKeyClass">
      {{hotKey + '\u00A0' + '\u00A0'}}
    </div>
    <template v-if="isSubmenu">
      <div v-if="menuLevel != 0"
           class="rightArrow">⏵</div>
      <ul v-bind:style="{ width: ulWidthString, left: l2LeftShiftString, visibility: ulVisibility }">
        <slot></slot>
      </ul>
      <ul class="dummyMenuBlock"
          ref="dummyMenuBlock">
        <li v-for="item in $children">
          {{item.localisedItemName +
            (item.threeDots ? '…' : '') +
            (item.hotKey ? item.hotKey : '')}}
        </li>
      </ul>
    </template>
  </li>
</template>

<script>
import nextKey from './id-gen'
import MenuEventBus from './menu-event-bus.js'
const MENU_BLOCK_MARGIN = 20
const NBSP = '\u00A0'
const IS_MISSING = -1

export default {
  name: 'item',
  data: function () {
    return {
      itemKey: null,
      parentName: null,
      menuLevel: null,
      menuComponent: "item",
      isSubmenu: true,
      ulWidth: IS_MISSING,
      ulWidthString: '140px',
      l2LeftShiftString: '0',
      newThreeDots: false,
      currentLocaleDict: null,
      ulVisibility: 'hidden',
      menuEventBusHandlers: {}
    }
  },
  props: {
    isInactive: {
      type: [Boolean, String],
      default: false
    },
    threeDots: {
      type: [Boolean, String],
      default: false
    },
    itemName: {
      type: String,
      default: ''
    },
    hotKey: {
      type: String,
      default: ''
    },
    menuLevelName: {
      type: String,
      default: ''
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
    },
    localisedItemName: function () {
      if(this.currentLocaleDict && this.currentLocaleDict[this.itemName]) {
        return this.spacesToNonBreacking(this.currentLocaleDict[this.itemName])
      }
      return this.spacesToNonBreacking(this.itemName)
    }
  },
  methods: {
    parseHotKeyString(hotKey) {
      let itemHotKeyWithName = {
        Ctrl: false,
        Alt: false,
        Shft: false,
        keyName: '',
        item: this
      }
      if (this.hotKey.indexOf('Ctrl+') != IS_MISSING) {
        itemHotKeyWithName.Ctrl = true
      }
      if (this.hotKey.indexOf('Alt+') != IS_MISSING) {
        itemHotKeyWithName.Alt = true
      }
      if (this.hotKey.indexOf('Shft+') != IS_MISSING) {
        itemHotKeyWithName.Shft = true
      }
      let h = this.hotKey.split('+')
      itemHotKeyWithName.keyName = h[h.length - 1]

      return itemHotKeyWithName

    },
    spacesToNonBreacking (str) {
      let newStr = ''
      let c = ''
      for (let i = 0; i < str.length; i++) {
        c = str[i]
        if (c == ' ') {
          c = NBSP
        }
        newStr += c
      }
      return newStr
    },
    defineNextLevelMenuWidth () {
      if (!this.isSubmenu) return

      this.$refs.dummyMenuBlock.style.display = 'block'
      this.ulWidth = this.$refs.dummyMenuBlock.clientWidth + MENU_BLOCK_MARGIN
      this.$refs.dummyMenuBlock.style.display = 'none'
      this.ulWidthString = this.ulWidth + 'px'

      if (this.isL0 && this.isSubmenu) {
        MenuEventBus.$emit(this.itemKey + '_ulWidth', this.ulWidth)
      }

      this.$nextTick(
        function () {
          this.ulVisibility = 'visible'
        }
      )
    },
    itemHandler () {
      if(!(this.isSubmenu || this.isInactive)) {
        MenuEventBus.$emit('menuItemActivate', this)
      }
    }
  },
  created () {
    this.itemKey = nextKey()

    this.newThreeDots = this.threeDots

    MenuEventBus.$on(
      'setLocaleDict',
      (currentLocaleDict) => {
        if (currentLocaleDict) {
          this.currentLocaleDict = currentLocaleDict
        }
      }
    )

    this.$nextTick(
      function () {
        MenuEventBus.$on(
          this.$parent.itemKey + '_ulWidth',
          this.menuEventBusHandlers[this.$parent.itemKey + '_ulWidth'] = (
            (parentUlWidth) => {
              this.l2LeftShiftString = parentUlWidth + 'px'
              MenuEventBus.$off(
                this.$parent.itemKey + '_ulWidth',
                this.menuEventBusHandlers[this.$parent.itemKey + '_ulWidth']
              )
            }
          )
        )
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
  beforeMount () {
    if(this.hotKey) {
      MenuEventBus.$emit(
        'hotKeyRegistration',
        this.parseHotKeyString(this.hotKey)
      )
    }
  },
  mounted () {
    this.isSubmenu = (this.$children.length > 0)

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
@import "theme";
$menuHeight: $menuFontSize * 2;

* {
  margin: 0;
  padding: 0;
  font: $menuFontSize $menuFontFamily;
  cursor: default;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  &.dummyMenuBlock {
    visibility: hidden;
    display: none;
    position: absolute;
    top: $menuHeight;
    left: 0;
    > li {
      line-height: $menuHeight;
      padding-left: 4px;
      height: $menuHeight;
    }
  }
}
.nolevel {
  visibility: hidden;
}
.rightArrow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: $menuHeight;
  line-height: $menuHeight;
  text-align: right;
  color: $rightArrowColor;
}
.hotKeyClass {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: $menuHeight;
  line-height: $menuHeight;
  text-align: right;
}
li {
  display: none;
  &.l0 {
    display: block;
    float: left;
    line-height: $menuHeight;
    position: relative;
    padding: 0 6px;
    color: $l0Color;
    background-color: $l0BackgroundColor;
    text-decoration: none;
    z-index: 10;
    &:hover {
      background-color: $l0HoverBackgroundColor;
      height: $menuHeight;
    }
    > ul:not(.dummyMenuBlock) {
      display: none;
      position: absolute;
      top: $menuHeight;
      left: 0;
      z-index: 10;
    }
  }
  &.l1 {
    position: relative;
    padding-left: 4px;
    height: $menuHeight;
    line-height: $menuHeight;
    color: $l1Color;
    background-color: $l1BackgroundColor;
    .hotKeyClass {
      color: $l1HotKeyColor;
    }
    &.inactive {
      color: $l1InactiveColor;
    }
    > ul:not(.dummyMenuBlock) {
      display: none;
      position: absolute;
      top: 0;
      z-index: 10;
    }
  }
  &.l2 {
    position: relative;
    padding-left: 4px;
    height: $menuHeight;
    line-height: $menuHeight;
    color: $l2Color;
    background-color: $l2BackgroundColor;
    &.inactive {
      color: $l2InactiveColor;
    }
    .hotKeyClass {
      color: $l2HotKeyColor;
    }
  }
}
li.l0:hover > ul {
  display: block;
}
li.l0:hover > ul > li {
  display: block;
}
li.l1:not(.separator):not(.inactive):hover {
  background-color: $l1HoverBackgroundColor;
}
li.l1:hover > ul {
  display: block;
}
li.l1:hover > ul > li {
  display: block;
}
li.l2:not(.separator):not(.inactive):hover {
  background-color: $l2HoverBackgroundColor;
}
</style>
