<template>
  <svg :viewBox="viewBox" :height="height">
    <g>
      <g class="x-axis"
        :transform="`translate(0, ${height - margin.bottom})`"
        ref="x_axis"></g>
      <g
        v-for="(col, i) in this.columns"
        :key="`col-${i}`"
        :transform="`translate(${col.x}, 0)`"
      >
        <path
          v-for="(base, j) in col.bases"
          :key="`base-${j}`"
          :d="getLetterPath(base.base)"
          :transform="`translate(${base.preTX},${base.preTY}) scale(${base.scaleX},${base.scaleY}) translate(${base.postTX},${base.postTY})`"
          :class="base.base"
        ></path>
      </g>
      <rect
        :x="x_scale(box.start)"
        :y=0
        :width="x_scale(box.len) - x_scale(0)"
        :height="height"
        class="core-box"
      ></rect>
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: "SeqLogoPlot",
  props: {
    id: String,
    sequences: Array,
    box: Object,
  },
  data: () => ({
    width: 380,
    height: 230,
    margin: {
      bottom: 20,
    },
  }),
  mounted() {
    d3.select(this.$refs.x_axis)
      .call(d3.axisBottom(this.x_scale).tickFormat(d => d + this.box.TRS_L_start));
  },
  methods: {
    getLetterPath(c) {
      const letterA = 'm 144.59,56.29 -5,13.27 h -8.48 L 147.55,21 h 7.56 l 16.56,48.53 H 163 l -5.18,-13.27 z m 11.91,-6.9 v 0 l -5.26063,-16.351734 v 0 L 145.89,49.31 v 0 z';
    
      const letterG = 'm 171.68,67.39 c -4.78512,1.718575 -9.8258,2.617852 -14.91,2.66 -7.34,0 -13.39,-1.87 -18.15,-6.41 -4.18,-4 -6.77,-10.51 -6.77,-18.07 0.07,-14.47 10,-25.06 26.28,-25.06 4.14408,-0.10062 8.46373,0.858362 12.29968,2.762485 l -2.50841,6.640895 C 164.5434,28.443296 162.68021,27.639533 158,27.76682 c -11.21095,0 -17.09113,8.671212 -17.11382,17.51318 0.0227,10.239742 7.28688,17.060696 16.32382,17.060696 2.63567,0 4.67493,-0.352283 6.66228,-1.499682 l 0,-10.27668 H 155.7 V 44.1 h 16 z';
    
      const letterT = 'M 142,30.35 H 129.19 V 21 h 35.93 v 9.33 h -12.83 v 39.2 H 142 Z';
    
      const letterC = 'm 168.65,68 c -2.3,1.15 -6.91,2.3 -12.82,2.3 -13.68,0 -24,-8.64 -24,-24.55 0,-15.19 10.3,-25.49 25.35,-25.49 6,0 9.86,1.3 11.52,2.16 l -3.53135,7.131354 c -2.57018,-1.213266 -5.82943,-1.138298 -8.52666,-0.989324 -10.11665,0.168446 -15.99219,6.764662 -16.07641,16.96797 0.16844,9.774423 4.90287,16.814862 16.71287,16.814862 2.83865,0.05714 6.66081,-0.54002 9.30355,-1.241993 z';
    
      if (c === "G") {
        return letterG;
      } else if (c === "A") {
        return letterA;
      } else if (c === "C") {
        return letterC;
      } else if (c === "T") {
        return letterT;
      }
      return null;
    },
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
      }
      return null;
    },
    calcPathTransform(bbox, y0, y1, yscale, colWidth, offsetY) {
      /**
       * calculate scale factor based on height
       * of bounding "rectangle" (imagine a stacked bar chart)
       */
      const rectHeight = yscale(y1 - y0);
      const rectWidth = colWidth;
    
      const scaleY = rectHeight / bbox.height;
      const scaleX = rectWidth / bbox.width;

      // console.log(bbox, y0, y1, rectHeight, scaleY);
    
      // transform to origin so scaling behaves as desired
      const originX = bbox.x;
      const originY = bbox.y;
    
      // apply scale in reverse to post-scale transforms
      const postTY = (offsetY - yscale(y1)) / scaleY;
      const postTX = (-originX - rectWidth / 2) / scaleX;
    
      // pre-scale transforms
      const preTX = originX * (1 - scaleX);
      const preTY = originY * (1 - scaleY);
    
      // const out = `translate(${preTX},${preTY}) scale(${scaleX},${scaleY}) translate(${postTX},${postTY})`;
    
      return {
        preTX: preTX,
        preTY: preTY,
        scaleX: scaleX,
        scaleY: scaleY,
        postTX: postTX,
        postTY: postTY
      }
    }
  },
  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    },
    maxBits() {
      return d3.max(this.stack_bar, function( d ) { return d.count_total } );
    },
    y_scale() {
      return d3.scaleLinear()
        .range([0, this.height - this.margin.bottom])
        .domain([0, this.maxBits]);
    },
    x_scale() {
      return d3.scaleBand()
        .domain(this.stack_bar.map((_,i) => i))
        .range([0, this.width])
        .padding(0.1);
    },
    stack_bar() {
      let seq = Array.from(this.sequences[0]).map((_, idx) => this.sequences.map(row => row[idx]));
      seq = seq.map((d) => {
        var dict = {
          'G': 0,
          'A': 0,
          'C': 0,
          'T': 0,
        };
        d.forEach((c) => {
          if (c != '-') {
            dict[c] += 1;
          }
        });
        var counts = Array();
        for (const [key, value] of Object.entries(dict)) {
          if (value > 0) {
            counts.push({letter: key, count:value});
          }
        }
        // Sort by count
        counts.sort((a,b) => (a.count > b.count) ? 1 : ((b.count > a.count) ? -1 : 0))
        return counts
      });

      seq.forEach(function(d) {
        var y0 = 0;
        d.count = d.map( function( entry ) {
            return {
              count: entry.count,
              letter: entry.letter,
              y0: y0,
              y1 : y0 += entry.count
            }
          }
        )
        d.count_total = d.count[d.count.length - 1].y1;
      });
      return seq;
    },
    columns() {
      return this.stack_bar.map(
        (d, i) => ({
          x: this.x_scale(i) + this.x_scale.bandwidth() / 2,
          bases: Array.from(
            d.count,
            (c) => ({
              ...this.calcPathTransform(
                this.get_bbox(c.letter),
                c.y0,
                c.y1,
                this.y_scale,
                this.x_scale.bandwidth(),
                this.height - 2*this.margin.bottom),
                base: c.letter,
            })
          )
        })
      )
    }
  }
}
</script>

<style scoped>
.core-box {
  fill: rgba(0,0,0,0);
  stroke: #ae23ae9b;
  stroke-dasharray: 10,5;
  stroke-linecap: butt;
  stroke-width: 2;
}
</style>
