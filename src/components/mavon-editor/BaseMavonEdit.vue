<template>
    <div style="width: 100%; height: 100%">
        <mavon-editor
            ref="md"
            :value="mdData"
            placeholder=" "
            :editable="true"
            :toolbarsFlag="true"
            defaultOpen="preview"
            @change="change"
            @imgDel="imgDel"
            @imgAdd="imgAdd"
            @save="save"
            :toolbars="toolbars"
            :html="true"
            :xssOptions="{
                whiteList: {
                    iframe: ['src', 'height', 'width'],
                    div: ['style', 'height', 'width', 'align'],
                    video: [
                        'controls',
                        'width',
                        'height',
                        'style',
                        'muted',
                        'autoplay',
                        'loop',
                        'poster',
                        'src',
                    ],
                    source: ['src', 'type'],
                },
            }"
            v-if="mavonShow"
        >
            <!-- 左工具栏后加入自定义按钮  -->
            <!-- <template slot="left-toolbar-after">
                <button
                    type="button"
                    @click="uploadLocalImage"
                    class="op-icon fa fa-mavon-picture-o"
                    aria-hidden="true"
                    title="上传本地图片"
                ></button>
                <button
                    type="button"
                    @click="uploadInternetImage"
                    class="op-icon fa fa-mavon-picture-o"
                    aria-hidden="true"
                    title="上传网络图片"
                ></button>
            </template> -->
        </mavon-editor>
    </div>
