/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import TextPlaceholder from 'Component/TextPlaceholder';
import { PriceType } from 'Type/ProductList';
import { MixType } from 'Type/Common';

import './ProductPrice.style';

/**
 * Product price
 * @class ProductPrice
 * @namespace Component/ProductPrice/Component
 */
export class ProductPrice extends ExtensiblePureComponent {
    static propTypes = {
        isSchemaRequired: PropTypes.bool,
        roundedRegularPrice: PropTypes.string,
        priceCurrency: PropTypes.string,
        discountPercentage: PropTypes.number,
        formatedCurrency: PropTypes.string,
        variantsCount: PropTypes.number,
        currency: PropTypes.string,
        price: PriceType,
        mix: MixType
    };

    static defaultProps = {
        isSchemaRequired: false,
        roundedRegularPrice: '0',
        priceCurrency: 'USD',
        discountPercentage: 0,
        formatedCurrency: '0',
        variantsCount: 0,
        currency: '$',
        mix: {},
        price: {}
    };

    renderPlaceholder() {
        const { mix } = this.props;

        return (
            <p block="ProductPrice" aria-label="Product Price" mix={ mix }>
                <TextPlaceholder mix={ { block: 'ProductPrice', elem: 'Placeholder' } } length="custom" />
            </p>
        );
    }

    getCurrentPriceSchema() {
        const { isSchemaRequired, variantsCount } = this.props;

        if (variantsCount > 1) {
            return isSchemaRequired ? { itemProp: 'lowPrice' } : {};
        }

        return isSchemaRequired ? { itemProp: 'price' } : {};
    }

    renderCurrentPrice() {
        const {
            discountPercentage,
            formatedCurrency,
            currency
        } = this.props;

        const schema = this.getCurrentPriceSchema();

        // Use <ins></ins> <del></del> to represent new price and the old (deleted) one
        const PriceSemanticElementName = discountPercentage > 0 ? 'ins' : 'span';

        return (
            <PriceSemanticElementName>
                <data
                  value={ formatedCurrency }
                >
                    <span>{ currency }</span>
                    <span { ...schema }>{ formatedCurrency }</span>
                </data>
            </PriceSemanticElementName>
        );
    }

    renderOldPrice() {
        const {
            roundedRegularPrice,
            discountPercentage,
            isSchemaRequired,
            variantsCount
        } = this.props;

        const schema = isSchemaRequired && variantsCount > 1 ? { itemProp: 'highPrice' } : {};

        return (
            <del
              block="ProductPrice"
              elem="HighPrice"
              mods={ { isVisible: discountPercentage > 0 } }
              aria-label={ __('Old product price') }
              { ...schema }
            >
                { roundedRegularPrice }
            </del>
        );
    }

    renderSchema() {
        const { isSchemaRequired, priceCurrency } = this.props;

        if (isSchemaRequired) {
            return (
                <meta itemProp="priceCurrency" content={ priceCurrency } />
            );
        }

        return null;
    }

    render() {
        const {
            price: { minimalPrice, regularPrice },
            formatedCurrency,
            currency,
            mix
        } = this.props;

        if (!minimalPrice || !regularPrice) {
            return this.renderPlaceholder();
        }

        return (
            <p
              block="ProductPrice"
              mix={ mix }
              aria-label={ `Product price: ${ formatedCurrency }${ currency }` }
            >
                { this.renderCurrentPrice() }
                { this.renderOldPrice() }
                { this.renderSchema() }
            </p>
        );
    }
}

export default ProductPrice;
