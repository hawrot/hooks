import React, {useState, useEffect, useCallback} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";


const Ingredients = () => {

    const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


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
        setIsLoading(true);
        fetch(process.env.REACT_APP_FIRE_API + `ingredients/${ingredientId}.json`, {
            method: 'DELETE'
        }).then(res => {
            setIsLoading(false);
            setIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingredientId));
        }).catch(err => {
            setError(err.message);
        })

    }

    const clearError = () => {
        setError(null);
        setIsLoading(false);
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
