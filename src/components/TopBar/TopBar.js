import React from "react";
import css from "./TopBar.module.css";
import { Logo, Currency, Cart, Arrow } from "./TopBar.module.svgs"
import { Outlet } from "react-router-dom";

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoriesArray: props.categoriesArray
        };
    }

    render() {
        return (
            <>
                <header >
                    <nav>
                        {
                            this.props.categories.map((item, index) => {
                                return (
                                    <button className={css.topBar_categories_item} key={index} onClick={this.props.onClick}>
                                        <p>{item}</p>
                                    </button>
                                )
                            })
                        }
                    </nav>
                    <div className={css.topBar__logo}>
                        <Logo />
                    </div>
                    <div className={css.topBar__rightSide}>
                        <button className={css.topBar__currency}>
                            <Currency />
                            <Arrow />
                        </button>
                        <button className={css.topBar__cart}>
                            <Cart />
                        </button>
                    </div>
                </header>
                <Outlet />
            </>
        );
    }
}