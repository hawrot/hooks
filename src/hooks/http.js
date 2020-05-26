const httpReducer = (httpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null};
        case 'RESPONSE':
            return {...httpState, loading: false};
        case 'ERROR':
            return {loading: false, error: action.error};
        case 'CLEAR':
            return {...httpState, error: null};
        default:
            throw new Error('Should not be reached')
    }
}

const useHttp = () => {


};

export default useHttp;
