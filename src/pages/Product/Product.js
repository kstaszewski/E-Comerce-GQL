import React from "react";
import SaveCart from "../../components/SaveCart/SaveCart";
import css from "./Product.module.css";
import withRouter from "../../components/withRouter/withRouter";
import {GET_PRODUCT_DATA} from '../../GraphQl/Queries';
import {Client} from '../../GraphQl/Client';
import {gql} from '@apollo/client';
import parse from 'html-react-parser';
import {SwatchAttribute, TextAttribute} from "../../components/AttributesDisplay/AttributesDisplay";

export class Product extends SaveCart {
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
            query: gql(`${GET_PRODUCT_DATA.replace('$idToPass', `${this.props.params.id.toString()}`)}`)
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

    handleSaveCart = (dataToAdd, currentCart) => {
        this.setState(this.saveCart(dataToAdd, currentCart));
        this.props.forceUpdate();
    };

    render () {
        return (
            <>
                {this.state.productData &&
                    <div className={css.container}>
                        <div className={css.photoContainer}>
                            <div className={css.photoContainer_thumbnails}>

                                {this.state.productData.gallery.map((photo, index) => {
                                    if (this.state.productData.gallery.length <= 1) return null;
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
                                switch (attribute.type) {
                                    case "text": return <TextAttribute
                                        key={index}
                                        attribute={attribute}
                                        onAttributeClick={(e) => this.setState({selectedAttributes: {...this.state.selectedAttributes, [attribute.name]: e.target.value}})}
                                    />;
                                    case "swatch": return <SwatchAttribute
                                        key={index}
                                        attribute={attribute}
                                        onAttributeClick={(e) => this.setState({selectedAttributes: {...this.state.selectedAttributes, [attribute.name]: e.target.value}})}
                                    />;
                                    default: return null;
                                }
                            })}
                            <div className={css.price}>
                                <p>PRICE:</p>
                                <p>{this.state.productData.prices.map(price => {
                                    if (price.currency.label === this.state.selectedCurrency) return (price.currency.symbol + (Math.round(price.amount * 100) / 100).toFixed(2));
                                    return null;
                                })}</p>
                            </div>
                            <div className={css.addToChart + " " + ((!this.state.productData.inStock || Object.values(this.state.selectedAttributes).find(x => x === 'notChosen')) ? css.addToChartDisabled : null)} onClick={() => {
                                if (!this.state.productData.inStock || Object.values(this.state.selectedAttributes).find(x => x === 'notChosen')) return;
                                this.handleSaveCart({
                                    name: this.state.productData.name,
                                    brand: this.state.productData.brand,
                                    prices: this.state.productData.prices,
                                    gallery: this.state.productData.gallery,
                                    selectedAttributes: this.state.selectedAttributes,
                                    attributes: this.state.productData.attributes
                                }, this.state.cart);
                            }}>
                                <p>{this.state.productData.inStock ? Object.values(this.state.selectedAttributes).find(x => x === 'notChosen') ? "SELECT ALL ATTRIBUTES" : "TO CHART" : "OUT OF STOCK"}</p>
                            </div>
                            <div className={css.description}> {parse(this.state.productData.description)}</div>
                        </div>
                    </div>
                }
            </>
        );
    }
}
export default withRouter(Product);