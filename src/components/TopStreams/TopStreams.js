import React, {useEffect, useState} from "react";
import api from "../../api";
import {Link} from "react-router-dom";

function TopStreams() {

    const [channels, setChannels] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get('https://api.twitch.tv/helix/streams');
            let dataArray = result.data.data;

            console.log(dataArray);

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
                let newUrl = stream.thumbnail_url.replace("{width}", "320").replace("{height}", "180");
                stream.thumbnail_url = newUrl;
                return stream;
            })
            setChannels(finalArray);
        }

        fetchData();
    }, [])

    return (
        <div>
            <h1 className="titreGames">Stream les plus populaires</h1>
            <div className="flexAccueil">
                {channels.map((channel, index) => (
                    <div key={index} className="carteStream">
                        <img src={channel.thumbnail_url} className="imgCarte" alt="Img jeux" />

                        <div className="cardBodyStream">
                            <h5 className="titreCartesStream">{channel.user_name}</h5>
                            <p className="txtStream">Jeu : {channel.gamesNames}</p>
                            <p className="txtStream viewers">Viewers : {channel.viewer_count}</p>

                            <Link className="link" to={{pathname: `/live/${channel.login}`}}>
                                <div className="btnCarte">Regarder</div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopStreams;