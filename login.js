function checkeLogin(){
    var username = document.querySelector("#email").value;
    var password = document.querySelector("#password").value;
    // store username and password in an object called "user". store "user" in local storage and redirect to home page
    var user = {
        username: username,
        password: password
    }
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "index.html";

}