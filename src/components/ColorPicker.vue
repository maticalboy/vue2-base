<template>
    <el-popover
        placement="bottom"
        width="315"
        trigger="click"
        style="padding: 0"
        v-model="colorPickerVisible"
    >
        <div class="box">
            <div class="color-picker">
                <ul class="color-picker-header">
                    <li
                        v-for="item in colorPickerTags"
                        :key="item.id"
                        :class="{
                            'header-tag': true,
                            'header-tag-active':
                                currentTag == item.id ? true : false,
                        }"
                        @click="currentTag = item.id"
                    >
                        {{ item.label }}
                    </li>
                </ul>
                <div class="color-picker-container">
                    <!-- <compact-picker
                        v-model="color"
                        :palette="predefine"
                        style="width: 100%"
                        v-show="currentTag == 'default'"
                    ></compact-picker> -->
                    <swatches-picker
                        v-model="color"
                        :palette="predefine"
                        style="width: 100%; height: 100%"
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
                    <el-input
                        v-model="rgbaColor"
                        style="width: 155px; margin-right: 44px"
                        @change="checkColor"
                    ></el-input>
                    <el-button type="text" size="small" @click="clear"
                        >清空</el-button
                    >
                    <el-button
                        type="plain"
                        size="small"
                        style="padding: 6px 15px"
                        @click="colorChange(color)"
                        >确定</el-button
                    >
                </div>
            </div>
        </div>
        <div class="picker-box" slot="reference">
            <div class="color" :style="{ background: color }"></div>
            <div class="el-icon-arrow-down"></div>
        </div>
    </el-popover>
</template>
<script>
import {
    CompactPicker,
    SwatchesPicker,
    ChromePicker,
    RGBSliders,
    HSVSliders,
    HSLSliders,
} from "vue-color/vue2";
export default {
    model: {
        prop: "myColor",
        event: "change",
    },
    props: {
        myColor: [String, Number],
        predefine: Array,
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
    },
    data() {
        return {
            colorPickerVisible: false,
            color: "#000000",
            rgbaColor: "",
            currentTag: "default",
            colorPickerTags: [
                {
                    label: "默认",
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

            return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
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

            return this.rgbaToHex(r, g, b, a);
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
            return this.rgbaToHex(r, g, b, a);
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
                    console.log(this.color)
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
         * @description: 颜色改变
         * @param {*} color
         * @return {*}
         */
        colorChange(color) {
            this.color = color;
            this.$emit("change", color);
            this.colorPickerVisible = false;
        },
    },
};
</script>
<style lang="less" scoped>
.picker-box {
    width: 35px;
    height: 20px;
    font-size: 12px;
    line-height: 1;
    margin-left: 9px;
    padding: 2px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .color {
        width: 13px;
        height: 13px;
        box-shadow: inset 0 0 0 0.013333rem rgba(0, 0, 0, 0.15);
    }
}
.color-picker {
    width: 314px;
    height: 330px;
    box-sizing: border-box;
    background-color: #f0f3fc;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .color-picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 18px;
        padding: 0 10px;
    }
    .color-picker-container {
        width: 100%;
        height: 240px;
        padding: 10px;
        box-sizing: border-box;
    }
    .color-picker-footer {
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
    }
    .header-tag {
        border: 1px solid #6d7079;
        background-color: #f1f4fd;
        color: #000;
        font-size: 12px;
        padding: 2px;
        box-sizing: border-box;
        cursor: pointer;
        list-style: none;
        &:hover {
            color: #719a8b;
        }
    }
    .header-tag-active {
        color: #719a8b;
    }
}
</style>
