<template>
  <svg :viewBox="viewBox" :height="height">
    <g>
      <g class="x-axis"
        :transform="`translate(0, ${height - margin.bottom})`"
        ref="x_axis"></g>
      <rect
        v-for="r in this.rects"
        :key="r.key"
        :x="r.x"
        :y="r.y"
        :width="r.width"
        :height="r.height"
      ></rect>
      <text
        v-for="l in this.labels"
        :key="l.key"
        :x="l.x"
        :y="l.y"
      >{{ l.name }}</text>
    </g>
  </svg>
</template>

<script>
// import { max, min } from "d3-array";
// import { scaleLinear, scaleBand, axisBottom } from "d3-scale";
import * as d3 from 'd3';

export default {
  name: "IntervalPlot",
  props: {
    id: String,
    intervals: Array,
    start: Number
  },
  data: () => ({
    width: 380,
    height: 230,
    margin: {
      bottom: 20,
      right: 20,
    },
  }),
  mounted() {
    d3.select(this.$refs.x_axis)
      .call(d3.axisBottom(this.x_scale));
  },
  computed: {
    min_x() {
      return d3.min(this.intervals, d => {
        return d.start;
      });
    },
    max_x() {
      return d3.max(this.intervals, d => {
        return d.end;
      });
    },
    y_scale() {
      return d3.scaleBand()
        .range([0, this.height - this.margin.bottom])
        .domain(this.intervals.map(function(i) { return i.id }))
        .padding(.1);
    },
    x_scale() {
      return d3.scaleLinear()
        .domain([this.min_x, this.max_x])
        .range([0, this.width - this.margin.right]);
    },
    rects() {
      return this.intervals.map(
        (i) => ({
          key: i.start,
          x: this.x_scale(i.start),
          y: this.y_scale(i.id),
          width: this.x_scale(i.end - i.start + this.min_x),
          height: this.y_scale.bandwidth()
        })
      )
    },
    labels() {
      return this.intervals.map(
        (i) => ({
          key: i.start,
          x: this.x_scale(i.end) + 3,
          y: this.y_scale(i.id) + this.y_scale.bandwidth() / 2 + 6,
          name: i.name,
        })
      )
    },
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    }
  }
}
</script>

<style scoped>
rect {
  fill: #1e90ff;
  fill-opacity: 0.5;
  stroke: #1e90ff;
  stroke-opacity: 0.5;
  transition: fill .2s ease-in-out;
}
</style>
