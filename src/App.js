import React, { Component } from 'react';
import Gif from './Gif';
import loader from './images/loader.svg';
import clearButton from './images/close-icon.svg'

const randomChoice = gifArray => {
  const randomIndex = Math.floor(Math.random() * gifArray.length)
  return gifArray[randomIndex]
}

const Header = ({clearSearch, hasResults}) => (
  <div className='header grid'>
    {hasResults ? 
    <button onClick={clearSearch} >
      <img src={clearButton}/>
    </button> :
    <h1 className='title'>Jiffy</h1>
    }
  </div>
)

const UserHint = ({loading, hintText}) => (
  <div className='user-hint'>
    {loading ? 
    <img className='block mx-auto' alt="hello" src={loader} /> : hintText}
  </div>

)

class App extends Component {

  constructor(props) {
    super(props)
    // our default state as we talked about in the previous section
    this.state = {
      gif: null,
      searchTerm: '',
      hintText: '',
      loading: false,
      gifs: []
    }
  }

  // we want a function that searches the giphy api using fetch and puts the search term into the query url and then we can do something with the results

  //we can also write async methods into our components that let us use the async/await style of function

  searchGiphy = async searchTerm => {
    this.setState({
      loading: true
    })
    try {
      const reponse = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=2hGhR22oviSt0u5CaVhT5lepIjhFIyjT&q=${
        searchTerm
      }&limit=25&offset=0&rating=pg&lang=en`);

      const {data} = await reponse.json();

      if(!data.length) {
        throw `Nothing found for ${searchTerm}`
      }

      const randomGif = randomChoice(data)

      this.setState((prevState, props) => ({
        ...prevState,
        //use our spread to take the prev gifs and spread them out and then add the new random gif
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }))

    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }))
      console.log(error)
    }
  }

  //with create react app we can write our methods as arrow functions, meaning we don't need the constructor and bind

  handleChange = event => {
    const {value} = event.target
    // by setting the search term in our ststae and also using that on the input as the value, we have created a "controlled input"

    this.setState((prevState, props) => ({
      //take our old props and spread them out here:
      ...prevState,
      //overwrite the props we want after:
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }))
    
  }

  handleKeyPress = event => {
    const {value} = event.target
    if (value.length > 2 && event.key === 'Enter') {
      this.searchGiphy(value)
    }
  }

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }))
    this.textInput.focus()
  }

  render() {
    const {searchTerm, gifs} = this.state;
    const hasResults = gifs.length;

    return (
      <div className="page">
        <Header 
        clearSearch={this.clearSearch}
        hasResults={hasResults} />
        <div className='search grid'>
          {this.state.gifs.map(gif => 
            <Gif {...gif} />
           )}
          <input 
          className='input grid-item' placeholder='Type something' 
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          value={searchTerm}
          ref={input => {
            this.textInput = input;
          }}/>
        </div>

        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
