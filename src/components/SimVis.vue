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
        
        <DevMap v-if="click" :devs="devs" :time = "time" :packets = "packets" :key = "key" :pause = "pause"
         :delay="delay" :delivery_r="delivery_r" :normalized_routing_load="normalized_routing_load"/>
        <StartMap v-if="!click"/>

      </div>
      <!-- /.col6 -->
      <div class="col-4">
        <div class="center">
          <button class="teal" @click="Clicked" id="startbtn">Start/End</button>
          <button class="teal" @click="Paused" id="pausebtn" v-if="click">Pause</button>
        </div>
        
        
        <LoadData v-if="!click"/>
        <SimLog v-if="click" :packets="packets" :pause="pause"/>
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
            data: [],
            devs: [],
            time: Number,
            packets: [],
            click :false,
            pause : false,
            index:0,
            status:Number,
            delivery_r:Number,
            delay:Number,
            normalized_routing_load:Number

        };
    },
    mounted:
    function (){
      setInterval(async ()=>{
        if(!this.click) return
        if(this.pause) return
        await axios.get("http://127.0.0.1:5000/api/simulation/extract-frame",{
        headers:{
          'Accept': 'application/json'
        }
      })
            .then((r) => {
                  this.status = r.status
                  this.data = r.data
                  
                  this.index = 0
                  
            
        });
      },2000),

      setInterval(()=>{
        if(this.status!=200)
          return
        if(this.index>=10)
          this.index = 0
        if(this.data[this.index] == undefined){
          this.packets = []
          return
        }

          
        this.devs = this.data[this.index].devices;
        this.time = this.data[this.index].time;
        this.packets = this.data[this.index].packets;
        this.delay = this.data[this.index].average_delay;
        this.delivery_r = this.data[this.index].delivery_ratio;
        this.normalized_routing_load = this.data[this.index].normalized_routing_load;
        this.data[this.index] = []
        this.index++;
        },200)
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
      },

      setIntervalX(callback, delay, repetitions) {
      var x = 0;
      var intervalID = window.setInterval(function () {

        callback();

        if (++x === repetitions) {
          window.clearInterval(intervalID);
        }
        }, delay);
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
