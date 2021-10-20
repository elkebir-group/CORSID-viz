<template>
  <div class="solution">
    <dl class="info">
      <dt>#{{ res[0] + 1 }}</dt>
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
      <!-- <dt><button id="remove_solution" @click="$emit('remove-solution', res[0])">Remove</button></dt> -->
    </dl>
    <!-- <i class="fas fa-chart-bar" @click="is_show_plot = !is_show_plot"></i> -->
    <span class="close">
      <i class="fas fa-times" @click="$emit('remove-solution', res[0])"></i>
    </span>

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

    <table>
      <thead>
        <tr>
          <th> </th>
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
          <td>{{ row.check }}
            <button type="button">Click Me!</button>
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
.solution {
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
}

dl dt {
  flex: 0 0 auto;
  color: #777;
  padding-left: 0.6em;
  padding-right: 0.4em;
}

dl dd {
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
</style>
