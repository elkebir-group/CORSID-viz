<template>
  <div class="container">
    <div
      :class="[style, hide_state ? 'hidden' : '']"
      v-if="message.length > 0">
      <i class="fas fa-exclamation-triangle" v-if="style == 'warning'"></i>
      {{message}}
    </div>
  </div>
</template>

<script>
import { ref, watch } from '@vue/runtime-core'
export default {
  name: 'Alert',
  props: {
    message: String,
    style: {
      type: String,
      default: "primary",
    },
    duration: {
      type: Number,
      default: 2,
    },
  },
  setup(props) {
    // const message_ref = ref(props.message);
    const hide_state = ref(false);
    let timeout_id = 0;

    watch(
      () => props.message,
      () => {
        hide_state.value = false;
        if (timeout_id > 0) {
          clearTimeout(timeout_id);
        }
        timeout_id = setTimeout(() => {hide_state.value = true}, 2000);
      }
    )

    return {
      hide_state,
    }
  }
}
</script>

<style scoped>
div.container div {
  position: fixed;
  bottom: 0.5em;
  left: 0.5em;
  padding: 0.5em;
  border-radius: 0.5em;
  visibility: visible;
  opacity: 1;
  user-select: none;
}

div.container .primary {
  color: #004085;
  background-color: #cce5ff;
  border: #b8daff;
  box-shadow: 0 6px 20px 0px rgb(0 64 133 / 30%), 0 0 6px 2px rgb(0 64 133 / 5%);
}

div.container .warning {
  color: #856404;
  background-color: #fff3cd;
  border: #ffeeba;
  box-shadow: 0 6px 20px 0px rgb(133 100 4 / 30%), 0 0 6px 2px rgb(133 100 4 / 5%);
}

div.container .hidden {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0.5s linear, opacity 0.5s;
}
</style>