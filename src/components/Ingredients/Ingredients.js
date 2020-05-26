import React, {useReducer, useState, useEffect, useCallback, useMemo} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

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
    const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier} = useHttp();

    useEffect(() => {
        if (!isLoading && !error && reqIdentifier === 'REMOVE') {
            dispatch({type: 'DELETE', id: reqExtra})
        } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
            dispatch({type: 'ADD', ingredient: {id: data.name, ...reqExtra}})
        }

    }, [data, reqExtra, reqIdentifier, isLoading, error])


    const filteredIngredientsHandler = useCallback(filteredIngredients => {

        dispatch({type: 'SET', ingredients: filteredIngredients})
    }, []);

    const addIngredientHandler = useCallback(ingredient => {

        sendRequest(process.env.REACT_APP_FIRE_API + 'ingredients.json', 'POST', JSON.stringify(ingredient), ingredient, 'ADD_INGREDIENT');

    }, [sendRequest])

    const removeIngredientHandler = useCallback(ingredientId => {
        sendRequest(process.env.REACT_APP_FIRE_API + `ingredients/${ingredientId}.json`, 'DELETE', null, ingredientId, 'REMOVE');

    }, [sendRequest]);

    const clearError = useCallback(() => {

    }, [])
    const ingredientList = useMemo(() => {
        return (
            <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
        )
    }, [ingredients, removeIngredientHandler]);

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm loading={isLoading} onAddIngredient={addIngredientHandler}/>
            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {ingredientList}
            </section>
        </div>
    );
}

export default Ingredients;
