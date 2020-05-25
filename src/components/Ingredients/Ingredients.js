import React, {useState, useEffect} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';


const Ingredients = () => {

    const [ingredients, setIngredients] = useState([]);

    useEffect(() =>{
        fetch(process.env.REACT_APP_FIRE_API + 'ingredients.json')
            .then(res => res.json())
            .then(resData =>{
                const loadedIngredient = [];
            for (const key in resData){
                loadedIngredient.push({
                    id: key,
                    title: resData[key].title,
                    amount: resData[key].amount
                });
            }
            setIngredients(loadedIngredient);
        })
    }, []);



    const addIngredientHandler = ingredient => {
        fetch(process.env.REACT_APP_FIRE_API + 'ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            return res.json();

        }).then(resData => {
            setIngredients(prevIngredients => [...prevIngredients, {id: resData.name, ...ingredient}
            ])
        });

    }

    const removeIngredientHandler = ingredientId => {
        setIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingredientId));
    }

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientHandler}/>
            <section>
                <Search/>
                <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
