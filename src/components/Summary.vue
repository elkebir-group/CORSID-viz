<template>
  <div class="summary">
    <h2 @click="test">{{ name }}</h2>

    <!-- <input type="file" id="user_file" @change="$emit('load-data', $event)" /> -->

    <Slider
      :sequence="sequence.slice(0, leader_end)"
      @add="add"
      @jump="jump"
    />

    <table>
      <thead>
        <tr class="summary-table-header">
          <th id="idx" @click="sort('idx')">
            ID
            <i
              :class="currentSort === 'idx' ? class_sorted : 'fas fa-sort dim'"
            ></i>
          </th>
          <th id="core_seq">Core Sequence</th>
          <th id="pos" @click="sort('pos')">
            Position
            <i
              :class="currentSort === 'pos' ? class_sorted : 'fas fa-sort dim'"
            ></i>
          </th>
          <th id="trs_l_start" @click="sort('trs_l_start')">
            TRS-L
            <i
              :class="
                currentSort === 'trs_l_start' ? class_sorted : 'fas fa-sort dim'
              "
            ></i>
          </th>

          <th id="compact" @click="sort('compact')">
            Coverage
            <i
              :class="
                currentSort === 'compact' ? class_sorted : 'fas fa-sort dim'
              "
            ></i>
          </th>

          <th v-if="is_corsid_a" id="weight" @click="sort('weight')">
            Weight
            <i
              :class="
                currentSort === 'weight' ? class_sorted : 'fas fa-sort dim'
              "
            ></i>
          </th>
          <th v-else id="score" @click="sort('score')">
            Score
            <i
              :class="
                currentSort === 'weight' ? class_sorted : 'fas fa-sort dim'
              "
            ></i>
          </th>

          <th v-if="!is_corsid_a" id="min_score" @click="sort('min_score')">
            Min Score
            <i
              :class="
                currentSort === 'min_score' ? class_sorted : 'fas fa-sort dim'
              "
            ></i>
          </th>

          <th id="plot">Plot</th>
          <th id="compare">Compare</th>
        </tr>
      </thead>
      <tbody>
        <tr
          :key="res.idx"
          v-for="res in sortedSummaryData.slice(idxShown, idxShown + 10)"
        >
          <td>{{ res.idx }}</td>
          <td class="aligned">
            <span
              v-for="(chr, idx) in res.core_seq"
              :key="idx"
              :class="{
                A: chr == 'A',
                T: chr == 'T',
                C: chr == 'C',
                G: chr == 'G',
              }"
              >{{ chr }}</span
            >
          </td>
          <td>{{ res.pos }}</td>
          <td>{{ res.trs_l_start }} - {{ res.trs_l_end }}</td>

          <percentage
            :percentage="percentage"
            :percentage_number="res.compact"
          />

          <td v-if="is_corsid_a">{{ parseFloat(res.weight).toFixed(0) }}</td>
          <td v-else>{{ res.score }}</td>

          <td v-if="!is_corsid_a">{{ res.min_score }}</td>

          <td>
            <button
              id="add_solution_card"
              @click="
                $emit('add-solution', [res.idx - 1, results[res.idx - 1]])
              "
            >
              <i class="fas fa-plus"></i>
            </button>
          </td>
          <td>
            <button @click="$emit('show-as-compare', res.idx)">
              <i class="fas fa-thumbtack"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <div id="paging">
      Showing <span> {{ idxShown + 1 }} </span>-<span>
        {{
          idxShown + 10 > summarydata.length
            ? summarydata.length
            : idxShown + 10
        }}
      </span>
      of <span>{{ summarydata.length }}&ensp;</span>
      <i class="fas fa-chevron-left" @click="sub_idx_shown"></i>
      <input
        type="text"
        @keyup.enter="jumpto(parseInt(this.idxJump-1))"
        v-model="idxJump"
        placeholder="1"
        style="width: 35px"
      />
      <i class="fas fa-angle-right" @click="add_idx_shown"></i>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import Percentage from "./Percentage.vue";
import SlidingWindow from "./SlidingWindow.vue";
import Slider from "./Slider.vue";

export default {
  components: {
    Percentage,
    SlidingWindow,
    Slider,
  },
  name: "Summary",
  data() {
    return {
      idxShown: 0,
      idxJump: 1,
      currentSort: "idx",
      currentSortDir: "asc",
    };
  },
  props: {
    name: String,
    sequence: String,
    results: Array,
    summarydata: Array,
    is_corsid_a: Boolean,
    leader_end: Number,
  },
  methods: {
    percentage(num) {
      return parseFloat(num).toFixed(2) + "%";
    },
    sort(s) {
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
    add(pos) {
      console.log(pos);
      var res = this.sortedSummaryData.filter((d) => d.pos === pos);
      console.log(res);
      if (res.length === 0) {
        console.log("no such records");
        return;
      }
      this.$emit("add-solution", [
        res[0].idx - 1,
        this.results[res[0].idx - 1],
      ]);
    },
    add_idx_shown() {
      if (this.idxShown < this.results.length-10) {
        this.idxShown += 10;
      }
    },
    sub_idx_shown() {
      if (this.idxShown >= 10) {
        this.idxShown -= 10;
      } else {
        this.idxShown -= this.idxShown;
      }
    },
    jump(pos) {
      var idx = this.sortedSummaryData.findIndex((d) => d.pos == pos);
      if (idx == -1) {
        console.log("no such records");
        this.message = "There are no records with position " + pos + ".";
        return;
      } else {
        this.message = "";
        this.jumpto(idx);
      }
    },
    jumpto(n) {
      if (isNaN(n)){
          alert("please enter a number");
          return;
      }
      if (n < 0 || n >= this.results.length){
          alert("index out of range");
          return;
      }
      this.idxShown = n;
    },
  },
  computed: {
    sortedSummaryData() {
      return this.summarydata.sort((a, b) => {
        let mod = 1;
        if (this.currentSortDir === "desc") mod = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * mod;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * mod;
        return 0;
      });
    },
    class_sorted() {
      return this.currentSortDir === "asc"
        ? "fas fa-sort-up"
        : "fas fa-sort-down";
    },
  },
};
</script>

<style scoped>
.summary {
  border: 1pt solid #ddd;
  margin: 1em 0 1em 0;
  border-radius: 1em;
  overflow: auto;
  padding: 1em;
  /* box-shadow: 0px 0px 10px 5px #ddd; */
  box-shadow: 0 6px 20px -5px rgba(0, 0, 0, 0.3),
    0 0 1px 1px rgba(0, 0, 0, 0.05);
}
#paging {
  text-align: right;
}
td {
  z-index: 10;
}
.dim {
  color: #ccc;
}
input {
  margin-bottom: 1em;
}
</style>
