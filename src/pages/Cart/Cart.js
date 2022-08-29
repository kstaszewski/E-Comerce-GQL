import React, {Component} from 'react';
import withRouter from "../../components/withRouter/withRouter";

class Cart extends Component {
    constructor (props) {
        super(props);
        this.setState = {
            cart: props.cart || [],
        };
    }


    render () {
        return (
            <>

            </>
        );
    }
}

export default withRouter(Cart);