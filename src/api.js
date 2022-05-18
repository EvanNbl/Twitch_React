import axios from "axios";

let api = axios.create({
    headers: {
        'Client-ID' : '74qaw8pwhr9h192ofczb5xpbujspkh',
        "Authorization": "Bearer eetj3chta29p2ivrlagg40ebd4aaah"
    }
})

export default api;