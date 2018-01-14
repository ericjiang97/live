import React, { Component } from "react";
import "./App.css";
import "whatwg-fetch";
import { lastfm, config } from "./config/";
import {
  Paper,
  Card,
  CardContent,
  CardMedia,
  withStyles,
  IconButton,
  Typography,
  CircularProgress
} from "material-ui";

import RefreshIcon from "material-ui-icons/Refresh";
import PlayArrowIcon from "material-ui-icons/PlayArrow";
import Infoicon from "material-ui-icons/Info";
import { green } from "material-ui/colors";

const styles = theme => ({
  card: {
    display: "flex",
    flexDirection: "row"
  },
  details: {
    flex: 2,
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    alignSelf: "flex-end",
    width: 150,
    height: 150
  },
  smallCover: {
    alignSelf: "flex-end",
    width: 75,
    height: 75
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  playIcon: {
    height: 38,
    width: 38
  },
  albumContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
});

class App extends Component {
  state = {
    tracks: {}
  };

  updateTracks = () => {
    this.setState({ tracks: {} });
    fetch(
      lastfm.API_URI +
        "?method=user.getrecenttracks&user=" +
        lastfm.USER_NAME +
        "&api_key=" +
        lastfm.API_KEY +
        "&format=json"
    )
      .then(resp => resp.json())
      .then(data => {
        return data.recenttracks;
      })
      .then(tracks => {
        this.setState({ tracks: tracks });
      });
  };
  componentDidMount() {
    setTimeout(() => this.updateTracks(), 3000);
  }
  render() {
    const { classes } = this.props;
    const { tracks } = this.state;
    const { track } = tracks;

    return (
      <div className="App">
        <header className="App-header">
          <img src={config.PROFILE_PIC_URI} className="App-logo" />
          <Typography type="headline" style={{ color: "white" }}>
            What lorderikir is playing on Spotify
          </Typography>
        </header>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div style={{ marginTop: 20 }}>
            {track ? (
              <div>
                <Card className={classes.card}>
                  <div className={classes.details}>
                    <CardContent className={classes.content}>
                      {track[0]["@attr"] && (
                        <Typography
                          type="subheading"
                          style={{ color: green[300] }}
                        >
                          Now Playing
                        </Typography>
                      )}
                      <Typography type="headline">{track[0].name}</Typography>
                      <Typography type="subheading" color="secondary">
                        {track[0].artist["#text"]}
                      </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                      <IconButton href={track[0].url} aria-label="Play/pause">
                        <PlayArrowIcon className={classes.playIcon} />
                      </IconButton>
                      <IconButton
                        onClick={() => this.updateTracks()}
                        aria-label="Play/pause"
                      >
                        <RefreshIcon className={classes.playIcon} />
                      </IconButton>
                    </div>
                  </div>
                  <div className={classes.albumContainer}>
                    <CardMedia
                      className={classes.cover}
                      image={track[0].image[3]["#text"]}
                      title={track[0].album["#text"]}
                    />
                  </div>
                </Card>
                <Paper style={{ maxHeight: "30vh", overflowY: "scroll" }}>
                  {track.slice(1, 10).map((cTrack, key) => {
                    return (
                      <Card className={classes.card} key={key}>
                        <div className={classes.details}>
                          <CardContent className={classes.content}>
                            <div style={{ display: "flex" }}>
                              <Typography type="title">
                                {cTrack.name}
                              </Typography>
                              <IconButton
                                href={cTrack.url}
                                aria-label="Track Info"
                                style={{ padding: 10 }}
                              >
                                <Infoicon />
                              </IconButton>
                            </div>
                            <Typography type="subheading" color="secondary">
                              {cTrack.artist["#text"]}
                            </Typography>
                          </CardContent>
                        </div>
                        <div className={classes.albumContainer}>
                          <CardMedia
                            className={classes.smallCover}
                            image={cTrack.image[2]["#text"]}
                            title={cTrack.album["#text"]}
                          />
                        </div>
                      </Card>
                    );
                  })}
                </Paper>
              </div>
            ) : (
              <CircularProgress size={100} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
