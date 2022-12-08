##X47lZ5BMscYn1CC##PAGE
<template>
  <div class="text-widget">
    <div v-if="!isEditing" key="1" class="text-container" contenteditable="false" :style="textStyle" v-html="newText">
      {{ newText }}
    </div>
    <div v-else key="2" ref="textContainer" class="text-container editing" style="background:pink">
      <ckeditor v-model="newText" type="inline" @blur="editorBlur" :config="editorConfig"
        @namespaceloaded="onNamespaceLoaded"></ckeditor>
    </div>
  </div>
</template>

<script>
import { TextWidget } from 'poster/widgetConstructor'
import { clickoutside } from 'poster/poster.directives'
import { mapState, mapActions } from 'poster/poster.vuex'
export default {
  directives: { clickoutside },
  mixins: [TextWidget.widgetMixin()],
  data() {
    return {
      isEditing: false,
      newText: '',
      editorConfig: {
        on: {
          pluginsLoaded: function() {
            var editor = this,
              config = editor.config

            editor.ui.addRichCombo('my-combo', {
              label: '插入内容', // 标题可以修改这个
              title: 'My Dropdown Title',
              toolbar: 'basicstyles,0',
              init: function() {
                this.add('我才是内容', 'Foo!')
                this.add('目前（2022.11）加息还未结束，美元资产价格毫无疑问还会继续跌，所以显然要手握现金，等资产价格跌到位再行动', 'Bar!')
                this.add('所以大家就盯着美国房产，特别是纽约的房产，萧条周期中再跌个15-20%很正常', 'Ping!')
                this.add('我的观点，除了自住的房子，如果不是核心城市的核心地段的次新大户型，优先卖，其次换。', 'Pong!')
              },
              onClick: function(value) {
                console.log('--click value--', value)
                editor.insertHtml(value)
                console.log('onClick中的 newText:', this.newText)
              }
            })
          }
        }
        // extraPlugins: 'placeholder'
      },
      editorUI: {

      }
    }
  },
  computed: {
    ...mapState(['canvasSize']),
    text() {
      return this.wState.text
    },
    textStyle() {
      return this.wState.style
    }
  },
  watch: {
    isEditing(newVal) {
      this.$emit('draggableChange', !newVal)
    }
  },
  created() {
    if (!this.item.isCopied) {
      this.updateDragInfo({
        w: 160,
        h: 50,
        x: (this.canvasSize.width - 160) / 2,
        y: 200
      })
    }
  },
  mounted() {
    this.newText = this.text
    this.$dragRef.$el.addEventListener('dblclick', () => {
      this.openEditing()
    })
  },
  methods: {
    ...mapActions(['setWidgetConfig', 'updateWidgetState']),
    getMenuList() {
      return []
    },
    openEditing() {
      this.isEditing = true
      this.$nextTick(() => {
        const ref = this.$refs.textContainer
        if (!ref) return
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(ref)
        selection.removeAllRanges()
        selection.addRange(range)
      })
    },
    editorBlur(eee) {
      this.newText = eee.editor.getData()
      console.log('blur中的 newText:', this.newText)
      this.saveText()
    },
    saveText(text) {
      this.isEditing = false
      this.updateWidgetState({
        keyPath: 'text',
        value: this.newText,
        widgetId: this.item.id
      })
    },
    onNamespaceLoaded(CKEDITOR) {
      // Add external `placeholder` plugin which will be available for each
      // editor instance on the page.
      CKEDITOR.plugins.addExternal('placeholder', '/Users/apple/Documents/zdndd/vue/h5-editor-ckeditor/src/views/posterEditor/plugins/', 'ckeditor.js')
    }
  }
}
</script>
<style lang="scss" scoped>
.text-widget {
  width: 100%;
  height: 100%;

  .text-container {
    box-sizing: border-box;
    margin: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    white-space: wrap;
    word-break: break-all;

    &.editing {
      position: relative;
    }
  }
}
</style>
