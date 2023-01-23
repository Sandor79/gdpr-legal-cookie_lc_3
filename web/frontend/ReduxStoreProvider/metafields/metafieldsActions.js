import {
    GET_METAFIELDS_FETCH_INIT,
    GET_METAFIELDS_FETCH_REQUEST,
    GET_METAFIELDS_FETCH_SUCCSSES,
    GET_METAFIELDS_FETCH_FAILURE
} from "./metafieldsTypes";

export const setStep = step => ({
    type : "SET_STEP",
    payload : step
})

export const Init = ({ namespace, key }) => ({
    type : GET_METAFIELDS_FETCH_INIT,
    payload : `/api/metafield/namespace/${ namespace }/key/${ key }`
})

export const Request = () => ({
    type : GET_METAFIELDS_FETCH_REQUEST
})

export const Succsses = metafield => ({
    type : GET_METAFIELDS_FETCH_SUCCSSES,
    payload : metafield
})

export const Failure = error => ({
    type : GET_METAFIELDS_FETCH_FAILURE,
    payload : error
})

export const metafieldsActions = [
    { step: 0, storePath: "metafields", key : "METAFIELDS_FETCH::SET_STEP", action : setStep },
    { step: 1, storePath: "metafields", key : GET_METAFIELDS_FETCH_INIT, action : Init },
    { step: 2, storePath: "metafields", key : GET_METAFIELDS_FETCH_REQUEST, action : Request },
    { step: 3, storePath: "metafields", key : GET_METAFIELDS_FETCH_SUCCSSES, action : Succsses },
    { step: 4, storePath: "metafields", key : GET_METAFIELDS_FETCH_FAILURE, action : Failure }
]
