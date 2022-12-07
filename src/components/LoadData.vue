<template>
    <div id="options">
        <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name"/>
        </div>
        <div class="form-group">
            <label for="tx-power">Tx-power</label>
            <input type="text" class="form-control" id="tx-power"/>
        </div>
        <div class="form-group">
            <label for="time">Time</label>
            <input type="text" class="form-control" id="time"/>
        </div>
        <div class="form-group">
            <label for="lan">latitude</label>
            <input type="text" class="form-control" id="lan"/>
        </div>
        <div class="form-group">
            <label for="lon">longitude</label>
            <input type="text" class="form-control" id="lon" />
        </div>
        <div class="form-group">
            <label for="he">Altitude</label>
            <input type="text" class="form-control" id="he"/>
        </div>
        <div class="form-group">
            <label for="data">Data</label>
            <input type="text" class="form-control" id="data"/>
        </div>
        <div class="form-group">
            <label for="int">Interval</label>
            <input type="text" class="form-control" id="int"/>
        </div>
        <div class="form-group">
            <label for="len">Length</label>
            <input type="text" class="form-control" id="len"/>
        </div>
        <div class="form-group">
            <label for="dest">Destination</label>
            <input type="text" class="form-control" id="dest"/>
        </div>
        <div class = "center">
            <button class="teal" @click="Clicked">Add</button>
            <button class="teal" @click="DeleteAll">Delete All</button>
            <button class="teal" @click="StartSim">Load</button>
    </div>
    </div>
    
    
</template>

<script>

import axios from 'axios'

export default{
    name: 'LoadData',
    methods:{
        Clicked: async function addDevice(){
            axios({
                method: 'post',
                url: 'http://127.0.0.1:5000/api/devices',
                data: {
                    name: document.querySelector('#name').value,
                    tx_power:document.querySelector('#tx-power').value,
                    path: [
                        {
                            time: document.querySelector('#time').value,
                            lat: document.querySelector('#lan').value,
                            lon: document.querySelector('#lon').value,
                            alt: document.querySelector('#he').value
                        }
                    ],
                    transmissions:[
                        {
                            data: document.querySelector('#data').value,
                            interval: document.querySelector('#int').value,
                            length: document.querySelector('#len').value,
                            destination: document.querySelector('#dest').value
                        }
                    ]

                }
            });
            console.log("added")

            document.querySelector('#name').value ='';
            document.querySelector('#tx-power').value ='';
            document.querySelector('#time').value ='';
            document.querySelector('#lan').value ='';
            document.querySelector('#lon').value ='';
            document.querySelector('#he').value ='';
            document.querySelector('#data').value ='';
            document.querySelector('#int').value ='';
            document.querySelector('#len').value ='';
            document.querySelector('#dest').value ='';
        },

        async DeleteAll(){
            await axios.delete("http://127.0.0.1:5000/api/devices")
            .then(() => {
                console.log("deleted")
            });

        },

        StartSim: async function(){
            await axios.put("http://127.0.0.1:5000/api/simulation")
        }


    }
}
/*
async function addDevice(id,name,param1,param2,latitude,longitude,height){
    axios({
        method: 'post',
        url: '/api/devices',
        data: {
            id: id,
            name: name,
            radio_params: {
                param1: param1,
                param2: param2
            },
            path: [
                {
                    latitude: latitude,
                    longitude: longitude,
                    height: height
                }
            ]
        }
    });
}

async function setDevice(device_id,latitude,longitude,height){
    axios({
        method: 'put',
        url:'/api//devices/'+ device_id + '/device-path',
        data: {
            path: [
                {
                    latitude: latitude,
                    longitude: longitude,
                    height: height
                }
            ]
        }
    });
}
*/

</script>

<style lang="scss">
.form-group{
    padding: 5px;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

#options{
    height: 85vh;
    overflow-y: scroll;
}
</style>