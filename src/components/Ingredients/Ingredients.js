import React, {useReducer, useState, useEffect, useCallback, useMemo} from 'react';
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



const Ingredients = () => {
    const [ingredients, dispatch] = useReducer(ingredientReducer, []);


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

    const removeIngredientHandler = useCallback(ingredientId => {
        dispatchHttp({type: 'SEND'})


    }, []);

    const clearError = useCallback(() => {
        dispatchHttp({type: 'CLEAR'})
    }, [])
    const ingredientList = useMemo(() => {
            return (
                <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
            )
        }, [ingredients, removeIngredientHandler]);

    return (
        <div className="App">
            {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
            <IngredientForm loading={httpState.loading} onAddIngredient={addIngredientHandler}/>
            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {ingredientList}
            </section>
        </div>
    );
}

export default Ingredients;
