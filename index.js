import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchValue: '',
      myRecipeArray: {},
      imageSrc: '',
      loading: null,
    };
  }

  //Sets the name of search object
  setName = (event) =>{
    this.setState({
      searchValue: event.target.value
    })
  };

  //function to fetch the object corresponding to search
  findRecipe = async() =>{
    this.setState({
      loading: 'LOADING'
    })
    console.log(this.state.searchValue)
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${this.state.searchValue}`);

    const myJson = await response.json();
    console.log("myJson" , myJson);

    //if fetched object is null
    if(myJson.meals == null) {    
  this.setState({
    loading: 'LOADING_FAILED'
  })
  } 

  var ingredients = myJson.meals.map(this.findIngredients);  
  var measures = myJson.meals.map(this.findMeasures);            
  this.setState({
    myRecipeArray: myJson.meals[0],
    imageSrc: myJson.meals[0].strMealThumb,
    loading: 'LOADING_DONE',
    ingredients: ingredients,
    measures: measures
  });
  console.log(this.state.myRecipeArray)
}

//function to toggle the like button
changeLike= (event) =>{
  if(event.target.style.color == "black")
    event.target.style.Color = "red";
  else
    event.target.style.color = "black";
}

//function to get ingredients
findIngredients = (object) => {
  var keys = Object.keys(object);
  console.log(keys);
  var ingredients = [];
  for(var i=0; i<keys.length; i++) {
    if(keys[i].indexOf("strIngredient") != -1) {

      if((object["" + keys[i]]) != null && object["" + keys[i]].length > 0)
        ingredients.push(object["" + keys[i]]);
    }
  }
  console.log(ingredients);
  return ingredients;
}

//function to get measures
findMeasures = (object) => {
  var keys = Object.keys(object);
  console.log(keys);
  var measures = [];
  for(var i=0; i<keys.length; i++) {
    if(keys[i].indexOf("strMeasure") != -1) {

      if((object["" + keys[i]]) != null && object["" + keys[i]].length > 0)
        measures.push(object["" + keys[i]]);
    }
  }
  console.log(measures);
  return measures;
}

//function to print ingredients and measures
getIngredients = (value, index) => {
  console.log(this.state);
  return <p>{value} ---- {this.state.measures[0][index]}</p>
}

  render() {   
    return (
      <div id="parent">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.css"/>

    <div id="header">
          <h1 id="head">Recipe Finder</h1>
         <center><input onChange={()=>this.setName(event)} value={this.state.searchValue} placeholder="Enter the Name of the Dish"/>
         <span><button onClick={this.findRecipe}>Get Recipes</button></span>
         <br/>
         <br/>
         {this.state.loading == null ? (<h2>Enter Dish Name to Search for it's recipie</h2>): ("")}</center>
    </div>

         {this.state.loading == "LOADING_FAILED" ? (<h1>No Such Data</h1>): ("")}

         {this.state.loading=="LOADING" ? (<h1>Loading....</h1>): ("")}

         {this.state.loading == "LOADING_DONE"? (
    <div id="container">

      <div id="header1">
         <div></div>
         <div><h1 id="main">{this.state.myRecipeArray.strMeal}</h1></div>
         <div><i id="heart" className="far fa-heart" onClick={this.changeLike}></i></div>
      </div>

      <div id="description">

        <div id="left">
         <img src={this.state.imageSrc}/>
        </div>

        <div id="right">
         <i>Category of the Meal - </i>{this.state.myRecipeArray.strCategory}
         <br/>
         <i>Area of the Meal - </i>{this.state.myRecipeArray.strArea}
         <br/>
         <br/>
         
         <i>Ingredients</i>
         <div id="ingredient">{this.state.ingredients[0].map(this.getIngredients)}</div>
         <i><center>Recipe</center></i>
         
         <div id="recipe">
         {this.state.myRecipeArray.strInstructions}
         </div>

        </div>
      </div>
    </div>
     ): ("")}

      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
