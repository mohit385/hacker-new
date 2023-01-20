import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import NewsCard from "./components/NewsCard";
import ReactPaginate from "react-paginate";
import moment from "moment";

let tags = { author: null, category: null };
let popularitySort = true;
let numericFilters = { created_at_i: null };

function Newspage() {
  const today = moment();

  const [articles, setArcticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const handlePageChange = (event) => {
    console.log(event);
    setCurrentPage(event.selected);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(0);
    setQuery(searchInput);
  };

  const handleChangeSorting = (_) => {
    popularitySort = !popularitySort;
    loadResults(popularitySort);
  };

  const getTagValue = (str) => {
    if (str === "Stories") return "story";
    if (str === "All") return null;
    if (str === "Comments") return "comment";
  };

  const getTimePeriodValue = (str) => {
    if (str === "All time") return null;
    if (str === "Last 24h")
      return ">=" + today.clone().subtract(24, "hours").unix();
    if (str === "Past Week")
      return ">=" + today.clone().subtract(1, "week").unix();
    if (str === "Past Month")
      return ">=" + today.clone().subtract(1, "month").unix();
    if (str === "Past Year")
      return ">=" + today.clone().subtract(1, "year").unix();
    return null;
  };

  const handleCategoryChange = (event) => {
    tags.category = getTagValue(event.target.value);
    loadResults(popularitySort);
  };

  const handleTimePeriodChange = (event) => {
    debugger;
    numericFilters.created_at_i = getTimePeriodValue(event.target.value);
    loadResults(popularitySort);
  };

  const loadResults = (sort = popularitySort) => {
    setIsLoading(true);
    sort = sort ? "search" : "search_by_date";
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://hn.algolia.com/api/v1/" + sort + "?",
          {
            params: {
              page: currentPage,
              query,
              tags:
                (tags.author ? "author_:" + tags.author : "") +
                (tags.category ? (tags.author ? "," : "") + tags.category : ""),
              numericFilters: numericFilters.created_at_i
                ? "created_at_i" + numericFilters.created_at_i
                : undefined,
            },
          }
        );
        console.log(data);
        const { hits, nbPages } = data;
        setArcticles(hits);
        setTotalPages(nbPages);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  };

  useEffect(() => {
    loadResults(true);
  }, [currentPage, query]);

  
  return (
    <div className="container">
      <h1>HackerNews</h1>
      <div className="navbar">
      <div className="navleft">
        <button className='damn' onClick={handleChangeSorting}>
          Sort by {popularitySort ? "Date" : "Popularity"}
        </button>
        <select className='damn'  defaultValue={"All"} onChange={handleCategoryChange}>
          <option value={"All"}>All</option>
          <option value={"Stories"}>Stories</option>
          <option value={"Comments"}>Comments</option>
        </select>
        <select className='damn' defaultValue={"All"} onChange={handleTimePeriodChange}>
          <option value={"All time"}>All time</option>
          <option value={"Last 24h"}>Last 24h</option>
          <option value={"Past Week"}>Past Week</option>
          <option value={"Past Month"}>Past Month</option>
          <option value={"Past Year"}>Past Year</option>
        </select>
      </div>
      <div className="navright">
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            placeholder="Search for the news"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <button type="submit">Search</button>
      </form>
    </div>

    </div>
      <div className="news-container">
        {isLoading ? (
          <p>Loading....</p>
        ) : (
          articles.map((article) => (
            <NewsCard
              article={article}
              key={article.objectID}
              isComment={tags.category === "comment" || !!article.comment_text}
            />
          ))
        )}
      </div>
      <div>
        <ReactPaginate
          nextLabel=">>"
          previousLabel="<<"
          breakLabel="..."
          forcePage={currentPage}
          pageCount={totalPages}
          renderOnZeroPageCount={null}
          onPageChange={handlePageChange}
          className="Pagination"
          activeClassName="active-page"
          previousClassName="previous-page"
          nextClassName="next-page"
        />
      </div>
    </div>
  );
}

export default Newspage;
