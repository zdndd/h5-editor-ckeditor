<template>
  <ckeditor
    v-model='newText'
    type='inline'
    :config='editorConfig'
    @blur='editorBlur'
    @focus='onEditorFocus'
  ></ckeditor>
  <!-- <div class='text-widget'>
    <div v-if='!isEditing' key='1' class='text-container' contenteditable='false' :style='textStyle' v-html='newText'>
    </div>
    <div v-else key='2' ref='textContainer' class='text-container editing' style='background:pink'>
      <ckeditor v-model='newText' type='inline' @blur='editorBlur'  :config='editorConfig'></ckeditor>
    </div>
  </div> -->
</template>

<script>
import { TextWidget } from 'poster/widgetConstructor'
import { mapState, mapActions } from 'poster/poster.vuex'
import { getSelectList } from '@/api/activity'
export default {
  mixins: [TextWidget.widgetMixin()],
  data() {
    return {
      isEditing: false,
      newText: '',
      selectList: [],
      editorConfig: {
        on: {
          pluginsLoaded: (evt) => {
            var editor = evt.editor
            var list = this.selectList
            editor.ui.addRichCombo('my-combo', {
              label: '插入内容', // 标题可以修改这个
              title: 'My Dropdown Title',
              toolbar: 'basicstyles,0',
              panel: {
                    multiSelect: false,
                    attributes: { 'aria-label': 'My Dropdown Title' }
                },
              init: function() {
                list.forEach(element => {
                  this.add(element.value, element.name)
                })
              },
              onClick: (value) => {
                this.isEditing = true
                editor.focus()
                editor.fire('saveSnapshot')
                editor.insertHtml(value)
                editor.fire('saveSnapshot')
                this.newText = editor.getData()
                // this.saveText()
              }
            })
          }
        }
      }
    }
  },
  computed: {
    ...mapState(['canvasSize']),
    text() {
      return this.wState.text
    }
  },
  watch: {
    isEditing(newVal) {
      this.$emit('draggableChange', !newVal)
    }
  },
  async created() {
    if (!this.item.isCopied) {
      this.updateDragInfo({
        w: 160,
        h: 50,
        x: (this.canvasSize.width - 160) / 2,
        y: 200
      })
    }

    this.selectList = await getSelectList()
  },
  mounted() {
    this.newText = this.text
  },
  methods: {
    ...mapActions(['updateWidgetState', 'getSelectList']),
    editorBlur(eee) {
      this.newText = eee.editor.getData()
      this.saveText()
      console.log('---blur----')
    },
    saveText() {
      this.isEditing = false
      this.updateWidgetState({
        keyPath: 'text',
        value: this.newText,
        widgetId: this.item.id
      })
    },
    onEditorFocus() {
      this.isEditing = true
    }
  }
}
</script>
<style lang='scss' scoped>
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
