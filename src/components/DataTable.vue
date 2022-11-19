<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-slate-200">
    <radio-form :buttons="['DiseaseType', 'Country', 'Disease', 'Discover', 'Users', 'PublicServant', 'Doctor', 'Specialize', 'Record']" v-model:input_type="type" @click="updateTable"/>
    <div class="block w-full overflow-x-auto">
      <!-- Projects table -->
      <table class="items-center w-full border-collapse">
        <thead>
          <tr class=" align-middle border border-solid text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center text-slate-200 bg-slate-800 border-slate-100" >
            <th class=" px-6 py-3" v-for="(field, idx) in Object.keys(info_empty[type])" :key="idx">
              {{field}}
            </th>
            <th class="px-0 py-3"> </th>
            <th class="px-0 py-3">
              <button v-show="!isNew" class="px-4 rounded bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 uppercase text-slate-200" @click="newRow">
                New
              </button>
              <button v-show="isNew" class="px-4 rounded bg-rose-500 hover:bg-rose-600 active:bg-rose-700 uppercase text-slate-200" @click="(e) => isNew=false">
                Cancel
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-show="isNew" class="text-xs text-center align-middle whitespace-nowrap
                     hover:text-slate-200 hover:bg-slate-800
                     border-t-1 border-solid border-slate-200 border-l-0 border-r-0">

            <td class="py-3 px-6" v-for="(df, fidx) in Object.keys(info_empty[type])" :key="fidx">
              <input :type="typeof info_empty[type][df] === 'number' ? 'number' : 'text'"
                   min="0"
                   :value="this.info_empty[this.type][df]"
                   @input="(event) => this.info_empty[this.type][df] = (typeof info_empty[type][df] === 'number' ? parseInt(event.target.value) : event.target.value)"
                   class="w-full relative border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                   :placeholder="df"/>
            </td>

            <td class="py-3 px-0"><button class="px-4 rounded bg-emerald-500  hover:bg-emerald-600  active:bg-emerald-700  uppercase text-slate-200" @click="createRow"> Create </button> </td>
            <td class="py-3 px-0"><button class="px-4 rounded bg-rose-500 hover:bg-rose-600 active:bg-rose-700 uppercase text-slate-200" @click="clearRow"> Clear </button> </td>
          </tr>
          <tr class="text-xs text-center align-middle whitespace-nowrap
                     hover:text-slate-200 hover:bg-slate-800
                     border-t-1 border-solid border-slate-200 border-l-0 border-r-0"
              v-for="(dr, didx) in infos" :key="didx" :id="'r'+didx">
            <td v-show="toUpdate != didx && df != 'id'" class="py-3 px-6" v-for="(df, fidx) in Object.keys(dr)" :key="fidx">
              {{dr[df]}}
            </td>
            <td v-show="toUpdate == didx && df != 'id'" class="py-3 px-6" v-for="(df, fidx) in Object.keys(dr)" :key="fidx">
              <input :type="typeof dr[df] === 'number' ? 'number' : 'text'"
                      min="0"
                      :value="this.info_empty[this.type][df]"
                      @input="(event) => this.info_empty[this.type][df] = event.target.value"
                      class="w-full relative border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                     :placeholder="df"/>
            </td>
            <td class="py-3 px-0">
              <button v-show="toUpdate != didx" class="px-4 rounded bg-sky-500  hover:bg-sky-600  active:bg-sky-700  uppercase text-slate-200" @click="updateRow">
                Update
              </button>
              <button v-show="toUpdate == didx" class="px-4 rounded bg-sky-500  hover:bg-sky-600  active:bg-sky-700  uppercase text-slate-200" @click="submitRow">
                Submit
              </button>
            </td>
            <td class="py-3 px-0">
              <button v-show="toUpdate != didx" class="px-4 rounded bg-rose-500 hover:bg-rose-600 active:bg-rose-700 uppercase text-slate-200" @click="deleteRow">
                Delete
              </button>
              <button v-show="toUpdate == didx" class="px-4 rounded bg-rose-500 hover:bg-rose-600 active:bg-rose-700 uppercase text-slate-200" @click="cancelRow">
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-show="!infos.length && !isNew" class="rounded-b mb-0 px-4 py-2 border-0">
      <div class="flex flex-nowrap overflow-x-auto border-collapse w-full align-middle whitespace-nowrap items-center">
          <h3 class="font-semibold text-lg text-slate-800">
            Empty
          </h3>
      </div>
    </div>
  </div>
