import React, {Component} from 'react';
import withRouter from "../../components/withRouter/withRouter";
import css from "./Cart.module.css";

import CartContent from '../../components/CartContent/CartContent';

class Cart extends Component {
    constructor (props) {
        super(props);
        this.state = {
            cart: this.props.cart || [],
        };
    }

    componentDidUpdate () {
        if (this.props.cart && JSON.stringify(this.props.cart) !== JSON.stringify(this.state.cart)) this.setState({cart: this.props.cart});
    }

    render () {
        return (
            <>
                <div className={css.container}>
                    <h2>Cart</h2>
                    <CartContent
                        data={this.props.cart}
                        currencyPass={this.props.currencyPass}
                        forceUpdate={() => this.props.forceUpdate()}
                    />
                </div>
            </>
        );
    }
}

export default withRouter(Cart);