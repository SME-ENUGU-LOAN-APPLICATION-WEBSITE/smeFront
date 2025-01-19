checkLogin();
function checkLogin(){
    // if there is no user logged in, redirect to login page
    if(!localStorage.getItem('user')){
        window.location.href = 'login.html';
        // console.log('No user logged in');
    }
    // if there is a user logged in, send a request to the server to check if the user is still valid. it should expect a response that first tells if the user is valid and second shows if the user is an admin or just user. If not, redirect to login page
    else{
        var user = JSON.parse(localStorage.getItem('user'));
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://smebackendmain.onrender.com/api/checkUser', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({username: user.username, password: user.password}));
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                var response = JSON.parse(xhr.responseText);
                console.log("response is: ",response);
                if(response.valid == false){
                    // if the user is not valid, redirect to login page and remove the user from the local storage
                    localStorage.removeItem('user');
                    // console.log('User is not valid');
                    window.location.href = 'login.html';
                }
                else{
                    if(response.admin == false){
                        // if the user is not an admin, hide the admin details
                        console.log('User is not an admin');
                        // document.getElementById('admin').style.display = 'none'; 
                    }
                    // save userdetails in local storage
                    // Create the user object
                    const userLoginDetails = {
                        username: user.username,
                        cookie: response.usercookie,
                        admin: response.admin,
                        valid: response.valid
                    };
                    
                    // Convert the user object to a JSON string
                    const userJSONS = JSON.stringify(userLoginDetails);
                    
                    // Store the JSON string in localStorage under the key "user"
                    localStorage.setItem("userLoginDetails", userJSONS);
                    
                    console.log("User Details stored in localStorage!");

                    console.log("You are logged in as " + user.username);
                    // showQuestionnaire();
                }
            }
        }
    }
    adminResponse();


}

function adminResponse(){
    // var user = JSON.parse(localStorage.getItem('userLoginDetails'));
    // if(user.admin == false){
    //     document.getElementById('admin').style.display = 'none'; 
    // }
        // change the class of the login button to loggedIn if the user is logged in and not an admin. if the user is an admin, change redirect to admin page
        if(localStorage.getItem('user')){
            var user = JSON.parse(localStorage.getItem('user'));
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://smebackendmain.onrender.com/api/checkUser', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({username: user.username, password: user.password}));
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4 && xhr.status == 200){
                    var response = JSON.parse(xhr.responseText);
                    if(response.valid == true){
                        if(response.admin == false){
                            // document.querySelector('.checklogin').className = 'loggedIn';
                            console.log("admin response, you are not an admin and logged in as " + user.username);
                            window.location.href = 'homepageU.html';
                        }
                        else{
                            // window.location.href = 'admin.html';
                            console.log("admin response, you are an admin")
                        }
                    }
                }
            }
        }
    
}

function getApplications(){
    // get all applications and put in applicationsHold
    if(localStorage.getItem('user')){
        var user = JSON.parse(localStorage.getItem('user'));
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://smebackendmain.onrender.com/api/adminGetAll', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            username: user.username
        }));
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                var response = JSON.parse(xhr.responseText);
                // code from here
               console.log("Application Response Data is: ", response)

                // let applciIdBox = document.querySelector('.application p:nth-of-type(1)')
               response.forEach(application => {
                let applicationsHold = document.querySelector('.applicationsHold');

                applicationsHold.innerHTML += `
                <div class="application" onclick="activityShow('${application.id}','${application.businessInfo.businessName}','${application.loanAmount}','${ new Date(application.dateSubmitted).toDateString() }','${application.loanStatus}')">
                    <p>#${application.id}</p>
                    <p>${application.businessInfo.businessName}</p>
                    <p>${application.loanAmount}</p>
                    <p>${ new Date(application.dateSubmitted).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      }) }
                    </p>
                    <p>${application.loanStatus}</p>
                </div>`
               });
            }
        }
    }
}
getApplications()



