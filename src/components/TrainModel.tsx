import * as React from "react";
import {Button, Typography} from "@material-ui/core";
import {ChildrensProps} from "./UploadDataset";
import {States} from "./MainPage";
import {restClient} from "../index";

interface TrainModelState {
  loading: boolean;
}



export class TrainModel extends React.Component<
  ChildrensProps,
  TrainModelState
> {
  constructor(props: ChildrensProps) {
    super(props);
    this.state = {  loading: false };
  }

  handleClick = () =>{
      this.setState({loading:true})
      restClient.trainModel().then(
          response => {
              if (response.status===200){
                  this.props.nextState(States.VIEW)
              }
          },
          error => {
          console.log(error);
        }
      )
  }


  render() {
    return this.state.loading ? (
      <div>
        <label>Model is Training...</label>
      </div>
    ) : (
      <div>
        <Typography variant="h6">Note: Now just logistic regression is available </Typography>
          <div style={{margin:10}}>
            <Button variant="contained" color="primary" onClick={this.handleClick}>TRAIN YOUR MODEL</Button>
          </div>
      </div>
    );
  }
}
