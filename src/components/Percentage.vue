<template>
    <td>
        <div class="bg" :style="{width: percentage_number+'%'}"></div>
        {{percentage(percentage_number)}}
    </td>
</template>

<script>
    export default {
        name: "Percentage",
        props: {
            percentage: Function,
            percentage_number: Number,
        },
        computed: {
        }
    }
</script>

<style scoped>
    td {
        text-align: center;
        position: relative;
    }
    div {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: linear-gradient(to right, #56ab2f, #a8e063);
        z-index: -1;
    }
</style>