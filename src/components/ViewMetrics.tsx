import * as React from "react";
import {Button} from "@material-ui/core";
import {ChildrensProps} from "./UploadDataset";
import {restClient} from "../index";
import {States} from "./MainPage";

interface ViewMetricsState {
  loading: boolean;
}

export class ViewMetrics extends React.Component<
  ChildrensProps,
  ViewMetricsState
> {
  constructor(props: ChildrensProps) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount = () => {
    restClient.getMetricsData().then(
      response => {
        if (response.status === 200) {
          this.setState({loading:false})
          console.log(response);
        }
      },
      error => {
        console.log(error);
      }
    );
  };

  handleReset = () => {
      restClient.cleanupBackend().then(
          res => {
              this.props.nextState(States.UPLOAD)
          }
      )
  }

  render() {
    return this.state.loading ? (
      <div>
        <label>Loading...</label>
      </div>
    ) : (
      <div>
        <Button onClick={this.handleReset}>Reset</Button>
      </div>
    );
  }
}
