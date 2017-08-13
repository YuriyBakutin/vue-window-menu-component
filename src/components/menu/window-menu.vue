<template>
  <div>
    <ul>

<!-- Begin - Menu Tree -->
<!--
      Hot keys names can be copied
      from the dictionary below

      When using a locale, the command names
      in the supported language must be placed
      in the localeDict object.                        -->

      <item itemName="File">
        <item itemName="New">
          <item itemName="Document" hotKey="Ctrl+N"></item>
          <item itemName="Project"></item>
        </item>
        <separator></separator>
        <item itemName="Open" hotKey="Ctrl+O"
         threeDots="true"></item>
        <item itemName="Save" hotKey="Ctrl+Shft+S"
         isInactive="true"></item>
        <item itemName="Save as" hotKey="Ctrl+Shft+S"
         threeDots="true"></item>
      </item>
      <item itemName="Edit">
        <item itemName="Undo" hotKey="Ctrl+Z"></item>
        <item itemName="Redo" hotKey="Ctrl+Shft+Z"></item>
        <separator></separator>
        <item itemName="Cut" hotKey="Ctrl+X"></item>
        <item itemName="Copy" hotKey="Ctrl+C"></item>
        <item itemName="Paste" hotKey="Ctrl+V"></item>
      </item>
      <item itemName="Tools">
        <item itemName="Macroses">
          <item itemName="Macro1" hotKey="Ctrl+1"></item>
          <separator></separator>
          <item itemName="Macro2" hotKey="Ctrl+⬇"></item>
          <item itemName="Macro3" isInactive="true"
           hotKey="Ctrl+⬆"></item>
        </item>
        <separator></separator>
        <item itemName="Options"></item>
        <item itemName="Preferences"></item>
      </item>
      <item itemName="Help">
        <item itemName="Help" hotKey="Ctrl+H"></item>
        <item itemName="About"></item>
      </item>
    </ul>
<!-- End - Menu Tree -->

    <div class="menu0BackgroundBox">
    </div>
  </div>
</template>

<script>
import MenuEventBus from './menu-event-bus.js'
import item from './item'
import separator from './separator'
import nextKey from './id-gen'

