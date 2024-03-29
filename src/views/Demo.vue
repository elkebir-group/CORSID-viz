<template>
<div>
  <h2>Welcome to the CORSID Visualization Tool</h2>
  <p>In this demo we show 468 samples used in the analysis. You can start exploring results of CORSID/CORSID-A by clicking any link in the table.</p>
  <div class="search-wrapper">
    <div class="form-group">
      <label>Search: </label>
      <input type="text" v-model="search"/>
    </div>
    <div class="form-group">
      <label> Genus: </label>
      <select v-model="genus_search">
        <option value=""></option>
        <option value="Alphacoronavirus">Alphacoronavirus</option>
        <option value="Betacoronavirus">Betacoronavirus</option>
        <option value="Gammacoronavirus">Gammacoronavirus</option>
        <option value="Deltacoronavirus">Deltacoronavirus</option>
      </select>
    </div>
    <div class="form-group tooltip">
      <label> Subgenus: </label>
      <select
        v-model="subgenus_search"
        :disabled="genus_search == ''">
        <option value=""></option>
        <option :key="idx" v-for="subgenus, idx in subgenuses_for_genus" v-bind:value="subgenus"> {{subgenus}} </option>
      </select>
      <span class="tooltip-text" v-if="genus_search == ''">Select a genus first</span>
    </div>
    <div class="form-group">
      <div @click='reset' class="button" title="Clear">
        <i class="fas fa-undo-alt"></i>
      </div>
    </div>
    <a
      class="button button-green"
      style="margin-left: auto"
      target="_blank"
      rel="noopener noreferrer"
      title="Open in new page"
      href="#/viz/">
      <i class="fas fa-cloud-arrow-up"></i>
      Upload your JSON result
    </a>
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
          <a
            class="button"
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new page"
            :href="`#/viz/${encodeURIComponent(res.corsid_url)}`">
            <i class="fas fa-external-link-alt">
            </i>
          </a>
        </td>
        <td>
          <a
            class="button"
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new page"
            :href="`#/viz/${encodeURIComponent(res.corsid_a_url)}`">
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
    genus_search: '',
    subgenus_search: '',
    subgenuses: []
  }),
  methods: {
    sort(item) {
      if (this.sort_item == item) {
        this.sort_order = -this.sort_order;
      } else {
        this.sort_order = 1;
      }
      this.sort_item = item;
    },
    reset() {
      this.search = ''
      this.genus_search = ''
      this.subgenus_search = ''
      this.subgenuses = []
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (files.length != 1) {
        console.log("Did not receive single file");
        return;
      }
      this.readFile(files[0]);
    },
    readFile(file) {
      let reader = new FileReader();
      reader.onload = e => {
        // console.log(e.target.result);
        try {
          this.json = JSON.parse(e.target.result);
        } catch (e) {
          alert(e);
        }
      };
      reader.readAsText(file);
    }
  },
  computed: {
    subgenuses_for_genus() {
      var genus_search_lowercase = this.genus_search.toLowerCase()
      var valid_rows = this.results
        .filter(items => genus_search_lowercase.includes(items.genus.toLowerCase()))

      this.subgenuses = new Set()
      for (var row of valid_rows) {
        this.subgenuses.add(row.subgenus)
      }

      return this.subgenuses
    },
    class_sorted() {
      return this.sort_order > 0 ? "fas fa-sort-up" : "fas fa-sort-down";
    },
    sorted_results() {
      this.shown_results = this.results;

      // Genus Filtering
      const genus_filter = this.genus_search.toLowerCase()
      
      this.shown_results = this.shown_results.filter(
        row => {
          const genus = row.genus.toLowerCase()
          return genus.includes(genus_filter)
        }
      )

      // Subgenus Filtering
      const subgenus_filter = this.subgenus_search.toLowerCase()
      
      this.shown_results = this.shown_results.filter(
        row => {
          const subgenus = row.subgenus.toLowerCase()
          return subgenus.includes(subgenus_filter)
        }
      )

      // Search Bar Filtering
      const search_term = this.search.toLowerCase();
      this.shown_results = this.shown_results.filter(
        row => {
          const genus = row.genus.toLowerCase();
          const sample = row.sample.toLowerCase();
          const subgenus = row.subgenus.toLowerCase();
          return genus.includes(search_term) || sample.includes(search_term) || subgenus.includes(search_term)
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
    }
  }
}
</script>

<style scoped>
div.search-wrapper {
  border: 1pt solid #ddd;
  margin: 1em 0 1em 0;
  border-radius: 1em;
  overflow: visible;
  width:fit-content;
  height:fit-content;
  padding: 1em;
  /* box-shadow: 0px 0px 10px 5px #ddd; */
  box-shadow: 0 6px 20px -5px rgba(0, 0, 0, 0.3), 0 0 1px 1px rgba(0, 0, 0, 0.05);
  display: flex;
  column-gap: 0.5em;
  justify-content: space-between;
  width: auto;
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
.button {
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
.button:hover {
  background-color: #d1d1d1;
  border-color: #555555;
}
.button-green {
  color: #fff;
  background-color: #04AA6D;
  border-color: #04AA6D;
}
.button-green:hover {
  color: #fff;
  background-color: #157347;
  border-color: #146c43;
}

.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltip-text {
  visibility: hidden;
  background-color: #333;
  color: #fff;
  text-align: center;
  vertical-align: middle;
  border-radius: 0.3em;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;
  top: 125%;
  left: 50%;
  margin-left: -50%;
  padding: 0.3em 0.5em;

  /* Fade in tooltip */
  opacity: 0;
  transition: opacity 0.3s;
}

/* Tooltip arrow */
.tooltip .tooltip-text::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent #333 transparent;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>