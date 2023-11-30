class ShopifyStorefrontClient {
    constructor(options) {
        this.options = options
        this.shopDomain = options.shopDomain
            .replace(/^https?:\/\//, "")
            .replace(/\/$/, "")
        this.accessToken = options.storefrontAccessToken
        this.apiVersion = options.apiVersion
    }

    async request(query, variables) {
        const response = await fetch(
            `https://${this.shopDomain}/api/${this.apiVersion}/graphql.json`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": this.accessToken
                },
                body: JSON.stringify({ query, variables })
            }
        )
        const json = await response.json()
        if (json.errors) {
            const msg = "Shopify Storefront API error"
            console.error(msg, json.errors)
            // Current typescript target doesn't know about second argument to Error
            // @ts-ignore
            throw new Error(msg, {
                cause: {
                    errors: json.errors,
                    response: json,
                    query,
                    variables: JSON.stringify(variables, null, 2)
                }
            })
        }
        return json.data
    }
}

export {
    ShopifyStorefrontClient
}