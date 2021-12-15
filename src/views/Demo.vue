<template>
<div>
  <h2>Welcome to the CORSID Visualization Tool</h2>
  <p>In this demo we show 468 samples used in the analysis. You can start exploring results of CORSID/CORSID-A by clicking any link in the table.</p>
  <div class="search-wrapper">
    <label>Search: </label>
    <input type="text" v-model="search"/>
    <label>Genus: </label>

    <select v-model="select_genus">
      <option disabled value="">Please select genus</option>
      <option :key="genus" v-for="genus of genera">{{genus}}</option>
    </select>

    <label>Subgenus: </label>
    <select v-model="select_subgenus">
      <option disabled value="">Please select subgenus</option>
      <option :key="subgenus" v-for="subgenus of subgenera">{{subgenus}}</option>
    </select>
  </div>
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
        <td>
          <a class="button" :href="`#/viz/${encodeURIComponent(res.corsid_url)}`">
            <i class="fas fa-external-link-alt">
            </i>
          </a>
        </td>
        <td>
          <a class="button" :href="`#/viz/${encodeURIComponent(res.corsid_a_url)}`">
            <i class="fas fa-external-link-alt">
            </i>
          </a>
        </td>
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
    shown_results: results,
    sort_item: 'sample',
    sort_order: 1,
    search: '',
    select_genus: '',
    select_subgenus: '',
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
      this.shown_results = this.results;
      const search_term = this.search.toLowerCase();
      this.shown_results = this.shown_results.filter(
        row => {
          const genus = row.genus.toLowerCase();
          const sample = row.sample.toLowerCase();
          const subgenus = row.subgenus.toLowerCase();
          return (
            (
              this.select_genus === "" ||
              genus == this.select_genus.toLowerCase()
            ) &&
            (
              this.select_subgenus === "" ||
              subgenus == this.select_subgenus.toLowerCase()
            ) &&
            (
              genus.includes(search_term) ||
              sample.includes(search_term) ||
              subgenus.includes(search_term)
            )
          )
        }
      )
      // console.log(this.shown_results[0])

      return this.shown_results.sort((a,b) => {
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
    },
    genera() {
      return new Set(this.results.map(item => item.genus));
    },
    subgenera() {
      return new Set(this.results.map(item => item.subgenus));
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
h2 {
  text-align: center;
}
p {
  margin-left: 10%;
  width: 80%;
  text-align: center;
}
.search-wrapper {
  width:fit-content;
  height:fit-content;
}
a.button {
  text-decoration: none;
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.05rem 0.5rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;

  background-color: #e6e6e6;
  border-color: #7e7e7e;
}
</style>