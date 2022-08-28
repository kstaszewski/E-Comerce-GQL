import React from "react";
import css from "./Product.module.css"
import withRouter from "../../components/withRouter/withRouter";
import { GET_PRODUCT_DATA } from '../../GraphQl/Queries'
import { Client } from '../../GraphQl/Client';
import { gql } from '@apollo/client'

class Product extends React.Component {
    constructor() {
        super();
        this.state = {
            productData: undefined,
            selectedPhoto: "",
            selectedAttributes: undefined,
            selectedCurrency: "",
        }
    }

    componentDidMount() {
        Client.query({
            query: gql`${GET_PRODUCT_DATA.replace('$idToPass', `"${this.props.params.id.toString()}"`)}`
        }).then(res => {
            console.log(res.data.product)
            this.setState(() => {
                let atr = {}
                res.data.product.attributes.forEach(attribute => {
                    atr[attribute.name] = undefined;
                })
                return (
                    {
                        productData: res.data.product,
                        selectedPhoto: res.data.product.gallery[0],
                        selectedAttributes: atr,
                        selectedCurrency: this.props.currencyToProduct.label,
                    }
                )
            })
        })
    }

    componentDidUpdate() {
        if (this.props.currencyToProduct.label !== this.state.selectedCurrency) this.setState({ selectedCurrency: this.props.currencyToProduct.label })
    }

    render() {
        return (
            <>
                {this.state.productData &&
                    <div className={css.container}>
                        <div className={css.photoContainer}>
                            <div className={css.photoContainer_thumbnails}>

                                {this.state.productData.gallery.map((photo, index) => {
                                    if (this.state.productData.gallery.length <= 1) return
                                    return (
                                        <img src={photo} key={index} alt="" onClick={() => this.setState({ selectedPhoto: photo })} />
                                    )
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
                                                        <div className={
                                                            (this.state.selectedAttributes[attribute.name] === item.value.toString()) ? (css.textAttribute_item + " " + css.selectedTextAttribute) : css.textAttribute_item
                                                        } key={index} onClick={() => this.setState({ selectedAttributes: { ...this.state.selectedAttributes, [attribute.name]: item.value } })}>
                                                            <p>{item.displayValue}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className={css.swatchAttribute} key={index}>
                                            <p>{`${attribute.name}:`}</p>
                                            <div className={css.swatchAttribute_itemsContainer}>
                                                {attribute.items.map((item, index) => {
                                                    return (
                                                        <div style={{ "backgroundColor": item.value }} className={
                                                            (this.state.selectedAttributes[attribute.name] === item.value.toString()) ? (css.swatchAttribute_item + " " + css.selectedSwatchAttribute) : css.swatchAttribute_item
                                                        } key={index} onClick={() => this.setState({ selectedAttributes: { ...this.state.selectedAttributes, [attribute.name]: item.value } })}>
                                                            {/* <div /> */}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
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
                            <div className={css.addToChart}>
                                <p>ADD TO CHART</p>
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }
}
export default withRouter(Product)