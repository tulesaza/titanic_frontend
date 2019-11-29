import * as React from "react";
import { Button } from "@material-ui/core";
import { ChildrensProps } from "./UploadDataset";
import { restClient } from "../index";
import { States } from "./MainPage";
import { ChartOptions } from "chart.js";
import { Pie, Scatter } from "react-chartjs-2";

interface ViewMetricsState {
  loading: boolean;
}

export class ViewMetrics extends React.Component<
  ChildrensProps,
  ViewMetricsState
> {
  constructor(props: ChildrensProps) {
    super(props);
    this.state = { loading: false };
  }
  /**
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
*/
  handleReset = () => {
    restClient.cleanupBackend().then(res => {
      this.props.nextState(States.UPLOAD);
    });
  };

  render() {
    const data = {
      datasets: [
        {
          label: "Random Classifier",
          data: [
            {
              x: 0,
              y: 0
            },
            {
              x: 1,
              y: 1
            }
          ],
          borderColor: "black",
          borderWidth: 1,
          pointBackgroundColor: ["#000"],
          pointBorderColor: ["#000"],
          pointRadius: 3,
          pointHoverRadius: 3,
          fill: false,
          tension: 0,
          showLine: true
        }
      ]
    };

    const options: ChartOptions = {
      tooltips: {
        callbacks: {
          title: (tooltipItem, data) => {
            return "threshold=0.5";
          },
          label: (tooltipItem, data) => {
            return "TP=90|FP=20 "
          },
          afterLabel: (tooltipItem, data) => {
            return  "TN=29|FN=22";
          }
        },
        titleFontSize: 14,
        bodyFontSize: 14,
        displayColors: false
      },
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              suggestedMax: 1
            },
            type: "linear",
            position: "bottom",
            scaleLabel: {
              display: true,
              labelString: "False Positive Rate"
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              suggestedMax: 1
            },
            type: "linear",
            position: "bottom",
            scaleLabel: {
              display: true,
              labelString: "True Positive Rate"
            }
          }
        ]
      }
    };
    return this.state.loading ? (
      <div>
        <label>Loading...</label>
      </div>
    ) : (
      <div style={{ height: 900, width: 900, margin: "auto" }}>
        <Scatter data={data} options={options} />
        <Button onClick={this.handleReset}>Reset</Button>
      </div>
    );
  }
}
