import { checkoutLineItemReplaceMutation } from './checkoutLineItemReplaceMutation.mjs';

function updateShopifyCheckout(client) {
    // const client = useShopifyStorefrontClient()
    return async (
        checkoutId,
        lineItems,
        email,
        shippingAddress,
        billingAddress
    ) => {
        const response = await client.request(checkoutLineItemReplaceMutation, {
            input: {
                checkoutId: checkoutId,
                lineItems: lineItems,
                email: email,
                shippingAddress: shippingAddress,
                billingAddress: billingAddress
            }
        });
        //@ts-expect-error
        if (!response?.checkoutLineItemsReplace) {
            return null;
        }
        //@ts-expect-error
        const { checkout, userErrors } = response.checkoutLineItemsReplace;
        if (userErrors.length > 0) {
            if (userErrors.some(
                userError => userError.code === "ALREADY_COMPLETED" ||
                    userError.code === "INVALID"
            )) {
                return null;
            }
            console.error(userErrors);
            throw new Error("checkout unavailable");
        }
        return checkout;
    };
}

export {
    updateShopifyCheckout
}
