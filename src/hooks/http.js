import {useReducer, useCallback} from 'react';

const httpReducer = (httpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null};
        case 'RESPONSE':
            return {...httpState, loading: false, data: action.resData};
        case 'ERROR':
            return {loading: false, error: action.error};
        case 'CLEAR':
            return {...httpState, error: null};
        default:
            throw new Error('Should not be reached')
    }
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, {
        loading: false,
        error: null,
        data: null
    });

    const sendRequest = useCallback( (url, method, body) => {
        dispatchHttp({type: 'SEND'});

        fetch(url, {
            method: method,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(resData => {
            dispatchHttp({type: 'RESPONSE', resData: resData})
        })
            .catch(err => {
            dispatchHttp({type: 'ERROR', error: err.message})
        })
    }, []);

    return {
        isLoading: httpState.loading,
        error: httpState.error,
        data: httpState.data,
        sendRequest: sendRequest
    };

};

export default useHttp;


//process.env.REACT_APP_FIRE_API + `ingredients/${ingredientId}.json`,
