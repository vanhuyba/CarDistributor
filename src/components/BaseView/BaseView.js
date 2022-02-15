import {PureComponent} from "react";

export default class BaseView extends PureComponent {

    _computeStyle(...args) {
        let styles = [];
        for (let i = 0; i < args.length; i++) {
            let arg = args[i];
            if (Array.isArray(arg)) {
                for (let _arg of arg) {
                    styles.push(_arg);
                }
            } else {
                styles.push(arg);
            }
        }
        return styles;
    }

    render() {
        return null;
    }
}
