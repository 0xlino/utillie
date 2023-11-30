const checkoutLineItemReplaceMutation = /* GraphQL */ `
  mutation($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsReplace(checkoutId: $checkoutId, lineItems: $lineItems) {
      checkout {
        id
        webUrl
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export {
  checkoutLineItemReplaceMutation
}
