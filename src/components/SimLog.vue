<template>
<h1 class="text-center">Logs</h1>
<ul id="log-text"></ul>
</template>

<script>

export default{
    name: 'SimLog',
    props:{
        packets:Array,
        pause: Boolean
    },
    methods:{
        appendLogs(){
            if(this.$props.pause) return
            if(this.$props.packets.length == 0) return
            
            
            const logs = document.querySelector('#log-text');
            const log = document.createElement('li');


            var htmls = []
        
            for(var index = 0; index<this.$props.packets.length;index++){

            if(this.$props.packets[index].destination == undefined){
                var part = `
                <p>
                source: ${this.$props.packets[index].source}</p>
                `
                htmls.push(part)
            }else{
                var partt = `
                <p>
                destination: ${this.$props.packets[index].destination},
                duration: ${this.$props.packets[index].duration},
                lost: ${this.$props.packets[index].lost},
                payload: ${this.$props.packets[index].payload},
                rssi: ${this.$props.packets[index].rssi},
                snr: ${this.$props.packets[index].snr},
                tx: ${this.$props.packets[index].tx} ,
                rx: ${this.$props.packets[index].rx}</p>
                `
                htmls.push(partt)}

            }

            log.innerHTML = htmls
            logs.appendChild(log)

        }

    },
    mounted:function(){
        
        setInterval(()=>{this.appendLogs();},200);
        
    }

    
}

</script>

<style lang="scss">

ul{
    height: 75vh;
    overflow-y: scroll;
}

</style>