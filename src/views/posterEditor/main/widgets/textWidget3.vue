<template>
  <vue-draggable-resizable
    ref="drag"
    :w="dragInfo.w"
    :h="dragInfo.h"
    :x="dragInfo.x"
    :y="dragInfo.y"
    :r="dragInfo.rotateZ"
    :minw="10"
    :minh="1"
    :resizable="true"
    :lock="item.lock"
    :active.sync="isActive"
    class="drag-item"
    deselect-cancel=".poster-editor_deactivated-ignore"
    :draggable="draggable"
    @activated="activated"
    @deactivated="deactivated"
    @dragging="onDrag"
    @resizing="onResize"
    @rotating="onRotate"
    @dragstop="onDragStop"
    @rotatestop="onRotateStop"
    @resizestop="onResizeStop"
  >
    <ckeditor v-model="newText" type="inline" :config="editorConfig"></ckeditor>
  </vue-draggable-resizable>
</template>

<script>
import vueDraggableResizable from 'poster/components/dragable/components/vue-draggable-resizable'
import { mapActions } from 'poster/poster.vuex'
import { widgetContainerMixin } from 'poster/widgetConstructor/widget'
export default {
  components: { vueDraggableResizable },
  mixins: [widgetContainerMixin()],
  data() {
    return {
      draggable: true,
      newText: '',
      editorConfig: {
        on: {
          pluginsLoaded: (evt) => {
            var editor = evt.editor
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
              onClick: (value) => {
                editor.focus()
                editor.fire('saveSnapshot')
                editor.insertHtml(value)
                editor.fire('saveSnapshot')
                this.newText = editor.getData()
                this.saveText()
              }
            })
          }
        }
        // extraPlugins: 'placeholder'
      }
    }
  },
  computed: {
    text() {
      return this.wState.text
    }
  },
  mounted() {
    this.newText = this.text
  },
  methods: {
    ...mapActions(['updateWidgetState']),
    saveText() {
      console.log('--3--')
      this.updateWidgetState({
        keyPath: 'text',
        value: this.newText,
        widgetId: this.item.id
      })
    }
  }

}
</script>
<style lang="scss" scoped>
</style>
