<template>
  <div class="summary">
    <h2 @click="printd3">Summary</h2>

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
          <tr>
            <th class="aligned"> ID </th>
            <th class="aligned"> Core Sequence </th>
            <th class="aligned"> Position </th>
            <th class="aligned"> TRS-L </th>
            <th class="aligned"> Weight </th>
            <th class="aligned"> Compactness </th>
            <th class="aligned"> Plot </th>
          </tr>
        </thead>
        <tbody>
          <tr :key="index" v-for="(res, index) in results.slice(idxShown, idxShown+10)">
            <td class="aligned"> {{ index + idxShown + 1 }} </td>
            <td class="aligned">
              <span
                v-for="(chr, idx) in res.leader_core_seq"
                :key="idx"
                :class="{A: chr=='A', T: chr=='T', C: chr=='C', G: chr=='G', }"
              >{{ chr }}</span>
            </td>
            <td class="aligned"> {{ res.leader_core_start + 1 }} </td>
            <td class="aligned"> {{ res.TRS_L_start + 1 }} - {{ res.TRS_L_start + res.TRS_L_len + 1 }} </td>
            <td class="aligned"> {{ res.weight }} </td>
            <percentage
              :id="index"
              :percentage="percentage"
              :percentage_number="((1.0-res.compact)*100)"
            />
            <td class="aligned">
              <button 
                id="add_solution_card"
                @click="$emit('add-solution', [index + idxShown, res])">
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div align="right">
        <span class="pagination">
          <i class="fas fa-chevron-left" @click="$emit('sub-idx-shown')"></i>
        </span>
        <input type="text" @keyup.enter="jumpto" v-model="idxJump" placeholder="0" style="width:75px">
        <span class="pagination">
          <i class="fas fa-angle-right" @click="$emit('add-idx-shown')"></i>
        </span>
      </div>
    </div>
</template>

<script>
import Percentage from './Percentage.vue'

export default {
  components: { Percentage },
  name: "Summary",
  props: {
    name: String,
    sequence: String,
    results: Array,
    idxShown: Number,
    idxJump: Number
  },
  methods: {
    percentage(num) {
      return parseFloat(num).toFixed(2)+"%"
    },
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

.pagination {
  margin: 0 .25em
}
</style>
