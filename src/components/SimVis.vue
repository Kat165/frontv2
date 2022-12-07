<template>
  <div class="container">
    <div class="row">

      <div class="col-12">
        
        
      </div>
      <!-- /.col-12 -->
      


    </div>
    <!-- /.row -->
    <div class="row">

      <div class="col-8">
        
        <!-- DevList -->
        
        <DevMap v-if="click" :devs="devs" :time = "time" :packets = "packets" :key = "key" :pause = "pause" :isReady="isReady"/>
        <StartMap v-if="!click"/>

      </div>
      <!-- /.col6 -->
      <div class="col-4">
        <div class="center">
          <button class="teal" @click="Clicked" id="startbtn">Start/End</button>
          <button class="teal" @click="Paused" id="pausebtn" v-if="click">Pause</button>
        </div>
        
        
        <LoadData v-if="!click"/>
        <SimLog v-if="click" :packets="packets" :pause="pause" :isReady="isReady"/>
      </div>
      <!-- /.col6 -->
    </div>
    <!-- /.row -->
  </div>
  <!-- /.container -->
</template>

<script>
import axios from 'axios'
import DevMap from './DevMap.vue'
import LoadData from './LoadData.vue'
import SimLog from './SimLog.vue'
import StartMap from './StartMap.vue'

export default {

  name: 'SimVis',
  data: function () {
        return {
            devs: [],
            time: Number,
            packets: [],
            click :false,
            pause : false,
            isReady: false
        };
    },
    mounted:
    function(){
      setInterval(async ()=>{
        if(!this.click) return
        if(this.pause) return

        await axios.get("http://127.0.0.1:5000/api/simulation/is-chunk-ready",{
        headers:{
          'Accept': 'application/json'
        }
      })
            .then((r) => {
            this.isReady = r.data
            if(!this.isReady)console.log("Jeszcze nie gotowe")
        });
        if(!this.isReady) return
        await axios.get("http://127.0.0.1:5000/api/simulation/extract-frame",{
        headers:{
          'Accept': 'application/json'
        }
      })
            .then((r) => {
            this.devs = r.data.devices;
            this.time = r.data.time;
            this.packets = r.data.packets;
        });
      },3000)
    }

    ,
    methods:{
      Clicked:function(){
        if (!this.click) this.click = true;
        else this.click = false;
      },

      Paused:function(){
        if (!this.pause) this.pause = true;
        else this.pause = false;
      }

    },
      
    components: { DevMap, LoadData, SimLog, StartMap }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.row{
  padding-top: 10px;
  display:flex;
  justify-content: center;
  align-items:flex-start;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
