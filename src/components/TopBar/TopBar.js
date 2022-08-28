import React from "react";
import css from "./TopBar.module.css";
import { Logo, Currency, Cart, Arrow, ArrowUp } from "./TopBar.module.svgs"
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import withRouter from "../withRouter/withRouter";
import { Client } from '../../GraphQl/Client';
import { GET_TOPBAR_DATA } from "../../GraphQl/Queries"

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoriesArray: [],
            active: "all",
            currencyDisplayed: false,
            currencies: [],
            activeCurrency: {}
        };
    }

    componentDidMount() {
        Client.query({
            query: GET_TOPBAR_DATA,
        }).then(res => {
            this.setState(() => {
                let arr = [];
                res.data.categories.forEach(category => {
                    if (category.products.length > 0) arr.push(category.name.toUpperCase())
                })
                return (
                    { currencies: res.data.currencies, activeCurrency: res.data.currencies[0], categoriesArray: arr }
                )
            })
            this.props.currencyChange(res.data.currencies[0])

        })
    }
    componentDidUpdate() {

    }

    render() {
        return (
            <>
                <header >
                    <nav>
                        {
                            this.state.categoriesArray.map((item, index) => {
                                return (
                                    <NavLink className={({ isActive }) => { return isActive ? css.active : "" }} to={`/${item.toLowerCase()}`} id={item} key={index}>
                                        <p>{item}</p>
                                    </NavLink>
                                )
                            })
                        }
                    </nav>
                    <div className={css.topBar__logo}>
                        <Logo />
                    </div>
                    <div className={css.topBar__rightSide}>
                        <button className={css.topBar__currency} onMouseEnter={() => this.setState({ currencyDisplayed: true })} onMouseLeave={() => this.setState({ currencyDisplayed: false })}>
                            <div>
                                <p className={css.currency_symbol}>{this.state.activeCurrency.symbol}</p>
                                {this.state.currencyDisplayed ? <ArrowUp /> : <Arrow />}
                            </div>
                            <div style={{}} className={css.topBar__currencyMenu}>
                                {this.state.currencies.map((currency, index) => {
                                    return (
                                        <div className={css.currency} key={index} id={currency.label} onClick={(e) => { this.setState({ activeCurrency: currency }); this.props.currencyChange(currency) }}>
                                            <p>{`${currency.symbol} ${currency.label}`}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </button>
                        <button className={css.topBar__cart}>
                            <Cart />
                        </button>
                    </div>
                </header >
                <Outlet />
            </>
        );
    }
}
export default withRouter(TopBar)