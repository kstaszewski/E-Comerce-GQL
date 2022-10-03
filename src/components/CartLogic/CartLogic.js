import {Component} from 'react';

class CartLogic extends Component {

    shallowEqual = (object1, object2) => {
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

    saveCart = (dataToAdd, currentCart) => {
        if (!dataToAdd || !currentCart || dataToAdd === undefined || currentCart === undefined) return;
        const {name, selectedAttributes} = dataToAdd;
        let newCart = [...currentCart];
        const existsIndex = currentCart.findIndex(item => (item.name === name && this.shallowEqual(item.selectedAttributes, selectedAttributes)));
        if (existsIndex !== -1) {
            newCart[existsIndex].quantity += 1;
        } else {
            let randomCartId;
            do randomCartId = Math.floor(Math.random() * 1000);
            while (currentCart.map(cartItem => cartItem.cartId).includes(randomCartId));
            dataToAdd.cartId = randomCartId;
            dataToAdd.quantity = 1;
            newCart.push(dataToAdd);
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
        return {cart: newCart};
    };

    addItemQty = ({name, selectedAttributes}) => {
        if (name === undefined || selectedAttributes === undefined) return;
        const {data, forceUpdate} = this.props;
        let newCart = [...data];
        const existsIndex = data.findIndex(item => (item.name === name && this.shallowEqual(item.selectedAttributes, selectedAttributes)));
        if (existsIndex !== -1) {
            newCart[existsIndex].quantity += 1;
        } else {
            return;
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
        forceUpdate();
    };

    removeItemQty = ({name, selectedAttributes}) => {
        if (name === undefined || selectedAttributes === undefined) return;
        const {data, forceUpdate} = this.props;
        let newCart = [...data];
        const existsIndex = data.findIndex(item => (item.name === name && this.shallowEqual(item.selectedAttributes, selectedAttributes)));
        if (existsIndex !== -1 && newCart[existsIndex].quantity !== 1) {
            newCart[existsIndex].quantity -= 1;
        } else {
            newCart.splice(existsIndex, 1);
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
        forceUpdate();
    };

    totalValue = (cart, currency) => {
        if (!cart || cart === undefined || !currency || currency === undefined) return;
        return cart.reduce((prev, current) => {
            const singlePrice = current.prices.filter((el) => {
                return el.currency.label === currency.label;
            });
            return prev + parseFloat(singlePrice[0]?.amount * current.quantity);
        }, 0);
    };
}
export default CartLogic;