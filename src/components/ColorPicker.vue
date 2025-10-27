<template>
    <el-popover
        placement="bottom"
        width="338"
        trigger="click"
        :disabled="disabled"
        style="
            padding: 0;
            height: 368px;
            background: #ffffff;
            border-radius: 2px;
        "
        v-model="colorPickerVisible"
    >
        <div class="color-picker">
            <el-tabs
                v-model="currentTag"
                type="card"
                class="color-picker-header"
            >
                <el-tab-pane
                    :label="item.label"
                    :name="item.id"
                    v-for="item in colorPickerTags"
                    :key="item.id"
                    class="tab-pane-item"
                ></el-tab-pane>
            </el-tabs>
            <div class="color-picker-container">
                <el-select
                    v-model="value"
                    placeholder="请选择配色方案"
                    v-show="currentTag == 'default'"
                    style="margin-bottom: 6px"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
                <swatches-picker
                    v-model="color"
                    :palette="predefine"
                    style="width: 100%; height: calc(100% - 30px)"
                    v-show="currentTag == 'default'"
                >
                </swatches-picker>
                <chrome-picker
                    v-model="color"
                    :disableFields="true"
                    style="width: 100%"
                    v-show="currentTag == 'palette'"
                ></chrome-picker>
                <RGBSliders
                    v-model="color"
                    style="
                        width: 100%;
                        background-color: #cec0c0;
                        padding: 5px;
                        box-sizing: border-box;
                    "
                    v-show="currentTag == 'RGB'"
                >
                </RGBSliders>
                <HSVSliders
                    v-model="color"
                    style="
                        width: 100%;
                        background-color: #cec0c0;
                        padding: 5px;
                        box-sizing: border-box;
                    "
                    v-show="currentTag == 'HSV'"
                >
                </HSVSliders>
                <HSLSliders
                    v-model="color"
                    style="
                        width: 100%;
                        background-color: #cec0c0;
                        padding: 5px;
                        box-sizing: border-box;
                    "
                    v-show="currentTag == 'HSL'"
                >
                </HSLSliders>
            </div>
            <div class="color-picker-footer">
                <div class="color-wrap1">
                    <div
                        class="active-color"
                        :style="{ 'background-color': color }"
                    ></div>
                    <div
                        class="vc-checkerboard"
                        :style="{
                            'background-image': backgroundImage,
                        }"
                    ></div>
                </div>
                <el-input
                    v-model="rgbaColor"
                    style="width: 160px; margin-right: 56px; line-height: 1"
                    @change="checkColor"
                ></el-input>
                <el-button type="text" size="small" @click="clear"
                    >清空</el-button
                >
                <el-button
                    type="primary"
                    size="mini"
                    style="padding: 6px 10px"
                    @click="colorChange(color)"
                    >确定</el-button
                >
            </div>
        </div>
        <div
            class="picker-box"
            slot="reference"
            :class="{
                'picker-box-medium': size == 'medium' ? true : false,
                'picker-box-small': size == 'small' ? true : false,
                'picker-box-mini': size == 'mini' ? true : false,
                'is-disabled': disabled,
            }"
        >
            <div class="color-picker__mask" v-if="disabled"></div>
            <div class="color-picker__trigger">
                <div class="color" :style="{ background: color }"></div>
                <div class="el-icon-arrow-down color-picker-icon"></div>
            </div>
        </div>
    </el-popover>
