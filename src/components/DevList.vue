<template>
  <div class="card dev-list">
        <ul class="list-group list-group-flush">
          <li
            :key="index"
            v-for="(dev,index) in devs"

            class="list-group-item"
            
          >{{(dev.name +" "+ dev.lat + " "+ dev.lon)}}</li>
        </ul>

        
  </div>

</template>

<script>
export default{
  data: function () {
        return {
            key:0,
        };
    },
  name: "DevList",
  props:{
      devs:Array,
  },
  methods:{
    forceRerender() {
      this.key += 1;
      console.log(this.key);
    }
  },

  mounted: function(){
      /*setInterval( ()=>{
        this.forceRerender();
      },3000);*/
    }
}

</script>

<style lang = "scss" scoped>
.dev-list{
  overflow-y: scroll;
  height: 90vh;
  background-color: #212529;

  li{
    background-color: gray;
    color: black;
    &:hover{
      background-color: darkgray;
    }
  }
}
</style>