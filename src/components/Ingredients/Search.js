import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from "../../hooks/http";
import ErrorModal from "../UI/ErrorModal";

const Search = React.memo(props => {
    const {onLoadIngredients} = props;
    const inputRef = useRef();
    const [enteredFilter, setEnteredFilter] = useState('');
    const  { isLoading, data, error, sendRequest, clear } = useHttp();

    useEffect(() => {
        const timer =  setTimeout(() => {
            if (enteredFilter === inputRef.current.value) {
                const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
                sendRequest(process.env.REACT_APP_FIRE_API + 'ingredients.json' + query, 'GET')
            }
        }, 500);
        return () => {clearTimeout(timer)};
    }, [enteredFilter, sendRequest, inputRef]);

    useEffect(() => {
        if(!isLoading && !error && data){
            const loadedIngredient = [];
            for (const key in data) {
                loadedIngredient.push({
                    id: key,
                    title: data[key].title,
                    amount: data[key].amount
                });
            }
            onLoadIngredients(loadedIngredient);
        }
    }, [data, isLoading, error, onLoadIngredients])

    return (
        <section className="search">
            {error & <ErrorModal onClose={clear}>{error}</ErrorModal>}
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    {isLoading && <span>LOADING...</span>}
                    <input ref={inputRef} value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)}
                           type="text"/>
                </div>
            </Card>
        </section>
    );
});

export default Search;
