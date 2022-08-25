import React from "react";
import css from "./TopBar.module.css";
import { Logo, Currency, Cart, Arrow, ArrowUp } from "./TopBar.module.svgs"
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import withRouter from "../withRouter/withRouter";
import { Client } from '../../GraphQl/Client';
import { GET_CURRENCIES_DATA } from "../../GraphQl/Queries"

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoriesArray: props.categoriesArray,
            active: "all",
            currencyDisplayed: false,
            currencies: [],
            activeCurrency: {}
        };
    }

    componentDidMount() {
        Client.query({
            query: GET_CURRENCIES_DATA,
        }).then(res => {
            this.setState({ currencies: res.data.currencies })
            this.setState({ activeCurrency: res.data.currencies[0] })
            this.props.currencyChange(res.data.currencies[0])
        })
    }
    componentDidUpdate() {
        if (this.props.params.category !== this.state.active && this.props.params.category)
            this.setState({
                active: this.props.params.category,
            })
    }

    render() {
        return (
            <>
                <header >
                    <nav>
                        {
                            this.props.categories.map((item, index) => {
                                return (
                                    <Link to={`/${item.toLowerCase()}`} className={(this.state.active === item.toLowerCase()) ? css.active : ""} id={item} key={index}>
                                        <p>{item}</p>
                                    </Link>
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
                                        <div className={css.currency} index={index} id={currency.label} onClick={(e) => { this.setState({ activeCurrency: currency }); this.props.currencyChange(currency) }}>
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