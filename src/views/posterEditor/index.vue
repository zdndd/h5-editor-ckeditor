<template>
  <el-form ref="form" :model="form" label-width="80px" size="mini">
    <div class="header">
      <el-form-item label="活动名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="共享">
        <el-switch v-model="value1"></el-switch>
      </el-form-item>
      <el-form-item label="停用">
        <el-switch v-model="value2"></el-switch>
      </el-form-item>
    </div>
    <div class="poster-editor" :class="{ 'init-loading': initLoading }">
      <div class="base">
        <!-- 左侧添加组件栏 -->
        <left-side />
        <!-- 主要操作区域 -->
        <main-component ref="main" />
        <!-- 常用功能栏 -->
        <extend-side-bar />
        <!-- 组件编辑区域 -->
        <control-component />
      </div>
      <!-- 图层面板 -->
      <transition name="el-zoom-in-top">
        <layer-panel v-show="layerPanelOpened" />
      </transition>
    </div>
    <div class="footer">
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { mapState, mapGetters, mapActions } from "./poster.vuex";
import controlComponent from "./control/index";
import mainComponent from "./main/index";
import leftSide from "./leftSide/index";
import extendSideBar from "./extendSideBar";
import layerPanel from "./extendSideBar/layerPanel";
import store from "@/store";
import posterModule from "@/store/modules/poster/poster";

const DELETE_KEY = 8; // delete
const COPY_KEY = 67; // c
const PASTE_KEY = 86; // v
const LAYER_PANEL_KEY = 76; // l
const REFERENCE_LINE_KEY = 72; // h
const UNDO_KEY = 90; // z
const BACKUP_KEY = 83; // s
const SELECT_ALL_KEY = 65; // a

export default {
  components: {
    controlComponent,
    mainComponent,
    leftSide,
    extendSideBar,
    layerPanel,
  },
  data() {
    return {
      value1: true,
      value2: true,
      initLoading: false,
      form: {
        name: "",
      },
    };
  },
  computed: {
    ...mapState([
      "posterItems",
      "layerPanelOpened",
      "activeItems",
      "copiedWidgets",
      "referenceLineOpened",
      "isUnsavedState",
    ]),
    ...mapGetters(["activeItemIds"]),
  },
  beforeRouteLeave(to, from, next) {
    if (this.isUnsavedState) {
      const answer = window.confirm(
        "当前页面配置未保存,退出将不会保存,是否继续退出？"
      );
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
  beforeCreate() {
    if (!store.hasModule("poster")) {
      /** 注册poster-vuex模块 */
      store.registerModule("poster", posterModule);
    }
  },
  async created() {
    this.initLoading = true;
    // if (!store.hasModule('poster')) return
    const loading = this.$loading({
      lock: true,
      text: "正在初始化编辑器",
      spinner: "el-icon-loading",
      background: "rgba(255, 255, 255, 0.6)",
    });
    await this.resetState();
    loading.close();
    this.initLoading = false;
    // 编辑状态
    if (this.$route.params.id) {
      this.$axios({
        method: "get",
        url: "/web/user/getUserList",
      })
        .then((response) => {
          if (response.data.code === 200) {
            this.recover(response.data.data.page);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  async mounted() {
    document.addEventListener("keydown", this.keydownHandle);
    this.body = document.body;
    this.mainPanelRef = this.$refs.main.$refs.mainPanel;
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.keydownHandle);
    this.killAutoSaveTask();
  },
  methods: {
    ...mapActions([
      "replacePosterItems",
      "replaceActiveItems",
      "pasteWidget",
      "copyWidget",
      "setLayerPanel",
      "setReferenceLineVisible",
      "resetState",
    ]),
    ...mapActions({
      undo: "history/undo",
      redo: "history/redo",
      backupInit: "backup/init",
      killAutoSaveTask: "backup/killAutoSaveTask",
      backupInvoker: "backup/invoker",
      recover: "backup/recover",
    }),
    keydownHandle(e) {
      if (e.target !== this.body) {
        return;
      }
      const keyCode = e.keyCode;
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      switch (true) {
        case keyCode === DELETE_KEY:
          if (this.activeItemIds.length > 0) {
            this.replacePosterItems(
              this.posterItems.filter(
                (item) => !this.activeItemIds.includes(item.id)
              )
            );
          }
          break;
        case keyCode === PASTE_KEY && ctrl:
          if (this.copiedWidgets) {
            this.pasteWidget();
          }
          break;
        case keyCode === COPY_KEY && ctrl:
          if (this.activeItems.length > 0) {
            // const copiedWidgets = []
            // const widgetRefs = this.mainPanelRef.$refs
            // this.activeItemIds.forEach((itemId) => {
            // const widgetRef = widgetRefs[itemId][0]
            // copiedWidgets.push(getCopyData(widgetRef.item, widgetRef._self))
            // })
            const copiedWidgets = [...this.activeItems].map((item) => {
              item._copyFrom = "command";
              return item;
            });
            this.copyWidget(copiedWidgets);
          }
          break;
        case keyCode === LAYER_PANEL_KEY && ctrl:
          e.preventDefault();
          this.setLayerPanel(!this.layerPanelOpened);
          break;
        case keyCode === REFERENCE_LINE_KEY && ctrl:
          e.preventDefault();
          this.setReferenceLineVisible(!this.referenceLineOpened);
          break;
        case keyCode === UNDO_KEY && ctrl && shift:
          this.redo();
          break;
        case keyCode === UNDO_KEY && ctrl:
          this.undo();
          break;
        case keyCode === BACKUP_KEY && ctrl:
          e.preventDefault();
          this.backupInvoker();
          break;
        case keyCode === SELECT_ALL_KEY:
          e.preventDefault();
          this.replaceActiveItems(this.posterItems);
          break;
        default:
          break;
      }
    },
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>

<style lang="scss" scoped>
.header,
.footer {
  height: 62px;
  display: flex;
  align-items: center;
}
.header {
  justify-content: flex-start;
  border-bottom: 1px solid #dcdfe6;
}
.footer {
  height: 42px;
  width: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  bottom: 0;
  border-top: 1px solid #dcdfe6;
  justify-content: center;
}
.poster-editor {
  width: 100%;
  min-width: 900px;
  height: calc(100% - 84px);
  background-color: #fff;
  position: fixed;

  &.init-loading {
    filter: blur(6px);
  }

  .base {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
  }

  .left-side {
    height: 100%;
  }

  .poster-editor-main {
    flex: 1;
    height: 100%;
    box-sizing: border-box;
  }

  .extend-side-bar {
    width: 50px;
    height: 100%;
    border-left: 1px solid $colorBorder;
  }

  .poster-editor-control {
    width: 200px;
    height: 100%;
    box-sizing: border-box;
    border-left: 1px solid $colorBorder;
  }
}
</style>
