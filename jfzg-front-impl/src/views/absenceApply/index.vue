<template>
    <div class="total-page">
        <div v-if="$route.name == 'absenceApply'">
            <list></list>
        </div>
        <router-view v-else></router-view>
    </div>
</template>


<script>
import list from "./children/list.vue";
export default {
    components: { list },
    props: {},
    data() {
        return {};
    },
};
</script>

<style scoped >
</style>