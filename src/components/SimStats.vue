<template>
    <div id = "Stats">
        <h1 class="text-center">Stats</h1>
        <ul class="tab">
            <li>delay: {{ delay_t().toFixed(3) }} </li>
            <!--<tr :key = "index" v-for="(dev,index) in stats">{{dev}}</tr>-->
            <li>delivery ratio: {{ del_t().toFixed(3) }} </li>
            <li>normalized routing load: {{ nor_t().toFixed(3) }}</li>
        </ul>
     </div>
</template>

<script>
export default{
    name: "DevMap",
    props:{
        delay:Number,
        delivery_r:Number,
        normalized_routing_load:Number
    },
    data: function () {
        return {
            stats:[],
        };
    },methods:{
        delay_t(){
            if(this.$props.delay.valueOf().toString() =='function Number() { [native code] }')
                return 0
            else return this.$props.delay
        },
        del_t(){
            if(this.$props.delivery_r.valueOf().toString() =='function Number() { [native code] }')
                return 0
            else return this.$props.delivery_r
        },
        nor_t(){
            if(this.$props.normalized_routing_load.valueOf().toString() =='function Number() { [native code] }')
                return 0
            else return this.$props.normalized_routing_load
        },
    }
}
</script>

<style>

.tab{
    height: 10vh;
    overflow: hidden;
}

</style>