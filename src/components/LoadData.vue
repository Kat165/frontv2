<template>
    
    <div class="form-group">
        <label for="name">Nazwa</label>
        <input type="text" class="form-control" id="name"/>
    </div>
    <div class="form-group">
        <label for="param1">Param1</label>
        <input type="text" class="form-control" id="param1"/>
    </div>
    <div class="form-group">
        <label for="param2">Param2</label>
        <input type="text" class="form-control" id="param2"/>
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
        <label for="he">Wysokość</label>
        <input type="text" class="form-control" id="he"/>
    </div>
    <div class = "center">
        <button class="teal" @click="Clicked">Add</button>
        <button class="teal" @click="DeleteAll">Delete All</button>
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
                    id:0,
                    name: document.querySelector('#name').value,
                    radio_params: {
                        param1: document.querySelector('#param1').value,
                        param2: document.querySelector('#param2').value
                    },
                    path: [
                        {
                            latitude: document.querySelector('#lan').value,
                            longitude: document.querySelector('#lon').value,
                            height: document.querySelector('#he').value
                        }
                    ]
                }
            });
            console.log("added")

            document.querySelector('#name').value ='';
            document.querySelector('#param1').value ='';
            document.querySelector('#param2').value ='';
            document.querySelector('#lan').value ='';
            document.querySelector('#lon').value ='';
            document.querySelector('#he').value ='';
        },

        async DeleteAll(){
            await axios.delete("http://127.0.0.1:5000/api/devices")
            .then(() => {
                console.log("deleted")
            });

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
</style>