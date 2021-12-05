<template>
  <div>
    <Summary
      :name="json.name + ', ' + json.description"
      :results="json.results"
      :sequence="json.sequence"
      :summarydata="summary_data"
      :idxShown="idxShown"
      :is_corsid_a="json.is_corsid_a"
      :leader_end="json.ORF1ab[0]"
      @load-data="load_data($event)"
      @add-solution="add_solution($event)"
      @show-as-compare="show_as_compare($event)"
      @add-idx-shown="add_idx_shown"
      @sub-idx-shown="sub_idx_shown"
      @jumpto="jumpto"
      @show="show_brush_selected_record"
      ref="Summary"
    />

    <Comparison v-if="staticIdx > -1"
    :key="json.results[staticIdx]"
    :res="[staticIdx, json.results[staticIdx]]"
    :name="json.name"
    :header="header"
    :reverse_bodys="reverse_bodys[staticIdx]"
    :intervals="intervals[staticIdx]"
    :sequences="sequences[staticIdx]"
    :box="boxes[staticIdx]"
    @remove-comparison="remove_comparison()"
    />

    <Solution
      v-for="(res, index) in solutions_shown"
      :key="index"
      :res="res"
      :name="json.name"
      :header="header"
      :reverse_bodys="reverse_bodys[res[0]]"
      :intervals="intervals[res[0]]"
      :sequences="sequences[res[0]]"
      :box="boxes[res[0]]"
      :full_sequence="json.sequence"
      @write-to-json="write_to_json($event)"
      @remove-solution="remove_solution($event)"
      @move-up="move_up($event)"
      @move-down="move_down($event)"
    />
  </div>
</template>

<script>
import Summary from './Summary.vue'
import Solution from './Solution.vue'
import Comparison from './Comparison.vue'

