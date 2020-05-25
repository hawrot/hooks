import React, {useReducer, useState, useEffect, useCallback} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET' : return action.ingredients;
        case 'ADD' : return [...currentIngredients, action.ingredient];
        case 'DELETE' : return currentIngredients.filter(ing => ing.id !== action.id);
        default:
            throw new Error('An error occurred')

    }
}

const Ingredients = () => {
     const [ingredients, dispatch ] = useReducer(ingredientReducer, []);

   // const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    const filteredIngredientsHandler = useCallback(filteredIngredients => {
       // setIngredients(filteredIngredients);
        dispatch({type: 'SET', ingredients: filteredIngredients})
    }, []);

    const addIngredientHandler = ingredient => {
        setIsLoading(true);
        fetch(process.env.REACT_APP_FIRE_API + 'ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            setIsLoading(false);
            return res.json();

        }).then(resData => {
           //setIngredients(prevIngredients => [...prevIngredients, {id: resData.name, ...ingredient}])
            dispatch({type: 'ADD', ingredient: {id: resData.name, ...ingredient} })
        });

    }

    const removeIngredientHandler = ingredientId => {
        setIsLoading(true);
        fetch(process.env.REACT_APP_FIRE_API + `ingredients/${ingredientId}.json`, {
            method: 'DELETE'
        }).then(res => {
            setIsLoading(false);
            dispatch({type: 'DELETE', id: ingredientId})
           // setIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingredientId));
        }).catch(err => {
            setError(err.message);
            setIsLoading(false);
        })

    }

    const clearError = () => {
        setError(null);
    }



    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm loading={isLoading} onAddIngredient={addIngredientHandler}/>
            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
