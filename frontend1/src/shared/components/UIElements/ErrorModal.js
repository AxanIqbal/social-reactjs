import React from 'react';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ErrorModal(props) {
    return (
        <Snackbar open={!!props.error} autoHideDuration={6000} onClose={props.onClear} style={{width: '80%'}}>
            <Alert onClose={props.onClear} severity="error">
                {props.error}
            </Alert>
        </Snackbar>
        // <Modal
        //     onCancel={this.props.onClear}
        //     header="An Error Occurred!"
        //     show={!!this.props.error}
        //     footer={<Button onClick={this.props.onClear} variant={"contained"} color={"secondary"}>Okay</Button>}
        // >
        //   <p>{this.props.error}</p>
        // </Modal>
    );
}

export default ErrorModal;