export default {
  name: 'Viz',
  data: () => ({
    idxShown: 0,
    staticIdx: 0,
    header: ["ORF", "Score", "Core start", "Core end", "Core len", "ORF start", "ORF end", "ORF len"],
    json: {
        "results": [
          {
            "leader_core_start": 70,
            "leader_core_len": 7,
            "leader_core_seq": "CGAACTT",
            "TRS_L_start": 64,
            "TRS_L_len": 19,
            "body_range_start": 21352,
            "body_range_len": 8551,
            "n_intervals": 7,
            "weight": 7518.064,
            "compact": 0.11998596655361946,
            "bodys": [
                {
                    "ORF": "N",
                    "interval_start": 28273,
                    "interval_len": 1258,
                    "weight": 1257.007,
                    "core_start": 28254,
                    "core_len": 13,
                    "leader_start": 64,
                    "leader_end": 76,
                    "ORF_start": 28273,
                    "ORF_len": 1257,
                    "score": 7,
                    "index": 29,
                    "align": "TCTAAACGAACAA------"
                },
                {
                    "ORF": "8",
                    "interval_start": 27893,
                    "interval_len": 364,
                    "weight": 363.01,
                    "core_start": 27883,
                    "core_len": 16,
                    "leader_start": 65,
                    "leader_end": 80,
                    "ORF_start": 27893,
                    "ORF_len": 363,
                    "score": 10,
                    "index": 25,
                    "align": "-CTAAACGAACATGAAA--"
                },
                {
                    "ORF": "7a",
                    "interval_start": 27393,
                    "interval_len": 364,
                    "weight": 363.011,
                    "core_start": 27384,
                    "core_len": 17,
                    "leader_start": 66,
                    "leader_end": 82,
                    "ORF_start": 27393,
                    "ORF_len": 363,
                    "score": 11,
                    "index": 17,
                    "align": "--TAAACGAACATGAAAAT"
                },
                {
                    "ORF": "M",
                    "interval_start": 26522,
                    "interval_len": 667,
                    "weight": 666.01,
                    "core_start": 26467,
                    "core_len": 13,
                    "leader_start": 64,
                    "leader_end": 76,
                    "ORF_start": 26522,
                    "ORF_len": 666,
                    "score": 10,
                    "index": 5,
                    "align": "TCTAAACGAACTA------"
                },
                {
                    "ORF": "E",
                    "interval_start": 26244,
                    "interval_len": 226,
                    "weight": 225.008,
                    "core_start": 26236,
                    "core_len": 8,
                    "leader_start": 69,
                    "leader_end": 76,
                    "ORF_start": 26244,
                    "ORF_len": 225,
                    "score": 8,
                    "index": 4,
                    "align": "-----ACGAACTT------"
                },
                {
                    "ORF": "3a",
                    "interval_start": 25392,
                    "interval_len": 826,
                    "weight": 825.011,
                    "core_start": 25381,
                    "core_len": 11,
                    "leader_start": 66,
                    "leader_end": 76,
                    "ORF_start": 25392,
                    "ORF_len": 825,
                    "score": 11,
                    "index": 1,
                    "align": "--TAAACGAACTT------"
                },
                {
                    "ORF": "S",
                    "interval_start": 21562,
                    "interval_len": 3820,
                    "weight": 3819.007,
                    "core_start": 21551,
                    "core_len": 13,
                    "leader_start": 65,
                    "leader_end": 77,
                    "ORF_start": 21562,
                    "ORF_len": 3819,
                    "score": 7,
                    "index": 0,
                    "align": "-CTAAACGAACAAT-----"
                }
            ],
            "total_ORF": [
                "8",
                "7a",
                "7b",
                "M",
                "3a",
                "10",
                "N",
                "E",
                "S",
                "6"
            ],
            "recall_ORF": [
                "8",
                "7a",
                "M",
                "3a",
                "N",
                "E",
                "S"
            ],
            "missing_ORF": [
                "10",
                "7b",
                "6"
            ],
            "TRS_L_seq": "TCTAAACGAACTTTAAAAT"
        },
        {
            "leader_core_start": 69,
            "leader_core_len": 7,
            "leader_core_seq": "ACGAACT",
            "TRS_L_start": 64,
            "TRS_L_len": 19,
            "body_range_start": 21352,
            "body_range_len": 8551,
            "n_intervals": 7,
            "weight": 7518.069,
            "compact": 0.11998596655361946,
            "bodys": [
                {
                    "ORF": "N",
                    "interval_start": 28273,
                    "interval_len": 1258,
                    "weight": 1257.009,
                    "core_start": 28254,
                    "core_len": 12,
                    "leader_start": 64,
                    "leader_end": 75,
                    "ORF_start": 28273,
                    "ORF_len": 1257,
                    "score": 9,
                    "index": 34,
                    "align": "TCTAAACGAACA-------"
                },
                {
                    "ORF": "8",
                    "interval_start": 27893,
                    "interval_len": 364,
                    "weight": 363.01,
                    "core_start": 27883,
                    "core_len": 16,
                    "leader_start": 65,
                    "leader_end": 80,
                    "ORF_start": 27893,
                    "ORF_len": 363,
                    "score": 10,
                    "index": 30,
                    "align": "-CTAAACGAACATGAAA--"
                },
                {
                    "ORF": "7a",
                    "interval_start": 27393,
                    "interval_len": 364,
                    "weight": 363.011,
                    "core_start": 27384,
                    "core_len": 17,
                    "leader_start": 66,
                    "leader_end": 82,
                    "ORF_start": 27393,
                    "ORF_len": 363,
                    "score": 11,
                    "index": 21,
                    "align": "--TAAACGAACATGAAAAT"
                },
                {
                    "ORF": "M",
                    "interval_start": 26522,
                    "interval_len": 667,
                    "weight": 666.012,
                    "core_start": 26467,
                    "core_len": 12,
                    "leader_start": 64,
                    "leader_end": 75,
                    "ORF_start": 26522,
                    "ORF_len": 666,
                    "score": 12,
                    "index": 8,
                    "align": "TCTAAACGAACT-------"
                },
                {
                    "ORF": "E",
                    "interval_start": 26244,
                    "interval_len": 226,
                    "weight": 225.008,
                    "core_start": 26236,
                    "core_len": 8,
                    "leader_start": 69,
                    "leader_end": 76,
                    "ORF_start": 26244,
                    "ORF_len": 225,
                    "score": 8,
                    "index": 7,
                    "align": "-----ACGAACTT------"
                },
                {
                    "ORF": "3a",
                    "interval_start": 25392,
                    "interval_len": 826,
                    "weight": 825.011,
                    "core_start": 25381,
                    "core_len": 11,
                    "leader_start": 66,
                    "leader_end": 76,
                    "ORF_start": 25392,
                    "ORF_len": 825,
                    "score": 11,
                    "index": 3,
                    "align": "--TAAACGAACTT------"
                },
                {
                    "ORF": "S",
                    "interval_start": 21562,
                    "interval_len": 3820,
                    "weight": 3819.008,
                    "core_start": 21551,
                    "core_len": 11,
                    "leader_start": 65,
                    "leader_end": 75,
                    "ORF_start": 21562,
                    "ORF_len": 3819,
                    "score": 8,
                    "index": 0,
                    "align": "-CTAAACGAACA-------"
                }
            ],
            "total_ORF": [
                "8",
                "7a",
                "7b",
                "M",
                "3a",
                "10",
                "N",
                "E",
                "S",
                "6"
            ],
            "recall_ORF": [
                "8",
                "7a",
                "M",
                "3a",
                "N",
                "E",
                "S"
            ],
            "missing_ORF": [
                "10",
                "7b",
                "6"
            ],
            "TRS_L_seq": "TCTAAACGAACTTTAAAAT"
        }
        ],
        "name": "Upload a JSON file",
        "description": "CORSID Viz",
        "genbank": {},
        "ORF1ab": [],
        "sequence": "ATTAAAGGTTTATACCTTCCCAGGTAACAAACCAACCAACTTTCGATCTCTTGTAGATCTGTTCTCTAAACGAACTTTAAAATCTGTGTGGCTGTCACTCGGCTGCATGCTTAGTGCACTCACGCAGTATAATTAATAACTAATTACTGTCGTTGACAGGACACGAGTAACTCGTCTATCTTCTGCAGGCTGCTTACGGTTTCGTCCGTGTTG"
    },
    solutions_shown: []
  }),
  created() {
    if (this.$route.params["data_url"]){
      console.log(this.$route.params["data_url"]);
      fetch(this.$route.params["data_url"])
        .then(response => response.json())
        .then(data => (this.json = data));
    }
  },
  methods: {
    add_solution(res) {
      // console.log("res index: ", res[0]);
      this.solutions_shown = this.solutions_shown.filter(i => i[0] !== res[0]);
      this.solutions_shown.unshift(res);
      // console.log("solutions_shown array: ", this.solutions_shown)
    },
    write_to_json(index_orfs_tuple) {
      // console.log("changing json data")
      var index_in_json = index_orfs_tuple[0]
      var index_in_rows = index_orfs_tuple[1] // note this is given in reverse order from reverse_bodys
      var row_orf_start = index_orfs_tuple[3]
      var num_rows = this.json.results[index_in_json].bodys.length
      var new_annotation = index_orfs_tuple[2]
      if (index_in_rows > 1) {
        // console.log("orf_start:", row_orf_start)
        for (var i = 0; i < num_rows; i++) {
          // console.log(this.json.results[index_in_json].bodys[i].ORF_start)
          if (row_orf_start == this.json.results[index_in_json].bodys[i].ORF_start) {
            // console.log("Found, previous: ", this.json.results[index_in_json].bodys.ORF)
            // console.log("i: ", i)
            this.json.results[index_in_json].bodys[i].ORF = new_annotation
          }
        }
        // var index_to_change = index_in_rows - 2 // - 2 for extra 1a, 1b rows in Solution cards
        // var new_annotation = index_orfs_tuple[2]
        // this.json.results[index_in_json].bodys[index_in_rows].ORF = new_annotation 
        // console.log("index_to_change: ", index_to_change)
        // console.log("changed ORF rows", this.json.results[index_in_json].bodys[index_in_rows].ORF)
        // console.log("changed ORF to_change", this.json.results[index_in_json].bodys[index_to_change].ORF)
      } 
    },
    show_as_compare(index) {
      // console.log("comparison index: ", index)
      this.staticIdx = index - 1;
    },
    remove_solution(index) {
      this.solutions_shown = this.solutions_shown.filter(i => i[0] != index);
    },
    remove_comparison() {
      this.staticIdx = -1;
    },
    move_down(solution) {
      // only move if index is valid and not the last item
      var index = this.solutions_shown.indexOf(solution)
      
      if (index < this.solutions_shown.length - 1 && index != -1) {
        var temp = this.solutions_shown[index + 1]
        this.solutions_shown[index + 1] = this.solutions_shown[index]
        this.solutions_shown[index] = temp;
      }
    },
    move_up(solution) {
      // only move if index is valid and not the first item
      var index = this.solutions_shown.indexOf(solution)

      if (index > 0 && index != -1) {
        var temp = this.solutions_shown[index];
        this.solutions_shown[index] = this.solutions_shown[index - 1]
        this.solutions_shown[index - 1] = temp;
      };
    },
    load_data(event) {
      const json_file = event.target.files;

      if (json_file.length != 1) {
        console.log("Did not receive single file")
        return false;
      }

      const fr = new FileReader();

      var result = ""
      console.log(this.json['name']);

      fr.onload = function(e) {
        try {
          result = JSON.parse(e.target.result);
          this.solutions_shown = [];
          this.json = result;
          
        } catch (e) {
          alert(e);
        }

        // this.generate_plots();
      }.bind(this);

      fr.readAsText(json_file.item(0));
    },
    add_idx_shown() {
      if (this.idxShown < this.json.results.length-10)
        this.idxShown += 10;
    },
    sub_idx_shown() {
      if (this.idxShown >= 10)
        this.idxShown -= 10;
      else if (this.idxShown < 10 && this.idxShown >= 0)
        this.idxShown = 0;
    },
    jumpto(n) {
      if (isNaN(n)){
          alert("please enter a number");
          return;
      }
      if (n < 1 || n > Math.ceil(this.json.results.length/10)){
          alert("index out of range");
          return;
      }
      this.idxShown = (n-1)*10;
    },
    show_brush_selected_record(n) {
      this.idxShown = n;
    }
  },
  computed: {
    boxes() {
      return Array.from(
        this.json.results,
        ({TRS_L_start, leader_core_start, leader_core_len}) => ({
          "start": leader_core_start - TRS_L_start,
          "len": leader_core_len,
          "TRS_L_start": TRS_L_start + 1
        })
      )
    },
    intervals() {
      return Array.from(this.json.results,
        ({ bodys }) => Array.from(bodys,
          ({ ORF, ORF_start, ORF_len }, i) => ({
            "id": i,
            "name": ORF,
            "start": ORF_start + 1,
            "end": ORF_start + 1 + ORF_len
          })
        ).reverse()
      )
    },
    reverse_bodys() {
      return Array.from(
        this.json.results,
        ({bodys}) => ([
          {
            check: null,
            ORF: "1a",
            score: null,
            core_start: null,
            core_len: null,
            ORF_start: this.json.ORF1ab[0],
            ORF_len: this.json.ORF1ab[1] - this.json.ORF1ab[0],
          },
          {
            check: null,
            ORF: "1b",
            score: null,
            core_start: null,
            core_len: null,
            ORF_start: this.json.ORF1ab[2],
            ORF_len: this.json.ORF1ab[3] - this.json.ORF1ab[2],
          }
        ].concat(bodys.slice().reverse()))
      )
    },
    sequences() {
      return Array.from(
        this.json.results,
        ({ bodys }) => Array.from(
          bodys,
          ({ align }) => align
        )
      )
    },
    summary_data() {
      return Array.from(this.json.results, 
        ({leader_core_seq,leader_core_start,TRS_L_start,TRS_L_len,weight,compact,bodys}, index) => ({
          "idx": index+1,
          "sample": this.json.name,
          "core_seq": leader_core_seq,
          "pos": leader_core_start + 1,
          "trs_l_start": TRS_L_start + 1,
          "trs_l_end": TRS_L_start + TRS_L_len + 1,
          "weight": weight,
          "score": bodys.reduce((a, b) => +a + (+b.score || 0), 0),
          "min_score": bodys.reduce((a, b) => Math.min(a, b.score || Infinity), Infinity),
          "compact": ((1.0-compact)*100)
        })
      )
    },
  },
  components: {
    Summary,
    Solution,
    Comparison
  }
}
</script>

<style scoped>
</style>
