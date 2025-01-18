function makeLogin(){
    var fullname = document.querySelector("#name").value;
    var email = document.querySelector("#email").value;
    var password = document.querySelector("#password").value;
   
    // upload user details
    var user = JSON.parse(localStorage.getItem('userLoginDetails'));
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://smebackendmain.onrender.com/api/post', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
                email:email,
                password:password,
                fullname:fullname}));
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            if(response.admin == false){
                // store username and password in an object called "user". store "user" in local storage and redirect to home page
                var user = {
                    username: email,
                    password: password,
                }
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "index.html";
            }
        }
    }
    

}