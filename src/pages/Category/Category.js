import React from "react";
import CartLogic from "../../components/CartLogic/CartLogic";
import css from "./Category.module.css";
import withRouter from "../../components/withRouter/withRouter";
import {Client} from '../../GraphQl/Client';
import {GET_CATEGORY_DATA} from '../../GraphQl/Queries';
import {gql} from '@apollo/client';
import {Navigate} from "react-router-dom";
import CategoryElement from "../../components/CategoryElement/CategoryElement";


class Category extends CartLogic {
    constructor (props) {
        super(props);
        this.state = {
            products: [],
            selectedCategory: "",
            selectedCurrency: 'USD',
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

    handleSaveCart = (dataToAdd, currentCart) => {
        this.setState(this.saveCart(dataToAdd, currentCart));
        this.props.forceUpdate();
    };

    render () {
        return (
            <>
                {this.state.wrongCategory && <Navigate to={`/all`} />}
                {this.state.products &&
                    <div className={css.container}>
                        <h2>{this.state.selectedCategory.toUpperCase()}</h2>
                        <div className={css.products}>
                            {this.state.products.map((product, index) => {
                                return (
                                    <CategoryElement
                                        key={index}
                                        product={product}
                                        selectedCurrency={this.state.selectedCurrency}
                                        onCartAddClick={() => {
                                            if (!product.inStock) return;
                                            this.handleSaveCart({
                                                name: product.name,
                                                brand: product.brand,
                                                prices: product.prices,
                                                gallery: product.gallery,
                                                selectedAttributes: [],
                                                attributes: []
                                            }, this.props.cart);
                                        }}
                                    />);
                            })}
                        </div>
                    </div>
                }
            </>
        );
    }
}
export default withRouter(Category);