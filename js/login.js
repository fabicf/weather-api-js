// taking the current date and time
$("#today-date").text(new Date().toDateString());
$("#today-time").text(new Date().toLocaleTimeString());

// using a api with a quote of the day based on random numbers
const settings = {
  async: true,
  crossDomain: true,
  url: "https://type.fit/api/quotes",
  method: "GET",
};

$.ajax(settings).done(function (response) {
  const data = JSON.parse(response);
  //console.log(data);
  const num = Math.floor(Math.random() * data.length);
  $("#today-msg").text(data[num].text);
});
// end of quote of the day api

//fetching the ul to be displayed the errors
const loginError = $("#login-error")[0];

function login() {
  //fetcing email and password input
  const email = $("#email")[0].value;
  const password = $("#password")[0].value;

  // turn the ul's errors and weather empty - to no averload when clicked and login twice
  $("#login-error").empty();
  $("#weather-ul").empty();

  //console.log(email);
  //console.log(password);
  // validation of email and login
  if (validateLogin(email, password)) {
    if (email === "admin@mail.com" && password === "admin1234") {
      // if email and login is correct go get the data
      getData();
      // clean the email and ps inputs once get the data
      $("#email").val("");
      $("#password").val("");
    } else {
      appendError("Invalid Email Address or Password");
      // const errorText = document.createElement("li");
      // errorText.textContent = "Invalid login or password";
      // loginError.append(errorText);
    }
  }
}

// validade login
function validateLogin(email, password) {
  let isValid = true;
  let emptyEmail = "";
  let psLength = password.length;

  // general error
  if (emptyEmail == email || psLength < 6) {
    //call function to apend error
    appendError("Error! Please complete the form!");
    isValid = false;
  }

  if (email === emptyEmail) {
    appendError("Email address must be filled in!");
    isValid = false;
  }
  if (psLength < 6) {
    appendError("Password length must be at least 6 characters!");
    isValid = false;
  }
  //validate
  return isValid;
}

// first I use a "if" with a message and append for each. Then I replace with appendError function to not repeat code.
function appendError(errorPhrase) {
  const errorText = document.createElement("li");
  errorText.textContent = errorPhrase;
  loginError.append(errorText);
}

//if login is correct use api
function getData() {
  $.ajax({
    url: `http://dataservice.accuweather.com/forecasts/v1/daily/5day/56186?apikey=FdWXXqQxMeaAhuAqtZA1ejSrqJRXvxUn&metric=true`,
  })
    .done(reqListener)
    .fail(failApi);

  //URL using Fahrenheith
  //"http://dataservice.accuweather.com/forecasts/v1/daily/5day/56186?apikey=FdWXXqQxMeaAhuAqtZA1ejSrqJRXvxUn"
}

// if login is correct
function reqListener(weatherData) {
  //const weatherUl = $("#weather-ul")[0];
  weatherData.DailyForecasts.forEach((element) => {
    $("#weather-ul").append(
      `<li><span><b> Date: ${element.Date}</b> <br>Max: ${element.Temperature.Maximum.Value}${element.Temperature.Maximum.Unit} Min: ${element.Temperature.Minimum.Value}${element.Temperature.Minimum.Unit}<br>Day: ${element.Day.IconPhrase} <br>Night: ${element.Night.IconPhrase}</span></li>`
    );
  });
}

function failApi() {
  $("#weather-ul").append(`<span> <b> Error! API failed </b></span>`);
}
