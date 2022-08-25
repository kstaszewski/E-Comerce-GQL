import React from "react";
import css from "./Category.module.css";
import { Cart } from "./Category.module.svgs"
import { Link, NavLink } from "react-router-dom";
import withRouter from "../../components/withRouter/withRouter";
import { Client } from '../../GraphQl/Client';
import { GET_BEGINING_DATA } from '../../GraphQl/Queries';

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thingsToDisplay: [],
            products: [],
            selectedCategory: "",
            selectedCurrency: "USD",
        };
    }
    componentDidMount() {
        Client.query({
            query: GET_BEGINING_DATA,
        }).then(result => {
            console.log(result);
            let fechedCategoriesArray = [];
            let fechedThingsToDisplay = [];
            result.data.categories.forEach(element => {
                fechedCategoriesArray.push(element.name.toUpperCase());
                fechedThingsToDisplay.push({ category: element.name, products: element.products })
            });
            this.props.categoryToTopBar(fechedCategoriesArray)
            this.setState({
                thingsToDisplay: fechedThingsToDisplay,
                selectedCategory: this.props.params.category,
            });
        })
    }
    componentDidUpdate() {
        if (this.props.currencyToCategory.label !== this.state.selectedCurrency) this.setState({ selectedCurrency: this.props.currencyToCategory.label })

        if (this.props.params.category !== this.state.selectedCategory)
            this.setState({
                selectedCategory: this.props.params.category,
                products: [],
            })

        if (this.state.products.length !== 0) return
        this.state.thingsToDisplay.forEach(element => {
            if (element.category.toUpperCase() === this.state.selectedCategory.toUpperCase()) {
                this.setState({
                    products: element.products,
                });
            }
        })
    }

    render() {
        return (
            <>{this.state.thingsToDisplay &&
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