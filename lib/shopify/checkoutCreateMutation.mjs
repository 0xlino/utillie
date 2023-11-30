const checkoutCreateMutation = /* GraphQL */ `
  mutation($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        field
        message
        code
      }
    }
  }
`;

export {
  checkoutCreateMutation
}
