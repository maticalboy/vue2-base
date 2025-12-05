<template>
    <transition name="el-zoom-in-top" @after-leave="doDestroy">
        <div class="el-color-dropdown base-color-picker" v-show="showPopper" :style="{ background: '#FFF' }">
            <!-- <div class="el-color-dropdown__main-wrapper">
                <hue-slider ref="hue" :color="color" vertical style="float: right;"></hue-slider>
                <sv-panel ref="sl" :color="color"></sv-panel>
            </div>
            <alpha-slider v-if="showAlpha" ref="alpha" :color="color"></alpha-slider>
            <predefine v-if="predefine" :color="color" :colors="predefine"></predefine> -->
            <div>
                <el-tabs v-model="currentTag" type="card" class="base-color-picker-header">
                    <el-tab-pane :label="item.label" :name="item.id" v-for="item in colorPickerTags" :key="item.id"
                        class="tab-pane-item"></el-tab-pane>
                </el-tabs>
                <div class="base-color-picker-container">
                    <el-select v-model="colorScheme" placeholder="请选择配色方案" v-show="currentTag == 'default'"
                        style="margin-bottom: 6px" :popper-append-to-body="false">
                        <el-option v-for="item in colorSchemeOptions" :key="item.value" :label="item.label"
                            :value="item.value" @change="handelChangeColorScheme">
                        </el-option>
                    </el-select>
                    <swatches-picker v-model="templateColor" :palette="colorSchemePredefine"
                        style="width: 100%; height: calc(100% - 30px)" v-show="currentTag == 'default'">
                    </swatches-picker>
                    <chrome-picker v-model="templateColor" :disableFields="true" style="width: 100%" :formats="['rgb']"
                        v-show="currentTag == 'palette'"></chrome-picker>
                    <RGBSliders v-model="templateColor" style="
                        width: 100%;
                        background-color: #cec0c0;
                        padding: 5px;
                        box-sizing: border-box;
                    " v-show="currentTag == 'RGB'">
                    </RGBSliders>
                    <HSVSliders v-model="templateColor" style="
                        width: 100%;
                        background-color: #cec0c0;
                        padding: 5px;
                        box-sizing: border-box;
                    " v-show="currentTag == 'HSV'">
                    </HSVSliders>
                    <HSLSliders v-model="templateColor" style="
                        width: 100%;
                        background-color: #cec0c0;
                        padding: 5px;
                        box-sizing: border-box;
                    " v-show="currentTag == 'HSL'">
                    </HSLSliders>
                </div>
                <!-- <div class="base-color-picker-footer">
                    <div class="color-wrap1">
                        <div class="active-color" :style="{ 'background-color': color }"></div>
                        <div class="vc-checkerboard" :style="{
                            'background-image': backgroundImage,
                        }"></div>
                    </div>
                    <el-input v-model="rgbaColor" style="width: 160px; margin-right: 56px; line-height: 1"
                        @blur="onBlur" @change="checkColor"></el-input>
                    <el-button type="text" size="small" @click="clear">清空</el-button>
                    <el-button type="primary" size="mini" style="padding: 6px 10px"
                        @click="colorChange(color)">确定</el-button>
                </div> -->
            </div>
            <div class="base-color-picker-footer">
                <div class="color-wrap1">
                    <div class="active-color" :style="{ 'background-color': templateColor }"></div>
                    <div class="vc-checkerboard" :style="{
                        'background-image': backgroundImage,
                    }"></div>
                </div>
                <el-input v-model="customInput" @keyup.native.enter="handleConfirm" @blur="handleConfirm"
                    :validate-event="false" style="width: 160px; margin-right: 36px; line-height: 1">
                </el-input>
                <el-button size="small" type="text" @click="$emit('clear')">
                    {{ t('el.colorpicker.clear') }}
                </el-button>
                <el-button type="primary" size="mini" @click="confirmValue">
                    {{ t('el.colorpicker.confirm') }}
                </el-button>
            </div>
        </div>
    </transition>
</template>

