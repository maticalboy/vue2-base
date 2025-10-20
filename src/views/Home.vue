<template>
    <div>
        Home
        <el-container>
            <el-header>
                <language-switcher style="float: right"></language-switcher>
            </el-header>
            <el-main>
                <!-- 数字格式化 -->
                <p>{{ $n(1000, "currency") }}</p>

                <!-- 日期格式化 -->
                <p>{{ $d(new Date(), "short") }}</p>
                <p>{{ $d(new Date(), "long") }}</p>
                <el-form :model="form" :rules="loginRules" ref="loginForm">
                    <el-form-item prop="username">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-date-picker v-model="date">
                        <!-- 
                        集成后：月份名称、星期、按钮文本都会自动切换语言
                        不集成：永远显示默认语言（通常是中文）
                        -->
                    </el-date-picker>
                    <color-picker v-model="color" @change= "changeRasterColor" :predefine="predefineColors"></color-picker>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ColorPicker from "@/components/ColorPicker.vue";
export default {
    components: {
        LanguageSwitcher,
        ColorPicker
    },
    computed: {
        loginRules() {
            // 计算属性确保了 this.$t() 会随语言切换更新
            return {
                username: [
                    {
                        required: true,
                        message: this.$t("login.errUserNameMsg"), // 使用国际化key
                        trigger: "blur",
                    },
                ],
            };
        },
    },
    data() {
        return {
            form: {
                username: "",
            },
            color:'#000000',
            predefineColors: [
                ['#AFC5A1', '#B2D2C0', '#B0DCD5', '#CDE081', '#CCE2A3', '#A5D8B7', '#285E1E'],
                ['#C2BBDC', '#D2CCE6', '#DAB4D4', '#ECCEE2', '#F9E8F1', '#E6C6E0', '#453B7F'],
                ['#F4BAAE', '#EBCFB0', '#FBD9BD', '#DECEBD', '#EAC2A6', '#E8B699', '#8D373C'],
                ['#FDE0A5', '#F9EAD2', '#FFF7C5', '#ECEAAC', '#FCF8BB', '#FBE8A6', '#926A34'],
                ['#A1CBED', '#B0DCDA', '#BDD7CA', '#BBC1D0', '#C7E8FA', '#A9D5E0', '#335489'],
                ['#BF7C85', '#ECA37A', '#E3CECD', '#F4B3C2', '#F6DDDB', '#E9A59A', '#A72126'],
                ['#F3F2F7', '#F1F9FE', '#FFF1D5', '#F6F1DA', '#FFF5D7', '#EAE5DA', '#EDDBB1'],
                ['#000000', '#2A2A2A', '#555555', '#808080', '#AAAAAA', '#D5D5D5', '#FFFFFF'],
            ],
        };
    },
    methods: {},
};
</script>