</template>
<script>

import axios from 'axios'
import {server_url} from '@/api.js'
import RadioForm from '@/components/RadioForm.vue'

export default {
  data() {
    return {
      toUpdate: null,
      isNew: false,
      type:'DiseaseType',
      pks: {DiseaseType:'did', Country:'cname', Disease: 'disease_code', Discover: 'id', Users: 'email', PublicServant: 'email', Doctor: 'email', Specialize: 'id', Record: 'id'},
      info_empty:{
        DiseaseType:  {did: 0, description:''},
        Country:      {cname: '', population:0},
        Disease:      {disease_code: '', pathogen:'', description:'', did:0},
        Discover:     {cname: '', disease_code:'', first_enc_date:''},
        Users:        {email: '', name:'', surname:'', salary:0, phone:'', cname:''},
        PublicServant:{email: '', departament:''},
        Doctor:       {email: '', degree:''},
        Specialize:   {did: 0, email:''},
        Record:       {email: '', cname:'', disease_code:'', total_death:0, total_patients:0},
      },
      infos:[],
    }
  },
  methods: {
    deleteRow(e) {
      const nm = e.target.parentNode.parentNode.id.match(/\d+/)
      if (nm) {
        const toDelete = parseInt(nm)
        var info  = this.infos[toDelete]
        var pk = this.pks[this.type]
        var todel = info[pk]
        if (pk == 'id') {
          todel = toDelete+1
        }
        axios
          .delete(server_url+'/api/'+this.type+'/'+ todel + '/')
          .then(() => {
            this.toUpdate = null
            this.infos.splice(toDelete, 1);
            alert("Success")
          })
          .catch(function (error) {
            alert("Could not delete with error: " + error.message)
          })
      }
    },
    submitRow() {
      var upd_info = this.info_empty[this.type]
      var pk       = this.pks[this.type]
      var upd      = upd_info[pk]
      console.log(this.info_empty[this.type])
      console.log("upd: " + upd)
      console.log(upd_info)
      axios
        .put(server_url+'/api/'+this.type+'/'+ upd + '/', upd_info)
        .then((response) => {
          console.log(response.data)
          this.infos[this.toUpdate] = response.data
          this.toUpdate = null
          alert("Success")
        })
        .catch(function (error) {
          alert("Could not update")
          console.log(error)
        })

    },
    cancelRow() {
      this.toUpdate = null
    },
    updateRow(e) {
      this.isNew = false
      const nm = e.target.parentNode.parentNode.id.match(/\d+/)
      if (nm) {
        const at = parseInt(nm)
        this.toUpdate = at;
      } else {
        this.toUpdate =null
      }
      this.info_empty[this.type] = JSON.parse(JSON.stringify(this.infos[this.toUpdate]))
    },
    createRow() {
      //var pk = this.pks[this.type]
      var to_send =  JSON.parse(JSON.stringify(this.info_empty[this.type]))
      /*
      if (pk == 'id') {
        to_send[pk] = ''
      }
      */
      axios
        .post(server_url+'/api/'+this.type+'/', to_send)
        .then((response) => {
          this.isNew = false
          this.infos.push(response.data)
          alert("Success")
        })
        .catch(function (error) {
          alert("Could not create")
          console.log(error)
        })
    },
    clearRow() {
      var info        = this.info_empty[this.type]
      var data_fields = Object.keys(info)
      data_fields.forEach(df => info[df] = typeof info[df] === 'number' ? 0 : '')
    },
    newRow() {
      this.clearRow()
      this.isNew = !this.isNew
      this.toUpdate = null
    },
    updateTable() {
      this.isNew = false
      this.toUpdate = null
      this.infos = []
      axios
        .get(server_url+'/api/'+this.type+'/')
        .then((response) => {
          console.log(response.data)
          this.infos = response.data
        })
        .catch((error) => {
          alert("Could not load data")
          console.log(error)
        })
    }
  },
  components: {
    RadioForm,
  },
  mounted() {
    console.log(this.$route.params.iin)
    axios
      .get(server_url+'/api/'+this.type+'/')
      .then((response) => {
        console.log(response.data)
        this.infos = response.data
      })
      .catch(function (error) {
        alert("Could not load data")
        console.log(error)
      })
  },
};
</script>
