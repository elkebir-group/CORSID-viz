<template>
  <div class="solution">
    <div style="width: 20%; float:left">
      <dt>#{{ res[0] + 1 }}</dt> 
      <br/>
      <dt>Sample</dt> <dd>{{ name }}</dd>
      <dt>Core sequence</dt> <dd>
        <div style="display: flex;">
          <span
            v-for="(chr, idx) in res[1].leader_core_seq"
            :key="idx"
            :class="{A: chr=='A', T: chr=='T', C: chr=='C', G: chr=='G', }"
          >{{ chr }}</span>
        </div>
      </dd>
      <dt>Position</dt> <dd>{{ res[1].leader_core_start + 1 }}</dd>
      <dt>TRS-L</dt> <dd>{{ res[1].TRS_L_start + 1 }} - {{ res[1].TRS_L_start + res[1].TRS_L_len + 1 }}</dd>
      <dt>Weight</dt> <dd>{{ res[1].weight }}</dd>
      <template v-if="!res[1].compact">
        <dt>Compactness</dt>
        <dd>
          {{ percentage(res[1].compact) }}
        </dd>
      </template>

      <dt>#ORFs</dt> <dd>{{ res[1].n_intervals }}</dd>
      <dt v-if="res[1].missing_ORF.length" >Missing ORFs</dt> <dd>{{ res[1].missing_ORF.join(", ") }}</dd>
      <dt>Range</dt> <dd>{{ res[1].body_range_start }} - {{ res[1].body_range_start + res[1].body_range_len }}</dd>
      <dt> <div> <button type="submit" @click="download()">Download!</button> </div></dt>
      
    </div>

    <div style="width: 80%; float:right">
      <!-- #right content in there -->
      <span class="top_corner">
        <i class="fas fa-arrow-up" @click="$emit('move-up', res)"></i>
      
        <i class="fas fa-arrow-down" @click="$emit('move-down', res)"></i>
        
        <span class="close">
          <i class="fas fa-times" @click="$emit('remove-solution', res[0])"></i>
        </span>
      </span> 
      <br/>
      <div class="svg" v-if="is_show_plot">
        <div :id="name + '-' + res[0] + '-interval'">
          <Interval
            :id="name + '-' + res[0] + '-interval'"
            :start=0
            :intervals="intervals"
          />
        </div>
        <div :id="name + '-' + res[0] + '-logo'">
          <SeqLogoPlot
            :id="name + '-' + res[0] + '-seq'"
            :sequences="sequences"
            :box="box"
          />
        </div>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th style="text-align: center;"> {{ "Button" }}
          </th>
          <th :key="item" v-for="item in header" style="text-align: center;">
            {{ item }}
          </th>
          <th class="aligned">
            <span
              v-for="(chr, idx) in res[1].TRS_L_seq"
              :key="idx"
              :class="{A: chr=='A', T: chr=='T', C: chr=='C', G: chr=='G', }"
            >{{ chr }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr :key="row.ORF_start" v-for="(row,idx) in reverse_bodys">
          <td>{{ row.check }}
             <input type="checkbox" :id="`ORF-${idx}`" :value="idx" v-model="selectedIDX" >
             <label :for="`ORF-${idx}`"> </label><br>
            </td>
          <td>{{ row.ORF }}</td>
          <td>{{ row.score }}</td>
          <td>{{ row.core_start !== null ? row.core_start + 1 : "" }}</td>
          <td>{{ row.core_start !== null ? row.core_start + row.core_len + 1 : "" }}</td>
          <td>{{ row.core_len ?? "" }}</td>
          <td>{{ row.ORF_start + 1 }}</td>
          <td>{{ row.ORF_start + row.ORF_len + 1 }}</td>
          <td>{{ row.ORF_len }}</td>
          <td class="aligned">
            <span
              v-for="(chr, idx) in row.align"
              :key="idx"
              :class="{A: chr=='A', T: chr=='T', C: chr=='C', G: chr=='G', }"
            >{{ chr }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p> {{selectedIDX}} </p>
  </div>
</template>

<script>
import Interval from './Interval.vue'
import SeqLogoPlot from './SeqLogo.vue'

export default {
  name: "Solution",
  props: {
    res: Object,
    name: String,
    header: Array,
    reverse_bodys: Object,
    intervals: Array,
    sequences: Array,
    box: Object,
    full_sequence: Object,
  },
  data: () => ({
    is_show_plot: true,
    selectedIDX: [],
  }),
  methods: {
    percentage(num) {
      return parseFloat(num).toFixed(2)+"%"
    },
    download(filename) {
      let text = "";
      for (let i = 0; i < this.selectedIDX.length; i++) {
        let var1 = this.reverse_bodys[this.selectedIDX[i]];
        text += this.full_sequence.slice(var1.ORF_start, var1.ORF_start + var1.ORF_len+3) + '\n';
        console.log(text);
      }
      

      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
  },
  components: {
    Interval,
    SeqLogoPlot,
  }
}
</script>

<style scoped>
.solution {
  position: relative;
  border: 1pt solid #ddd;
  margin: 1em 0 1em 0;
  border-radius: 1em;
  padding: 1em;
  /* box-shadow: 0px 0px 10px 5px #ddd; */
  box-shadow: 0 6px 20px -5px rgba(0, 0, 0, 0.3), 0 0 1px 1px rgba(0, 0, 0, 0.05);
}

dl.info {
  display: flex;
  flex-wrap: wrap;
  margin-block: 0;
  padding: 0;
  margin: 0;
}

dt {
  float: left;
  flex: 0 0 auto;
  color: #777;
  padding-left: 0.6em;
  padding-right: 0.4em;
}

dd {
  flex: 0 0 auto;
  padding-right: 0.6em;
  margin-left: 0;
}

.svg {
  width: 60%;
  margin: auto;
}

.close {
  color: #ff7847;
}

.close:hover {
  color: #ff4500;
}

.svg {
  display: flex;
}

.top_corner {
  position: absolute;
  top:10px;
  right:20px;
}
</style>
