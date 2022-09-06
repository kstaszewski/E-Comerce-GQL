import React, {useEffect} from "react";
import css from "./Product.module.css";
import withRouter from "../../components/withRouter/withRouter";
import {GET_PRODUCT_DATA} from '../../GraphQl/Queries';
import {Client} from '../../GraphQl/Client';
import {gql} from '@apollo/client';

class Product extends React.Component {
    constructor () {
        super();
        this.state = {
            productData: undefined,
            selectedPhoto: "",
            selectedAttributes: undefined,
            selectedCurrency: "",
            cart: JSON.parse(localStorage.getItem("cart")) || [],
        };
    }

    componentDidMount () {
        Client.query({
            query: gql`${GET_PRODUCT_DATA.replace('$idToPass', `"${this.props.params.id.toString()}"`)}`
        }).then(res => {
            this.setState(() => {
                let atr = {};
                res.data.product.attributes.forEach(attribute => {
                    atr[attribute.name] = 'notChosen';
                });
                return (
                    {
                        productData: res.data.product,
                        selectedPhoto: res.data.product.gallery[0],
                        selectedAttributes: atr,
                        selectedCurrency: this.props.currencyPass.label,
                    }
                );
            });
        });
    }

    componentDidUpdate () {
        if (this.props.currencyPass.label !== this.state.selectedCurrency) this.setState({selectedCurrency: this.props.currencyPass.label});
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
            let newCart = [...this.state.cart];
            const existsIndex = this.state.cart.findIndex(item => (item.name === data.name && shallowEqual(item.selectedAttributes, data.selectedAttributes)));
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
            <>
                {this.state.productData &&
                    <div className={css.container}>
                        <div className={css.photoContainer}>
                            <div className={css.photoContainer_thumbnails}>

                                {this.state.productData.gallery.map((photo, index) => {
                                    if (this.state.productData.gallery.length <= 1) return;
                                    return (
                                        <img src={photo} key={index} alt="" onClick={() => this.setState({selectedPhoto: photo})} />
                                    );
                                })}
                            </div>
                            <div className={css.photoContainer_photo}>
                                <img src={this.state.selectedPhoto} alt="" />
                            </div>
                        </div>
                        <div className={css.infoContainer}>
                            <h1>{this.state.productData.brand}</h1>
                            <h2 id={css.subtitle}>{this.state.productData.name}</h2>
                            {this.state.productData.attributes.map((attribute, index) => {
                                if (attribute.type === 'text') {
                                    return (
                                        <div className={css.textAttribute} key={index}>
                                            <p>{`${attribute.name}:`}</p>
                                            <div className={css.textAttribute_itemsContainer}>
                                                {attribute.items.map((item, index) => {
                                                    return (
                                                        <div className={css.textAttribute_item + " " +
                                                            (this.state.selectedAttributes[attribute.name] === item.value.toString() ? (css.selectedTextAttribute) : null)
                                                        } key={index} onClick={() => this.setState({selectedAttributes: {...this.state.selectedAttributes, [attribute.name]: item.value}})}>
                                                            <p>{item.value}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className={css.swatchAttribute} key={index}>
                                            <p>{`${attribute.name}:`}</p>
                                            <div className={css.swatchAttribute_itemsContainer}>
                                                {attribute.items.map((item, index) => {
                                                    return (
                                                        <div style={{"backgroundColor": item.value}} className={css.swatchAttribute_item + " " +
                                                            (this.state.selectedAttributes[attribute.name] === item.value.toString() ? css.selectedSwatchAttribute : null)
                                                        } key={index} onClick={() => this.setState({selectedAttributes: {...this.state.selectedAttributes, [attribute.name]: item.value}})}>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                            <div className={css.price}>
                                <p>PRICE:</p>
                                <p>{this.state.productData.prices.map(price => {
                                    if (price.currency.label === this.state.selectedCurrency) {
                                        return (price.currency.symbol + price.amount);
                                    }
                                })}</p>
                            </div>
                            <div className={css.addToChart + " " + ((!this.state.productData.inStock || Object.values(this.state.selectedAttributes).find(x => x === 'notChosen')) ? css.addToChartDisabled : null)} onClick={() => {
                                if (!this.state.productData.inStock || Object.values(this.state.selectedAttributes).find(x => x === 'notChosen')) return;
                                saveCart({
                                    name: this.state.productData.name,
                                    brand: this.state.productData.brand,
                                    prices: this.state.productData.prices,
                                    gallery: this.state.productData.gallery,
                                    selectedAttributes: this.state.selectedAttributes,
                                    attributes: this.state.productData.attributes
                                });
                            }}>
                                <p>{this.state.productData.inStock ? Object.values(this.state.selectedAttributes).find(x => x === 'notChosen') ? "SELECT ALL ATTRIBUTES" : "TO CHART" : "OUT OF STOCK"}</p>
                            </div>
                            <div className={css.description} dangerouslySetInnerHTML={{__html: this.state.productData.description}} />
                        </div>
                    </div>
                }
            </>
        );
    }
}
export default withRouter(Product);