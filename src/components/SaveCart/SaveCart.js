import {Component} from 'react';

class SaveCart extends Component {

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

    addItemQty = data => {
        if (!data || data === undefined) return;
        let newCart = [...this.props.data];
        const existsIndex = this.props.data.findIndex(item => (item.name === data.name && this.shallowEqual(item.selectedAttributes, data.selectedAttributes)));
        if (existsIndex !== -1) {
            newCart[existsIndex].quantity += 1;
        } else {
            return;
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
        this.props.forceUpdate();
    };

    removeItemQty = data => {
        if (!data || data === undefined) return;
        let newCart = [...this.props.data];
        const existsIndex = this.props.data.findIndex(item => (item.name === data.name && this.shallowEqual(item.selectedAttributes, data.selectedAttributes)));
        if (existsIndex !== -1 && newCart[existsIndex].quantity !== 1) {
            newCart[existsIndex].quantity -= 1;
        } else {
            newCart.splice(existsIndex, 1);
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
        this.props.forceUpdate();
    };
}
export default SaveCart;