import { setLocalCheckout } from './setLocalCheckout.mjs';
import { checkoutCreateMutation } from './checkoutCreateMutation.mjs';

function createShopifyCheckout(client) {
    // const client = useShopifyStorefrontClient()
    return async (lineItems, email, shippingAddress, billingAddress) => {
        const response = await client.request(checkoutCreateMutation, {
            input: {
                lineItems: lineItems,
                email: email,
                shippingAddress: shippingAddress,
                billingAddress: billingAddress
            }
        });
        if (!response?.checkoutCreate) {
            throw new Error("checkout unavailable");
        }
        const { checkout, checkoutUserErrors } = response.checkoutCreate;
        if (checkoutUserErrors.length > 0) {
            console.error(checkoutUserErrors);
            throw new Error("checkout unavailable");
        }
        setLocalCheckout({
            id: checkout.id,
        });
        return checkout;
    };
}

export {
    createShopifyCheckout
}
