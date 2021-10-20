<template>
    <td 
        class="aligned">
        <div class="bg" :style="{width: percentage_number+'%'}"></div>
        {{percentage(percentage_number)}}
    </td>
</template>

<script>
    export default {
        name: "Percentage",
        props: {
            id: Number,
            percentage: Function,
            percentage_number: Number,
        },
        computed: {
        }
    }
</script>

<style scoped>
    .aligned {
        font-family: "Roboto Mono", Monaco, consolas, courier, monospace;
        text-align: center;
        position: relative;
    }
    .bg {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: linear-gradient(to right, #56ab2f, #a8e063);
        z-index: -1;
    }
</style>