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
            productData: {},
            selectedPhoto: ""
        }
    }

    componentDidMount() {
        Client.query({
            query: gql`${GET_PRODUCT_DATA.replace('$idToPass', `"${this.props.params.id.toString()}"`)}`
        }).then(res => {
            console.log(res.data.product)
            this.setState({ productData: res.data.product, selectedPhoto: res.data.product.gallery[0] })
        })
    }

    render() {
        return (
            <>
                <div className={css.container}>
                    <div className={css.photoContainer}>
                        <div className={css.photoContainer_thumbnails}>
                            {this.state.productData.gallery &&
                                this.state.productData.gallery.map((photo, index) => {
                                    if (this.state.productData.gallery.length <= 1) return
                                    return (
                                        <img src={photo} alt="" onClick={() => this.setState({ selectedPhoto: photo })} />
                                    )
                                })}
                        </div>
                        <div className={css.photoContainer_photo}>
                            <img src={this.state.selectedPhoto} alt="" />
                        </div>
                    </div>
                    <div className={css.infoContainer}>
                        <h1>{this.state.productData.brand}</h1>
                        <h2>{this.state.productData.name}</h2>
                        {this.state.productData.attributes &&
                            this.state.productData.attributes.map((attribute, index) => {
                                if (attribute.type === 'text') {
                                    return (
                                        <div className={css.textAttribute} key={index}>
                                            <p>{attribute.name}</p>
                                            {attribute.items.map((item, index) => {
                                                return (
                                                    <div className={css.textAttribute_item} key={index}>
                                                        <p>{item.displayValue}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className={css.swatchAttribute} key={index}>

                                        </div>
                                    )
                                }
                            })}
                    </div>
                </div>
            </>
        )
    }
}
export default withRouter(Product)