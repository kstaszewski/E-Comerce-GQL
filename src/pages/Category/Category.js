import React from "react";
import css from "./Category.module.css";
import {Cart} from "./Category.module.svgs";
import {Link, NavLink} from "react-router-dom";
import withRouter from "../../components/withRouter/withRouter";
import {Client} from '../../GraphQl/Client';
import {GET_BEGINING_DATA} from '../../GraphQl/Queries';

class Category extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            thingsToDisplay: [],
            products: [],
            selectedCategory: "",
            selectedCurrency: "USD",
        };
    }
    componentDidMount () {
        Client.query({
            query: GET_BEGINING_DATA,
        }).then(result => {
            let fechedCategoriesArray = [];
            let fechedThingsToDisplay = [];
            result.data.categories.forEach(element => {
                fechedCategoriesArray.push(element.name.toUpperCase());
                fechedThingsToDisplay.push({category: element.name, products: element.products});
            });
            this.setState({
                thingsToDisplay: fechedThingsToDisplay,
                selectedCategory: this.props.params.category,
            });
        });
    }
    componentDidUpdate () {
        if (this.props.currencyPass.label !== this.state.selectedCurrency) this.setState({selectedCurrency: this.props.currencyPass.label});

        if (this.props.params.category !== this.state.selectedCategory)
            this.setState({
                selectedCategory: this.props.params.category,
                products: [],
            });

        if (this.state.products.length !== 0) return;
        this.state.thingsToDisplay.forEach(element => {
            if (element.category.toUpperCase() === this.state.selectedCategory.toUpperCase()) {
                this.setState({
                    products: element.products,
                });
            }
        });
    }

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
                data.quantity = 1;
                newCart.push(data);
            }
            this.setState({cart: newCart});
            localStorage.setItem("cart", JSON.stringify(newCart));
            this.props.forceUpdate();
        };
        return (
            <>{this.state.thingsToDisplay &&
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
                                            <p className={css.productName}>{product.name}</p>
                                            <p className={css.productPrice}>{product.prices.map(price => {
                                                if (price.currency.label === this.state.selectedCurrency) {
                                                    return (price.currency.symbol + price.amount);
                                                }
                                            })}</p>
                                        </div>
                                        {product.inStock === false &&
                                            <div className={css.product_unavalible}>
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
            }</>
        );
    }
}
export default withRouter(Category);