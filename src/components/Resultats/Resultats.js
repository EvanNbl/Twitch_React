import React, {useState, useEffect} from "react";
import api from "../../api";
import {Link, useParams} from "react-router-dom";

function Resultats() {

    let {slug} = useParams();

    const [result, setResult] = useState(true);
    const [streamerInfo, setStreamerInfo] = useState([]);

    let cleanSearch = slug.replace(/ /g, "");

    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get(`https://api.twitch.tv/helix/users?login=${cleanSearch}`);
            console.log(result);
            setStreamerInfo(result.data.data);
        }
        fetchData();
    }, []);

    return (
        <div>
            <br /><br /><br /><br />
            /// EN DEV ///
        </div>
    )
}

export default Resultats;