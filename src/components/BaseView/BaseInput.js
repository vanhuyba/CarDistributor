import BaseView from "./BaseView";
import * as Utils from "../../utils/Utils.js";

export default class BaseInput extends BaseView {
    constructor(props) {
        super(props);
        const {validators} = props;
        this.state = {
            error: undefined,
            valid: !(validators && validators.length > 0)
        };
    }

    isValid() {
        return this.state.valid;
    }

    validate(text) {
        const {validators, onValidationChanged} = this.props;
        let error;
        for (let validator of validators) {
            error = validator(text);
            console.log(error);
            if (error) {
                this.setState({
                    error: error,
                    valid: false
                });
                if (Utils.isFunction(onValidationChanged)) {
                    onValidationChanged(false);
                }
                return false;
            }
        }

        this.setState({
            valid: true,
            error: undefined
        });
        if (Utils.isFunction(onValidationChanged)) {
            onValidationChanged(true);
        }
        return true;
    }

    render() {
        return null;
    }

}
