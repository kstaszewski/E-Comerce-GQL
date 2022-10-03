import React, {Component} from 'react';
import css from './AttributesDisplay.module.css';

class TextAttribute extends Component {
    constructor (props) {
        super(props);
        this.attribute = props.attribute;
        this.state = {
            selectedAttribute: props.selectedAttribute ?? undefined
        };
    }
    render () {
        const {overlayMode, onAttributeClick} = this.props;
        return (
            <>
                <div className={(overlayMode ? (css.textAttribute + " " + css.textAttributeOverlay) : css.textAttribute)} >
                    <p>{(overlayMode ? `${this.attribute.name}:` : `${this.attribute.name.toUpperCase()}:`)}</p>
                    <div className={(overlayMode ? (css.textAttribute_itemsContainer + " " + css.textAttribute_itemsContainerOverlay) : css.textAttribute_itemsContainer)}>
                        {this.attribute.items.map((item, index) => {
                            return (
                                <button
                                    className={(overlayMode ? (css.textAttribute_item + " " + css.textAttribute_itemOverlay) : css.textAttribute_item) + " " +
                                        (this.state.selectedAttribute === item.value.toString() ? (css.selectedTextAttribute) : null)}
                                    key={index}
                                    value={item.value}
                                    onClick={(e) => {
                                        if (!onAttributeClick) return;
                                        onAttributeClick(e);
                                        this.setState({
                                            selectedAttribute: e.target.value
                                        });
                                    }}>
                                    {item.value}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}

class SwatchAttribute extends Component {
    constructor (props) {
        super(props);
        this.attribute = props.attribute;
        this.state = {
            selectedAttribute: props.selectedAttribute ?? undefined
        };
    }
    render () {
        const {overlayMode, onAttributeClick} = this.props;
        return (
            <>
                <div className={(overlayMode ? (css.swatchAttribute + " " + css.swatchAttributeOverlay) : css.swatchAttribute)} >
                    <p>{(overlayMode ? `${this.attribute.name}:` : `${this.attribute.name.toUpperCase()}:`)}</p>
                    <div className={(overlayMode ? (css.swatchAttribute_itemsContainer + " " + css.swatchAttribute_itemsContainerOverlay) : css.swatchAttribute_itemsContainer)}>
                        {this.attribute.items.map((item, index) => {
                            return (
                                <button
                                    style={{"backgroundColor": item.value}} className={css.swatchAttribute_item + " " +
                                        (this.state.selectedAttribute === item.value.toString() ? css.selectedSwatchAttribute : null) + " " + (overlayMode ? (css.swatchAttribute_itemOverlay) : null) + " " + ((overlayMode && this.state.selectedAttribute === item.value.toString()) ? (css.selectedSwatchAttributeOverlay) : null)}
                                    key={index}
                                    value={item.value}
                                    onClick={(e) => {
                                        if (!onAttributeClick) return;
                                        onAttributeClick(e);
                                        this.setState({
                                            selectedAttribute: e.target.value
                                        });
                                    }}>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}

export {TextAttribute, SwatchAttribute};