</template>
<script>
import { disable } from "ol/rotationconstraint";
import {
    CompactPicker,
    SwatchesPicker,
    ChromePicker,
    RGBSliders,
    HSVSliders,
    HSLSliders,
    TwitterPicker,
} from "vue-color/vue2";
export default {
    model: {
        prop: "myColor",
        event: "change",
    },
    props: {
        myColor: [String, Number],
        predefine: Array,
        size: {
            type: String,
        },
        disabled: { type: Boolean, default: false },
        ColorFormat: String,
    },
    computed: {
        backgroundImage() {
            const url = this.generateCheckerboard("#ffffff", "#e6e6e6", 8);
            return `url(${url})`;
        },
    },
    watch: {
        myColor: {
            handler(newVal, oldVal) {
                this.color = newVal || "#000000";
            },
        },
        color: {
            handler(newVal, oldVal) {
                this.rgbaColor = this.hexToRgba(newVal);
            },
            immediate: true,
        },
    },
    mounted() {
        this.color = this.myColor || "#000000";
    },
    components: {
        CompactPicker,
        SwatchesPicker,
        ChromePicker,
        RGBSliders,
        HSVSliders,
        HSLSliders,
        TwitterPicker,
    },
    data() {
        return {
            colorPickerVisible: false,
            color: "#000000",
            rgbaColor: "",
            currentTag: "default",
            value: "01",
            options: [
                {
                    label: "世界地图配色",
                    value: "01",
                },
            ],
            colorPickerTags: [
                {
                    label: "推荐",
                    id: "default",
                },
                {
                    label: "调色板",
                    id: "palette",
                },
                {
                    label: "RGB",
                    id: "RGB",
                },
                {
                    label: "HSV",
                    id: "HSV",
                },
                {
                    label: "HSL",
                    id: "HSL",
                },
            ],
        };
    },
    methods: {
        generateCheckerboard(color1, color2, size) {
            // 避免在非浏览器环境执行
            if (typeof document === "undefined") return "";

            // 创建Canvas：尺寸为 2*size（2x2的棋盘格单元）
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = size * 2;
            const ctx = canvas.getContext("2d");
            if (!ctx) return "";

            // 绘制背景（第一种颜色）
            ctx.fillStyle = color1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 绘制左上角方块（第二种颜色）
            ctx.fillStyle = color2;
            ctx.fillRect(0, 0, size, size);

            // 平移坐标后绘制右下角方块（第二种颜色）
            ctx.translate(size, size);
            ctx.fillRect(0, 0, size, size);

            // 转换为图片URL
            return canvas.toDataURL();
        },
        /**
         * @description: 十六进制转RGBA
         * @param {*} hex
         * @param {*} alpha
         * @return {*}
         */
        hexToRgba(hex, alpha = 1) {
            // 移除#号
            hex = hex.replace("#", "");

            // 处理3位十六进制
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }

            // 处理8位十六进制（带透明度）
            if (hex.length === 8) {
                const alphaHex = hex.substring(6, 8);
                alpha = parseInt(alphaHex, 16) / 255;
                hex = hex.substring(0, 6);
            }

            // 转换为RGB
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            return `rgba(${r},${g},${b},${
                alpha == 1 ? alpha : alpha.toFixed(2)
            })`;
        },

        /**
         * @description: RGBA转十六进制
         * @param {*} rgbaStr
         * @return {*}
         */
        rgbToHex(r, g, b, a = 1) {
            const toHex = (n) => {
                const hex = n.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            };

            // 如果有透明度且小于1，则使用8位十六进制
            if (a < 1) {
                const alpha = Math.round(a * 255);
                return "#" + toHex(r) + toHex(g) + toHex(b) + toHex(alpha);
            } else {
                return "#" + toHex(r) + toHex(g) + toHex(b);
            }
        },

        /**
         * @description: hsl转hex
         * @param {*} h
         * @param {*} s
         * @param {*} l
         * @param {*} a
         * @return {*}
         */
        hslToHex(h, s, l, a = 1) {
            // 将 HSL 转换为 RGB
            s /= 100;
            l /= 100;

            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = l - c / 2;

            let r, g, b;

            if (h >= 0 && h < 60) {
                [r, g, b] = [c, x, 0];
            } else if (h >= 60 && h < 120) {
                [r, g, b] = [x, c, 0];
            } else if (h >= 120 && h < 180) {
                [r, g, b] = [0, c, x];
            } else if (h >= 180 && h < 240) {
                [r, g, b] = [0, x, c];
            } else if (h >= 240 && h < 300) {
                [r, g, b] = [x, 0, c];
            } else {
                [r, g, b] = [c, 0, x];
            }

            // 转换为 0-255 范围
            r = Math.round((r + m) * 255);
            g = Math.round((g + m) * 255);
            b = Math.round((b + m) * 255);

            return this.rgbToHex(r, g, b, a);
        },

        /**
         * @description: HSV 转十六进制
         * @param {*} h
         * @param {*} s
         * @param {*} v
         * @param {*} a
         * @return {*}
         */
        hsvToHex(h, s, v, a = 1) {
            // 将 HSV 转换为 RGB
            s /= 100;
            v /= 100;

            const c = v * s;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = v - c;

            let r, g, b;

            if (h >= 0 && h < 60) {
                [r, g, b] = [c, x, 0];
            } else if (h >= 60 && h < 120) {
                [r, g, b] = [x, c, 0];
            } else if (h >= 120 && h < 180) {
                [r, g, b] = [0, c, x];
            } else if (h >= 180 && h < 240) {
                [r, g, b] = [0, x, c];
            } else if (h >= 240 && h < 300) {
                [r, g, b] = [x, 0, c];
            } else {
                [r, g, b] = [c, 0, x];
            }

            // 转换为 0-255 范围
            r = Math.round((r + m) * 255);
            g = Math.round((g + m) * 255);
            b = Math.round((b + m) * 255);
            return this.rgbToHex(r, g, b, a);
        },

        /**
         * @description: 校验颜色输入合不合法
         * @return {*}
         */
        checkColor(value) {
            let str = value;
            // 正则表达式匹配十六进制格式
            const hexRegex =
                /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

            // 检查基本格式
            if (hexRegex.test(str)) {
                this.color = str;
                return;
            }

            // 正则表达式匹配RGB格式
            const rgbRegex =
                /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;

            if (rgbRegex.test(str)) {
                const matches = str.match(rgbRegex);
                const r = parseInt(matches[1]);
                const g = parseInt(matches[2]);
                const b = parseInt(matches[3]);

                // 检查RGB值是否在0-255范围内
                if (
                    r >= 0 &&
                    r <= 255 &&
                    g >= 0 &&
                    g <= 255 &&
                    b >= 0 &&
                    b <= 255
                ) {
                    this.color = this.rgbToHex(r, g, b);
                    return;
                }
            }

            // 正则表达式匹配RGBA格式
            const rgbaRegex =
                /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+|1\.\d+)\s*\)$/;

            // 检查基本格式
            if (rgbaRegex.test(str)) {
                // 提取各组成部分
                const matches = str.match(rgbaRegex);
                const r = parseInt(matches[1]);
                const g = parseInt(matches[2]);
                const b = parseInt(matches[3]);
                const a = parseFloat(matches[4]);

                // 检查RGB值是否在0-255范围内
                if (
                    r >= 0 &&
                    r <= 255 &&
                    g >= 0 &&
                    g <= 255 &&
                    b >= 0 &&
                    b <= 255 &&
                    a >= 0 &&
                    a <= 1
                ) {
                    this.color = this.rgbToHex(r, g, b, a);
                    return;
                }
            }

            // 正则表达式匹配HSL格式
            const hslRegex =
                /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i;
            const hslaRegex =
                /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(0|1|0?\.\d+|1\.\d*)\s*\)$/i;

            if (hslRegex.test(str) || hslaRegex.test(str)) {
                const matches = str.match(/(\d+(?:\.\d+)?)/g);
                const h = parseInt(matches[0]);
                const s = parseInt(matches[1]);
                const l = parseInt(matches[2]);
                const a = matches[3] ? parseFloat(matches[3]) : 1;

                // 检查HSL值范围
                if (
                    h >= 0 &&
                    h <= 360 &&
                    s >= 0 &&
                    s <= 100 &&
                    l >= 0 &&
                    l <= 100 &&
                    a >= 0 &&
                    a <= 1
                ) {
                    this.color = this.hslToHex(h, s, l, a);
                    return;
                }
            }

            // 正则表达式匹配HSV/HSB格式
            const hsvRegex =
                /^hsv\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i;
            const hsvaRegex =
                /^hsva\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(0|1|0?\.\d+|1\.\d*)\s*\)$/i;

            if (hsvRegex.test(str) || hsvaRegex.test(str)) {
                const matches = str.match(/(\d+(?:\.\d+)?)/g);
                const h = parseInt(matches[0]);
                const s = parseInt(matches[1]);
                const v = parseInt(matches[2]);
                const a = matches[3] ? parseFloat(matches[3]) : 1;

                // 检查HSV值范围
                if (
                    h >= 0 &&
                    h <= 360 &&
                    s >= 0 &&
                    s <= 100 &&
                    v >= 0 &&
                    v <= 100 &&
                    a >= 0 &&
                    a <= 1
                ) {
                    this.color = this.hsvToHex(h, s, v, a);
                    return;
                }
            }

            // 如果都不匹配，使用默认颜色
            this.color = "#000000";
        },

        /**
         * @description: 清空
         * @return {*}
         */
        clear() {
            this.colorChange("#000000");
        },

        /**
         * @description: 颜色改变 hex
         * @param {*} color
         * @return {*}
         */
        colorChange(color) {
            this.color = color;
            let formatColor = "";
            switch (this.ColorFormat) {
                case "hex":
                default:
                    formatColor = color;
                case "rgb":
                    formatColor = this.hexToRgba(color);
            }
            this.$emit("change", formatColor);
            this.colorPickerVisible = false;
        },
    },
};
</script>
<style lang="less" scoped>
:deep(.el-tabs__header) {
    margin: 0;
}
:deep(.el-tabs__item) {
    line-height: 1;
    padding: 3px 10px !important;
    box-sizing: border-box;
    text-align: center;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #333333;
    height: 21px;
    transition: none;
}
:deep(.el-tabs__item.is-active) {
    background: #3370ff;
    border-radius: 2px;
    border: 1px solid #d4d4d4;
    color: #ffffff;
}
.picker-box {
    display: inline-block;
    position: relative;
    line-height: normal;
    width: 18px;
    height: 18px;
    .color-picker__mask {
        width: 26px;
        height: 26px;
        border-radius: 4px;
        position: absolute;
        top: 1px;
        left: 1px;
        z-index: 1;
        cursor: not-allowed;
        background-color: rgba(255, 255, 255, 0.7);
    }
    .color-picker__trigger {
        display: inline-block;
        box-sizing: border-box;
        height: 18px;
        width: 18px;
        padding: 0;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        font-size: 0;
        position: relative;
        cursor: pointer;
    }

    .color {
        position: relative;
        display: block;
        box-sizing: border-box;
        border: 1px solid #999;
        border-radius: 2px;
        width: 100%;
        height: 100%;
        text-align: center;
    }
    .color-picker-icon {
        font-size: 12px;
        display: inline-block;
        width: 100%;
        color: #fff;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
    }
}
.picker-box.is-disabled .color-picker__trigger {
    cursor: not-allowed;
}
// .picker-box-medium {
//     height: 36px;
//     .color-picker__trigger {
//         height: 36px;
//         width: 36px;
//     }
// }
// .picker-box-small {
//     height: 32px;
//     .color-picker__trigger {
//         height: 32px;
//         width: 32px;
//     }
//     .color-picker-icon {
//         transform: translate3d(-50%, -50%, 0) scale(0.8);
//     }
// }
// .picker-box-mini {
//     height: 28px;
//     .color-picker__trigger {
//         height: 28px;
//         width: 28px;
//     }
//     .color-picker-icon {
//         transform: translate3d(-50%, -50%, 0) scale(0.8);
//     }
// }
.color-circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
}
.color-wrap1 {
    position: relative;
    width: 36px;
    margin-right: 5px;
}
.active-color {
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    overflow: hidden;
    z-index: 1;
}
.color-wrap1 .vc-checkerboard {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-size: auto;
}
.vc-checkerboard {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-size: contain;
}
.color-picker {
    width: 100%;
    height: 368px;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .color-picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 37px;
        padding: 8px;
        box-sizing: border-box;
    }
    .color-picker-container {
        width: 100%;
        height: 290px;
        padding: 0 8px 8px;
        box-sizing: border-box;
    }
    .color-picker-footer {
        display: flex;
        align-items: center;
        width: 100%;
        height: 41px;
        padding: 8px;
        border-top: 1px solid #d4d4d4;
        box-sizing: border-box;
    }
}
</style>
