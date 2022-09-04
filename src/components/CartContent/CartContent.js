import React, {Component} from 'react';
import css from "./CartContent.module.css";
import {Add, Remove} from './CartContent.module.svgs';

class CartContent extends Component {
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
        return (
            <>
                {console.log(this.props.data)}
                {this.props.data.length !== 0 &&
                    this.props.data.map((element, index) => {
                        return (
                            <div className={css.item} key={index}>
                                <div className={css.itemInfo}>
                                    <p className={css.brand} >{element.brand}</p>
                                    <p className={css.subtitle}>{element.name}</p>
                                    <p className={css.price} >{element.prices.map(price => {
                                        if (price.currency.label === this.props.currencyPass.label) {
                                            return (price.currency.symbol + price.amount);
                                        }
                                    })}</p>
                                    {element.attributes.map((attribute, index) => {
                                        if (attribute.type === 'text') {
                                            return (
                                                <div className={css.textAttribute} key={index}>
                                                    <p>{`${attribute.name}:`}</p>
                                                    <div className={css.textAttribute_itemsContainer}>
                                                        {attribute.items.map((item, index) => {
                                                            return (
                                                                <div className={css.textAttribute_item + " " +
                                                                    (element.selectedAttributes[attribute.name] === item.value.toString() ? (css.selectedTextAttribute) : null)
                                                                } key={index}>
                                                                    <p>{item.displayValue}</p>
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
                                                                    (element.selectedAttributes[attribute.name] === item.value.toString() ? css.selectedSwatchAttribute : null)
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
                                <div className={css.itemRightSite}>
                                    <div className={css.qtyDisplay}>
                                        <Add size={this.props.overlay ? "21" : "45"} onClick={() => addItemQty(element)} />
                                        <p>{element.quantity}</p>
                                        <Remove size={this.props.overlay ? "21" : "45"} onClick={() => removeItemQty(element)} />
                                    </div>
                                    <div className={css.photo}>
                                        <img src={element.gallery[0]} key={index} alt="" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </>
        );
    }
}

export default CartContent;