function activityShow(applicID,bizName,loanAmount,timeSubmitted,loanStatus){
    document.querySelector(".contentHeading").innerHTML = `Application #${applicID}`;

    if(loanStatus == "Accepted"){
        document.querySelector(".statusBox").innerHTML = `
            <p>Status</p>
            <h2>Under Review<span> - accepted</span></h2><!-- we have under review - pending, - accepted and plain old rejected-->`;

        // document.querySelector("section.activityHold").innerHTML = `
        // <div class="activity">
        //         <p>Submitted</p>
        //         <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
        // </div>
        // <div class="activity">
        //         <p>Accepted</p>
        //         <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
        // </div>`

         // get all details for this application
         if(localStorage.getItem('user')){
            var user = JSON.parse(localStorage.getItem('user'));
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://smebackendmain.onrender.com/api/adminGetOne', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                id: applicID
            }));
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4 && xhr.status == 200){
                    var response = JSON.parse(xhr.responseText);
                    // code from here
                    document.querySelector(".buttonHold").innerHTML = ` `;
                    console.log("responzio",response)
                    let activityHold = document.querySelector("section.activityHold")
                    activityHold.innerHTML = `
                        <div class="activity">
                            <p>Fullname</p>
                            <p>${response[0].personalInfo.fullname}</p>
                        </div>
                        <div class="activity">
                            <p>Date of Birth</p>
                            <p>${response[0].personalInfo.dateofbirth}</p>
                        </div>
                        <div class="activity">
                            <p>Gender</p>
                            <p>${response[0].personalInfo.gender}</p>
                        </div>
                        <div class="activity">
                            <p>Email</p>
                            <p>${response[0].personalInfo.email}</p>
                        </div>
                        <div class="activity">
                            <p>Phone Number</p>
                            <p>${response[0].personalInfo.phone}</p>
                        </div>
                        <div class="activity">
                            <p>Resident Address</p>
                            <p>${response[0].personalInfo.residentAddress}</p>
                        </div>
                        <div class="activity">
                            <p>Local Govt Area</p>
                            <p>${response[0].personalInfo.LGA}</p>
                        </div>
                        <div class="activity">
                            <p>State of Origin</p>
                            <p>${response[0].personalInfo.state}</p>
                        </div>
                        <div class="activity">
                            <p>Loan Before Question</p>
                            <p>${new Date(response[0].dateSubmitted).toDateString()}</p>
                        </div>

                        <h3 class="activityHeading">Business Information</h3>

                        <div class="activity">
                            <p>Business Name</p>
                            <p>${response[0].businessInfo.businessName}</p>
                        </div>
                        <div class="activity">
                            <p>Business Address</p>
                            <p>${response[0].businessInfo.businessAddress}</p>
                        </div>
                        <div class="activity">
                            <p>Business Age</p>
                            <p>${response[0].businessInfo.businessAge}</p>
                        </div>
                        <div class="activity">
                            <p>Business Type</p>
                            <p>${response[0].businessInfo.businessType}</p>
                        </div>
                        <div class="activity">
                            <p>Business Industry</p>
                            <p>${response[0].businessInfo.businessIndustry}</p>
                        </div>
                        <div class="activity">
                            <p>Business LGA</p>
                            <p>${response[0].businessInfo.businessLGA}</p>
                        </div>
                        <div class="activity">
                            <p>Business Town</p>
                            <p>${response[0].businessInfo.businessTown}</p>
                        </div>

                        <h3 class="activityHeading">Financial Information</h3>

                        <div class="activity">
                            <p>Bank Account Question</p>
                            <p>${response[0].financeInfo.bankAccountQuestion}</p>
                        </div>
                        <div class="activity">
                            <p>Bank Account Question</p>
                            <p>${response[0].financeInfo.digitalPaymentQuestion}</p>
                        </div>
                        <div class="activity">
                            <p>Bank Account Question</p>
                            <p>${response[0].financeInfo.businessFinanceQuestion}</p>
                        </div>

                        <h3 class="activityHeading">Challenges Information</h3>

                        <div class="activity">
                            <p>Biggest Challenges Question</p>
                            <p>${response[0].challengeInfo.biggestChallengesQuestion}</p>
                        </div>
                        <div class="activity">
                            <p>Government Support Question</p>
                            <p>${response[0].challengeInfo.govtSupportQuestion}</p>
                        </div>
                        <div class="activity">
                            <p>Biggest Challenges Question</p>
                            <p>${response[0].challengeInfo.businessGrowthQuestion}</p>
                        </div>

                        <h3 class="activityHeading">Loan Information</h3>

                        <div class="activity">
                            <p>Loan Before Question</p>
                            <p>${response[0].loanInfo.loanBeforeQuestion}</p>
                        </div>
                        <div class="activity">
                            <p>Loan How Question</p>
                            <p>${response[0].loanInfo.loanHowQuestion}</p>
                        </div>
                        <div class="activity">
                            <p>Why No Loan Question</p>
                            <p>${response[0].loanInfo.whyNoLoan}</p>
                        </div>

                        <h3 class="activityHeading">Regulatory Information</h3>

                        <div class="activity">
                            <p>Regulatory Challenge Question</p>
                            <p>${response[0].regulatoryInfo.regulatoryChallengeQuestion}</p>
                        </div>
                    `;

                }
            }
        }

        document.querySelector(".buttonHold").innerHTML = ` `;
    }else
    if(loanStatus == "Submitted"){
        document.querySelector(".statusBox").innerHTML = `
            <p>Status</p>
            <h2>Submitted<span> - Pending</span></h2><!-- we have under review - pending, - accepted and plain old rejected-->`;

            document.querySelector('#firstActivity').textContent = "Personal Information"
            // get all details for this application
            if(localStorage.getItem('user')){
                var user = JSON.parse(localStorage.getItem('user'));
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://smebackendmain.onrender.com/api/adminGetOne', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    id: applicID
                }));
                xhr.onreadystatechange = function(){
                    if(xhr.readyState == 4 && xhr.status == 200){
                        var response = JSON.parse(xhr.responseText);
                        // code from here
                        document.querySelector(".buttonHold").innerHTML = ` `;
                        console.log("responzio",response)
                        let activityHold = document.querySelector("section.activityHold")
                        activityHold.innerHTML = `
                            <div class="activity">
                                <p>Fullname</p>
                                <p>${response[0].personalInfo.fullname}</p>
                            </div>
                            <div class="activity">
                                <p>Date of Birth</p>
                                <p>${response[0].personalInfo.dateofbirth}</p>
                            </div>
                            <div class="activity">
                                <p>Gender</p>
                                <p>${response[0].personalInfo.gender}</p>
                            </div>
                            <div class="activity">
                                <p>Email</p>
                                <p>${response[0].personalInfo.email}</p>
                            </div>
                            <div class="activity">
                                <p>Phone Number</p>
                                <p>${response[0].personalInfo.phone}</p>
                            </div>
                            <div class="activity">
                                <p>Resident Address</p>
                                <p>${response[0].personalInfo.residentAddress}</p>
                            </div>
                            <div class="activity">
                                <p>Local Govt Area</p>
                                <p>${response[0].personalInfo.LGA}</p>
                            </div>
                            <div class="activity">
                                <p>State of Origin</p>
                                <p>${response[0].personalInfo.state}</p>
                            </div>
                            <div class="activity">
                                <p>Date Submitted</p>
                                <p>${new Date(response[0].dateSubmitted).toDateString()}</p>
                            </div>

                            <h3 class="activityHeading">Business Information</h3>

                            <div class="activity">
                                <p>Business Name</p>
                                <p>${response[0].businessInfo.businessName}</p>
                            </div>
                            <div class="activity">
                                <p>Business Address</p>
                                <p>${response[0].businessInfo.businessAddress}</p>
                            </div>
                            <div class="activity">
                                <p>Business Age</p>
                                <p>${response[0].businessInfo.businessAge}</p>
                            </div>
                            <div class="activity">
                                <p>Business Type</p>
                                <p>${response[0].businessInfo.businessType}</p>
                            </div>
                            <div class="activity">
                                <p>Business Industry</p>
                                <p>${response[0].businessInfo.businessIndustry}</p>
                            </div>
                            <div class="activity">
                                <p>Business LGA</p>
                                <p>${response[0].businessInfo.businessLGA}</p>
                            </div>
                            <div class="activity">
                                <p>Business Town</p>
                                <p>${response[0].businessInfo.businessTown}</p>
                            </div>

                            <h3 class="activityHeading">Financial Information</h3>

                            <div class="activity">
                                <p>Bank Account Question</p>
                                <p>${response[0].financeInfo.bankAccountQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Bank Account Question</p>
                                <p>${response[0].financeInfo.digitalPaymentQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Bank Account Question</p>
                                <p>${response[0].financeInfo.businessFinanceQuestion}</p>
                            </div>

                            <h3 class="activityHeading">Challenges Information</h3>

                            <div class="activity">
                                <p>Biggest Challenges Question</p>
                                <p>${response[0].challengeInfo.biggestChallengesQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Government Support Question</p>
                                <p>${response[0].challengeInfo.govtSupportQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Biggest Challenges Question</p>
                                <p>${response[0].challengeInfo.businessGrowthQuestion}</p>
                            </div>

                            <h3 class="activityHeading">Loan Information</h3>

                            <div class="activity">
                                <p>Loan Before Question</p>
                                <p>${response[0].loanInfo.loanBeforeQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Loan How Question</p>
                                <p>${response[0].loanInfo.loanHowQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Why No Loan Question</p>
                                <p>${response[0].loanInfo.whyNoLoan}</p>
                            </div>

                            <h3 class="activityHeading">Regulatory Information</h3>

                            <div class="activity">
                                <p>Regulatory Challenge Question</p>
                                <p>${response[0].regulatoryInfo.regulatoryChallengeQuestion}</p>
                            </div>
                        `;

                    }
                }
            }
    }else
    if(loanStatus == "Rejected"){
        document.querySelector(".statusBox").innerHTML = `
            <p>Status</p>
            <h2>${loanAmount}</h2>
            <p>Rejected</p><!-- we have under review - pending, - accepted and plain old rejected-->`;

        // document.querySelector("section.activityHold").innerHTML = `
        // <div class="activity">
        //         <p>Submitted</p>
        //         <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
        // </div>
        // <div class="activity">
        //         <p>Rejected</p>
        // </div>`

        document.querySelector('#firstActivity').textContent = "Personal Information"
        // get all details for this application
        if(localStorage.getItem('user')){
            var user = JSON.parse(localStorage.getItem('user'));
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://smebackendmain.onrender.com/api/adminGetOne', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                id: applicID
            }));
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4 && xhr.status == 200){
                    var response = JSON.parse(xhr.responseText);
                    // code from here
                    document.querySelector(".buttonHold").innerHTML = ` `;
                    console.log("responzio",response)
                    let activityHold = document.querySelector("section.activityHold")
                    activityHold.innerHTML = `
                        <div class="activity">
                            <p>Fullname</p>
                            <p>${response[0].personalInfo.fullname}</p>
                        </div>
                        <div class="activity">
                            <p>Date of Birth</p>
                            <p>${response[0].personalInfo.dateofbirth}</p>
                        </div>
                        <div class="activity">
                            <p>Gender</p>
                            <p>${response[0].personalInfo.gender}</p>
                        </div>
                        <div class="activity">
                            <p>Email</p>
                            <p>${response[0].personalInfo.email}</p>
                        </div>
                        <div class="activity">
                            <p>Phone Number</p>
                            <p>${response[0].personalInfo.phone}</p>
                        </div>
                        <div class="activity">
                            <p>Resident Address</p>
                            <p>${response[0].personalInfo.residentAddress}</p>
                        </div>
                        <div class="activity">
                            <p>Local Govt Area</p>
                            <p>${response[0].personalInfo.LGA}</p>
                        </div>
                        <div class="activity">
                            <p>State of Origin</p>
                            <p>${response[0].personalInfo.state}</p>
                        </div>
                        <div class="activity">
                            <p>Loan Before Question</p>
                            <p>${new Date(response[0].dateSubmitted).toDateString()}</p>
                        </div>

                        <h3 class="activityHeading">Business Information</h3>

                        <div class="activity">
                            <p>Business Name</p>
                            <p>${response[0].businessInfo.businessName}</p>
                        </div>
                        <div class="activity">
                            <p>Business Address</p>
                            <p>${response[0].businessInfo.businessAddress}</p>
                        </div>
                        <div class="activity">
                            <p>Business Age</p>
                            <p>${response[0].businessInfo.businessAge}</p>
                        </div>
                        <div class="activity">
                            <p>Business Type</p>
                            <p>${response[0].businessInfo.businessType}</p>
                        </div>
                        <div class="activity">
                            <p>Business Industry</p>
                            <p>${response[0].businessInfo.businessIndustry}</p>
                        </div>
                        <div class="activity">
                            <p>Business LGA</p>
                            <p>${response[0].businessInfo.businessLGA}</p>
                        </div>
                        <div class="activity">
                            <p>Business Town</p>
                            <p>${response[0].businessInfo.businessTown}</p>
                        </div>

                        <h3 class="activityHeading">Financial Information</h3>

                        <div class="activity">
                            <p>Bank Account Question</p>
                            <p>${response[0].financeInfo.bankAccountQuestion}</p>
                        </div>
                        <div class="activity">
                            <p>Bank Account Question</p>
                            <p>${response[0].financeInfo.digitalPaymentQuestion}</p>
                        </div>
                        <div class="activity">
                            <p>Bank Account Question</p>
                            <p>${response[0].financeInfo.businessFinanceQuestion}</p>
                        </div>

                        <h3 class="activityHeading">Challenges Information</h3>

                        <div class="activity">
                            <p>Biggest Challenges Question</p>
                            <p>${response[0].challengeInfo.biggestChallengesQuestion}</p>
                        </div>
                        <div class="activity">
                            <p>Government Support Question</p>
                            <p>${response[0].challengeInfo.govtSupportQuestion}</p>
                        </div>
                        <div class="activity">
                            <p>Biggest Challenges Question</p>
                            <p>${response[0].challengeInfo.businessGrowthQuestion}</p>
                        </div>

                        <h3 class="activityHeading">Loan Information</h3>

                        <div class="activity">
                            <p>Loan Before Question</p>
                            <p>${response[0].loanInfo.loanBeforeQuestion}</p>
                        </div>
                        <div class="activity">
                            <p>Loan How Question</p>
                            <p>${response[0].loanInfo.loanHowQuestion}</p>
                        </div>
                        <div class="activity">
                            <p>Why No Loan Question</p>
                            <p>${response[0].loanInfo.whyNoLoan}</p>
                        </div>

                        <h3 class="activityHeading">Regulatory Information</h3>

                        <div class="activity">
                            <p>Regulatory Challenge Question</p>
                            <p>${response[0].regulatoryInfo.regulatoryChallengeQuestion}</p>
                        </div>
                    `;

                    document.querySelector(".buttonHold").innerHTML = `
                        <button type="button" id="resubmitBtn" class="deciseBtn" onclick="resubimtApplic(${applicID})">Resubmit</button>`;
                }
            }
        }

        document.querySelector(".buttonHold").innerHTML = ` `;
    }else
    if(loanStatus == "Pending"){
        document.querySelector(".statusBox").innerHTML = `
            <p>Status</p>
            <h2>${loanAmount}</h2>
            <p>Pending Document Review</p><!-- we have under review - pending, - accepted and plain old rejected-->`;

            // document.querySelector("section.activityHold").innerHTML = `
            // <div class="activity">
            //         <p>Submitted</p>
            //         <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            // </div>
            // <div class="activity">
            //         <p>Accepted</p>
            //         <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            // </div>
            // <div class="activity">
            //         <p>Documents Uploaded</p>
            //         <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            // </div>`

            document.querySelector('#firstActivity').textContent = "Personal Information"
            // get all details for this application
            if(localStorage.getItem('user')){
                var user = JSON.parse(localStorage.getItem('user'));
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://smebackendmain.onrender.com/api/adminGetOne', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    id: applicID
                }));
                xhr.onreadystatechange = function(){
                    if(xhr.readyState == 4 && xhr.status == 200){
                        var response = JSON.parse(xhr.responseText);
                        // code from here
                        document.querySelector(".buttonHold").innerHTML = ` `;
                        console.log("responzio",response)
                        let activityHold = document.querySelector("section.activityHold")
                        activityHold.innerHTML = `
                            <div class="activity">
                                <p>Fullname</p>
                                <p>${response[0].personalInfo.fullname}</p>
                            </div>
                            <div class="activity">
                                <p>Date of Birth</p>
                                <p>${response[0].personalInfo.dateofbirth}</p>
                            </div>
                            <div class="activity">
                                <p>Gender</p>
                                <p>${response[0].personalInfo.gender}</p>
                            </div>
                            <div class="activity">
                                <p>Email</p>
                                <p>${response[0].personalInfo.email}</p>
                            </div>
                            <div class="activity">
                                <p>Phone Number</p>
                                <p>${response[0].personalInfo.phone}</p>
                            </div>
                            <div class="activity">
                                <p>Resident Address</p>
                                <p>${response[0].personalInfo.residentAddress}</p>
                            </div>
                            <div class="activity">
                                <p>Local Govt Area</p>
                                <p>${response[0].personalInfo.LGA}</p>
                            </div>
                            <div class="activity">
                                <p>State of Origin</p>
                                <p>${response[0].personalInfo.state}</p>
                            </div>
                            <div class="activity">
                                <p>Date Submitted</p>
                                <p>${new Date(response[0].dateSubmitted).toDateString()}</p>
                            </div>

                            <h3 class="activityHeading">Business Information</h3>

                            <div class="activity">
                                <p>Business Name</p>
                                <p>${response[0].businessInfo.businessName}</p>
                            </div>
                            <div class="activity">
                                <p>Business Address</p>
                                <p>${response[0].businessInfo.businessAddress}</p>
                            </div>
                            <div class="activity">
                                <p>Business Age</p>
                                <p>${response[0].businessInfo.businessAge}</p>
                            </div>
                            <div class="activity">
                                <p>Business Type</p>
                                <p>${response[0].businessInfo.businessType}</p>
                            </div>
                            <div class="activity">
                                <p>Business Industry</p>
                                <p>${response[0].businessInfo.businessIndustry}</p>
                            </div>
                            <div class="activity">
                                <p>Business LGA</p>
                                <p>${response[0].businessInfo.businessLGA}</p>
                            </div>
                            <div class="activity">
                                <p>Business Town</p>
                                <p>${response[0].businessInfo.businessTown}</p>
                            </div>

                            <h3 class="activityHeading">Financial Information</h3>

                            <div class="activity">
                                <p>Bank Account Question</p>
                                <p>${response[0].financeInfo.bankAccountQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Bank Account Question</p>
                                <p>${response[0].financeInfo.digitalPaymentQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Bank Account Question</p>
                                <p>${response[0].financeInfo.businessFinanceQuestion}</p>
                            </div>

                            <h3 class="activityHeading">Challenges Information</h3>

                            <div class="activity">
                                <p>Biggest Challenges Question</p>
                                <p>${response[0].challengeInfo.biggestChallengesQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Government Support Question</p>
                                <p>${response[0].challengeInfo.govtSupportQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Biggest Challenges Question</p>
                                <p>${response[0].challengeInfo.businessGrowthQuestion}</p>
                            </div>

                            <h3 class="activityHeading">Loan Information</h3>

                            <div class="activity">
                                <p>Loan Before Question</p>
                                <p>${response[0].loanInfo.loanBeforeQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Loan How Question</p>
                                <p>${response[0].loanInfo.loanHowQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Why No Loan Question</p>
                                <p>${response[0].loanInfo.whyNoLoan}</p>
                            </div>

                            <h3 class="activityHeading">Regulatory Information</h3>

                            <div class="activity">
                                <p>Regulatory Challenge Question</p>
                                <p>${response[0].regulatoryInfo.regulatoryChallengeQuestion}</p>
                            </div>
                        `;

                        document.querySelector(".buttonHold").innerHTML = `
                        <button type="button" id="approveBtn" class="deciseBtn" onclick="approveApplic(${applicID})">Approve</button>

                        <button type="button" id="rejectBtn" class="deciseBtn"  onclick="rejectApplic(${applicID})">Reject</button>
                        
                        <button type="button" id="resubmitBtn" class="deciseBtn" onclick="resubimtApplic(${applicID})">Resubmit</button>`;
                    }
                }
            }

            
    }else
    if(loanStatus == "Approved"){
        document.querySelector(".statusBox").innerHTML = `
            <p>Status</p>
            <h2>${loanAmount}</h2>
            <p>Approved</p><!-- we have under review - pending, - accepted and plain old rejected-->`;

            // document.querySelector("section.activityHold").innerHTML = `
            // <div class="activity">
            //         <p>Submitted</p>
            //         <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            // </div>
            // <div class="activity">
            //         <p>Accepted</p>
            //         <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            // </div>
            // <div class="activity">
            //         <p>Documents Uploaded</p>
            //         <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            // </div>
            // <div class="activity">
            //         <p>Approved</p>
            //         <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            // </div>`

            document.querySelector('#firstActivity').textContent = "Personal Information"
            // get all details for this application
            if(localStorage.getItem('user')){
                var user = JSON.parse(localStorage.getItem('user'));
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://smebackendmain.onrender.com/api/adminGetOne', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    id: applicID
                }));
                xhr.onreadystatechange = function(){
                    if(xhr.readyState == 4 && xhr.status == 200){
                        var response = JSON.parse(xhr.responseText);
                        // code from here
                        document.querySelector(".buttonHold").innerHTML = ` `;
                        console.log("responzio",response)
                        let activityHold = document.querySelector("section.activityHold")
                        activityHold.innerHTML = `
                            <div class="activity">
                                <p>Fullname</p>
                                <p>${response[0].personalInfo.fullname}</p>
                            </div>
                            <div class="activity">
                                <p>Date of Birth</p>
                                <p>${response[0].personalInfo.dateofbirth}</p>
                            </div>
                            <div class="activity">
                                <p>Gender</p>
                                <p>${response[0].personalInfo.gender}</p>
                            </div>
                            <div class="activity">
                                <p>Email</p>
                                <p>${response[0].personalInfo.email}</p>
                            </div>
                            <div class="activity">
                                <p>Phone Number</p>
                                <p>${response[0].personalInfo.phone}</p>
                            </div>
                            <div class="activity">
                                <p>Resident Address</p>
                                <p>${response[0].personalInfo.residentAddress}</p>
                            </div>
                            <div class="activity">
                                <p>Local Govt Area</p>
                                <p>${response[0].personalInfo.LGA}</p>
                            </div>
                            <div class="activity">
                                <p>State of Origin</p>
                                <p>${response[0].personalInfo.state}</p>
                            </div>
                            <div class="activity">
                                <p>Date Submitted</p>
                                <p>${new Date(response[0].dateSubmitted).toDateString()}</p>
                            </div>

                            <h3 class="activityHeading">Business Information</h3>

                            <div class="activity">
                                <p>Business Name</p>
                                <p>${response[0].businessInfo.businessName}</p>
                            </div>
                            <div class="activity">
                                <p>Business Address</p>
                                <p>${response[0].businessInfo.businessAddress}</p>
                            </div>
                            <div class="activity">
                                <p>Business Age</p>
                                <p>${response[0].businessInfo.businessAge}</p>
                            </div>
                            <div class="activity">
                                <p>Business Type</p>
                                <p>${response[0].businessInfo.businessType}</p>
                            </div>
                            <div class="activity">
                                <p>Business Industry</p>
                                <p>${response[0].businessInfo.businessIndustry}</p>
                            </div>
                            <div class="activity">
                                <p>Business LGA</p>
                                <p>${response[0].businessInfo.businessLGA}</p>
                            </div>
                            <div class="activity">
                                <p>Business Town</p>
                                <p>${response[0].businessInfo.businessTown}</p>
                            </div>

                            <h3 class="activityHeading">Financial Information</h3>

                            <div class="activity">
                                <p>Bank Account Question</p>
                                <p>${response[0].financeInfo.bankAccountQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Bank Account Question</p>
                                <p>${response[0].financeInfo.digitalPaymentQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Bank Account Question</p>
                                <p>${response[0].financeInfo.businessFinanceQuestion}</p>
                            </div>

                            <h3 class="activityHeading">Challenges Information</h3>

                            <div class="activity">
                                <p>Biggest Challenges Question</p>
                                <p>${response[0].challengeInfo.biggestChallengesQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Government Support Question</p>
                                <p>${response[0].challengeInfo.govtSupportQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Biggest Challenges Question</p>
                                <p>${response[0].challengeInfo.businessGrowthQuestion}</p>
                            </div>

                            <h3 class="activityHeading">Loan Information</h3>

                            <div class="activity">
                                <p>Loan Before Question</p>
                                <p>${response[0].loanInfo.loanBeforeQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Loan How Question</p>
                                <p>${response[0].loanInfo.loanHowQuestion}</p>
                            </div>
                            <div class="activity">
                                <p>Why No Loan Question</p>
                                <p>${response[0].loanInfo.whyNoLoan}</p>
                            </div>

                            <h3 class="activityHeading">Regulatory Information</h3>

                            <div class="activity">
                                <p>Regulatory Challenge Question</p>
                                <p>${response[0].regulatoryInfo.regulatoryChallengeQuestion}</p>
                            </div>
                        `;

                    }
                }
            }
            // get all the remaining details from upload documents database
            if(localStorage.getItem('user')){
                var user = JSON.parse(localStorage.getItem('user'));
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://smebackendmain.onrender.com/api/adminGetUpOne', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    id: applicID
                }));
                xhr.onreadystatechange = function(){
                    if(xhr.readyState == 4 && xhr.status == 200){
                        var response = JSON.parse(xhr.responseText);
                        // code from here
                        document.querySelector(".buttonHold").innerHTML = ` `;
                        console.log("responzio",response)
                        let activityHold = document.querySelector("section.activityHold")
                        activityHold.innerHTML = `
                            <div class="activity">
                                <p>ID Card Link</p>
                                <p>${response[0].idCardLink}</p>
                            </div>
                            <div class="activity">
                                <p>Business Certificate Link</p>
                                <p>${response[0].businessCertificateLink}</p>
                            </div>
                            <div class="activity">
                                <p>Bank Statement Link</p>
                                <p>${response[0].bankStatementLink}</p>
                            </div>
                            <div class="activity">
                                <p>Loan Amount</p>
                                <p>${response[0].LoanAmount}</p>
                            </div>
                            <div class="activity">
                                <p>Interest Rate</p>
                                <p>${response[0].interestRate}</p>
                            </div>
                            <div class="activity">
                                <p>Payment per Interval</p>
                                <p>${response[0].PaymentPer}</p>
                            </div>
                           `;

                    }
                }
            }

            document.querySelector(".buttonHold").innerHTML = `
                        <button type="button" id="rejectBtn" class="deciseBtn"  onclick="rejectApplic(${applicID})">Reject</button>
                        
                        <button type="button" id="resubmitBtn" class="deciseBtn" onclick="resubimtApplic(${applicID})">Resubmit</button>`;
    }
}






