import React, {Component} from 'react';
import withRouter from "../../components/withRouter/withRouter";
import css from "./Cart.module.css";

import CartContent from '../../components/CartContent/CartContent';
import {Link} from 'react-router-dom';

class Cart extends Component {
    // constructor (props) {
    //     super(props);
    //     this.state = {
    //         cart: this.props.cart || [],
    //     };
    // }

    componentDidUpdate () {
        // if (this.props.cart && JSON.stringify(this.props.cart) !== JSON.stringify(this.state.cart)) this.setState({cart: this.props.cart});
    }

    render () {
        const totalValue = e => {
            return this.props.cart.reduce((prev, current) => {
                const singlePrice = current.prices.filter((el) => {
                    return el.currency.label === this.props.currencyPass.label;
                });
                return prev + parseFloat(singlePrice[0]?.amount * current.quantity);
            }, 0);
        };
        return (
            <>
                <div className={css.container}>
                    <h2>CART</h2>
                    <CartContent
                        data={this.props.cart}
                        currencyPass={this.props.currencyPass}
                        forceUpdate={() => this.props.forceUpdate()}
                    />
                    <div className={css.priceInfo}>
                        <div>
                            <p>{`Tax 21%: `}</p>
                            <p>{`Quantity: `}</p>
                            <p>{`Total: `}</p>
                        </div>
                        <div>
                            <p>{this.props.currencyPass.symbol + (isNaN(totalValue()) ? "" : Math.round((totalValue() * 0.21 + Number.EPSILON) * 100) / 100)}</p>
                            <p>{this.props.cart.reduce((prev, current) => prev + parseInt(current.quantity), 0)}</p>
                            <p>{this.props.currencyPass.symbol + (isNaN(totalValue()) ? "" : Math.round((totalValue() + Number.EPSILON) * 100) / 100)}</p>
                        </div>
                    </div>
                    <Link to={'#'}>
                        <p>ORDER</p>
                    </Link>
                </div>
            </>
        );
    }
}

export default withRouter(Cart);