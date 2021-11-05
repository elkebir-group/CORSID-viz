<template>
<div id="app">
    <div class="topnav">
        <router-link to="/">Home</router-link>

    <router-link to="/about">About</router-link>
    <router-link to="/Viz">Visualization</router-link>
    </div>
  <!-- route outlet -->
  <!-- component matched by the route will render here -->
  <router-view></router-view>

</div>
</template>

<script>

export default {
  name: "App",
  props: {
  },
  data: () => ({
  }),
}
</script>

<style>
.topnav {
  border-radius: 1em;
  background-color: #13294B;
  overflow: hidden;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantrell, "Helvetica Neue", sans-serif;
}

.topnav a {
  float: left;
  color: #ffffff;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

/* Change the color of links on hover */
.topnav a:hover {
  background-color: #ddd;
  color: black;
}

</style>