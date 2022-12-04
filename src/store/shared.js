import {ref} from 'vue'

export const shared = ref({
    lat: 0,
    lng: 0,
    setLatLng(lat,lon){
        this.lat = lat,
        this.lng = lon
    }
})