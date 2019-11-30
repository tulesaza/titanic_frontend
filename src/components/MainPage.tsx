import * as React from "react";
import {
  Grid,
  StyledComponentProps,
  Theme,
  Typography,
  withStyles
} from "@material-ui/core";
import { UploadDataset } from "./UploadDataset";
import { StyleRules } from "@material-ui/core/styles";
import {TrainModel} from "./TrainModel";
import {ViewMetrics} from "./ViewMetrics";

const styles = (theme: Theme): StyleRules<any> => {
  return {
    root: {
      flexGrow: 1
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.primary
    },
    button: {
      margin: theme.spacing(1)
    },
    input: {
      display: "none"
    }
  };
};

export enum States {
  UPLOAD,
  TRAIN,
  VIEW
}

interface MainPageState {
  pageState: States;
}
class MainPage extends React.Component<StyledComponentProps, MainPageState> {
  constructor(props: any) {
    super(props);
    this.state = { pageState: States.UPLOAD };
  }

  handleChangeMainPageState = (state: States) => {
    this.setState({ pageState: state });
  };

  getActualString = (): string => {
    switch (this.state.pageState) {
      case States.UPLOAD:
        return " 1. Upload data ";
      case States.TRAIN:
        return " 2. Train utils ";
      case States.VIEW:
        return " 3. View graphs ";
    }
  };

  getActualComponent = (): React.ReactElement<any> => {
    switch (this.state.pageState) {

      case States.UPLOAD: {
        return <UploadDataset nextState={this.handleChangeMainPageState} />;
      }
      case States.TRAIN: {
        return <TrainModel nextState={this.handleChangeMainPageState} />;
      }
      case States.VIEW: {
        return <ViewMetrics nextState={this.handleChangeMainPageState} />;
      }
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes!.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={classes!.paper}>
              <Typography variant="h5"> {this.getActualString()} </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes!.paper}>{this.getActualComponent()}</div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const StyledMainPage = withStyles(styles)(MainPage);
export default StyledMainPage;
