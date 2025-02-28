import React, {useEffect, useState} from "react";
import api from "../../api";
import {Link} from "react-router-dom";

function Sidebar(){

    const [topStreams, setTopStreams] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get('https://api.twitch.tv/helix/streams');
            let dataArray = result.data.data;

            let gameIDs = dataArray.map(stream => {
                return stream.game_id;
            })
            let userIDs = dataArray.map(stream => {
                return stream.user_id;
            })

            let baseUrlUsers = 'https://api.twitch.tv/helix/users?';
            let baseUrlGames = 'https://api.twitch.tv/helix/games?';

            let queryParamsGames = "";
            let queryParamsUsers = "";

            gameIDs.map(id => {
                return (queryParamsGames = queryParamsGames + `id=${id}&`)
            })
            userIDs.map(id => {
                return (queryParamsUsers = queryParamsUsers + `id=${id}&`)
            })

            let urlFinalGames = baseUrlGames + queryParamsGames;
            let urlFinalUsers = baseUrlUsers + queryParamsUsers;

            let gamesNames = await api.get(urlFinalGames);
            let usersNames = await api.get(urlFinalUsers);

            let gamesNamesArray = gamesNames.data.data;
            let arrayUsers = usersNames.data.data;

            let finalArray = dataArray.map(stream => {
                stream.gamesNames = "";
                stream.truePic = "";
                stream.login = "";

                gamesNamesArray.forEach(name => {
                    arrayUsers.forEach(user => {
                        if(stream.user_id === user.id && stream.game_id === name.id){
                            stream.truePic = user.profile_image_url;
                            stream.gamesNames = name.name;
                            stream.login = user.login;
                        }
                    })
                })
                return stream;
            })
            setTopStreams(finalArray.slice(0,6));
        }

        fetchData();
    }, [])

    // console.log(topStreams);

    return(
        <div className="sidebar">
            <h2 className="titreSidebar">Chaînes recommandées</h2>
            <ul className="listStream">
                {topStreams.map((stream,index) => (
                <Link className="lien" to={{pathname: `/live/${stream.login}`}}>
                    <li key={index} className="containerFlexSidebar">
                        <img src={stream.truePic} alt="logo user" className="profilePicRonde" />

                        <div className="streamUser">{stream.user_name}</div>

                        <div className="viewerRight">
                            <div className="pointRouge"></div>
                            <div>{stream.viewer_count}</div>
                        </div>
                        <div className="gameNameSidebar">{stream.game_name}</div>
                    </li>
                </Link>
                ))}
            </ul>
            
        </div>
    )
}

export default Sidebar