import React, {Component} from 'react';
import css from "./CartContent.module.css";
import {Add, Remove, PrevImage, NextImage} from './CartContent.module.svgs';

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
        this.props.data.forEach((item, index) => {
            newState[index] = 0;
        });
        this.setState({selectedImgIndex: newState, data: this.props.data});
    }

    componentDidUpdate (prevState) {
        if (prevState.data !== this.props.data) {
            let newState = {};
            this.props.data.forEach((item, index) => {
                newState[index.toString()] = 0;
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
                                        if (price.currency.label === this.props.currencyPass.label) {
                                            return (price.currency.symbol + price.amount);
                                        }
                                    })}</p>
                                    {element.attributes.map((attribute, index) => {
                                        if (attribute.type === 'text') {
                                            return (
                                                <div className={(this.props.overlayMode ? (css.textAttribute + " " + css.textAttributeOverlay) : css.textAttribute)} key={index}>
                                                    <p>{(this.props.overlayMode ? `${attribute.name}:` : `${attribute.name.toUpperCase()}:`)}</p>
                                                    <div className={(this.props.overlayMode ? (css.textAttribute_itemsContainer + " " + css.textAttribute_itemsContainerOverlay) : css.textAttribute_itemsContainer)}>
                                                        {attribute.items.map((item, index) => {
                                                            return (
                                                                <div className={(this.props.overlayMode ? (css.textAttribute_item + " " + css.textAttribute_itemOverlay) : css.textAttribute_item) + " " +
                                                                    (element.selectedAttributes[attribute.name] === item.value.toString() ? (css.selectedTextAttribute) : null)
                                                                } key={index}>
                                                                    <p>{item.value}</p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className={(this.props.overlayMode ? (css.swatchAttribute + " " + css.swatchAttributeOverlay) : css.swatchAttribute)} key={index}>
                                                    <p>{(this.props.overlayMode ? `${attribute.name}:` : `${attribute.name.toUpperCase()}:`)}</p>
                                                    <div className={(this.props.overlayMode ? (css.swatchAttribute_itemsContainer + " " + css.swatchAttribute_itemsContainerOverlay) : css.swatchAttribute_itemsContainer)}>
                                                        {attribute.items.map((item, index) => {
                                                            return (
                                                                <div style={{"backgroundColor": item.value}} className={css.swatchAttribute_item + " " +
                                                                    (element.selectedAttributes[attribute.name] === item.value.toString() ? css.selectedSwatchAttribute : null) + " " + (this.props.overlayMode ? (css.swatchAttribute_itemOverlay) : null) + " " + ((this.props.overlayMode && element.selectedAttributes[attribute.name] === item.value.toString()) ? (css.selectedSwatchAttributeOverlay) : null)
                                                                } key={index} >
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
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
                                            <PrevImage onClick={() => handlePrevImage(index, element)} />
                                            <NextImage onClick={() => handleNextImage(index, element)} />
                                        </div>}
                                        <img src={element.gallery[this.state.selectedImgIndex[index]]} key={index} alt="" />
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