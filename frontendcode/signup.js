async function signup(event){
    try{
        event.preventDefault(); //in order to prevent reloading of page when i click on submit button

        //created object called signupDetails
        const signupDetails = {
            name: event.target.username.value,
            //This line retrieves the value entered in the input field with the name 'username' from the form.
            //It uses event.target to access the form element and .value to retrieve the entered value.
            email: event.target.email.value,
            password: event.target.password.value
            
        }
        console.log('signupDetails',signupDetails);

        const response = await axios.post('http://localhost:3000/signup',signupDetails);
        event.target.reset();
        if(response.status === 200){
            window.location.href = "./login.html" //redirecting user to login page if response was successful
            console.log('response from addmethod',response)
        }else {
            throw new error('Failed to login');
        }
    }catch (error) {
        const errorMessage = error.message || 'An error occurred';
        const errorHtml = `
          <div class="col-lg-6 col-lg-offset-4">
            <p class="text-danger">${errorMessage}</p>
          </div>
        `;
        document.body.innerHTML += errorHtml;
      }
      
      
}
