import { gql, useQuery, useLazyQuery } from "@apollo/client";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 18,
  },
  pos: {
    marginBottom: 12,
    fontSize: 12,
  },
});

const ALL_PLAYERS_QUERY = gql`
  query allPlayers {
    queryPlayer {
      name
      position
      country {
        id
        name
        stadium
      }
      club {
        id
        name
        stadium
      }
      id
    }
  }
`;

export const ALL_COUNTRIES_QUERY = gql`
  query allCountries {
    queryCountry {
      id
      name
    }
  }
`;

export const ALL_CLUBS_QUERY = gql`
  query allClubs {
    queryClub {
      id
      name
    }
  }
`;

const FILTER_PLAYERS_QUERY = gql`
  query filterPlayers(
    $filter: PlayerFilter
    $countryID: [ID!]
    $clubID: [ID!]
  ) {
    queryPlayer(filter: $filter) @cascade {
      name
      position
      country(filter: { id: $countryID }) {
        id
        name
      }
      club(filter: { id: $clubID }) {
        id
        name
      }
      id
    }
  }
`;

export default function PlayersList() {
  const [country, setCountry] = useState(null);
  const [club, setClub] = useState(null);
  const [position, setPosition] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchStatus, setSearchStatus] = useState(false);
  const classes = useStyles();
  const { loading, error, data } = useQuery(ALL_PLAYERS_QUERY);
  const {
    loading: loadingCountries,
    error: errCountries,
    data: countries,
  } = useQuery(ALL_COUNTRIES_QUERY);
  const { loading: loadingClubs, error: errClubs, data: clubs } = useQuery(
    ALL_CLUBS_QUERY
  );
  const [
    getFilteredPlayers,
    { loading: filterLoading, data: filteredPlayers, error: filterError },
  ] = useLazyQuery(FILTER_PLAYERS_QUERY);

  if (error || errCountries || errClubs || filterError)
    return <div>Error loading players.</div>;
  if (loading || loadingCountries || loadingClubs || filterLoading)
    return <div>Loading</div>;

  const { queryPlayer: allPlayers } = data;
  const { queryCountry: allCountries } = countries;
  const { queryClub: allClubs } = clubs;

  const positions = [
    "GK",
    "RB",
    "LB",
    "CB",
    "DM",
    "CM",
    "LM",
    "RM",
    "CF",
    "ST",
  ];

  const clearSearch = () => {
    setClub(null);
    setCountry(null);
    setPosition(null);
    setSearchText("");
    setSearchStatus(false);
  };

  const searchPlayers = () => {
    let filter = {};
    setSearchStatus(true);
    if (position) {
      filter.position = { eq: position };
    }
    if (searchText !== "") {
      filter.name = { anyoftext: searchText };
    }
    if (Object.keys(filter).length === 0) {
      if (!club && !country) {
        setSearchStatus(false);
        return;
      }
    }
    getFilteredPlayers({
      variables: {
        filter: filter,
        clubID: club ? [club] : allClubs.map((club) => club.id), // if no club is selected then return all clubs id
        countryID: country
          ? [country.id]
          : allCountries.map((country) => country.id), // if no country is selected then return all countries id
      },
    });
  };

  const dataset =
    searchStatus && filteredPlayers ? filteredPlayers?.queryPlayer : allPlayers;

  return (
    <div>
      <div style={{ display: "flex" }}>
        <Autocomplete
          id="combo-box-country"
          options={allCountries}
          getOptionLabel={(option) => option.name}
          value={country}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Country" variant="outlined" />
          )}
          onChange={(e, value) =>
            value
              ? setCountry({
                  id: value.id,
                  name: value.name,
                })
              : setCountry(null)
          }
        />
        <Autocomplete
          id="combo-box-club"
          options={allClubs}
          value={club}
          getOptionLabel={(option) => option.name}
          style={{ width: 300, marginLeft: "10px" }}
          renderInput={(params) => (
            <TextField {...params} label="Club" variant="outlined" />
          )}
          onChange={(e, value) =>
            value ? setClub({ name: value.name, id: value.id }) : setClub(null)
          }
        />
        <Autocomplete
          id="combo-box-pos"
          options={positions}
          value={position}
          getOptionLabel={(option) => option}
          style={{ width: 200, marginLeft: "10px" }}
          renderInput={(params) => (
            <TextField {...params} label="Position" variant="outlined" />
          )}
          onChange={(e, value) => setPosition(value)}
        />
        <TextField
          id="outlined-basic"
          label="Player"
          variant="outlined"
          value={searchText}
          style={{ width: 300, marginLeft: "10px" }}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={searchPlayers}
          style={{ marginLeft: "10px" }}
        >
          Search
        </Button>
        {searchStatus && (
          <Button
            variant="contained"
            color="secondary"
            onClick={clearSearch}
            style={{ marginLeft: "10px" }}
          >
            Clear
          </Button>
        )}
      </div>
      <Grid style={{ marginTop: "20px" }} container spacing={2}>
        {dataset.map((player) => (
          <Grid item xs={4} key={player.id}>
            <Card className={classes.root}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textPrimary"
                  gutterBottom
                >
                  {player.name}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  {player.club.name}
                </Typography>
                <Typography variant="body2" component="p">
                  Position - {player.position}
                  <br />
                  Country - {player.country.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
