import React from "react";
import css from "./TopBar.module.css";
import withRouter from "../withRouter/withRouter";
import CartLogic from "../CartLogic/CartLogic";

import {Logo, Cart, Arrow, ArrowUp} from "./TopBar.module.svgs";
import {Link, Outlet} from "react-router-dom";
import {NavLink} from "react-router-dom";
import {Client} from '../../GraphQl/Client';
import {GET_TOPBAR_DATA} from "../../GraphQl/Queries";
import CartContent from "../CartContent/CartContent";

class TopBar extends CartLogic {
    constructor (props) {
        super(props);
        this.state = {
            categoriesArray: [],
            active: "all",
            currencyDisplayed: false,
            currencies: [],
            activeCurrency: JSON.parse(localStorage.getItem("activeCurrency")) ?? {},
            cart: [],
            cartOverlayDisplayed: false,
        };
        this.currencyRef = React.createRef();
    }

    componentDidMount () {
        Client.query({
            query: GET_TOPBAR_DATA,
        }).then(res => {
            this.setState(() => {
                let arr = [];
                res.data.categories.forEach(category => {
                    if (category.products.length > 0) arr.push(category.name.toUpperCase());
                });
                return (
                    {currencies: res.data.currencies, categoriesArray: arr, activeCurrency: this.state.activeCurrency.label ? this.state.activeCurrency : res.data.currencies[0]}
                );
            });
            this.props.currencyChange(this.state.activeCurrency.label ? this.state.activeCurrency : res.data.currencies[0]);
        });
    }
    componentDidUpdate () {
        if (this.state.currencyDisplayed) document.addEventListener("mousedown", this.handleClickOutside);
        else document.removeEventListener("mousedown", this.handleClickOutside);
        if (this.props.cart && JSON.stringify(this.props.cart) !== JSON.stringify(this.state.cart)) this.setState({cart: this.props.cart});
    }

    componentWillUnmount () {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.currencyRef && !this.currencyRef.current.contains(event.target)) {
            this.setState({currencyDisplayed: false});
        }
    };

    render () {
        const {cart, currencyChange, forceUpdate} = this.props;
        return (
            <>
                <header >
                    <nav>
                        {
                            this.state.categoriesArray.map((item, index) => {
                                return (
                                    <NavLink className={({isActive}) => {return isActive ? css.active : "";}} to={`/${item.toLowerCase()}`} id={item} key={index}>
                                        <p>{item}</p>
                                    </NavLink>
                                );
                            })
                        }
                    </nav>
                    <div className={css.logo}>
                        <Logo />
                    </div>
                    <div className={css.rightSide}>
                        <button ref={this.currencyRef} className={css.currency} onClick={() => this.setState({currencyDisplayed: !this.state.currencyDisplayed})}>
                            <div>
                                <p className={css.currency_symbol}>{this.state.activeCurrency.symbol}</p>
                                {this.state.currencyDisplayed ? <ArrowUp /> : <Arrow />}
                            </div>
                            <div className={css.currencyMenu} style={{display: this.state.currencyDisplayed ? "block" : "none"}}>
                                {this.state.currencies.map((currency, index) => {
                                    return (
                                        <div className={css.currency + " " + (currency.label === this.state.activeCurrency.label ? css.activeCurrency : null)} key={index} id={currency.label} onClick={(e) => {this.setState({activeCurrency: currency}); currencyChange(currency); localStorage.setItem("activeCurrency", JSON.stringify(currency));}}>
                                            <p>{`${currency.symbol} ${currency.label}`}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </button>
                        <div className={css.cartWrapper} onMouseEnter={() => this.setState({cartOverlayDisplayed: true})} onMouseLeave={() => this.setState({cartOverlayDisplayed: false})}>
                            <NavLink className={css.cart} to={`/cart`} >
                                <div className={css.cartIndicator + " " + (this.state.cart.length === 0 ? css.inactive : null)}>
                                    <p>{this.state.cart.reduce((prev, current) => prev + current.quantity, 0)}</p>
                                </div>
                                <Cart />
                            </NavLink>
                            <div className={css.cartOverlay}>
                                <div className={css.cartOverlayInner}>
                                    <div className={css.cartOverlayTitleWrapper}>
                                        <p className={css.cartOverlayTitle}>{`My Bag, `}</p>
                                        <p className={css.cartOverlayTitle}>{`${this.state.cart.reduce((prev, current) => prev + current.quantity, 0)} ${this.state.cart.reduce((prev, current) => prev + current.quantity, 0) > 1 ? "items" : "item"}`}</p>
                                    </div>
                                    <CartContent
                                        data={cart}
                                        currencyPass={this.state.activeCurrency}
                                        forceUpdate={forceUpdate}
                                        overlayMode={true}
                                        turnOffOverlayBackground={() => this.setState({cartOverlayDisplayed: false})}
                                    />
                                    <div className={css.cartTotalPrice}>
                                        <p>Total</p>
                                        <p>{this.state.activeCurrency.symbol + ((isNaN(this.totalValue(cart, this.state.activeCurrency)) || this.totalValue(cart, this.state.activeCurrency) === 0) ? "0" : (Math.round((this.totalValue(cart, this.state.activeCurrency) + Number.EPSILON) * 100) / 100).toFixed(2))}</p>
                                    </div>
                                    <div className={css.cartOverlayButtons}>
                                        <Link to={'cart'}><button type="button">VIEW BAG</button></Link>
                                        <Link to={'#'}><button type="submit">CHECK OUT</button> </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={css.cartOverlayBackground} style={{display: this.state.cartOverlayDisplayed ? "block" : "none", height: (window.document.body.clientHeight < window.innerHeight) ? window.innerHeight - 80 + 'px' : window.document.body.clientHeight - 80 + 'px'}} />
                    </div>
                </header >
                <Outlet />
            </>
        );
    }
}
export default withRouter(TopBar);