</template>
<script>
export default {
    data() {
        return {
            mavonShow: false,
            lastMdData: "",
            mdData: "",
            toolbars: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: true, // 标记
                superscript: true, // 上角标
                subscript: true, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                help: false, // 帮助
                /* 1.3.5 */
                undo: true, // 上一步
                redo: true, // 下一步
                trash: true, // 清空
                save: false, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: true, // 导航目录
                /* 2.1.8 */
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                /* 2.2.1 */
                subfield: true, // 单双栏模式
                preview: true, // 预览
                shortCut: false,
            },
            // 未删除的文件对应关系
            img_file: [],
            // 已经删除的文件对应关系
            deletedImgFileList: [],
        };
    },
    methods: {
        /**
         * @description: 重置
         * @return {*}
         */
        resetData() {
            this.mdData = "";
            this.mavonShow = false;
        },

        /**
         * @description: 初始化值
         * @param {*} data
         * @return {*}
         */
        initMdData(data) {
            this.mavonShow = true;
            this.$nextTick(() => {
                this.lastMdData = data;
                this.mdData = data;
                this.clearFileList();
            });
        },

        /**
         * @description: 向外传递改变后的数据
         * @param {*} args
         * @return {*}
         */
        change(args) {
            this.mdData = args;
            let x = this.replaceUrlsWithBase64(args, this.img_file);
            this.$emit("change", x);
        },

        /**
         * @description: 根据内过滤出其中的图片Id
         * @return {*}
         */
        filterImgId(str) {
            // 匹配 Markdown 图片语法中的 URL/ID
            const regex = /!\[.*?\]\((.*?)\)/g;
            const matches = [];
            let match;

            while ((match = regex.exec(str)) !== null) {
                // 排除空内容（如 `![]()`）
                if (match[1].trim()) {
                    matches.push(match[1]);
                }
            }
            return matches;
        },

        /**
         * @description: 对比新旧数组的差异，直接返回 新增项 和 删除项 废弃
         * @param {*} oldArr
         * @param {*} newArr
         * @return {*}
         */
        compareArrays(oldArr, newArr) {
            // 将旧数组转为 Set 提高查找效率
            const oldSet = new Set(oldArr);
            const newSet = new Set(newArr);

            // 找出新增项（在新数组但不在旧数组）
            const added = newArr.filter((id) => !oldSet.has(id));

            // 找出删除项（在旧数组但不在新数组）
            const removed = oldArr.filter((id) => !newSet.has(id));

            return { added, removed };
        },

        /**
         * @description: 保存时 注意和上次内容比对 筛选出减少的图片 废弃
         * @param {*} a
         * @return {*}
         */
        save(a) {
            /*console.log(a, this.mdData, this.img_file, "result");
            // 过滤出图片Id
            let ImgIds = this.filterImgId(this.mdData);
            let lastImgIds = this.filterImgId(this.lastMdData);
            // 根据Id的变化 发给后端 添加或者删除 图片
            const { added, removed } = this.compareArrays(lastImgIds, ImgIds);*/
            console.log(a, this.img_file);
            let x = this.replaceUrlsWithBase64(a, this.img_file);
            console.log(x);
            this.$emit("save", a);
            this.mdData = "";
        },

        /**
         * @description: 将字符串中的blob字符串替换base64
         * @param {*} originalString
         * @param {*} urlDataArray
         * @return {*}
         */
        replaceUrlsWithBase64(originalString, urlDataArray) {
            // 步骤1：去重 - 保留最后一个出现的URL定义（防止重复替换）
            const urlMap = new Map();
            urlDataArray.forEach((item) => {
                urlMap.set(item.url, item.base64String);
            });

            // 步骤2：创建去重后的数组并按URL长度降序排序
            const uniqueData = Array.from(urlMap, ([url, base64String]) => ({
                url,
                base64String,
            }));
            // uniqueData.sort((a, b) => b.url.length - a.url.length);

            // 步骤3：逐个替换（长URL优先）
            let result = originalString;
            uniqueData.forEach(({ url, base64String }) => {
                // 跳过空URL防止无限匹配
                if (!url) return;

                // 创建全局替换正则（转义特殊字符）
                const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const regex = new RegExp(escapedUrl, "g");

                // 执行替换
                result = result.replace(regex, base64String);
            });

            return result;
        },

        /**
         * @description: 自定义上传本地图片 废弃
         * @return {*}
         */
        uploadLocalImage() {
            const file = document.createElement("input");
            file.type = "file";
            file.click();
            file.onchange = () => {
                // 上传文件至后端 后端返回id
                // 建立映射关系 绑定别名和文件
                let id = Date.now();
                this.$refs.md.$refs.toolbar_left.$imgAddByFilename(
                    `img_${id}`,
                    file.files[0]
                );
                // 将图片md添加到编辑栏中
                this.$refs.md.$imgAdd(`img_${id}`, file.files[0]);
            };
        },

        /**
         * @description: 开启上传网络图片 废弃
         * @return {*}
         */
        uploadInternetImage() {
            this.$refs.md.$refs.toolbar_left.$toggle_imgLinkAdd("imagelink");
        },

        /**
         * @description:上传文件之后回调函数 可能不需要
         * @param {*} id
         * @param {*} file
         * @return {*}
         */
        imgAdd(id, imgFile) {
            let reader = new FileReader();
            reader.readAsDataURL(imgFile);
            reader.onload = () => {
                let base64String =
                    "data:image/jpeg;base64," + reader.result.split(",")[1];
                let blob = this.dataURLtoBlob(base64String);
                let url = URL.createObjectURL(blob);
                // 自己生成Id 和 其对应关系 将id 转成 图片的blob
                this.$refs.md.$img2Url(id, url);
                let obj = {
                    url,
                    base64String,
                };
                this.img_file.push(obj);
            };
        },

        /**
         * @description: base64转blob
         * @param {*} dataurl
         * @return {*}
         */
        dataURLtoBlob(dataurl) {
            var arr = dataurl.split(",");
            var mime = arr[0].match(/:(.*?);/)[1];
            var bstr = atob(arr[1]);
            var n = bstr.length;
            var u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        },

        /**
         * @description: 清空显示列表
         * @return {*}
         */
        clearFileList() {
            this.img_file.forEach((obj) => {
                // 释放映射关系
                URL.revokeObjectURL(obj.url);
            });
            this.deletedImgFileList.forEach((url) => {
                // 释放映射关系
                URL.revokeObjectURL(url);
            });
            this.img_file = [];
            this.deletedImgFileList = [];
            // console.log(this.$refs.md, this.$refs.md.$refs.toolbar_left);
        },

        /**
         * @description: 删除图片 可能不需要
         * @param {*} id
         * @param {*} imgFile
         * @return {*}
         */
        imgDel([id, imgFile]) {
            this.img_file = this.img_file.filter((img) => {
                return img.url != id;
            });
            // 释放映射关系
            // URL.revokeObjectURL(id);
            this.deletedImgFileList.push(id);
            this.$refs.md.$refs.toolbar_left.$imgDelByFilename(id);
            // let reg = new RegExp(`![${imgFile.name}](${id})`, "g")
            // this.mdData = this.mdData.replace(`![${imgFile.name}](${id})`, '');
            // console.log(this.mdData,'66',`![${imgFile.name}](${id})`)
        },
    },
};
</script>
<style lang="less" scoped>
:deep(.dropdown-images button) {
    top: 0px !important;
}
</style>
