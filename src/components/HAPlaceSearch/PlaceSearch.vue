<template>
    <div style="width: 100%;height: 100%;">
        <china-search v-if="isCN"></china-search>
        <foreign-search v-else></foreign-search>
    </div>
</template>
<script>
import ChinaSearch from './ChinaSearch.vue';
import ForeignSearch from './ForeignSearch.vue';
export default {
    components:{
        ChinaSearch,
        ForeignSearch
    },
    computed:{
        isCN(){
            return this.$isCN
        }
    },
    data(){
        return{
            
        }
    },
}
</script>