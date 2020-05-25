import React, {useState, useEffect} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

    const { onLoadIngredients } = props;

    const [enteredFilter, setEnteredFilter] = useState('');

    useEffect(() => {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(process.env.REACT_APP_FIRE_API + 'ingredients.json' + query)
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
                onLoadIngredients(loadedIngredient);
            })
    }, [enteredFilter, onLoadIngredients]);

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)} type="text"/>
                </div>
            </Card>
        </section>
    );
});

export default Search;
