<template>
     <div id="map"></div>
</template>

<script>

import * as L from 'leaflet'



export default{
    name: "DevMap",
    props:{
        devs: Array,
        links: Array,
        packets: Array

    },
    data: function () {
        return {
            key:0,
        };
    },
    
    methods:{
        
        show_nodes(map){

            if(this.$props.devs.length == 0){
                console.warn("Nie udało się załadować danych z devs w DevMap - spróbuj ponownie")
            }
            //var markers = L.markerClusterGroup();
            var markers = [];
            for (let index = 0; index < this.$props.devs.length; index++) {
                var marker = L.marker([this.$props.devs[index].lat,this.devs[index].lon]);
                marker.bindPopup(this.$props.devs[index].name + `<p>Wysokość:</p>` + this.$props.devs[index].alt).openPopup();
                //markers.addLayer(marker);
                markers.push(marker);
                //marker.addTo(map);
                
            }
           //markers.addTo(map);
           //map.addLayer(markers)
            var markerLayer = L.layerGroup(markers);
            markerLayer.addTo(map)

            
            setInterval(()=>{this.clearMap(map,markers);},3000)


            
        },
        show_paths(map){
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
                if(this.$props.packets[index].lost)
                packages.push([this.$props.packets[index].destination,this.$props.packets[index].source,{color: 'red'}])
                else
                packages.push([this.$props.packets[index].destination,this.$props.packets[index].source,{color: 'green'}])

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
                        
                        if (places[k][0] == packages[i][j]){
                            line.push([places[k][1],places[k][2],packages[i][2]])
                    }
                    
                }
                
                if(line.length>1){
                    cords.push(L.polyline([[line[0][0],line[0][1]],[line[1][0],line[1][1]]],line[0][2]))
                }
            }}
            
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
            setInterval(()=>{this.clearMap(map,cords);},3000)
            
            
        },
        clearMap(map,markers){/*
            map.eachLayer(function(layer) {
                if (!(layer instanceof L.tileLayer)){
                    console.log(layer);
                }
                
            })*/

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
            
            
            setInterval(()=>{this.show_nodes(map);},3000);
            setInterval(()=>{this.show_paths(map);},3000);
            
            
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

