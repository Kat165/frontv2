<template>
    <div id="map" ></div>
</template>

<script>
import L from 'leaflet'
import axios from 'axios'

export default{
    name: "StartMap",
    data: function () {
        return {
            devs: [],
        };
    },
    methods:{

        show_nodes(map){
            if(this.devs.length == 0){
                return
            }
            //var markers = L.markerClusterGroup();
            
            var markers = [];
            for (let index = 0; index < this.devs.length; index++) {
                var icon = new L.Icon.Default();
                icon.options.shadowSize = [0,0];
                var marker = L.marker([this.devs[index].path[0].lat,this.devs[index].path[0].lon], {icon : icon});
                marker.bindPopup(this.devs[index].name + '<br>' + 
                    this.devs[index].path[0].lat + '<br>' + 
                    this.devs[index].path[0].lon + '<br>' + 
                    this.devs[index].path[0].alt).openPopup();
                //markers.addLayer(marker);
                markers.push(marker);
                //marker.addTo(map);
                
            }
           //markers.addTo(map);
           //map.addLayer(markers)
            var markerLayer = L.layerGroup(markers);
            markerLayer.addTo(map)

            setInterval(()=>{this.clearMap(map,markers);},2000)


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

            
            setInterval(()=>{ this.show_nodes(map);},2000)

            function onMapClick(e) {
                var popup = L.popup();
                console.log(e.latlng);
                popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(map);
            }           
           
            map.on('click',onMapClick)
            
        },

        

        async getDevs(){
            await axios.get("http://127.0.0.1:5000/api/devices",{
                headers:{
                    'Accept': 'application/json'
                }
            })
            .then((r) => {
                this.devs = r.data;
            });
            
        },




    },
    mounted:function(){

        setInterval(()=>{this.getDevs();},2000)
        this.createMap();


    }
}



</script>

<style lang="scss">
#map{
    height: 95vh;
}
</style>