<script>
import Popper from 'element-ui/lib/utils/vue-popper'
import Locale from 'element-ui/lib/mixins/locale';
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
    name: 'el-color-picker-dropdown',

    mixins: [Popper, Locale],

    components: {
        CompactPicker,
        SwatchesPicker,
        ChromePicker,
        RGBSliders,
        HSVSliders,
        HSLSliders,
        TwitterPicker,
    },

    props: {
        color: {
            required: true
        },
        showAlpha: Boolean,
    },

    data() {
        return {
            customInput: '',
            templateColor: 'rgba(0,0,0,1)',
            currentTag: "default",
            colorScheme: "01",
            colorSchemeOptions: [
                {
                    label: "世界地图配色",
                    value: "01",
                    predefine: [
                        [
                            "#AFC5A1",
                            "#B2D2C0",
                            "#B0DCD5",
                            "#CDE081",
                            "#CCE2A3",
                            "#A5D8B7",
                            "#285E1E",
                        ],
                        [
                            "#C2BBDC",
                            "#D2CCE6",
                            "#DAB4D4",
                            "#ECCEE2",
                            "#F9E8F1",
                            "#E6C6E0",
                            "#453B7F",
                        ],
                        [
                            "#F4BAAE",
                            "#EBCFB0",
                            "#FBD9BD",
                            "#DECEBD",
                            "#EAC2A6",
                            "#E8B699",
                            "#8D373C",
                        ],
                        [
                            "#FDE0A5",
                            "#F9EAD2",
                            "#FFF7C5",
                            "#ECEAAC",
                            "#FCF8BB",
                            "#FBE8A6",
                            "#926A34",
                        ],
                        [
                            "#A1CBED",
                            "#B0DCDA",
                            "#BDD7CA",
                            "#BBC1D0",
                            "#C7E8FA",
                            "#A9D5E0",
                            "#335489",
                        ],
                        [
                            "#BF7C85",
                            "#ECA37A",
                            "#E3CECD",
                            "#F4B3C2",
                            "#F6DDDB",
                            "#E9A59A",
                            "#A72126",
                        ],
                        [
                            "#F3F2F7",
                            "#F1F9FE",
                            "#FFF1D5",
                            "#F6F1DA",
                            "#FFF5D7",
                            "#EAE5DA",
                            "#EDDBB1",
                        ],
                        [
                            "#000000",
                            "#2A2A2A",
                            "#555555",
                            "#808080",
                            "#AAAAAA",
                            "#D5D5D5",
                            "#FFFFFF",
                        ],
                    ]
                },
                {
                    label: "纯色过渡配色",
                    value: "02",
                    predefine: [
                        [
                            "#2d0709",
                            "#520408",
                            "#750e13",
                            "#a2191f",
                            "#da1e28",
                            "#fa4d56",
                            "#ff8389",
                            "#ffb3b8",
                            "#ffd7d9",
                            "#fff1f1",
                        ],
                        [
                            "#2a0a18",
                            "#510224",
                            "#740937",
                            "#9f1853",
                            "#d02670",
                            "#ee5396",
                            "#ff7eb6",
                            "#ffafd2",
                            "#ffd6e8",
                            "#fff0f7",
                        ],
                        [
                            "#1c0f30",
                            "#31135e",
                            "#491d8b",
                            "#6929c4",
                            "#8a3ffc",
                            "#a56eff",
                            "#be95ff",
                            "#d4bbff",
                            "#e8daff",
                            "#f6f2ff",
                        ],
                        [
                            "#001141",
                            "#001d6c",
                            "#002d9c",
                            "#0043ce",
                            "#0f62fe",
                            "#4589ff",
                            "#78a9ff",
                            "#a6c8ff",
                            "#d0e2ff",
                            "#edf5ff",
                        ],
                        [
                            "#061727",
                            "#012749",
                            "#003a6d",
                            "#00539a",
                            "#0072c3",
                            "#1192e8",
                            "#33b1ff",
                            "#82cfff",
                            "#bae6ff",
                            "#e5f6ff",
                        ],
                        [
                            "#081a1c",
                            "#022b30",
                            "#004144",
                            "#005d5d",
                            "#007d79",
                            "#009d9a",
                            "#08bdba",
                            "#3ddbd9",
                            "#9ef0f0",
                            "#d9fbfb",
                        ],
                        [
                            "#071908",
                            "#022d0d",
                            "#044317",
                            "#0e6027",
                            "#198038",
                            "#24a148",
                            "#42be65",
                            "#6fdc8c",
                            "#a7f0ba",
                            "#defbe6",
                        ],
                        [
                            "#121619",
                            "#21272a",
                            "#343a3f",
                            "#4d5358",
                            "#697077",
                            "#878d96",
                            "#a2a9b0",
                            "#c1c7cd",
                            "#dde1e6",
                            "#f2f4f8",
                        ],
                          [
                            "#161616",
                            "#262626",
                            "#393939",
                            "#525252",
                            "#6f6f6f",
                            "#8d8d8d",
                            "#a8a8a8",
                            "#c6c6c6",
                            "#e0e0e0",
                            "#f4f4f4",
                        ],
                          [
                            "#171414",
                            "#272525",
                            "#3c3838",
                            "#565151",
                            "#726e6e",
                            "#8f8b8b",
                            "#ada8a8",
                            "#cac5c4",
                            "#e5e0df",
                            "#f7f3f2",
                        ],
                    ]
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

    computed: {
        currentColor() {
            const parent = this.$parent;
            return !parent.value && !parent.showPanelColor ? '' : parent.color.value;
        },
        backgroundImage() {
            const url = this.generateCheckerboard("#ffffff", "#e6e6e6", 8);
            return `url(${url})`;
        },

        colorSchemePredefine() {
            const currentColorScheme = this.colorSchemeOptions.find(colorScheme => {
                return colorScheme.value == this.colorScheme
            })
            return currentColorScheme ? currentColorScheme.predefine : []
        },
    },

    methods: {
        confirmValue() {
            this.$emit('pick');
        },

        handleConfirm() {
            this.color.fromString(this.customInput);
        },

        handelChangeColorScheme(value) {
            this.colorScheme = value
        },

        /**
        * @description: 用于生成透明底色色块背景
        * @param {*} color1
        * @param {*} color2
        * @param {*} size
        * @return {*}
        */
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
         * @description: 格式化
         * @param {*} value
         * @return {*}
         */
        formatColor(value) {
            let str = value;
            let hexColor = ''
            if (!str) {
                hexColor = "";
                return;
            }
            // 正则表达式匹配十六进制格式
            const hexRegex =
                /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

            // 检查基本格式
            if (hexRegex.test(str)) {
                hexColor = str;
                return this.hexToRgba(hexColor);
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
                    hexColor = this.rgbToHex(r, g, b);
                    return this.hexToRgba(hexColor);
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
                    hexColor = this.rgbToHex(r, g, b, a);
                    return this.hexToRgba(hexColor);
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
                    hexColor = this.hslToHex(h, s, l, a);
                    return this.hexToRgba(hexColor);
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
                    hexColor = this.hsvToHex(h, s, v, a);
                    return this.hexToRgba(hexColor);
                }
            }

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

            return `rgba(${r},${g},${b},${alpha == 1 ? alpha : alpha.toFixed(2)
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

    },

    mounted() {
        this.referenceElm = this.$parent.$el; // 参考元素 = 父组件触发按钮
        this.$parent.popperElm = this.popperElm = this.$el; // 弹出层元素 = 当前组件根元素
    },

    watch: {
        showPopper(val) {
            if (val === true) {
                this.$nextTick(() => {
                    const { sl, hue, alpha } = this.$refs;
                    sl && sl.update();
                    hue && hue.update();
                    alpha && alpha.update();
                });
            }
        },

        currentColor: {
            immediate: true,
            handler(val) {
                this.customInput = val;
                this.templateColor = val ? val : '';
            }
        },

        templateColor: {
            immediate: true,
            handler(val) {
                let formatColor = this.formatColor(val)
                this.customInput = formatColor ? formatColor : null;
                this.handleConfirm()
            }
        },
    }
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

.base-color-picker {
    width: 338px;
    // height: 368px;
    padding: 0 !important;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .base-color-picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 37px;
        padding: 8px;
        box-sizing: border-box;
    }

    .base-color-picker-container {
        width: 100%;
        height: 290px;
        padding: 0 8px 8px;
        box-sizing: border-box;
    }
}

.base-color-picker-footer {
    display: flex;
    align-items: center;
    width: 100%;
    height: 41px;
    padding: 8px;
    border-top: 1px solid #d4d4d4;
    box-sizing: border-box;
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
</style>