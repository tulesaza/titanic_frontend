import * as React from "react";
import { Button } from "@material-ui/core";
import { States } from "./MainPage";
import {restClient} from "../index";

interface UploadDatasetState {
  file: File | null;
  loading: boolean;
}

export interface ChildrensProps {
  nextState: (state: States) => void;
}

export class UploadDataset extends React.Component<
  ChildrensProps,
  UploadDatasetState
> {
  constructor(props: ChildrensProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { file: null, loading: false };
  }

  handleChange = (selectorFiles: FileList | null) => {
    if (selectorFiles) {
      this.setState({ file: selectorFiles[0] });
    }
  };

  handleSubmit = () => {
    if (this.state.file) {
      this.setState({ loading: true });
      restClient.sendFile(
        this.state.file,
      ).then(
        response => {
          if (response.status === 200) {
            this.props.nextState(States.TRAIN);
          }

          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
    }
  };

  render() {
    return this.state.loading ? (
      <div>
        <label>Uploading...</label>
      </div>
    ) : (
      <div>
        <label>Upload Your File </label>
        <input type="file" onChange={e => this.handleChange(e.target.files)} />
        <div style={{margin:10}}>
        <Button variant="contained" color="primary" onClick={this.handleSubmit}>UPLOAD DATA</Button>
        </div>
      </div>
    );
  }
}
