async function saveToCloudStoarage(event) {
  try {
    event.preventDefault();

    const loginDetails = {
      email: event.target.email.value,
      password: event.target.password.value
    }
    console.log('loginDetails', loginDetails);

    const response = await axios.post('http://localhost:3000/login', loginDetails)
    event.target.reset();
    alert(response.data.message)
    localStorage.setItem('token',response.data.token); 
    //when u make above request to the backend server will go inside routes folder, it finds login method inside routes file
    //server will go the control file where it performs neccesary validation such as checking wheather user logined succefully or not like that
    //login was successful backend will create token specific to that user
    //when you get response back from the server u will also get token in the front end using response.data.token
    //frontend recieves token and it stores token in localstorage
    //now onward when you make an request from the front end to the server along with request token also included in the headers
    //so that backend will identify who is logged in, if i logged in backend will comes to know that shreyas loggedin
    //backend will provide me my expense details
    window.location.href = "./expensetracker.html"   //using anchor tag after login redirecting user to the page expensetracker.html

  } catch (error) {
    const errorMessage = error.message || 'An error occured';
    const errorHtml = `
          <div class="col-lg-6 col-lg-offset-4">
            <p class="text-danger">${errorMessage}</p>
          </div>
        `;
    document.body.innerHTML += errorHtml;
  }

}