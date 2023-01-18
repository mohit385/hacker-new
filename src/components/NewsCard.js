import React from 'react'

const NewsCard = ({article}) => {
  return (
    <div className='news-card'>
        <h3>{article.title}</h3>
        <a href={article.url}>Read More</a>
    </div>
  );
};

export default NewsCard;