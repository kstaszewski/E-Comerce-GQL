import React, {Component} from 'react';
import css from './CategoryElement.module.css';
import {Cart} from "./CategoryElement.module.svgs";
import {Link} from "react-router-dom";
import ProductUnavailableOpacity from '../ProductUnavailableOpacity/ProductUnavailableOpacity';

class CategoryElement extends Component {
    constructor (props) {
        super(props);
        this.product = props.product;
        this.state = {
            selectedCurrency: props.selectedCurrency
        };
    }
    componentDidUpdate () {
        if (this.props.selectedCurrency !== this.state.selectedCurrency) this.setState({selectedCurrency: this.props.selectedCurrency});
    }
    render () {
        return (
            <>
                <div className={css.productWrapper}>
                    <Link className={css.product} id={this.product.id} to={`/product/${this.product.id}`}>
                        <div className={css.photoContainer}>
                            <img src={this.product.gallery[0]} alt={this.product.name} />
                        </div>
                        <div className={css.productInfo}>
                            <p className={css.productName}>{`${this.product.brand} ${this.product.name}`}</p>
                            <p className={css.productPrice}>{this.product.prices.map(price => {
                                if (price.currency.label === this.state.selectedCurrency) return (price.currency.symbol + (Math.round(price.amount * 100) / 100).toFixed(2));
                                return "";
                            })}</p>
                        </div>
                        {this.product.inStock === false &&
                            <ProductUnavailableOpacity />
                        }
                    </Link>
                    {this.product.attributes.length === 0 && this.product.inStock &&
                        <div className={css.product_cart}>
                            <Cart onClick={() => this.props.onCartAddClick()} />
                        </div>
                    }
                </div>
            </>
        );
    }
}

export default CategoryElement;