export default {
  name: 'windowmenu',
  data: function () {
    return {
      itemKey: null,
      itemName: 'menuRoot',
      menuLevel: -1,
      menuComponent: "menu",
      itemHotKeys: [],
/* hotKeyObject structure:
      {
        Ctrl: false,
        Shft: false,
        Alt: false,
        keyCode: null,
        item: null
      }
*/
      localeDict: {
        'ru': {
          '_locale_' : 'ru',
          'File': 'Файл',
          'New': 'Новый',
          'Document': 'Документ',
          'Project': 'Проект',
          'Open': 'Открыть',
          'Save': 'Сохранить',
          'Save_as': 'Сохранить как',
          'Save as': 'Сохранить как',
          'Edit': 'Правка',
          'Undo': 'Отменить',
          'Redo': 'Повторить',
          'Cut': 'Вырезать',
          'Copy': 'Копировать',
          'Paste': 'Вставить',
          'Tools': 'Инструменты',
          'Macroses': 'Макросы',
          'Options': 'Опции',
          'Preferences': 'Настройки',
          'Help': 'Помощь',
          'About': 'О программе',
        },
        'en': {
          '_locale_' : 'en',
          'File': 'File',
          'New': 'New',
          'Document': 'Document',
          'Project': 'Project',
          'Open': 'Open',
          'Save': 'Save',
          'Save_as': 'Save as',
          'Edit': 'Edit',
          'Undo': 'Undo',
          'Redo': 'Redo',
          'Cut': 'Cut',
          'Copy': 'Copy',
          'Paste': 'Paste',
          'Tools': 'Tools',
          'Macroses': 'Macroses',
          'Options': 'Options',
          'Preferences': 'Preferences',
          'Help': 'Help',
          'About': 'About',
        }
      },
      hotKeyCodeDict: {
        '1': 'Digit1',
        '2': 'Digit2',
        '3': 'Digit3',
        '4': 'Digit4',
        '5': 'Digit5',
        '6': 'Digit6',
        '7': 'Digit7',
        '8': 'Digit8',
        '9': 'Digit9',
        '0': 'Digit0',
        '-': 'Minus',
        '=': 'Equal',
        'Q': 'KeyQ',
        'W': 'KeyW',
        'E': 'KeyE',
        'R': 'KeyR',
        'T': 'KeyT',
        'Y': 'KeyY',
        'U': 'KeyU',
        'I': 'KeyI',
        'O': 'KeyO',
        'P': 'KeyP',
        '[': 'BracketLeft',
        ']': 'BracketRight',
        '╲': 'Backslash',
        'A': 'KeyA',
        'S': 'KeyS',
        'D': 'KeyD',
        'F': 'KeyF',
        'G': 'KeyG',
        'H': 'KeyH',
        'J': 'KeyJ',
        'K': 'KeyK',
        'L': 'KeyL',
        ';': 'Semicolon',
        'ʼ': 'Quote',
        'Z': 'KeyZ',
        'X': 'KeyX',
        'C': 'KeyC',
        'V': 'KeyV',
        'B': 'KeyB',
        'N': 'KeyN',
        'M': 'KeyM',
        ',': 'Comma',
        '.': 'Period',
        '╱': 'Slash',
        '⬅': 'ArrowLeft',
        '⬆': 'ArrowUp',
        '⬇': 'ArrowDown',
        '➡': 'ArrowRight',
        'F1': 'F1',
        'F2': 'F2',
        'F3': 'F3',
        'F4': 'F4',
        'F5': 'F5',
        'F6': 'F6',
        'F7': 'F7',
        'F8': 'F8',
        'F9': 'F9',
        'F10': 'F10',
        'F11': 'F11',
        'F12': 'F12'
      }
    }
  },
  components: {
    'item': item,
    'separator': separator
  },
  props: {
    locale: {
      type: String,
      default: 'en'
    },
  },
  methods: {
    keydownListner (event) {
      event.preventDefault()
      if (this.itemHotKeys.length === 0) return
      let keyDowned = {
        Ctrl: event.ctrlKey,
        Alt: event.altKey,
        Shft: event.shiftKey,
        code: event.code,
      }

      let targetItem = null

      for (let itemHotKey of this.itemHotKeys) {
        if(keyDowned.code !== itemHotKey.code) continue
        if(keyDowned.Ctrl !== itemHotKey.Ctrl) continue
        if(keyDowned.Alt !== itemHotKey.Alt) continue
        if(keyDowned.Shft !== itemHotKey.Shft) continue
        targetItem = itemHotKey.item
        break
      }

      if(!targetItem) return

      event.preventDefault()
      this.$emit('menuItemActivate',targetItem)
    }
  },
  created () {
    this.itemKey = nextKey()
    MenuEventBus.$on(
      'hotKeyRegistration',
      (itemHotKeyWithName) => {
        let itemHotKeyWithCode = {
          Ctrl: itemHotKeyWithName.Ctrl,
          Alt: itemHotKeyWithName.Alt,
          Shft: itemHotKeyWithName.Shft,
          code: this.hotKeyCodeDict[itemHotKeyWithName.keyName],
          item: itemHotKeyWithName.item
        }
        this.itemHotKeys.push(itemHotKeyWithCode)
      }
    )
    MenuEventBus.$on(
      'menuItemActivate',
      (item) => {
        this.$emit('menuItemActivate',item)
      }
    )
  },
  mounted () {
    if(this.localeDict[this.locale]) {
      MenuEventBus.$emit('setLocaleDict',this.localeDict[this.locale])
    } else {
      if(this.locale === 'en') return
      console.log('Warning: The requested locale is missing in the dictionary!') //
    }

    window.addEventListener('keyup', this.keydownListner.bind(this))

    this.$nextTick(
      function () {
        MenuEventBus.$emit(
          this.itemKey + '_menuLevel',
          this.menuLevel
        )
      }
    )
  },
  beforDestroy () {
    window.removeEventListener('keyup', this.keydownListner.bind(this))
  }
}
</script>

<style lang="scss" scoped>
@import "_theme";
$menuHeight: $menuFontSize * 2;

* {
    margin: 0;
    padding: 0;
    font: $menuFontSize 'Ubuntu';
    cursor: default;
}
.menu0BackgroundBox {
    margin: 0;
    padding: 0;
    width: 100%;
    height: $menuHeight;
    border: none;
    background-color: $l0BackgroundColor;
    z-index: 10;
}
ul {
    display: block;
    margin: 0;
    padding: 0;
    list-style: none;
}
</style>
