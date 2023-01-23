import {
    SET_SHOP_DOMAIN
} from "./_types";

export const setShopDomain = shopDomain => ({
    type : SET_SHOP_DOMAIN,
    payload : shopDomain
});
