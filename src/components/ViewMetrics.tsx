import * as React from "react";
import { Button } from "@material-ui/core";
import { ChildrensProps } from "./UploadDataset";
import { restClient } from "../index";
import { States } from "./MainPage";
import { ChartOptions } from "chart.js";
import {  Scatter } from "react-chartjs-2";

interface ViewMetricsState {
  loading: boolean;
  metrics: Metrics | null;
}

interface ConfusionMatrix {
    tp: number;
    tn: number;
    fp: number;
    fn: number;
}

interface Metrics {
    thresholds: number[];
    TPR: number[];
    FPR: number[];
    conf_matrices: ConfusionMatrix[];
}

interface  RocPoint {
    x: number;
    y: number;
    r: number;
    }


export class ViewMetrics extends React.Component<
  ChildrensProps,
  ViewMetricsState
> {
  constructor(props: ChildrensProps) {
    super(props);
    this.state = { loading: true, metrics: null };
  }

  componentDidMount = () => {
    restClient.getMetricsData().then(
      response => {
        if (response.status === 200) {
          this.setState({metrics: response.data})
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
    restClient.cleanupBackend().then(res => {
      this.props.nextState(States.UPLOAD);
    });
  };

  getRocPoints = (): RocPoint[] => {
      if(this.state.metrics){
          const {FPR,TPR} = this.state.metrics
          const res =  FPR.map((value,index) =>  {return  {x:value, y:TPR[index], r:index}});
          return  res
      }
      else {
          return []
      }
}

    getThresholdByIndex = (index: number): string => {
      if (this.state.metrics) {
          return "threshold="+this.state.metrics.thresholds[index]
      }
      else {
          throw  new Error("Error getting thresholds")
      }
    }

    /**
     *
     * @param index position in array
     * @param positve if true return TP, FP else TN, FN
     */
    getConfMatrixData = (index: number, positve: boolean): string => {
        if (this.state.metrics) {
            const matrix = this.state.metrics.conf_matrices[index]
            return positve? "TP="+ matrix.tp +"|FP="+matrix.fp: "FN="+ matrix.fn +"|TN="+matrix.tn
      }
        else {
          throw  new Error("Error getting thresholds")
      }
    }

  render() {
    const data = {
      datasets: [
          {
          label: "Logistic Regression",
          data: this.getRocPoints(),
          borderColor: "blue",
          borderWidth: 1,
          pointBackgroundColor: ["#137"],
          pointBorderColor: ["#137"],
          pointRadius: 2,
          pointHoverRadius: 2,
          fill: false,
          tension: 0,
          showLine: true
        },
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
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tension: 0,
          showLine: true
        }
      ]
    };

    const options: ChartOptions = {
      tooltips: {
        callbacks: {
          title: (tooltipItem) => {
            return tooltipItem[0].index? this.getThresholdByIndex(tooltipItem[0].index):" ";
          },
          label: (tooltipItem) => {
             return tooltipItem.index? this.getConfMatrixData(tooltipItem.index,true):" ";
          },
          afterLabel: (tooltipItem, data) => {
             return tooltipItem.index? this.getConfMatrixData(tooltipItem.index,false):" ";
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
      <div style={{ height: 1000, width: 1000, margin: "auto" }}>
        <Scatter data={data} options={options} />
        <Button onClick={this.handleReset}>Reset</Button>
      </div>
    );
  }
}
