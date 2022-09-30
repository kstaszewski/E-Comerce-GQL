import React, {Component} from 'react';
import css from './ProductUnavailableOpacity.module.css'

export default class ProductUnavailableOpacity extends Component {
    render () {
        return (
            <>
                <div className={css.product_unavailable}>
                    <p>OUT OF STOCK</p>
                </div>
            </>
        );
    }
}
