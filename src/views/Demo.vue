<template>
<div>
  <table>
    <thead>
      <tr>
        <th id="sample" @click="sort('sample')">
          Sample
          <i :class="sort_item === 'sample' ? class_sorted : 'fas fa-sort dim'"></i>
        </th>
        <th id="genus" @click="sort('genus')">
          Genus
          <i :class="sort_item === 'genus' ? class_sorted : 'fas fa-sort dim'"></i>
        </th>
        <th id="subgenus" @click="sort('subgenus')">
          Subgenus
          <i :class="sort_item === 'subgenus' ? class_sorted : 'fas fa-sort dim'"></i>
        </th>
        <th id="corsid">CORSID viz</th>
        <th id="corsid-a">CORSID-A viz</th>
      </tr>
    </thead>
    <tbody>
      <tr :key="idx" v-for="res, idx in sorted_results">
        <td> {{ res.sample }} </td>
        <td> {{ res.genus }} </td>
        <td> {{ res.subgenus }} </td>
        <td> <a :href="`#/viz/${encodeURIComponent(res.corsid_url)}`">CORSID</a> </td>
        <td> <a :href="`#/viz/${encodeURIComponent(res.corsid_a_url)}`">CORSID-A</a> </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import results from '../assets/demo.json'

export default {
  data: () => ({
    results: results,
    sort_item: 'sample',
    sort_order: 1,
  }),
  methods: {
    sort(item) {
      if (this.sort_item == item) {
        this.sort_order = -this.sort_order;
      } else {
        this.sort_order = 1;
      }
      this.sort_item = item;
    }
  },
  computed: {
    class_sorted() {
      return this.sort_order > 0 ? "fas fa-sort-up" : "fas fa-sort-down";
    },
    sorted_results() {
      return this.results.sort((a,b) => {
        var i = a[this.sort_item].toUpperCase();
        var j = b[this.sort_item].toUpperCase();
        if (i < j) {
          return -this.sort_order;
        }
        if (i > j) {
          return this.sort_order;
        }
        return 0;
      })
    }
  }
}
</script>

<style scoped>
div {
  border: 1pt solid #ddd;
  margin: 1em 0 1em 0;
  border-radius: 1em;
  overflow: auto;
  padding: 1em;
  /* box-shadow: 0px 0px 10px 5px #ddd; */
  box-shadow: 0 6px 20px -5px rgba(0, 0, 0, 0.3), 0 0 1px 1px rgba(0, 0, 0, 0.05);
}
.dim {
  color: #ccc;
}
</style>