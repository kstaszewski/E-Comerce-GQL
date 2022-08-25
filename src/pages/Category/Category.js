import React from "react";
import css from "./Category.module.css";
import { Cart } from "./Category.module.svgs"
import { Link, NavLink } from "react-router-dom";
import withRouter from "../../components/withRouter/withRouter";

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            selectedCategory: "all",
            selectedCurrency: "USD",
        };
    }

    componentDidUpdate() {
        if (this.props.currencyToCategory.label !== this.state.selectedCurrency) this.setState({ selectedCurrency: this.props.currencyToCategory.label })
        if (this.props.params.category !== this.state.selectedCategory && this.props.params.category)
            this.setState({
                selectedCategory: this.props.params.category,
                products: [],
            })
        if (this.state.products.length !== 0) return
        this.props.thingsToDisplay.forEach(element => {
            if (element.category.toUpperCase() === this.state.selectedCategory.toUpperCase()) {
                this.setState({
                    products: element.products,
                });
            }
        })
    }

    render() {
        return (
            <>{this.props.thingsToDisplay &&
                <div className={css.container}>
                    <h2>{this.state.selectedCategory.toUpperCase()}</h2>
                    <div className={css.products}>
                        {this.state.products.map((product, index) => {
                            return (
                                <Link className={css.product} id={product.id} key={index} to={`/product/${product.id}`} state={{}}>
                                    {product.inStock === false &&
                                        <div className={css.product_unavalible}>
                                            <p>OUT OF STOCK</p>
                                        </div>
                                    }
                                    {product.attributes.length === 0 && product.inStock &&
                                        <div className={css.product_cart}>
                                            <Cart />
                                        </div>
                                    }
                                    <img src={product.gallery[0]} alt={product.name} />
                                    <div className={css.productInfo}>
                                        <p className={css.productName}>{product.name}</p>
                                        <p className={css.productPrice}>{product.prices.map(price => {
                                            if (price.currency.label === this.state.selectedCurrency) {
                                                return (price.currency.symbol + price.amount);
                                            }
                                        })}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            }</>
        );
    }
}
export default withRouter(Category);