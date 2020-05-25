import React, {useState, useEffect, useCallback} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';
import LoadingIndicator from "../UI/LoadingIndicator";


const Ingredients = () => {

    const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        setIngredients(filteredIngredients);
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
            setIngredients(prevIngredients => [...prevIngredients, {id: resData.name, ...ingredient}
            ])
        });

    }

    const removeIngredientHandler = ingredientId => {
        fetch(process.env.REACT_APP_FIRE_API + `ingredients/${ingredientId}.json`, {
            method: 'DELETE'
        }).then(res => {
            setIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingredientId));
        })

    }

    const loading = isLoading ? <LoadingIndicator/> : null;

    return (
        <div className="App">
            {loading}
            <IngredientForm onAddIngredient={addIngredientHandler}/>
            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
