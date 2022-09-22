import React from "react";
import defaultComponent from "../../components/defaultComponent";
import css from "./Category.module.css";
import {Cart} from "./Category.module.svgs";
import {Link, Navigate} from "react-router-dom";
import withRouter from "../../components/withRouter/withRouter";
import {Client} from '../../GraphQl/Client';
import {GET_CATEGORY_DATA} from '../../GraphQl/Queries';
import {gql} from '@apollo/client';


class Category extends defaultComponent {
    constructor (props) {
        super(props);
        this.state = {
            products: [],
            selectedCategory: "",
            selectedCurrency: "USD",
            wrongCategory: false,
        };
    }
    componentDidMount () {
        this.fetchCategoryProducts();
    }
    componentDidUpdate (prevState) {
        if (this.props.currencyPass.label !== this.state.selectedCurrency) this.setState({selectedCurrency: this.props.currencyPass.label});
        if (this.props.params.category !== this.state.selectedCategory)
            this.setState({
                selectedCategory: this.props.params.category,
                products: [],
            });
        if (prevState.params.category !== this.props.params.category) {
            this.fetchCategoryProducts();
        }
    }

    fetchCategoryProducts = () => {
        this.setState({wrongCategory: false});
        Client.query({
            query: gql(`${GET_CATEGORY_DATA.replace('$categoryToPass', `${this.props.params.category}`)}`)
        }).then(res => {
            try {
                const {products} = res.data.category;
                this.setState({
                    products: products,
                    selectedCategory: this.props.params.category,
                });
            } catch (err) {
                this.setState({wrongCategory: true});
            }
        });
    };

    render () {
        const shallowEqual = (object1, object2) => {
            const keys1 = Object.keys(object1);
            const keys2 = Object.keys(object2);
            if (keys1.length !== keys2.length) {
                return false;
            }
            for (let key of keys1) {
                if (object1[key] !== object2[key]) {
                    return false;
                }
            }
            return true;
        };

        const saveCart = data => {
            let newCart = [...this.props.cart];
            const existsIndex = this.props.cart.findIndex(item => (item.name === data.name && shallowEqual(item.selectedAttributes, data.selectedAttributes)));
            if (existsIndex !== -1) {
                newCart[existsIndex].quantity += 1;
            } else {
                let randomCartId;
                do randomCartId = Math.floor(Math.random() * 1000);
                while (this.state.cart.map(cartItem => cartItem.cartId).includes(randomCartId));
                data.cartId = randomCartId;
                data.quantity = 1;
                newCart.push(data);
            }
            this.setState({cart: newCart});
            localStorage.setItem("cart", JSON.stringify(newCart));
            this.props.forceUpdate();
        };
        return (
            <>
                {this.state.wrongCategory && <Navigate to={`/all`} />}
                {this.state.products &&
                    <div className={css.container}>
                        <h2>{this.state.selectedCategory.toUpperCase()}</h2>
                        <div className={css.products}>
                            {this.state.products.map((product, index) => {
                                return (
                                    <div className={css.productWrapper} key={index}>
                                        <Link className={css.product} id={product.id} to={`/product/${product.id}`}>
                                            <div className={css.photoContainer}>
                                                <img src={product.gallery[0]} alt={product.name} />
                                            </div>
                                            <div className={css.productInfo}>
                                                <p className={css.productName}>{`${product.brand} ${product.name}`}</p>
                                                <p className={css.productPrice}>{product.prices.map(price => {
                                                    if (price.currency.label === this.state.selectedCurrency) return (price.currency.symbol + (Math.round(price.amount * 100) / 100).toFixed(2));
                                                    return "";
                                                })}</p>
                                            </div>
                                            {product.inStock === false &&
                                                <div className={css.product_unavailable}>
                                                    <p>OUT OF STOCK</p>
                                                </div>
                                            }
                                        </Link>
                                        {product.attributes.length === 0 && product.inStock &&
                                            <div className={css.product_cart}>
                                                <Cart onClick={() => {
                                                    if (!product.inStock) return;
                                                    saveCart({
                                                        name: product.name,
                                                        brand: product.brand,
                                                        prices: product.prices,
                                                        gallery: product.gallery,
                                                        selectedAttributes: [],
                                                        attributes: []
                                                    });
                                                }} />
                                            </div>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                }
            </>
        );
    }
}
export default withRouter(Category);