function approveApplic(applicID){
     // get all details for this application
     if(localStorage.getItem('user')){
        var user = JSON.parse(localStorage.getItem('user'));
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://smebackendmain.onrender.com/api/adminChangeOne', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            id: applicID,
            loanStatus: "Approved"
        }));
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                var response = JSON.parse(xhr.responseText);
                // code from here
                console.log(response)
                location.reload();
            }
        }
    }
}

function rejectApplic(applicID){
    // get all details for this application
    if(localStorage.getItem('user')){
       var user = JSON.parse(localStorage.getItem('user'));
       var xhr = new XMLHttpRequest();
       xhr.open('POST', 'https://smebackendmain.onrender.com/api/adminChangeOne', true);
       xhr.setRequestHeader('Content-Type', 'application/json');
       xhr.send(JSON.stringify({
           id: applicID,
           loanStatus: "Rejected"
       }));
       xhr.onreadystatechange = function(){
           if(xhr.readyState == 4 && xhr.status == 200){
               var response = JSON.parse(xhr.responseText);
               // code from here
               console.log(response)
               location.reload();
           }
       }
   }
}


function resubmitApplic(applicID){
    // get all details for this application
    if(localStorage.getItem('user')){
       var user = JSON.parse(localStorage.getItem('user'));
       var xhr = new XMLHttpRequest();
       xhr.open('POST', 'https://smebackendmain.onrender.com/api/adminChangeOne', true);
       xhr.setRequestHeader('Content-Type', 'application/json');
       xhr.send(JSON.stringify({
           id: applicID,
           loanStatus: "Accepted"
       }));
       xhr.onreadystatechange = function(){
           if(xhr.readyState == 4 && xhr.status == 200){
               var response = JSON.parse(xhr.responseText);
               // code from here
               console.log(response)
               location.reload();
           }
       }
   }
}



function logout(){
    // remove the user from the local storage and redirect to login page
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function adminLogout(){
    // remove the user from the local storage and redirect to login page
    localStorage.removeItem('userLoginDetails');
    window.location.href = 'login.html';
}