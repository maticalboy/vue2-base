<template>
    <div class="language-switcher">
        <el-select v-model="currentLang" @change="changeLanguage">
            <el-option
                v-for="lang in availableLanguages"
                :key="lang.code"
                :value="lang.code"
                :label="lang.name"
            >
                {{ lang.name }}
            </el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    name: "LanguageSwitcher",
    data() {
        return {
            availableLanguages: [],
            currentLang: this.$i18n.locale,
        };
    },

    created() {
        this.availableLanguages = [
            { code: "zh-CN", name: '简体中文' },
            { code: "en-US", name: "English" },
            { code: "de-DE", name: "Deutsch" },
            { code: "fr-FR", name: "Français" },
            { code: "es-ES", name: "Espanol" },
            { code: "it-IT", name: "Italiano" },
            { code: "pt-PT", name: "Português" },
        ];
    },
    methods: {
        changeLanguage() {
            // this.$i18n.locale = this.currentLang;
            localStorage.setItem("lang", this.currentLang);

            // 根据需要可以触发页面刷新或重新获取数据
            window.location.reload()
        },
    },
};
</script>

<style scoped>
.language-switcher {
    margin: 10px;
}

select {
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
}
</style>
