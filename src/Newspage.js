import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import NewsCard from './components/NewsCard';


function Newspage() {

    const [articles,setArcticles]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [totalPages,setTotalPages]=useState(0);

    useEffect(() => {
      setIsLoading(true);
      const fetchData = async ()=>{
        try{
           const { data } = await axios.get("http://hn.algolia.com/api/v1/search?");
           console.log(data);
        const {hits, nbPages}=data;
        setArcticles(hits);
        setTotalPages(nbPages);

        }
        catch(err){
            console.log(err);
        }
        finally{
            setIsLoading(false);
        }
      };
      fetchData();
    }, [])
    
  return (
    <div className='container'>
        <h1>Newspage</h1> 
        <div className='news-container'>
            {
                isLoading ? (<p>Loading....</p> 
                ):(
                 articles.map((article)=>(
                    <NewsCard article={article} key={article.objectID} />
                 ))
            )}
        </div>
    </div>
  );
}

export default Newspage