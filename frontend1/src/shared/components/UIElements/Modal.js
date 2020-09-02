import React, {Component} from 'react';

import './Modal.css'
import Backdrop from "@material-ui/core/Backdrop";
import Modal from "@material-ui/core/Modal";

class ModalOverlay extends Component {
    render() {
        return (
            <div className={`modal ${this.props.className}`} style={this.props.style}>
                <header className={`modal__header ${this.props.headerClass}`}>
                    <h2>{this.props.header}</h2>
                </header>
                <form onSubmit={this.props.onSubmit ? this.props.onSubmit : event => event.preventDefault()}>
                    <div className={`modal__content ${this.props.contentClass}`}>
                        {this.props.children}
                    </div>
                    <footer className={`modal__footer ${this.props.footerClass}`}>
                        {this.props.footer}
                    </footer>
                </form>
            </div>
        );

    }
}

class CModal extends Component {
    render() {
        return (
            <Modal
                open={this.props.show}
                onClose={this.props.onCancel}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 200,
                }}
            >
                <ModalOverlay {...this.props} />
            </Modal>
        );
    }
}

export default CModal;