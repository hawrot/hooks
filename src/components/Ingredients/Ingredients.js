import React, {useReducer, useState, useEffect, useCallback} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET' :
            return action.ingredients;
        case 'ADD' :
            return [...currentIngredients, action.ingredient];
        case 'DELETE' :
            return currentIngredients.filter(ing => ing.id !== action.id);
        default:
            throw new Error('An error occurred')

    }
}

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

const Ingredients = () => {
    const [ingredients, dispatch] = useReducer(ingredientReducer, []);
    const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});

    // const [ingredients, setIngredients] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState('');


    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        // setIngredients(filteredIngredients);
        dispatch({type: 'SET', ingredients: filteredIngredients})
    }, []);

    const addIngredientHandler = useCallback(ingredient => {
        dispatchHttp({type: 'SEND'})
        fetch(process.env.REACT_APP_FIRE_API + 'ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            dispatchHttp({type: 'RESPONSE'});
            return res.json();

        }).then(resData => {
            //setIngredients(prevIngredients => [...prevIngredients, {id: resData.name, ...ingredient}])
            dispatch({type: 'ADD', ingredient: {id: resData.name, ...ingredient}})
        });

    }, [])

    const removeIngredientHandler = ingredientId => {
        dispatchHttp({type: 'SEND'})
        fetch(process.env.REACT_APP_FIRE_API + `ingredients/${ingredientId}.json`, {
            method: 'DELETE'
        }).then(res => {
            dispatchHttp({type: 'RESPONSE'})
            dispatch({type: 'DELETE', id: ingredientId})
            // setIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingredientId));
        }).catch(err => {
            dispatchHttp({type: 'ERROR', error: err.message})
        })

    }

    const clearError = () => {
        dispatchHttp({type: 'CLEAR'})
    }


    return (
        <div className="App">
            {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
            <IngredientForm loading={httpState.loading} onAddIngredient={addIngredientHandler}/>
            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
