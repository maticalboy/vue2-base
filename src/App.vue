<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: "App",
    components: {},
};
</script>

<style>
html,
body,
#app {
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    font-size: 12px;
    min-width: 860px;
}

body {
    margin: 0;
}
</style>
