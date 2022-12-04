<template>
<h1 class="text-center">Logi</h1>
<ul id="log-text"></ul>
</template>

<script>

export default{
    name: 'SimLog',
    props:{
        packets:Array
    },
    methods:{
        appendLogs(){
            const logs = document.querySelector('#log-text');
            const log = document.createElement('li');

            var htmls = []
            for(var index = 0; index<this.$props.packets.length;index++){
                var part = `
                <p>calculated_ber: ${this.$props.packets[index].calculated_ber}
                destination: ${this.$props.packets[index].destination}
                duration: ${this.$props.packets[index].duration}
                lost: ${this.$props.packets[index].lost}
                packet_type: ${this.$props.packets[index].packet_type}
                payload: ${this.$props.packets[index].payload}
                rssi: ${this.$props.packets[index].rssi}
                snr: ${this.$props.packets[index].snr}
                source: ${this.$props.packets[index].source} </p>
            `
                htmls.push(part)
            }

            log.innerHTML = htmls
            logs.appendChild(log)
            console.log(this.$props.packets[0])

        }

    },
    mounted:function(){
        setInterval(()=>{this.appendLogs();},3000);
    }

    
}

</script>

<style lang="scss">

ul{
    height: 75vh;
    overflow-y: scroll;
}

</style>