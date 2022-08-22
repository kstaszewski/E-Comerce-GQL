import React from "react";
import css from "./TopBar.module.css";
import { Logo, Currency, Cart, Arrow, ArrowUp } from "./TopBar.module.svgs"
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import withRouter from "../withRouter/withRouter";

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoriesArray: props.categoriesArray,
            active: "all",
            currencyDisplayed: false,
            currencies: ["USD", "EUR", "JPY"]
        };
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
                            <Currency />
                            {this.state.currencyDisplayed ? <ArrowUp/> : <Arrow />}
                            < div style={{}} className={css.topBar__currencyMenu}>
                                {this.state.currencies.map((currency, index) => {
                                    return (
                                        <div className={css.currency} index={index} id={currency}>
                                            <p>{currency}</p>
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