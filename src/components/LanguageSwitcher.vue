<template>
    <div class="language-switcher">
        <select v-model="currentLang" @change="changeLanguage">
            <option
                v-for="lang in availableLanguages"
                :key="lang.code"
                :value="lang.code"
            >
                {{ lang.name }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
    name: "LanguageSwitcher",
    data() {
        return {
            availableLanguages: [
                { code: "en-US", name: "English" },
                { code: "zh-CN", name: "简体中文" },
                { code: "ja-JP", name: "日本語" },
            ],
            currentLang: this.$i18n.locale,
        };
    },
    methods: {
        changeLanguage() {
            this.$i18n.locale = this.currentLang;
            localStorage.setItem("lang", this.currentLang);

            // 根据需要可以触发页面刷新或重新获取数据
            // window.location.reload()
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
