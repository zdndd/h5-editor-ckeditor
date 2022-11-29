<template>
  <div class="text-widget">
    <div
      v-if="!isEditing"
      key="1"
      class="text-container"
      contenteditable="false"
      :style="textStyle"
      v-html="newText"
    >
      {{ newText }}
    </div>
    <div
      v-else
      key="2"
      ref="textContainer"
      class="text-container editing"
    >
    <ckeditor
      v-model="newText" type="inline" @blur="editorBlur"></ckeditor>
    </div>
  </div>
</template>

<script>
import { TextWidget } from 'poster/widgetConstructor'
import { clickoutside } from 'poster/poster.directives'
import textControl from 'poster/control/widgets/textControl'
import { mapState, mapActions } from 'poster/poster.vuex'

export default {
  components: { textControl },
  directives: { clickoutside },
  mixins: [TextWidget.widgetMixin()],
  data() {
    return {
      isEditing: false,
      newText: ''
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
      this.saveText()
    },
    saveText(text) {
      this.isEditing = false
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
