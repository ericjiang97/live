import React, { Component } from "react";
import "./App.css";
import "whatwg-fetch";
import { lastfm, config } from "./config/";
import Card, { CardContent, CardMedia } from "material-ui/Card";
import { withStyles } from "material-ui/styles";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import RefreshIcon from "material-ui-icons/Refresh";
import PlayArrowIcon from "material-ui-icons/PlayArrow";
import CircularProgress from "material-ui/Progress/CircularProgress";
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
      .then(data => data.recenttracks)
      .then(tracks => {
        this.setState({ tracks: tracks });
      });
  };
  componentDidMount() {
    this.updateTracks();
  }
  render() {
    const { classes, theme } = this.props;
    const { tracks } = this.state;
    const { track } = tracks;

    return (
      <div className="App">
        <header className="App-header">
          <img src={config.PROFILE_PIC_URI} className="App-logo" />
          <Typography type="headline" style={{ color: "white" }}>
            What NAME is playing on Spotify
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
                  <CardMedia
                    className={classes.cover}
                    image={track[0].image[3]["#text"]}
                    title="Live from space album cover"
                  />
                </Card>
                {track.slice(1, 10).map((cTrack, key) => {
                  return (
                    <Card className={classes.card} key={key}>
                      <div className={classes.details}>
                        <CardContent className={classes.content}>
                          <Typography type="title">{cTrack.name}</Typography>
                          <Typography type="subheading" color="secondary">
                            {cTrack.artist["#text"]}
                          </Typography>
                        </CardContent>
                      </div>
                      <CardMedia
                        className={classes.smallCover}
                        image={cTrack.image[2]["#text"]}
                        title="Live from space album cover"
                      />
                    </Card>
                  );
                })}
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
