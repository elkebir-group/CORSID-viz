<template>
  <div id="slider">
    <svg
      preserveAspectRatio="xMinYMin meet"
      :viewBox="`0 0 ${width} ${height + h_heatmap}`"
    >
      <g id="logo" :transform="`translate(0, ${margin.top})`">
        <g>
          <path
            v-for="(path, i) in logo_paths"
            :key="i"
            :d="getLetterPath(path.value)"
            :class="path.base"
            :transform="path.transform"
          ></path>
          <rect
            v-for="(path, i) in logo_paths"
            :key="i"
            :x="logo_x_scale(i)"
            :y="0"
            :height="logo_y_scale(1)"
            :width="logo_x_scale.bandwidth()"
            fill="#ffffff00"
            @click="choose_idx=i+offset"
          ></rect>
          <rect
            class="middle"
            :x="logo_x_scale(7) - 1"
            :y="-logo_y_scale(0.05)"
            :height="logo_y_scale(1.1)"
            :width="logo_x_scale(7) - 2"
            rx="5"
            ry="5"
          >
          </rect>
          <rect
            class="add"
            :x="logo_x_scale(7) + 5"
            :y="2"
            :height="20"
            :width="20"
            rx="3"
            ry="3"
            @click="$emit('add', offset + 8)"
          >
            <title>Add solution</title>
          </rect>
          <text
            class="add"
            :x="logo_x_scale(7) + 5 + 20/2"
            :y="2 + 20/2"
            dominant-baseline="middle"
            text-anchor="middle"
          >+</text>
        </g>
        <g
          :transform="`translate(0, ${height - margin.top - margin.bottom})`"
          ref="logo_x_axis"
        ></g>
      </g>
      <g id="heatmap" :transform="`translate(0, ${height})`">
        <g
          :transform="`translate(0, ${h_heatmap - margin.bottom})`"
          ref="heatmap_x_axis"
        ></g>
        <g>
          <rect
            v-for="(rect, i) in heatmap_rects"
            :key="i"
            :x="rect.x"
            :y="rect.y"
            :width="rect.width"
            :height="rect.height"
            :class="rect.class"
          ></rect>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Slider",
  emits: [
    "add",
    "jump",
  ],
  data: () => ({
    width: 1080,
    height: 70,
    h_heatmap: 40,
    margin: {
      top: 5,
      bottom: 20,
    },
    offset: 0,
    focus_len: 21,
    choose_idx: 0
  }),
  props: {
    sequence: String,
    default_pos: Number,
  },
  methods: {
    get_bbox(c) {
      if (c === "G") {
        return {
          height: 49.54718017578125,
          width: 39.850006103515625,
          x: 131.84999084472656,
          y: 20.502824783325195,
        };
      } else if (c === "A") {
        return {
          height: 48.55999755859375,
          width: 40.55999755859375,
          x: 131.11000061035156,
          y: 21,
        };
      } else if (c === "C") {
        return {
          height: 50.040000915527344,
          width: 36.87001037597656,
          x: 131.82998657226562,
          y: 20.2600040435791,
        };
      } else if (c === "T") {
        return {
          height: 48.529998779296875,
          width: 35.92999267578125,
          x: 129.19000244140625,
          y: 21,
        };
      } else {
        return null;
      }
    },
    calcPathTransform(bbox, yscale, colWidth, offsetX, offsetY) {
      /**
       * calculate scale factor based on height
       * of bounding "rectangle" (imagine a stacked bar chart)
       */
      const rectHeight = yscale(1);
      const rectWidth = colWidth;

      const scaleY = rectHeight / bbox.height;
      const scaleX = rectWidth / bbox.width;

      // transform to origin so scaling behaves as desired
      const originX = bbox.x;
      const originY = bbox.y;

      // apply scale in reverse to post-scale transforms
      const postTY = (offsetY - originY) / scaleY;
      const postTX = (offsetX - originX) / scaleX;

      // pre-scale transforms
      const preTX = originX * (1 - scaleX);
      const preTY = originY * (1 - scaleY);

      return `translate(${preTX},${preTY}) scale(${scaleX},${scaleY}) translate(${postTX},${postTY})`;
    },
    getLetterPath(i) {
      const letterA =
        "m 144.59,56.29 -5,13.27 h -8.48 L 147.55,21 h 7.56 l 16.56,48.53 H 163 l -5.18,-13.27 z m 11.91,-6.9 v 0 l -5.26063,-16.351734 v 0 L 145.89,49.31 v 0 z";

      const letterG =
        "m 171.68,67.39 c -4.78512,1.718575 -9.8258,2.617852 -14.91,2.66 -7.34,0 -13.39,-1.87 -18.15,-6.41 -4.18,-4 -6.77,-10.51 -6.77,-18.07 0.07,-14.47 10,-25.06 26.28,-25.06 4.14408,-0.10062 8.46373,0.858362 12.29968,2.762485 l -2.50841,6.640895 C 164.5434,28.443296 162.68021,27.639533 158,27.76682 c -11.21095,0 -17.09113,8.671212 -17.11382,17.51318 0.0227,10.239742 7.28688,17.060696 16.32382,17.060696 2.63567,0 4.67493,-0.352283 6.66228,-1.499682 l 0,-10.27668 H 155.7 V 44.1 h 16 z";

      const letterT =
        "M 142,30.35 H 129.19 V 21 h 35.93 v 9.33 h -12.83 v 39.2 H 142 Z";

      const letterC =
        "m 168.65,68 c -2.3,1.15 -6.91,2.3 -12.82,2.3 -13.68,0 -24,-8.64 -24,-24.55 0,-15.19 10.3,-25.49 25.35,-25.49 6,0 9.86,1.3 11.52,2.16 l -3.53135,7.131354 c -2.57018,-1.213266 -5.82943,-1.138298 -8.52666,-0.989324 -10.11665,0.168446 -15.99219,6.764662 -16.07641,16.96797 0.16844,9.774423 4.90287,16.814862 16.71287,16.814862 2.83865,0.05714 6.66081,-0.54002 9.30355,-1.241993 z";

      if (i === 1) {
        return letterA;
      } else if (i === 2) {
        return letterT;
      } else if (i === 3) {
        return letterC;
      } else if (i === 4) {
        return letterG;
      }
      return null;
    },
    brushed(event) {
      if (!event.sourceEvent) return; // Only transition after input.
      if (!event.selection) return; // Ignore empty selections.
      if (event.sourceEvent && event.sourceEvent.type === "zoom") return;

      var eachBand = this.heatmap_x_scale.step();
      var index = Math.round((event.selection[0] / eachBand));
      // this.offset = this.heatmap_x_scale.domain()[index];
      // console.log(index, this.offset);
      this.offset = index;
      this.$emit("jump", this.offset + 8);
    },
  },
  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    },
    logo_x_scale() {
      return d3
        .scaleBand()
        .domain([...Array(this.focus_len).keys()])
        .range([0, this.width])
        .padding(0.05);
    },
    logo_y_scale() {
      return d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, this.height - this.margin.top - this.margin.bottom]);
    },
    heatmap_x_scale() {
      return d3
        .scaleBand()
        .domain([...Array(this.encoded.length).keys()])
        .range([0, this.width])
        .padding(0.0);
    },
    heatmap_y_scale() {
      return d3
        .scaleBand()
        .domain(["base"])
        .range([0, this.h_heatmap - this.margin.bottom])
        .padding(0.0);
    },
    encoded() {
      return Array.from(Array.from(this.sequence), (d, i) => {
        let value = 0;
        if (d == "A") {
          value = 1;
        }
        if (d == "T") {
          value = 2;
        }
        if (d == "C") {
          value = 3;
        }
        if (d == "G") {
          value = 4;
        }
        return {
          index: i,
          value: value,
          base: d,
        };
      });
    },
    encoded_focused() {
      if (this.offset >= 0) {
        return this.encoded.slice(this.offset, this.offset + this.focus_len);
      } else {
        return Array(-this.offset).fill(null).concat(this.encoded.slice(0, this.offset + this.focus_len));
      }
    },
    logo_paths() {
      return Array.from(Array.from(this.encoded_focused), (d, i) => {
        return {
          index: i,
          value: d == null ? null : d.value,
          base: d == null ? null : d.base,
          x: this.logo_x_scale(i),
          y: 0,
          transform: d == null ? null : this.calcPathTransform(
            this.get_bbox(d.base),
            this.logo_y_scale,
            this.logo_x_scale.bandwidth(),
            this.logo_x_scale(i),
            0
          ),
        };
      });
    },
    heatmap_rects() {
      return Array.from(Array.from(this.encoded), (d, i) => {
        return {
          index: i,
          value: d.value,
          x: this.heatmap_x_scale(i),
          y: this.heatmap_y_scale("base"),
          width: this.heatmap_x_scale.bandwidth(),
          height: this.heatmap_y_scale.bandwidth(),
          class: d.base,
        };
      });
    },
  },
  watch: {
    offset() {
      d3.select(this.$refs.logo_x_axis)
        .call(
          d3.axisBottom(this.logo_x_scale)
            .tickFormat(d => (d + this.offset + 1))
        );
    },
    heatmap_x_scale() {
      // plot ticks
      d3.select(this.$refs.heatmap_x_axis).call(
        d3.axisBottom(this.heatmap_x_scale)
          .tickFormat(d => (d + 1))
          .tickValues(this.heatmap_x_scale.domain().filter((_, i) => !(i % 50)))
      );
      // make brush
      var brush = d3.brushX()
        .extent([
                  [-this.heatmap_x_scale(7), 0],
                  [this.width+this.heatmap_x_scale(7), this.h_heatmap - this.margin.bottom]])
        .on("brush", this.brushed);

      d3.select("#heatmap-brush").remove();
      var gBrush = d3.selectAll("#heatmap").append("g")
        .attr("id", "heatmap-brush")
        .call(brush)
        .call(brush.move, [this.heatmap_x_scale(this.default_pos-8), this.heatmap_x_scale(this.default_pos-8+this.focus_len)]);
      this.offset = this.default_pos-8;
      d3.selectAll('#heatmap-brush>.handle').remove();
      d3.selectAll('#heatmap-brush>.overlay').remove();
    }
  },
  mounted() {
    // plot ticks
    d3.select(this.$refs.logo_x_axis)
      .call(
        d3.axisBottom(this.logo_x_scale)
          .tickFormat(d => (d + this.offset + 1))
      );
  },
};
</script>

<style>
#heatmap-brush rect.selection {
  fill: rgb(255, 255, 255);
  fill-opacity: 0.7;
  stroke: #13294B;
  stroke-width: 2;
}

#logo rect.middle {
  fill: #00000000;
  stroke: #13294B;
  stroke-width: 3;
}

#logo rect.add {
  fill: #8888;
  stroke: #13294B33;
  stroke-width: 1;
}
#logo rect.add:hover {
  fill: #fffa;
  stroke: #13294B;
  stroke-width: 1;
}
#logo text.add {
  fill:#13294B91;
  font-weight: bold;
  pointer-events: none;
  font-size: 1.3em;
}
#logo rect.add:hover ~ text.add {
  fill:#13294B;
}
</style>

<style scoped>
#slider {
  width: 80%;
  margin-left: 10%;
}
</style>
