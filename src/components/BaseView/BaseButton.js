import React from 'react';
import * as Utils from '../../utils/Utils';
import BaseView from "./BaseView";

class AbstractButton extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            userAction: false,
            timeoutId: -1
        };
    }

    componentWillUnmount() {
        if (this.state.timeoutId !== -1) {
            clearTimeout(this.state.timeoutId);
        }
    }

    onPress() {
        const {delay} = this.props;

        if (!this.state.userAction) {
            this.setState({
                userAction: true
            });
            if (this.state.timeoutId !== -1) {
                clearTimeout(this.state.timeoutId);
            }
            let timeoutId = setTimeout(() => {
                this.setState({
                    userAction: false
                });
            }, delay ? delay : 500);

            const {onPress} = this.props;
            if (Utils.isFunction(onPress)) {
                onPress();
            }

            this.setState({timeoutId: timeoutId});
        }
    }

    render() {
        null;
    }
}

AbstractButton.defaultProps = {
    style: {}
};

export default AbstractButton;
