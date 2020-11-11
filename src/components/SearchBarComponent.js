import React from 'react';
import {connect} from 'react-redux';
import { setfilterText }  from '../actions/filter';

const SearchBarComponent = (props) => {
    const setFilterText = (e) => props.setfilterText(e.target.value);
    return (
    <div className="searchBar">
        <input 
        placeholder="Search"
        value={props.search}
        className="searchBarInput" 
        type="text"
        onChange={setFilterText}/>    
        <button
        onClick={() => props.history.push(`/me/users/find=${props.search.replace(/ /g, '_')}`)} 
        className="kuro__search__button">Find</button>
    </div>
)};

const mapStateToProps = (state) => ({
    search: state.filter.text
});

const mapDispatchToProps = (dispatch) => ({
    setfilterText: (text) => dispatch(setfilterText(text))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarComponent);