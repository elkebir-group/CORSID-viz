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
          <th id="pos" @click="sort('pos')">
            Position
            <i
              :class="currentSort === 'pos' ? class_sorted : 'fas fa-sort dim'"
            ></i>
          </th>
          <th id="core_seq" title="Core sequence">Core Sequence</th>
          <th
            id="idx" @click="sort('idx')"
            :title="is_corsid_a ? 'Ranked by `Weight`' : 'Ranked by (Coverage, Score, Min-Score) lexicographically'"
          >
            Rank
            <i
              :class="currentSort === 'idx' ? class_sorted : 'fas fa-sort dim'"
            ></i>
          </th>
          <th
            id="trs_l_start" @click="sort('trs_l_start')"
            title="TRS-L range"
          >
            TRS-L
            <i
              :class="
                currentSort === 'trs_l_start' ? class_sorted : 'fas fa-sort dim'
              "
            ></i>
          </th>

          <th 
            id="compact" @click="sort('compact')"
            title="Genome coveraged by identified ORFs"
          >
            Coverage
            <i
              :class="
                currentSort === 'compact' ? class_sorted : 'fas fa-sort dim'
              "
            ></i>
          </th>

          <th
            v-if="is_corsid_a" id="weight" @click="sort('weight')"
            title="Total alignment score"
          >
            Weight
            <i
              :class="
                currentSort === 'weight' ? class_sorted : 'fas fa-sort dim'
              "
            ></i>
          </th>
          <th
            v-else id="score" @click="sort('score')"
            title="Total alignment score"
          >
            Score
            <i
              :class="
                currentSort === 'score' ? class_sorted : 'fas fa-sort dim'
              "
            ></i>
          </th>

          <th
            v-if="!is_corsid_a" id="min_score" @click="sort('min_score')"
            title="Minimum alignment score of an ORF in the solution"
          >
            Min Score
            <i
              :class="
                currentSort === 'min_score' ? class_sorted : 'fas fa-sort dim'
              "
            ></i>
          </th>

          <th
            id="plot"
            title="Add a solution to the top"
          >Add</th>
          <th
            id="compare"
            title="Pin a solution below to compare"
          >Compare</th>
        </tr>
      </thead>
      <tbody>
        <tr
          :key="res.idx"
          v-for="res in sortedSummaryData.slice(idxShown, idxShown + 10)"
        >
          <td>{{ res.pos }}</td>
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
          <td>{{ res.idx }}</td>
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

    <div class="paging">
      <div class="label">
        {{ `Showing ${idxShown + 1} -
          ${ idxShown + 10 > summarydata.length ? summarydata.length : idxShown + 10 }
          of ${summarydata.length}` }}
      </div>
      <div class="paging-group">
        <div class="button" @click="jumpto(0)">
          <i class="fas fa-angle-double-left"></i>
        </div>
        <div class="button" @click="sub_idx_shown">
          <i class="fas fa-angle-left"></i>
        </div>
        <input
          type="text"
          @keyup.enter="jumpto(parseInt(this.idxJump-1))"
          v-model="idxJump"
          placeholder="position"
        />
        <div class="button" @click="add_idx_shown">
          <i class="fas fa-angle-right"></i>
        </div>
        <div class="button" @click="jumpto(summarydata.length - 10)">
          <i class="fas fa-angle-double-right"></i>
        </div>
      </div>
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
      currentSort: "pos",
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
        this.$emit("no-solution", pos);
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
td {
  z-index: 10;
}
.dim {
  color: #ccc;
}
.paging {
  margin-top: 0.3em;
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 0.8em;
}
.paging .label {
  text-align: center;
  min-width: 12em;
}
.paging-group {
  display: flex;
  align-items: center;
  column-gap: 0.2em;
}
.paging-group .button {
  font-size: 1em;
  border: 1px solid #13294B;
  border-radius: 0.2em;
  padding: 0.1em 0.15em;
}
.paging-group .button:hover {
  border-color: #80bdff;
  box-shadow: 0 0 0.1em 0.1em rgba(0, 123, 255, 25%);
}
.paging-group input {
  font-size: 1em;
  border: 1px solid #13294B;
  border-radius: 0.2em;
  padding: 0.15em 0.15em 0.05em 0.15em;
  text-align: center;
  width: 3em;
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}
textarea:focus, input:focus{
  outline: none;
}
.paging-group input:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2em rgba(0, 123, 255, 25%);
}
:focus:not(:focus-visible) {
  outline: 0;
}
</style>
