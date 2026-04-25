<template>
    <div style="width: 100%; height: 100%">
        <mavon-editor
            ref="md"
            :value="mdData"
            placeholder=" "
            :subfield="false"
            :editable="false"
            :toolbarsFlag="false"
            defaultOpen="preview"
            :toolbars="{}"
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
import api from "@/request/api";

export default {
    data() {
        return {
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
                imagelink: false, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                help: true, // 帮助
                /* 1.3.5 */
                undo: true, // 上一步
                redo: true, // 下一步
                trash: true, // 清空
                save: true, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: true, // 导航目录
                /* 2.1.8 */
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                /* 2.2.1 */
                subfield: true, // 单双栏模式
                preview: true, // 预览
            },
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.setupImageCaching();
            // this.initLazyLoad();
        });
    },
    methods: {
        /**
         * @description:修改渲染规则 为图片添加懒加载
         * @return {*}
         */
        setupImageCaching() {
            const editor = this.$refs.md;
            if (!editor) return;
            const markdown = editor.markdownIt;

            // 保存默认渲染规则
            const defaultImageRender = markdown.renderer.rules.image;

            // 重写图片渲染
            markdown.renderer.rules.image = (
                tokens,
                idx,
                options,
                env,
                self
            ) => {
                const token = tokens[idx];
                const srcIndex = token.attrIndex("src");

                if (srcIndex >= 0) {
                    // let originalSrc = token.attrs[srcIndex][1];

                    // // 处理目标图片
                    // if (
                    //     originalSrc.includes(
                    //         "xingeo.oss-cn-hangzhou.aliyuncs.com"
                    //     )
                    // ) {
                    //     // 转换为本地代理地址
                    //     const proxyPath = originalSrc.replace(
                    //         "https://xingeo.oss-cn-hangzhou.aliyuncs.com",
                    //         "/image-cache"
                    //     );
                    //     token.attrs[srcIndex][1] = proxyPath;

                    //     console.log(
                    //         "图片代理转换:",
                    //         originalSrc,
                    //         "->",
                    //         proxyPath
                    //     );
                    // }
                    // 添加loading lazy 简单 距离不可控 精细 请选择Intersection Observer方案
                    const lazyIndex = token.attrIndex("loading");
                    if (lazyIndex < 0) {
                        token.attrPush(["loading", "lazy"]);
                    } else {
                        token.attrs[lazyIndex][1] = "lazy";
                    }
                    const decodingIndex = token.attrIndex("decoding");
                    if (decodingIndex < 0) {
                        token.attrPush(["decoding", "async"]);
                    } else {
                        token.attrs[decodingIndex][1] = "async";
                    }
                    // // 添加懒加载标识属性
                    // const lazyIndex = token.attrIndex("data-lazy");
                    // if (lazyIndex < 0) {
                    //     token.attrPush(["data-lazy", "true"]);
                    // } else {
                    //     token.attrs[lazyIndex][1] = "true";
                    // }

                    // // 确保有 crossOrigin 属性用于跨域
                    // const crossOriginIndex = token.attrIndex("crossorigin");
                    // if (crossOriginIndex < 0) {
                    //     token.attrPush(["crossorigin", "anonymous"]);
                    // } else {
                    //     token.attrs[crossOriginIndex][1] = "anonymous";
                    // }

                    // // 保存原始URL到data-src
                    // const dataSrcIndex = token.attrIndex("data-src");
                    // if (dataSrcIndex < 0) {
                    //     token.attrPush(["data-src", originalSrc]);
                    // } else {
                    //     token.attrs[dataSrcIndex][1] = originalSrc;
                    // }

                    // // 初始使用占位图或空src
                    // token.attrs[srcIndex][1] =
                    //     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABaCAYAAABzAJLvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4JpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MzBmNzdhNzctZmVlYi0zYTQ4LTg0YjItOWUzNjc0NjEwYzZmIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlFNjNCNjFFQkE1NDExRUU5QzUzQUJCMTZENDMyMzY3IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlFNjNCNjFEQkE1NDExRUU5QzUzQUJCMTZENDMyMzY3IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMy4wIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmNjM2Y4OGYyLWM2YmItN2E0Mi04MGJmLTk1ZjI3NTk5ODFlMiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjhmNmQ3NWNlLTA4NjctNjg0Yy1hYTMyLTg4OTBiNzYwNjkzYiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjkqLPAAAAN1SURBVHja7Jy/S1tRFIBPNERBo2CUqotGNCAiVkSok5N1qS0Uxy79D1zaLu3SqY7dSueOoR0cHcTJFLFCxQpVUBcVqqFplJpIsPdcfCG8pk2i0Sav3wdHr9f7nuF+99wfyHu+kZlzuWDExAMTtwSqmZ8mPpqImjjzX1S+NPHchI/+8QxPTdxVwfdMvKA/PMdtE29rzJfH9IVnua+Cw/SDZ6nRKdqfW3MnkpFnD9O2PPs+ILGvtUXXQQUadleotFDw3IYjsNg6qALBufiuUAcVKnj2Q0DiSZ98++GTV6ZcSh1UHr6RmfPP5vsgXfEfTtGAYEAwIBiub5OVSCTYZJHBgGBAMCAYEAwIhiz+UhrX19fTYxXA6enp9QiureWf+kzRgGBAMCAYEAwIRjAgGBAMCAYEA4IBwQgGBAOCAcGAYEAwIBjBgGBAMCAYEPxXjo+Pi2p3cHAg6TQvaPNX2wdeWFiQyclJCQT+/G4uFbu8vCxTU1MFB8vu7q4tHx4eSmtrqy13dXVJY2OjrK6u5v072nZ8fBzB5WB9fV2SyaQEg0H7c09Pj2xubmZ/v7GxIdPT07bsCFHBbW1t9lpFr49EItLS0iJbW1uyvb1t79fd3S0DAwMSj8ftNVp2i5yYmPjtM83Pz5PB5URFaEap2OHh4aw4FbK3t1dQiLZ3puve3l5JpVISCoWkvb1dotGo9Pf324Gh7fR+uffQqd5NKQ9/sQYXoKOjQ/b392VpaUn6+vqyYuvq6mRubk4GB6/2/pjm5ubsQHFnMGvwDaIidc10Nlma0UNDQ3J0dGQzMTdb3ag8zdjLkHtvh2p6jLbiBeu6qdOnI1Y3T6Ojo7as9e6sKyYLdbre2dmxg6OYPYCbRCKB4HKi2arhZE++rCqWxcVFaWpqym66dKrXdbazs9MOonA4XHDA5K77CC7DuTf37KsbHPfGp5QpOt/xZm1tTcbGxmRlZSV7VPLKJqvqzsHO9JwPlZMv4zRL851nY7GYvcbZNat8PUbpsUmz2wuU9CrDhoYGgX/PycmJd45J4PFzMCAYEIxgQDAgGBAMCAYEA4IBwQgGBAOCAcGAYEAwIBjBgGBAMCAYEAwIhgKU9OhKNT2TA5cQnMlk6DGmaKg0wSm6wduCv9ANniWtgl+bOKMvPMkbFfzJxCMT3+kPT/HOxJNfAgwAMfQ1O62JqeAAAAAASUVORK5CYII="; // 透明占位图
                }

                return defaultImageRender(tokens, idx, options, env, self);
            };
        },

        /**
         * @description: Intersection Observer 实现懒加载 服务端需要放开跨域
         * @return {*}
         */        
        initLazyLoad() {
            // 使用 Intersection Observer 实现懒加载
            if (!this.lazyLoadObserver) {
                this.lazyLoadObserver = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                const src = img.getAttribute("data-src");
                                if (src) {
                                    img.src = src;
                                    img.classList.remove("lazy-image");
                                    this.lazyLoadObserver.unobserve(img);
                                }
                            }
                        });
                    },
                    {
                        rootMargin: "50px 0px", // 提前50px加载
                        threshold: 0.1,
                    }
                );
            }

            // 观察所有懒加载图片
            const lazyImages = this.$el.querySelectorAll("img[data-lazy]");
            lazyImages.forEach((img) => {
                img.classList.add("lazy-image");
                this.lazyLoadObserver.observe(img);
            });
        },

        /**
         * @description: 获取md数据
         * @return {*}
         */
        getMdData(templateId) {
            api.project.getDescriptionByTempalteId(templateId).then((res) => {
                this.mdData = res.data.result ? res.data.result : "";
                // this.$nextTick(() => {
                //     this.initLazyLoad();
                // });
            });
            // this.mdData =''
            // return
            // let reader = new FileReader();
            // this.mdData = text;
            // 根据内容过滤出图片Id
            // imgIdArr = this.filterImgId(text);
            // imgIdArr.forEach((imgId) => {
            //     // imgId向后端请求 得到base64
            //     reader.readAsDataURL(imgFile);
            //     reader.onload = () => {
            //         let base64String =
            //             "data:image/jpeg;base64," + reader.result.split(",")[1];
            //         // 建立映射关系
            //         this.$refs.md.$refs.toolbar_left.$imgAddByFilename(
            //             imgId,
            //             imgFile
            //         );
            //         // 更新html对应的地址
            //         this.$refs.md.$imgUpdateByUrl(imgId,base64String)
            //     };
            // });
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
    },
};
</script>
