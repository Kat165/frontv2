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
         :delay="delay" :delivery_r="delivery_r" :normalized_routing_load="normalized_routing_load" :interval="interval"/>
        <StartMap v-if="!click"/>

      </div>
      <!-- /.col6 -->
      <div class="col-4">
        <div class="center">
          <button class="teal" @click="Reset" id="resetbtn" v-if="click">Reset</button>
          <button class="teal" @click="Clicked" id="startbtn" v-if = "!click">Start</button>
          <button class="teal" @click="Paused" id="pausebtn" v-if="click">Pause</button>
        </div>
        
        
        <LoadData v-if="!click"/>
        <SimLog v-if="click" :packets="packets" :pause="pause" :time = "time"/>
        <SimStats v-if="click" :delay="delay" :delivery_r="delivery_r" :normalized_routing_load="normalized_routing_load"/>
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
import SimStats from './SimStats.vue'

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
            interval:200,
            status:Number,
            delivery_r:Number,
            delay:Number,
            normalized_routing_load:Number,
            times:[],
            icc:1,
            imm:0

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
                  this.times = []
                  this.status = r.status
                  this.data = r.data
                  this.interval = parseInt(5000/this.data.length) 
                  this.index = 0
                  console.log(this.data.length)
                  for (let i = 0; i < this.data.length -1; i++) {
                    this.times.push((this.data[i+1].time - this.data[i].time))             
                  }
                  this.times.push((this.icc*5000 - this.data[this.data.length -1].time))

                  console.log(this.times)
                  let sum = 0

                  for (let index = 0; index < this.times.length; index++) {
                    sum += this.times[index];
                    
                  }
                  console.log(sum)
                  this.icc++
        });
      },5000),

      setInterval(()=>{
        this.interval = this.times[this.imm]
        this.imm++
        if(this.status!=200)
          return
        if(this.index>=this.data.length)
          return
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
        },this.interval)
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

      Reset:function(){
        if (!this.click) this.click = true;
        else this.click = false;
        this.time = 0;
        this.delay = 0;
        this.delivery_r =0;
        this.normalized_routing_load =0;
        axios.put("http://127.0.0.1:5000/api/simulation/reset");
        window.location.reload();
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
      
    components: { DevMap, LoadData, SimLog, StartMap, SimStats}
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
