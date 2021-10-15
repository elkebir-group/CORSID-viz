<template>
    <td 
        :style="percentage_style"
        class="aligned"> 
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
            percentage_style () {
                return {
                    background: 'linear-gradient(to right, #78A2CC ' + this.percentage_number +'%, #FFFFFF ' + (1.0 - this.percentage_number) + '%)'
                }
            }
        }
    }
</script>

<style scoped>
    .aligned {
        font-family: "Roboto Mono", Monaco, consolas, courier, monospace;
        text-align: center;
    }
</style>