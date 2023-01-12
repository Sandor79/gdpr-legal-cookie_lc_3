

const initialState = {
    status: 'idle',
    APP_BRIDGE: {
        ACTIONS: {
            LOADING: {

            }
        }
    },
}

export const dispatcher = (createStore) => {
    return (rootReducer, preloadedState, enhancers) => {
        const store = createStore(rootReducer, preloadedState, enhancers)

        function newDispatch(action) {
            const result = store.dispatch(action)
            console.log('Hi!')
            return result
        }

        return { ...store, dispatch: newDispatch }
    }
}
