<template>
  <div id="sliding"></div>
  <p v-show="false">{{ new_sequence }}</p>
</template>

<script>
import * as d3 from "d3";

export default {
  components: {},
  emits: ['add'],
  data() {
    return {};
  },
  props: {
    sequence: String,
  },
  methods: {
    updateBarChart(dataset) {
      d3.select("svg").remove();
      for (let i = -6; i < 1; i++)
        dataset.push({ index: i, value: 0});
      for (let i = 0; i < 9; i++)
        dataset.push({ index: dataset.length-6, value: 0 });
      console.log(dataset);

      var margin = { top: 20, right: 20, bottom: 90, left: 20 },
        margin2 = { top: 230, right: 20, bottom: 30, left: 20 },
        width = 800 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        height2 = 300 - margin2.top - margin2.bottom;

      var svg = d3
        .select("#sliding")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      var focus = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      var box = focus
        .append("rect")
        .attr("x", 253.33333333333331)
        .attr("y", 15)
        .attr("width", 506.66666666666663-253.33333333333331)
        .attr("height", height)
        .attr("stroke", "#ae23ae9b")
        .attr("stroke-dasharray", [10,5])
        .attr("stroke-linecap", "butt")
        .attr("stroke-width", 2)
        .attr("fill", "#ffffff");
        
      var context = svg
        .append("g")
        .attr(
          "transform",
          "translate(" + margin2.left + "," + margin2.top + ")"
        );

      //set y scale
      var yScale = d3.scaleLinear().range([0, 0]).domain([0, 0]);
      //add x axis
      var xScale = d3.scaleBand().range([0, width]);
      xScale.domain(d3.range(-6, dataset.length-6));
      //set y scale
      var yScale2 = d3.scaleLinear().range([0, height2]).domain([0, 0]);
      //add x axis
      var xScale2 = d3.scaleBand().range([0, width]);
      xScale2.domain(d3.range(-6, dataset.length-6));

      var xAxis = d3.axisBottom(xScale).tickSize(0); 
      // .tickValues(xScale.domain().slice(0, dataset.length - 8))
      var xAxisGroup = focus
        .append("g")
        .attr("transform", "translate(0," + height + ")");

      var xAxis2 = d3.axisBottom(xScale2).tickValues(
        xScale.domain().filter(function (d, i) {
          return !(i % 20);
        })
      );
      var xAxisGroup2 = context
        .append("g")
        .call(xAxis2)
        .attr("transform", "translate(0," + height2 + ")");

      var initialdata = [];
      var domainofscale = [];
      initialdata.push({});
      xScale2.domain().forEach(function (d, i) {
        if (initialdata.length < 22) {
          let fdata = dataset.filter(function (dt) {
            return dt.index == d;
          });
          initialdata.push(fdata[0]);
          domainofscale.push(d);
        }
      });
      xScale.domain(domainofscale);

      var bars1 = focus.selectAll("rect").data(dataset).enter().append("rect");
      bars1
        .attr("id", function (d, i) {
          return "b" + d.index;
        })
        .attr("x", function (d, i) {
          //data set is still data
          return xScale(d.index);
        })
        .attr("y", function (d) {
          return yScale(d.value);
        }) //for bottom to top
        .attr("width", xScale.bandwidth())
        .attr("height", function (d, i) {
          if (xScale.domain().indexOf(i) === -1) {
            return 0;
          } else return height;
        })
        .attr("fill", (d) => {
          return "none";
        });

      xAxisGroup.call(xAxis);

      focus
        .selectAll("path")
        .data(initialdata)
        .enter()
        .append("path")
        .attr("id", function (d, i) {
          return "b" + d.index;
        })
        .attr("d", function (d, i) {
          if (d.value == 1) {
            return "m 144.59,56.29 -5,13.27 h -8.48 L 147.55,21 h 7.56 l 16.56,48.53 H 163 l -5.18,-13.27 z m 11.91,-6.9 v 0 l -5.26063,-16.351734 v 0 L 145.89,49.31 v 0 z";
          } else if (d.value == 2) {
            return "M 142,30.35 H 129.19 V 21 h 35.93 v 9.33 h -12.83 v 39.2 H 142 Z";
          } else if (d.value == 3) {
            return "m 168.65,68 c -2.3,1.15 -6.91,2.3 -12.82,2.3 -13.68,0 -24,-8.64 -24,-24.55 0,-15.19 10.3,-25.49 25.35,-25.49 6,0 9.86,1.3 11.52,2.16 l -3.53135,7.131354 c -2.57018,-1.213266 -5.82943,-1.138298 -8.52666,-0.989324 -10.11665,0.168446 -15.99219,6.764662 -16.07641,16.96797 0.16844,9.774423 4.90287,16.814862 16.71287,16.814862 2.83865,0.05714 6.66081,-0.54002 9.30355,-1.241993 z";
          } else if (d.value == 4) {
            return "m 171.68,67.39 c -4.78512,1.718575 -9.8258,2.617852 -14.91,2.66 -7.34,0 -13.39,-1.87 -18.15,-6.41 -4.18,-4 -6.77,-10.51 -6.77,-18.07 0.07,-14.47 10,-25.06 26.28,-25.06 4.14408,-0.10062 8.46373,0.858362 12.29968,2.762485 l -2.50841,6.640895 C 164.5434,28.443296 162.68021,27.639533 158,27.76682 c -11.21095,0 -17.09113,8.671212 -17.11382,17.51318 0.0227,10.239742 7.28688,17.060696 16.32382,17.060696 2.63567,0 4.67493,-0.352283 6.66228,-1.499682 l 0,-10.27668 H 155.7 V 44.1 h 16 z";
          } else return null;
        })
        .attr("fill", function (d) {
          if (d.value == 1) return "#32cd32";
          else if (d.value == 2) return "#ff4500";
          else if (d.value == 3) return "#1e90ff";
          else if (d.value == 4) return "#ffa500";
          else return null;
        })
        .attr("transform", function (d, i) {
          let x = xScale(d.index) - 103;
          let y = -20;
          return "translate(" + x + "," + y + ") scale(0.8, 3)";
        });
      
      box.on("click",() => {
          var idx = parseInt(d3.selectAll("path")._groups[0][8].id.substring(1));
          this.$emit('add', idx);
          console.log(idx);
        });

      var bars2 = context
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect");
      bars2
        .attr("x", function (d, i) {
          return xScale2(d.index);
        })
        .attr("y", function (d) {
          return yScale2(d.value);
        })
        .attr("width", xScale2.bandwidth())
        .attr("height", function (d) {
          return height2 - yScale2(d.value);
        })
        .attr("fill", (d) => {
          if (d.value == 1) return "#32cd32";
          else if (d.value == 2) return "#ff4500";
          else if (d.value == 3) return "#1e90ff";
          else if (d.value == 4) return "#ffa500";
          else return "#ffffff";
        });

      var brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width, height2],
        ])
        .on("brush", brushed) //when mouse up, move the selection to the exact tick //start(mouse down), brush(mouse move), end(mouse up)
        .on("end", brushend);
      context
        .append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, [0, 80]);

      function brushed(event) {
        if (!event.sourceEvent) return; // Only transition after input.
        if (!event.selection) return; // Ignore empty selections.
        if (event.sourceEvent && event.sourceEvent.type === "zoom") return;
        var newInput = [];
        var initialdata = [];
        var brushArea = event.selection;
        if (brushArea === null) brushArea = [0, 80];
        if (brushArea[1] - brushArea[0] < 80) {
          d3.selectAll(".brush").call(brush.move, [previousS0, previousS1]);
          return;
        }
        var previousS0 = brushArea[0];
        var previousS1 = brushArea[1];
        xScale2.domain().forEach(function (d, i) {
          if (newInput.length < 21) {
            var pos = xScale2(d) + xScale2.bandwidth() / 2;
            if (pos >= brushArea[0] && pos <= brushArea[1]) {
              newInput.push(d);
              let fdata = dataset.filter(function (dt) {
                return dt.index == d;
              });
              initialdata.push(fdata[0]);
            }
          }
        });
        if (newInput.length == 21) {
          xScale.domain(newInput);

          //realocate the bar chart
          bars1
            .attr("x", function (d, i) {
              return xScale(d.index);
            })
            .attr("y", function (d) {
              return yScale(d.value);
            }) //for bottom to top
            .attr("width", xScale.bandwidth())
            .attr("height", function (d, i) {
              if (xScale.domain().indexOf(i) === -1) {
                return 0;
              } else return height - yScale(d.value);
            });

          focus.selectAll("path").remove();
          focus
            .selectAll("path")
            .data(initialdata)
            .enter()
            .append("path")
            .attr("id", function (d, i) {
              return "b" + d.index;
            })
            .attr("d", function (d, i) {
              if (d.value == 1) {
                return "m 144.59,56.29 -5,13.27 h -8.48 L 147.55,21 h 7.56 l 16.56,48.53 H 163 l -5.18,-13.27 z m 11.91,-6.9 v 0 l -5.26063,-16.351734 v 0 L 145.89,49.31 v 0 z";
              } else if (d.value == 2) {
                return "M 142,30.35 H 129.19 V 21 h 35.93 v 9.33 h -12.83 v 39.2 H 142 Z";
              } else if (d.value == 3) {
                return "m 168.65,68 c -2.3,1.15 -6.91,2.3 -12.82,2.3 -13.68,0 -24,-8.64 -24,-24.55 0,-15.19 10.3,-25.49 25.35,-25.49 6,0 9.86,1.3 11.52,2.16 l -3.53135,7.131354 c -2.57018,-1.213266 -5.82943,-1.138298 -8.52666,-0.989324 -10.11665,0.168446 -15.99219,6.764662 -16.07641,16.96797 0.16844,9.774423 4.90287,16.814862 16.71287,16.814862 2.83865,0.05714 6.66081,-0.54002 9.30355,-1.241993 z";
              } else if (d.value == 4) {
                return "m 171.68,67.39 c -4.78512,1.718575 -9.8258,2.617852 -14.91,2.66 -7.34,0 -13.39,-1.87 -18.15,-6.41 -4.18,-4 -6.77,-10.51 -6.77,-18.07 0.07,-14.47 10,-25.06 26.28,-25.06 4.14408,-0.10062 8.46373,0.858362 12.29968,2.762485 l -2.50841,6.640895 C 164.5434,28.443296 162.68021,27.639533 158,27.76682 c -11.21095,0 -17.09113,8.671212 -17.11382,17.51318 0.0227,10.239742 7.28688,17.060696 16.32382,17.060696 2.63567,0 4.67493,-0.352283 6.66228,-1.499682 l 0,-10.27668 H 155.7 V 44.1 h 16 z";
              } else return null;
            })
            .attr("fill", function (d) {
              if (d.value == 1) return "#32cd32";
              else if (d.value == 2) return "#ff4500";
              else if (d.value == 3) return "#1e90ff";
              else if (d.value == 4) return "#ffa500";
              else return null;
            })
            .attr("transform", function (d, i) {
              let x = xScale(d.index) - 103;
              let y = yScale(d.value) - 20;

              return "translate(" + x + "," + y + ") scale(0.8, 3)";
            });

          xAxisGroup.call(xAxis);
        }
      }
      function brushend(event) {
        if (!event.sourceEvent) return; // Only transition after input.
        if (!event.selection) return; // Ignore empty selections.
        if (event.sourceEvent && event.sourceEvent.type === "zoom") return;
        var newInput = [];
        var brushArea = event.selection;
        if (brushArea === null) brushArea = xScale.range();

        if (brushArea[1] - brushArea[0] < 80) {
          d3.selectAll(".brush").call(brush.move, [previousS0, previousS1]);
          return;
        }
        var previousS0 = brushArea[0];
        var previousS1 = brushArea[1];

        xScale2.domain().forEach(function (d) {
          if (newInput.length < 21) {
            var pos = xScale2(d) + xScale2.bandwidth() / 2;
            if (pos >= brushArea[0] && pos <= brushArea[1]) {
              newInput.push(d);
            }
          }
        });

        //relocate the position of brush area
        var increment = 0;
        if (newInput.length > 21) {
          var left = xScale2(d3.min(newInput));
          var right = xScale2(d3.max(newInput)) + xScale2.bandwidth();

          d3.select(this).transition().call(brush.move, [left, right]);
        }
      }
    },
  },
  mounted() {
    this.updateBarChart(this.encoded);
  },
  computed: {
    encoded() {
      return Array.from(Array.from(this.sequence.slice(0, 200)), (d, i) => {
        i = i+1;
        if (d == "A") {
          let obj = {};
          obj["index"] = i;
          obj["value"] = 1;
          return obj;
        }
        if (d == "T") {
          let obj = {};
          obj["index"] = i;
          obj["value"] = 2;
          return obj;
        }
        if (d == "C") {
          let obj = {};
          obj["index"] = i;
          obj["value"] = 3;
          return obj;
        }
        if (d == "G") {
          let obj = {};
          obj["index"] = i;
          obj["value"] = 4;
          return obj;
        }
      });
    },
    new_sequence() {
      this.updateBarChart(this.encoded);
      return this.encoded;
    },
  },
};
</script>

<style scoped>
</style>
