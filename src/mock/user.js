import Mock from 'mockjs'

const code = 200
export let getUserList = () => {
    return {
        data: Mock.mock({
            'page': {
                background: {
                  id: '背景-3',
                  type: 'background',
                  typeLabel: '背景',
                  componentName: 'background-widget',
                  icon: 'icon-background',
                  wState: {
                    isSolid: true,
                    src: '',
                    style: { backgroundColor: 'rgb(249,204,173)' },
                  },
                  dragInfo: { w: 338, h: 600, x: 0, y: 0, rotateZ: 0 },
                  rename: '',
                  lock: true,
                  visible: true,
                  initHook: null,
                  layerPanelVisible: true,
                  replicable: false,
                  isCopied: false,
                  removable: true,
                  couldAddToActive: false,
                  componentState: null,
                },
                posterItems: [
                  {
                    id: '文本-4',
                    type: 'text',
                    typeLabel: '文本',
                    componentName: 'text-widget',
                    icon: 'icon-text',
                    wState: {
                      text:
                        '<p>标题pong</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>\n\n<p>pong</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>\n\n<p>赶脚这个才是文字</p>\n',
                      style: {
                        margin: '10px',
                        wordBreak: 'break-all',
                        color: '#000',
                        textAlign: 'center',
                        fontSize: '24px',
                        padding: 0,
                        borderColor: '#000',
                        borderWidth: 0,
                        borderStyle: 'solid',
                        lineHeight: '100%',
                        letterSpacing: 0,
                        backgroundColor: '',
                        fontWeight: '',
                        fontStyle: '',
                        textDecoration: '',
                      },
                    },
                    dragInfo: { x: 35, y: 83, w: 280, h: 320, rotateZ: 0 },
                    rename: '',
                    lock: false,
                    visible: true,
                    initHook: null,
                    layerPanelVisible: true,
                    replicable: true,
                    isCopied: false,
                    removable: true,
                    couldAddToActive: true,
                    componentState: null,
                  },
                ],
                referenceLine: { row: [], col: [] },
                canvasSize: { width: 338, height: 600 },
              }
        }),
        code: code
    }
} 