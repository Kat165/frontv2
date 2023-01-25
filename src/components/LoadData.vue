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
            <label for="lan">Latitude</label>
            <input type="text" class="form-control" id="lan"/>
        </div>
        <div class="form-group">
            <label for="lon">Longitude</label>
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
        </div>
        <div class="form-group">
            <label for="time_of_sim">Simulaton time (ms)</label>
            <input type="text" class="form-control" id="time_of_sim"/>
        </div>
        <div class="form-group">
            <label for="sf">Spreading factor</label>
            <input type="text" class="form-control" id="sf"/>
        </div>
        <div class="form-group">
            <label for="bandwidth">Bandwidth</label>
            <input type="text" class="form-control" id="bandwidth"/>
        </div>
        <div class="form-group">
            <label for="phy">Phy header length</label>
            <input type="text" class="form-control" id="phy"/>
        </div>
        <div class = "center">
            <button class="teal" @click="ClickedParams">Change simulation params</button>
            <button class="teal" @click="StartSim">Load</button>
        </div>
    </div>
    
    
</template>

<script>

import axios from 'axios'

export default{
    name: 'LoadData',
    data: function () {
        return {
            devs: [],
            names:[]
        };
    },
    methods:{
        Clicked: async function addDevice(){

            let _data = document.querySelector('#data').value;
            let _int = document.querySelector('#int').value;
            let _len = document.querySelector('#len').value;
            let _dest = document.querySelector('#dest').value;
            let _name = document.querySelector('#name').value;
            let _tx_power = document.querySelector('#tx-power').value;
            let _time = document.querySelector('#time').value;
            let _lat = document.querySelector('#lan').value;
            let _lon = document.querySelector('#lon').value;
            let _alt = document.querySelector('#he').value;

            let _time_table = _time.split(',');
            let _lat_table = _lat.split(',');
            let _lon_table = _lon.split(',');
            let _alt_table = _alt.split(',');
            let json_path_table = [];

            if(_time_table.length != _lat_table.length || _lat_table.length != _lon_table.length || _alt_table.length!= _lon_table.length){
                alert("Wrong data format in time, latitude, longitude and altitude")
                return
            }
            for (let i = 0; i < _time_table.length; i++) {
                let small_tab = {}
                small_tab["time"] = _time_table[i]
                small_tab["lat"] = _lat_table[i]
                small_tab["lon"] = _lon_table[i]
                small_tab["alt"] = _alt_table[i]
                json_path_table.push(small_tab)
                
            }
            console.log(json_path_table)

            
            
            await this.getDevs();
            this.devs.forEach(dev => {
                this.names.push(dev.name)
            });
            if(_name == '' || _tx_power == '' || _time == '' || _lat == '' || _lon == '' || _alt == ''){
                alert("name, tx_power, time, latitude, longitude and altitude can't be empty!!!");
                return
            }
            let t = 0;

            this.names.forEach(name => {
                if(_name == name){
                    alert("this name is taken, pick another!!!")
                    t = 1
                    return
                }
                
            });
            if(t)
                return
            
            if(_data == ''){
                axios({
                method: 'post',
                url: 'http://127.0.0.1:5000/api/devices',
                data: {
                    name: _name,
                    tx_power: _tx_power,
                    path: json_path_table,
                    transmissions:[ ]

                }
            });
            }else{
                axios({
                method: 'post',
                url: 'http://127.0.0.1:5000/api/devices',
                data: {
                    name: _name,
                    tx_power:_tx_power,
                    path: json_path_table,
                    transmissions:[
                        {
                            data: _data,
                            interval: _int,
                            length: _len,
                            destination: _dest
                        }
                    ]

                }
            });
            }
                
            
            console.log("added")
/*
            document.querySelector('#name').value ='';
            document.querySelector('#tx-power').value ='';
            document.querySelector('#time').value ='';
            document.querySelector('#lan').value ='';
            document.querySelector('#lon').value ='';
            document.querySelector('#he').value ='';
            document.querySelector('#data').value ='';
            document.querySelector('#int').value ='';
            document.querySelector('#len').value ='';
            document.querySelector('#dest').value ='';*/
        },

         convertToJSON(array) {/*
            var objArray = [];
            for (var i = 1; i < array.length; i++) {
                objArray[i - 1] = {};
                for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                    var key = array[0][k];
                    objArray[i - 1][key] = array[i][k]
                }
            }*/
            var objArray = [];
            for (var i = 0; i < array.length; i++) {
                objArray[i] = {};
                for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                    var key = array[0][k];
                    objArray[i - 1][key] = array[i][k]

                }
            }
            return objArray;
        },

        async DeleteAll(){
            await axios.delete("http://127.0.0.1:5000/api/devices")
            .then(() => {
                console.log("deleted")
            });

        },

        StartSim: async function(){
            await axios.put("http://127.0.0.1:5000/api/simulation")
        },

        async ClickedParams(){
            let _st = document.querySelector('#time_of_sim').value
            let _sf = document.querySelector('#sf').value;
            let _b = document.querySelector('#bandwidth').value;
            let _phy = document.querySelector('#phy').value;

            if(_sf == '' || _b == '' || _phy == '' || _st == '')
            {
                alert("Spreading factor, Bandwidth or Phy header length can't be empty!!!");
                return
            }

            axios({
                method:'post',
                url:'http://127.0.0.1:5000/api/simulation/params',
                data: {
                    simulation_time: _st,
                    spreading_factor: _sf,
                    bandwidth: _b,
                    phy_header_length:_phy

                }
            })
            console.log("params changed")

        },

        async getDevs(){
            await axios.get("http://127.0.0.1:5000/api/devices",{
                headers:{
                    'Accept': 'application/json'
                }
            })
            .then((r) => {
                this.devs = r.data;
                console.log(this.devs)
            });
            
        },


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
    height: 90vh;
    overflow-y: scroll;
}

.teal{
    background-color: lightgray;
    border-radius: 4px;
}

.teal:hover{
    background-color: grey;
}

</style>