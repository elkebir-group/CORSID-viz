<template>
  <div id="app">
    <span id="forkongithub">
      <a href="https://github.com/elkebir-group/CORSID">
        Fork me on GitHub
      </a>
    </span>
    <div class="topnav">
      <!-- <router-link to="/">Home</router-link> -->
      <router-link to="/demo">Home</router-link>
      <!-- <router-link to="/viz">Visualization</router-link> -->
      <a href="https://github.com/elkebir-group/CORSID-viz/wiki/How-To-Use" target="_blank">Help</a>
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
body {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantrell, "Helvetica Neue", sans-serif;
}

#app {
  width: 80%;
  margin: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.aligned {
  font-family: "Roboto Mono", Monaco, consolas, courier, monospace;
  text-align: center;
}

.T {
  color: #ff4500;
  fill: #ff4500;
}

.A {
  color: #32cd32;
  fill: #32cd32;
}

.C {
  color: #1e90ff;
  fill: #1e90ff;
}

.G {
  color: #ffa500;
  fill: #ffa500;
}

table, tr, td {
  border-collapse:collapse;
  border: none;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

table tr:hover {
  background-color: rgba(207, 207, 207, 0.705) !important;
}

td, th {
  /* border-bottom: 1px solid #ccc; */
  text-align: center;
  padding: 0 8px 0 8px;
}

th {
  border-top: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
  /* background-color: #ccc; */
}

tbody:last-child {
  border-bottom: 2px solid #ccc;
}

tr:nth-child(even) {
  background-color: #f0f0f0;
  z-index: -10;
}

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

#forkongithub a {
  background: #04aa6d;
  color: #fff;
  text-decoration: none;
  font-family: arial, sans-serif;
  text-align: center;
  font-weight: bold;
  padding: 5px 40px;
  font-size: 1rem;
  line-height: 2rem;
  position: relative;
  transition: 0.5s;
}
#forkongithub a:hover {
  background: #157347;
  color: #fff;
}
#forkongithub a::before,
#forkongithub a::after {
  content: "";
  width: 100%;
  display: block;
  position: absolute;
  top: 1px;
  left: 0;
  height: 1px;
  background: #fff;
}
#forkongithub a::after {
  bottom: 1px;
  top: auto;
}
@media screen and (min-width: 800px) {
  #forkongithub {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 200px;
    overflow: hidden;
    height: 200px;
    z-index: 9999;
  }
  #forkongithub a {
    width: 200px;
    position: absolute;
    top: 60px;
    left: -60px;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    box-shadow: 4px 4px 10px #124230e0;
  }
}
</style>
