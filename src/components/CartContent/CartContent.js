import React, {Component} from 'react';
import css from "./CartContent.module.css";
import {Add, Remove, PrevImage, NextImage} from './CartContent.module.svgs';
import {SwatchAttribute, TextAttribute} from "../../components/AttributesDisplay/AttributesDisplay";

class CartContent extends Component {
    constructor () {
        super();
        this.state = {
            selectedImgIndex: {},
            data: []
        };
    }

    componentDidMount () {
        let newState = {};
        this.props.data.forEach(item => {
            newState[item.cartId.toString()] = 0;
        });
        this.setState({selectedImgIndex: newState, data: this.props.data});
    }

    componentDidUpdate (prevState) {
        if (prevState.data !== this.props.data) {
            let newState = {};
            this.props.data.forEach(item => {
                newState[item.cartId.toString()] = this.state.selectedImgIndex[item.cartId] ?? 0;
            });
            this.setState({selectedImgIndex: newState, data: this.props.data});
        }
        if (prevState.data !== this.props.data && this.props.data.length === 0 && this.props.turnOffOverlayBackground) this.props.turnOffOverlayBackground();
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

        const addItemQty = data => {
            let newCart = [...this.props.data];
            const existsIndex = this.props.data.findIndex(item => (item.name === data.name && shallowEqual(item.selectedAttributes, data.selectedAttributes)));
            if (existsIndex !== -1) {
                newCart[existsIndex].quantity += 1;
            } else {
                return;
            }
            localStorage.setItem("cart", JSON.stringify(newCart));
            this.props.forceUpdate();
        };
        const removeItemQty = data => {
            let newCart = [...this.props.data];
            const existsIndex = this.props.data.findIndex(item => (item.name === data.name && shallowEqual(item.selectedAttributes, data.selectedAttributes)));
            if (existsIndex !== -1 && newCart[existsIndex].quantity !== 1) {
                newCart[existsIndex].quantity -= 1;
            } else {
                newCart.splice(existsIndex, 1);
            }
            localStorage.setItem("cart", JSON.stringify(newCart));
            this.props.forceUpdate();
        };
        const handlePrevImage = (index, e) => {
            this.setState({selectedImgIndex: {...this.state.selectedImgIndex, [index]: (this.state.selectedImgIndex[index] === 0) ? (e.gallery.length - 1) : (this.state.selectedImgIndex[index] - 1)}});
        };
        const handleNextImage = (index, e) => {
            this.setState({selectedImgIndex: {...this.state.selectedImgIndex, [index]: (this.state.selectedImgIndex[index] === (e.gallery.length - 1)) ? 0 : (this.state.selectedImgIndex[index] + 1)}});
        };
        return (
            <>
                {this.props.data.length !== 0 &&
                    this.props.data.map((element, index) => {
                        return (
                            <div className={(this.props.overlayMode ? (css.item + " " + css.itemOverlay) : css.item)} key={index}>
                                <div className={css.itemInfo}>
                                    <p className={(this.props.overlayMode ? (css.brand + " " + css.brandOverlay) : css.brand)} >{element.brand}</p>
                                    <p className={(this.props.overlayMode ? (css.subtitle + " " + css.subtitleOverlay) : css.subtitle)}>{element.name}</p>
                                    <p className={(this.props.overlayMode ? (css.price + " " + css.priceOverlay) : css.price)} >{element.prices.map(price => {
                                        if (price.currency.label === this.props.currencyPass.label) return (price.currency.symbol + price.amount);
                                        return null;
                                    })}</p>
                                    {element.attributes.map((attribute, index) => {
                                        switch (attribute.type) {
                                            case "text": return <TextAttribute
                                                key={index}
                                                attribute={attribute}
                                                selectedAttribute={element.selectedAttributes[attribute.name]}
                                                overlayMode={this.props.overlayMode}
                                            />;
                                            case "swatch": return <SwatchAttribute
                                                key={index}
                                                attribute={attribute}
                                                selectedAttribute={element.selectedAttributes[attribute.name]}
                                                overlayMode={this.props.overlayMode}
                                            />;
                                            default: return null;
                                        }
                                    })}
                                </div>
                                <div className={(this.props.overlayMode ? (css.itemRightSite + " " + css.itemRightSiteOverlay) : css.itemRightSite)}>
                                    <div className={css.qtyDisplay}>
                                        <Add size={this.props.overlayMode ? "21" : "45"} onClick={() => addItemQty(element)} />
                                        <p>{element.quantity}</p>
                                        <Remove size={this.props.overlayMode ? "21" : "45"} onClick={() => removeItemQty(element)} />
                                    </div>
                                    {element.gallery && <div className={css.photo}>
                                        {(element.gallery.length > 1 && !this.props.overlayMode) && <div className={css.photoNavigation}>
                                            <PrevImage onClick={() => handlePrevImage(element.cartId, element)} />
                                            <NextImage onClick={() => handleNextImage(element.cartId, element)} />
                                        </div>}
                                        <img src={element.gallery[this.state.selectedImgIndex[element.cartId]]} key={index} alt="" />
                                    </div>}
                                </div>
                            </div>
                        );
                    })}
            </>
        );
    }
}

export default CartContent;