import React from 'react'
import SearchIcon from '@material-ui/icons/Search';
import styled from "styled-components";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import axiosWithAuth from '../utils/axiosWithAuth';
import axios from "axios"
const CheckBoxDiv = styled.div`
    width:250px;
    height:20px;
    display:flex;
    align-items:flex-start;
    padding-left:35px;
`;
const StyledDiv = styled.div`
    width: 250px;
    height:40px;
    border-radius: 45px;
    background-color: white;
    display:flex;
    align-items:center;
    .SearchIcon{
        height:80%;
    }
    input{
        width:60%;
    }
    .HighlightOffIcon{
        height:80%;
    }
`;

export default function SearchBar(props) {
	const { setSongs, recommendedIsChecked, setRecommendedIsChecked, setRecs, setMainGraphUrl } = props

	function delayedRouter() {
		setTimeout(() => {
			props.history.push("/search")
		}, 4000);
	}

	const submit = (event) => {
		event.preventDefault();
		let value = document.querySelector("#search").value.toLowerCase();
		if (!recommendedIsChecked) {
			axios
				.get(`https://spotify-song-suggester-app.herokuapp.com/data/search/images/${value}`)
				.then(res => {
					console.log("axios from UNCHECKED searchbar", res)
					setSongs(res.data);
					delayedRouter();
					document.querySelector("#search").value = "";
				})

				.catch(err => {
					console.log("axios error UNCHECKED searchbar", err.response.data)

				})
		}
		else if (recommendedIsChecked) {
			// Second axios is #DS endpoints to display data visualization from recommended songs
			axios
				.get(`https://spotify-song-suggester-app.herokuapp.com/data/recs/search/${value}`)
				.then(res => {
					console.log("axios from CHECKED searchbar", res)
					setRecs(res.data);
					delayedRouter();
					document.querySelector("#search").value = "";
					axios
						.get(`https://spotify-api-helper.herokuapp.com/graph_data/DReaI4d55IIaiD6P9/${res.data[0].trackid}`)
						.then(results => {
							console.log(res, "res from Checked search for the 5 way graph display uri")
							setMainGraphUrl(results.data[0].graph_uri)
						})
						.catch(err => {
							console.log(err, "err from Checked search for the 5 way graph display uri")
						})
				})
				.catch(err => {
					console.log("axios error CHECKED searchbar", err)
				})
		}

	}
	const toggleCheckBox = () => {
		setRecommendedIsChecked(!recommendedIsChecked)
	}

	return (
		<>
			<StyledDiv>
				<SearchIcon className="SearchIcon"></SearchIcon>
				<input type="text" name="search" id="search" placeholder="Search" autofill="on" />
				<CheckCircleOutlineIcon className={CheckCircleOutlineIcon} onClick={submit}></CheckCircleOutlineIcon>
			</StyledDiv>

			<CheckBoxDiv>
				<label htmlFor="checkbox">Search by Related</label>
				<input type="checkbox" id="checkbox" name="checkbox" value="checkbox" checked={recommendedIsChecked} onClick={toggleCheckBox} />
			</CheckBoxDiv>
		</>
	)
}