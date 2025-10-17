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
            </el-main>
        </el-container>
    </div>
</template>
<script>
import LanguageSwitcher from "@/components/LanguageSwitcher";
export default {
    components: {
        LanguageSwitcher,
    },
    data() {
        return {};
    },
    methods: {},
};
</script>
