import React from "react";
import css from "./Category.module.css";

export default class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: "Category name",
        };
    }

    render() {
        return (
            <>
                <div className={css.container}>
                    <h2>{this.state.selectedCategory}</h2>
                    <div className={css.products}>
                    {this.props.products?.map((product) => (
                            <div className={css.product}>
                                <img src={product.image} alt={product.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}