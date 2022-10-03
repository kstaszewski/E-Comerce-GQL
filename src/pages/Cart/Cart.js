import React from 'react';
import withRouter from "../../components/withRouter/withRouter";
import css from "./Cart.module.css";

import CartContent from '../../components/CartContent/CartContent';
import {Link} from 'react-router-dom';
import CartLogic from '../../components/CartLogic/CartLogic';

class Cart extends CartLogic {

    render () {
        const {cart, currencyPass, forceUpdate} = this.props;
        return (
            <>
                <div className={css.container}>
                    <h2>CART</h2>
                    <CartContent
                        data={cart}
                        currencyPass={currencyPass}
                        forceUpdate={() => forceUpdate()}
                    />
                    <div className={css.priceInfo}>
                        <div>
                            <p>{`Tax 21%: `}</p>
                            <p>{`Quantity: `}</p>
                            <p>{`Total: `}</p>
                        </div>
                        <div>
                            <p>{currencyPass.symbol + ((isNaN(this.totalValue(cart, currencyPass)) || this.totalValue(cart, currencyPass) === 0) ? "0" : Math.round((this.totalValue(cart, currencyPass) + Number.EPSILON) * 100) / 100)}</p>
                            <p>{cart.reduce((prev, current) => prev + parseInt(current.quantity), 0)}</p>
                            <p>{currencyPass.symbol + ((isNaN(this.totalValue(cart, currencyPass)) || this.totalValue(cart, currencyPass) === 0) ? "0" : Math.round((this.totalValue(cart, currencyPass) + Number.EPSILON) * 100) / 100)}</p>
                        </div>
                    </div>
                    <Link to={'#'}>
                        <button type='submit'>ORDER</button>
                    </Link>
                </div>
            </>
        );
    }
}

export default withRouter(Cart);