import * as React from "react";
import {Button} from "@material-ui/core";
import {ChildrensProps} from "./UploadDataset";
import {restClient} from "../index";
import {States} from "./MainPage";
import {ChartOptions} from "chart.js";
import {Pie} from 'react-chartjs-2'

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
      const data = {
      labels: [
        'Red',
        'Green',
        'Yellow'
      ],
      datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ]
      }]
    };

    const options: ChartOptions = {
      legend: {
        position: 'bottom',
      }
    };
    return this.state.loading ? (
      <div>
        <label>Loading...</label>
      </div>
    ) : (
      <div>
          <Pie data={data} options={options} />
        <Button onClick={this.handleReset}>Reset</Button>
      </div>
    );
  }
}
