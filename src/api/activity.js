
import axios from 'axios'

/**
 * 添加页面配置
 * 此处的config是已经序列化好的当前编辑器的json数据
 * @param {Object} config
 */
export function addActivityPageConfig(config) {
    console.log('页面配置已上传---本地测试用', config)
    return Promise.resolve()
}

/**
 * 上传图片
 * 选择图片后应先上传到服务器获取图片url后再在编辑器中使用
 * 由于该项目只有前端
 * 所以直接返回图片的src
 * @param {File} imgFile
 */
export function uploadActivityImgAssets(imgFile) {
    console.log('图片已上传---本地测试用')
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const img = new Image()
            img.onload = () => {
                resolve({ src: reader.result, width: img.width, height: img.height })
            }
            img.src = reader.result
        }
        reader.onerror = reject
        reader.readAsDataURL(imgFile)
    })
}

export function getSelectList() {
    return new Promise((resolve) => {
        axios({
            method: 'get',
            url: '/zdn/selectList'
        }).then((response) => {
            if (response.data.code === 200) {
                resolve(response.data.data.list)
            }
        }).catch((error) => {
            console.log(error)
        })
    })
}
