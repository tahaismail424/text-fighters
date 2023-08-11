import React, { useState } from 'react'

const SearchBar = ({ handler, placeholderText }) => {
    
    const [searchReq, setSearchReq] = useState('');

    const updateSearchReq = (e) => setSearchReq(e.target.value);

    return (
        <form onSubmit={(e) => handler(e, searchReq)}>
            <input type="text" placeholder={placeholderText} value={searchReq} onChange={updateSearchReq}/>
            <button type="submit">Search</button>
        </form>
  )
}

export default SearchBar;