<template>
    <h1>{{ time }}</h1>
     <div id="map"></div>
     <div id = "Stats">
        <h1>Stats</h1>
        <table class="tab">
            <tr>name, lost (tx), delivered (tx), source</tr>
            <tr :key = "index" v-for="(dev,index) in stats">{{dev}}</tr>
        </table>
     </div>
</template>

<script>

import * as L from 'leaflet'



export default{
    name: "DevMap",
    props:{
        devs: Array,
        time: Number,
        packets: Array,
        pause: Boolean,

    },
    data: function () {
        return {
            key:0,
            tab:[],
            timeold:0,
            stats:[]
        };
    },
    
    methods:{
        
        show_nodes(map){
            if(this.$props.pause) return

            if(this.$props.devs.length == 0){
                console.warn("Nie udało się załadować danych z devs w DevMap - spróbuj ponownie")
            }
            //var markers = L.markerClusterGroup();

            
            var markers = [];
            for (let index = 0; index < this.$props.devs.length; index++) {
                
                var marker = L.marker([this.$props.devs[index].lat,this.devs[index].lon])
                marker.bindPopup(this.$props.devs[index].name + `<p>Wysokość:</p>` + this.$props.devs[index].alt).openPopup();
                 
                
                
                //markers.addLayer(marker);
                markers.push(marker);
                //marker.addTo(map);
                
            }
           //markers.addTo(map);
           //map.addLayer(markers)
            var markerLayer = L.layerGroup(markers);
            markerLayer.addTo(map)

            
            setInterval(()=>{this.clearMap(map,markers);},200)


            
        },
        show_nodes2(map){
            if(this.$props.pause) return
            if(this.$props.devs.length == 0){
                console.warn("Nie udało się załadować danych z devs w DevMap - spróbuj ponownie")
            }
            //var markers = L.markerClusterGroup();

            var packages = []
            
            for(let index = 0; index < this.$props.packets.length; index++){
                if(this.$props.packets[index].destination == undefined){
                    packages.push(this.$props.packets[index].source)
                }
            }

            var greenIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            
            var markers = [];
            for (let index = 0; index < this.$props.devs.length; index++) {
                
                for(var k = 0; k< packages.length;k++)
                {
                    if(this.$props.devs[index].name == packages[k]){
                        var marker = L.marker([this.$props.devs[index].lat,this.devs[index].lon], {icon: greenIcon})
                        marker.bindPopup(this.$props.devs[index].name + `<p>Wysokość:</p>` + this.$props.devs[index].alt).openPopup();
                        markers.push(marker);
                    }
                }
                
                //markers.addLayer(marker);
                
                //marker.addTo(map);
                
            }

            var markerLayer = L.layerGroup(markers);
            markerLayer.addTo(map)

            
            setInterval(()=>{this.clearMap(map,markers);},200)
        },
        
        show_paths(map){
            if(this.$props.pause) return
            if(this.$props.devs.length == 0){
                console.warn("Nie udało się załadować danych z devs w DevMap - spróbuj ponownie")
            }
            if(this.$props.packets.length == 0){
                console.warn("Nie udało się załadować danych z packets w DevMap - spróbuj ponownie")
            }
            /*
            for(let index = 0; index < this.$props.devs.length; index++){
                for(let j = 0; j < this.$props.devs[index].paths.length; j++){
                    var latlngs = []
                    latlngs.push([this.$props.devs[index].latitude,this.$props.devs[index].longitude])
                    latlngs.push([this.$props.devs[index].paths[j].latitude,this.$props.devs[index].paths[j].longitude])
                    var line = L.polyline(latlngs, {color: 'red'});
                    line.addTo(map)
                }
            }*/

            var packages = []
            
            for(let index = 0; index < this.$props.packets.length; index++){
                if(this.$props.packets[index].destination != undefined){
                    if(this.$props.packets[index].lost){
                        packages.push([this.$props.packets[index].rx,this.$props.packets[index].tx,{color: 'red'},this.$props.packets[index].duration])
                    }else
                        packages.push([this.$props.packets[index].rx,this.$props.packets[index].tx,{color: 'green'},this.$props.packets[index].duration])
                }
            }
            var places = [];
            for(let i = 0; i<this.$props.devs.length; i++){
                places.push([this.$props.devs[i].name,this.$props.devs[i].lat,this.$props.devs[i].lon])
            }
            var cords = []
            for(let i = 0; i<packages.length;i++){
                var line=[]
                for(let j = 0; j<packages[i].length;j++){
                    
                    for(let k = 0;k<places.length;k++){
                        if(packages[i][j] == 'alfa'){
                            console.log("!!!!!!!!!",packages[i][j])
                        }

                        
                        if (places[k][0] == packages[i][j]){
                            try{
                                line.push([places[k][1],places[k][2],packages[i][2],packages[i][3]])
                            }catch{
                                console.log("weird bug with packages[i][3]",i)
                                console.log(packages)
                            }
                            
                    }
                    
                }
                
                if(line.length>1){
                    this.tab.push([[[line[0][0],line[0][1]],[line[1][0],line[1][1]]],line[0][2],line[0][3]])
                    //cords.push(L.polyline([[line[0][0],line[0][1]],[line[1][0],line[1][1]]],line[0][2]))
                }
            }}

            for (var i = 0;i< this.tab.length;i++){
                if(this.tab[i][2]>0){
                    cords.push(L.polyline(this.tab[i][0],this.tab[i][1]))
                }
                
                this.tab[i][2] = this.tab[i][2]-(this.$props.time - this.timeold)
                
            }
            //var polylines = L.polyline(cords);

            var markerLayer = L.layerGroup(cords);
            markerLayer.addTo(map)

            //cords.addTo(map)

            //var latlngs = [];
            /*
            if(packages == [])return;
            for(let index = 0; index < this.$props.devs.length; index++){
                for(let j = 0; j<packages.length; index++){
                    for(let k = 0; k<packages[j].length; k++){
                        if(this.$props.devs[index].name == packages[j][k]){
                            latlngs.push([this.$props.devs[index].lat,this.$props.devs[index].lon])
                            console.log([this.$props.devs[index].lat,this.$props.devs[index].lon])
                        }
                        console.log(this.$props.devs[index])
                    }
                }
            }*/
            this.timeold = this.$props.time

            //stats
            //[name,lost (tx),notlost (tx),sourceonly]

            for(let index = 0; index < this.$props.devs.length; index++){
                if(this.stats.length>=this.$props.devs.length)
                    continue
                this.stats.push([this.$props.devs[index].name,0,0,0])
            }

            for(let index = 0; index < this.$props.packets.length; index++){
                if(this.$props.packets[index].destination != undefined){
                    if(this.$props.packets[index].lost){
                        for (let j = 0; j < this.stats.length; j++) {
                            if(this.$props.packets[index].tx == this.stats[j][0]){
                                this.stats[j][1] =  parseInt(1 + parseInt(this.stats[j][1]))
                            }
                                
                        }
                        }else{
                            for (let j = 0; j < this.stats.length; j++) {
                            if(this.$props.packets[index].tx == this.stats[j][0])
                                this.stats[j][2] = parseInt(1 + parseInt(this.stats[j][2]))
                            }
                        }
                        
                }
                else{
                    for (let j = 0; j < this.stats.length; j++) {
                            if(this.$props.packets[index].source == this.stats[j][0])
                                this.stats[j][3] = parseInt(1 + parseInt(this.stats[j][3])) 
                    }
                }
            }

            setInterval(()=>{this.clearMap(map,cords);},200)
                       
        },
        clearMap(map,markers){/*
            map.eachLayer(function(layer) {
                if (!(layer instanceof L.tileLayer)){
                    console.log(layer);
                }
                
            })*/

            if(this.$props.pause) return

            markers.forEach(function(marker) {
                map.removeLayer(marker)
    
            })

        },
        
        createMap(){
            var map = L.map('map').setView([50.068963, 19.907302], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            
            
            setInterval(()=>{this.show_nodes(map);},200);
            setInterval(()=>{this.show_nodes2(map)},200);
            setInterval(()=>{this.show_paths(map);},200);
            
            
        },

        forceRerender() {
      this.key += 1;
      console.log(this.key);
    }

        
    },
    mounted:function(){
        
        
        this.createMap();
/*
        setInterval( ()=>{
        this.forceRerender();
      },3000);*/
    },
    
}

</script>

<style lang = "scss" scoped>
#map{
    height: 90vh;
}
</style>

