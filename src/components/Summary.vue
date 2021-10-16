<template>
  <div class="summary">
    <h2 @click="test">Summary</h2>

    <input type="file" id="user_file" @change="$emit('load-data', $event)" />

    <p id="value-range"></p>
    <p>
      <span
        v-for="(chr, idx) in sequence.slice(0,200)"
        :key="idx"
        :class="{A: chr=='A', T: chr=='T', C: chr=='C', G: chr=='G', }"
      >{{ chr }}</span>
    </p>
    <div id="slider-range"></div>
      
      <table>
        <thead>
          <tr class="summary-table-header">
            <th id="idx" class="aligned" @click="$emit('sort', 'idx')"> ID <i class="fas fa-sort-amount-down-alt"></i></th>
            <th id="sample" class="aligned"> Sample </th>
            <th id="core_seq" class="aligned"> Core Sequence </th>
            <th id="pos" class="aligned" @click="$emit('sort', 'pos')"> Position </th>
            <th id="trs_l_start" class="aligned" @click="$emit('sort', 'trs_l_start')"> TRS-L </th>
            <th id="weight" class="aligned" @click="$emit('sort', 'weight')"> Weight </th>
            <th id="compact" class="aligned" @click="$emit('sort', 'compact')"> Compactness </th>
            <th id="plot" class="aligned"> Plot </th>
          </tr>
        </thead>
        <tbody>
          <tr :key="res.idx" v-for="res in sortedSummaryData.slice(idxShown, idxShown+10)">
            <td class="aligned"> {{ res.idx }} </td>
            <td class="aligned"> {{ res.sample }} </td>
            <td class="aligned">
              <span
                v-for="(chr, idx) in res.core_seq"
                :key="idx"
                :class="{A: chr=='A', T: chr=='T', C: chr=='C', G: chr=='G', }"
              >{{ chr }}</span>
            </td>
            <td class="aligned"> {{ res.pos }} </td>
            <td class="aligned"> {{ res.trs_l_start }} - {{ res.trs_l_end }} </td>
            <td class="aligned"> {{ parseFloat(res.weight).toFixed(3) }} </td>
            <percentage
              :id="index"
              :percentage="percentage"
              :percentage_number="((1.0-res.compact)*100)"
            />
            <td class="aligned">
              <button 
                id="add_solution_card"
                @click="$emit('add-solution', [res.idx-1, results[res.idx-1]])">
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <br>
      <div id="paging">
        Showing <span> {{idxShown+1}} </span>-<span> {{idxShown+10>summarydata.length?summarydata.length:idxShown+10}} </span> of <span>{{summarydata.length}}&ensp;</span>
        <i class="fas fa-chevron-left" @click="$emit('sub-idx-shown')"></i>
        <input type="text" @keyup.enter="$emit('jumpto',this.idxJump)" v-model="idxJump" placeholder="0" style="width:35px">
        <i class="fas fa-angle-right" @click="$emit('add-idx-shown')"></i>
      </div>
      
    </div>
</template>

<script>
import * as d3 from 'd3';
import Percentage from './Percentage.vue'

export default {
  components: { Percentage },
  name: "Summary",
  data() {
    return {
      idxJump: 0,
    }
  },
  props: {
    name: String,
    sequence: String,
    results: Array,
    summarydata: Array,
    idxShown: Number,
    currentSort: String,
    currentSortDir: String,
  },
  methods: {
    percentage(num) {
      return parseFloat(num).toFixed(2)+"%"
    },
    icon() {
      d3.select(".summary-table-header").selectAll("th").select("i").remove();
      var c = this.$parent.currentSortDir==='asc' ? "fas fa-sort-amount-down":"fas fa-sort-amount-down-alt";
      d3.select("#"+this.$parent.currentSort).append("i").classed(c, true);
    }
  },
  computed: {
    sortedSummaryData() {
      return this.summarydata.sort((a,b) => {
        let mod = 1;
        if (this.currentSortDir === 'desc') mod = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * mod;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * mod;
        return 0;
      })
    }
  }
}
</script>

<style scoped>
.summary {
  border: 1pt solid #ddd;
  margin: 1em 0 1em 0;
  border-radius: 1em;
  padding: 1em;
  /* box-shadow: 0px 0px 10px 5px #ddd; */
  box-shadow: 0 6px 20px -5px rgba(0, 0, 0, 0.3), 0 0 1px 1px rgba(0, 0, 0, 0.05);
}
#paging {
  text-align: right;
}
</style>
