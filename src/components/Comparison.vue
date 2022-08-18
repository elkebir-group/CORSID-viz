<template>
  <div class="comparison">
    <div style="width: 20%; float:left">
      <dt style="font-weight: bold">Comparison</dt> 
      <br/>
      <!-- <dt>Sample</dt> <dd>{{ name }}</dd> -->
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
      <template v-if="is_corsid_a">
        <dt>Total Score</dt>
        <dd>{{ res[1].weight }}</dd>
      </template>
      <template v-else>
        <dt>Genome coverage</dt>
        <dd>
          {{ percentage(((1.0-res[1].compact)*100)) }}
        </dd>
        <dt>Total Score</dt>
        <dd>{{ res[1].bodys.reduce((a, b) => +a + (+b.score || 0), 0) }}</dd>
      </template>

      <dt>#ORFs</dt> <dd>{{ res[1].n_intervals }}</dd>
      <dt v-if="res[1].missing_ORF.length" >Missing ORFs</dt> <dd>{{ res[1].missing_ORF.join(", ") }}</dd>
      <dt>Range</dt> <dd>{{ res[1].body_range_start }} - {{ res[1].body_range_start + res[1].body_range_len }}</dd>
    </div>

    <div style="width: 80%; float:right">
      <span class="top_corner">
        <span class="close">
          <i class="fas fa-times" @click="$emit('remove-comparison')"></i>
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
        <tr :key="row.ORF_start" v-for="row in reverse_bodys">
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
  </div>
</template>

<script>
import Interval from './Interval.vue'
import SeqLogoPlot from './SeqLogo.vue'

export default {
  name: "Comparison",
  props: {
    res: Object,
    name: String,
    header: Array,
    reverse_bodys: Object,
    intervals: Array,
    sequences: Array,
    box: Object,
    is_corsid_a: Boolean,
  },
  data: () => ({
    is_show_plot: true,
  }),
  methods: {
    percentage(num) {
      return parseFloat(num).toFixed(2)+"%"
    },
  },
  components: {
    Interval,
    SeqLogoPlot,
  }
}
</script>

<style scoped>
.comparison {
  position: relative;
  /* border: 1pt solid #ddd; */
  margin: 1em 0 1em 0;
  border-radius: 1em;
  padding: 1em;
  overflow: auto;
  box-shadow: inset 0px 0px 9px 3px #94e1ff7a, 0 0 1px 1px #87d2ed5e;
  /* background: linear-gradient(to top, #ffffff, #edfaff); */
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
  width: 90%;
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
