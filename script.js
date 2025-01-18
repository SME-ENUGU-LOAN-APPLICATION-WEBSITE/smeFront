// // Create the user object
// const user = {
//     username: "renezest@gmail.com",
//     password: "123456"
//   };
  
//   // Convert the user object to a JSON string
//   const userJSON = JSON.stringify(user);
  
//   // Store the JSON string in localStorage under the key "user"
//   localStorage.setItem("user", userJSON);
  
//   console.log("User stored in localStorage!");
function hideQuestionnaire(){
    document.querySelector('.detailsHold').style.display = 'none';
}
function showQuestionnaire(){
    document.querySelector('.detailsHold').style.display = 'flex';
}
function checkLogin(){
    // if there is no user logged in, redirect to login page
    if(!localStorage.getItem('user')){
        window.location.href = 'login/login.html';
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
                    window.location.href = 'login/login.html';
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
                    showQuestionnaire();
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
                            document.querySelector('.checklogin').className = 'loggedIn';
                        }
                        else{
                            window.location.href = './admin/admin.html';
                        }
                    }
                }
            }
        }
    
}



function logout(){
    // remove the user from the local storage and redirect to login page
    localStorage.removeItem('user');
    window.location.href = 'login/login.html';
}

function adminLogout(){
    // remove the user from the local storage and redirect to login page
    localStorage.removeItem('userLoginDetails');
    window.location.href = 'login/login.html';
}

function businessShow(){
    let fullname = document.querySelector('.fullnameInput').value;
    let dateofbirth = document.querySelector('.dobInput').value;
    let gender = document.querySelector('#genderSelect').value;
    let email = document.querySelector('.emailInput').value;
    let phone = document.querySelector('.phoneNumberInput').value;
    let residentAddress = document.querySelector('.residentAddressInput').value;
    let LGA = document.querySelector('.LGAInput').value;
    let state = document.querySelector('.stateInput').value;
    console.log(fullname, dateofbirth, gender, email, phone, residentAddress, LGA, state);

    // validate to ensure that all fields are filled. if not, alert the user. if all fields are filled, send a request to the server to save the details and replace the html in the div with the class: "questionsHold" with a headinng saying hello and the fullname of the user
    // if(fullname && dateofbirth && gender && email && phone && residentAddress && LGA && state){
    //     var user = JSON.parse(localStorage.getItem('userLoginDetails'));
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('POST', 'https://smebackendmain.onrender.com/api/businessShow', true);
    //     xhr.setRequestHeader('Content-Type', 'application/json');
    //     xhr.send(JSON.stringify({
    //         fullname: fullname, 
    //         dateofbirth: dateofbirth, 
    //         gender: gender, 
    //         email: email, 
    //         phone: phone, 
    //         residentAddress: residentAddress, 
    //         LGA: LGA, 
    //         state: state, 
    //         username: user.username, 
    //         cookie: user.cookie}));
    //     xhr.onreadystatechange = function(){
    //         if(xhr.readyState == 4 && xhr.status == 200){
    //             var response = JSON.parse(xhr.responseText);
    //             console.log(response);
    //             if(response.valid == true){
    //                 document.querySelector('.questionsHold').innerHTML = `<h1>Hello ${fullname}</h1>`;
    //             }
    //         }
    //     }
    // }

    //validate to ensure that all fields are filled. if not, alert the user. if all fields are filled, gather all the details in an object called personalInfo and store in local storage. replace the html in the div with the class: "questionsHold" with a heading saying hello.
    if(fullname && dateofbirth && gender && email && phone && residentAddress && LGA && state){
        var personalInfo = {
            fullname: fullname,
            dateofbirth: dateofbirth,
            gender: gender,
            email: email,
            phone: phone,
            residentAddress: residentAddress,
            LGA: LGA,
            state: state
        };
        const personalInfoJSON = JSON.stringify(personalInfo);
        localStorage.setItem('personalInfo', personalInfoJSON);
        document.querySelector('.questionsHold').innerHTML = `
                    <label for="businessName">Business Name</label>
                    <input type="text" class="businessNameInput" placeholder="Enter your business name" name="businessName" required>

                    <label for="businessAddress">Business Address</label>
                    <input type="text" class="businessAddressInput" placeholder="Enter your business address" name="businessAddress" required>

                    <label for="businessAge">Business Age</label>
                    <select name="businessAge" id="businessAgeSelect" title="select your business age">
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-3">1-3 years</option>
                        <option value="4-7">4-7 years</option>
                        <option value="7+">Over 7 years</option>
                    </select>

                    <label for="businessType">Business Type</label>
                    <select name="businessType" id="businessTypeSelect" title="select your business type">
                        <option value="Nanoenterprise">Nanoenterprise(0-4 employees)</option>
                        <option value="Microenterprise">Microenterprise (5-9 employees)</option>
                        <option value="Smallenterprise">Small Enterprise (10-49 employees)</option>
                        <option value="Mediumenterprise">Medium Enterprise (50-249 employees)</option>
                    </select>

                    <label for="businessIndustry">Business industry</label>
                    <select name="businessIndustry" id="businessIndustrySelect" title="select your business industry">
                        <option value="Retail">Retail</option>
                        <option value="Services">Services (e.g hardressing, tailoring e.t.c)</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Technology">Technology</option>
                        <option value="Other">Other</option>
                    </select>

                    <label for="businessLGA"> LGA of Business</label>
                    <select name="businessLGA" id="businessLGASel" title="select your business LGA">
                        <option value="Aninri">Aninri</option>
                        <option value="Awgu">Agwu</option>
                        <option value="Enugu East">Enugu East</option>
                        <option value="Enugu North">Enugu North</option>
                        <option value="Enugu South">Enugu South</option>
                        <option value="Ezeagu">Ezeagu</option>
                        <option value="Igbo Etiti">Igbo Etiti</option>
                        <option value="Igbo Eze North">Igbo Eze North</option>
                        <option value="Nkanu East">Nkanu East</option>
                        <option value="Igbo Eze South">Igbo Eze South</option>
                        <option value="Isi Uzo">Isi Uzo</option>
                        <option value="Nkanu West">Nkanu West</option>
                        <option value="Uzo Uwani">Uzo Uwani</option>
                        <option value="Nsukka">Nsukka</option>
                        <option value="Oji River">Oji River</option>
                        <option value="Udenu">Udenu</option>
                        <option value="Udi">Udi</option>
                    </select>

                    <label for="businessTown">Town of Business</label>
                    <input type="text" class="businessTownInput" placeholder="Enter your business town" name="businessTown" required>

                    <div class="buttonHold">
                        <button type="button" onclick="businessShowBack(0)">Back</button>
                        <button type="button" onclick="financenOpShow()">Next</button>
                    </div>`;
        document.querySelector('section.detailsForm .progressLine').style.backgroundImage = "linear-gradient(to right, purple 0%,purple 33%,#f5f5f5 33%,#f5f5f5 100%)";
    }
    else{
        alert('Please fill all fields');
    }
}

function financenOpShow(){
    let businessName = document.querySelector('.businessNameInput').value;
    let businessAddress = document.querySelector('.businessAddressInput').value;
    let businessAge = document.querySelector('#businessAgeSelect').value;
    let businessType = document.querySelector('#businessTypeSelect').value;
    let businessIndustry = document.querySelector('#businessIndustrySelect').value;
    let businessLGA = document.querySelector('#businessLGASel').value;
    let businessTown = document.querySelector('.businessTownInput').value;
    console.log(businessName, businessAddress, businessAge, businessType, businessIndustry, businessLGA, businessTown);

    // validate to ensure that all fields are filled. if not, alert the user. if all fields are filled, gather all the details in an object called businessInfo and store in local storage. replace the html in the div with the class: "questionsHold" with a heading saying hello.
    if(businessName && businessAddress && businessAge && businessType && businessIndustry && businessLGA && businessTown){
        var businessInfo = {
            businessName: businessName,
            businessAddress: businessAddress,
            businessAge: businessAge,
            businessType: businessType,
            businessIndustry: businessIndustry,
            businessLGA: businessLGA,
            businessTown: businessTown
        };
        const businessInfoJSON = JSON.stringify(businessInfo);
        localStorage.setItem('businessInfo', businessInfoJSON);
        document.querySelector('.questionsHold').innerHTML = `
                <label for="bankAccountQuestion">Do you have a bank account for your business?</label>
                <select name="bankAccountQuestion" id="bankAccountQuestionSelect" title="select if you have a bank account for your business">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                <label for="digitalPaymentQuestion">Do you use any digital payment systems? </label>
                <select name="digitalPaymentQuestion" id="digitalPaymentQuestionSelect" title="select if you use any digital payment systems">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                <label for="businessFinanceQuestion">How do you manage your business finances? </label>
                <select name="businessFinanceQuestion" id="businessFinanceQuestionSelect" title="select how you manage your business finances">
                    <option value="Formal Accounting">Formal Accounting System</option>
                    <option value="Basic Bookeeping">Basic Bookeeping</option>
                    <option value="No Formal System">No Formal System</option>
                    <option value="Outsourced Accountant">Outsourced Accountant</option>
                </select>

                <div class="buttonHold">
                    <button type="button" onclick="businessShowBack(1)">Back</button>
                    <button type="button" onclick="challengenNeedShow()">Next</button>
                </div>`;
        document.querySelector('section.detailsForm .progressLine').style.backgroundImage = "linear-gradient(to right, purple 0%,purple 49.5%,#f5f5f5 49.5%,#f5f5f5 100%)";
        
    }
    else{
        alert('Please fill all fields');
    }


}

function challengenNeedShow(){
    let bankAccountQuestion = document.querySelector('#bankAccountQuestionSelect').value;
    let digitalPaymentQuestion = document.querySelector('#digitalPaymentQuestionSelect').value;
    let businessFinanceQuestion = document.querySelector('#businessFinanceQuestionSelect').value;
    console.log(bankAccountQuestion, digitalPaymentQuestion, businessFinanceQuestion);

    // validate to ensure that all fields are filled. if not, alert the user. if all fields are filled, gather all the details in an object called financeInfo and store in local storage. replace the html in the div with the class: "questionsHold" with a heading saying hello.
    if(bankAccountQuestion && digitalPaymentQuestion && businessFinanceQuestion){
        var financeInfo = {
            bankAccountQuestion: bankAccountQuestion,
            digitalPaymentQuestion: digitalPaymentQuestion,
            businessFinanceQuestion: businessFinanceQuestion
        };
        const financeInfoJSON = JSON.stringify(financeInfo);
        localStorage.setItem('financeInfo', financeInfoJSON);
        document.querySelector('.questionsHold').innerHTML = `
                <label for="biggestChallengesQuestion">What are the biggest challenges your business faces?</label>
                <select name="biggestChallengesQuestion" id="biggestChallengesQuestionSelect" title="select the biggest challenges your business faces">
                    <option value="Access to Finance">Access to Finance</option>
                    <option value="High costs of Operations">High cost of Operations</option>
                    <option value="Getting customers">Getting customers</option>
                    <option value="Competition">Competition</option>
                    <option value="Regulatory Compliance">Regulatory Compliance</option>
                    <option value="Other">Other</option>
                </select>
                

                <label for="govtSupportQuestion">What kind of support would you like from the government? </label>
                <select name="govtSupportQuestion" id="govtSupportQuestionSelect" title="select the kind of support you would like from the government">
                    <option value="Easier Access to Loans">Easier Access To Loans</option>
                    <option value="Lower taxes or fees">Lower taxes or fees</option>
                    <option value="Better infrastructure">Better infrastructure</option>
                    <option value="More Business advice and training">More Business advice and training</option>
                </select>

                <label for="businessGrowthQuestion">What would help your business grow the most?</label>
                <select name="businessGrowthQuestion" id="businessGrowthQuestionSelect" title="select what would help your business grow the most">
                    <option value="More access to money">Access to Finance</option>
                    <option value="Better Equipment">Better Equipment</option>
                    <option value="Lower business costs">Lower business costs</option>
                    <option value="Better infrastructure">Better infrastructure</option>
                    <option value="More skilled workers">More skilled workers</option>
                </select>

                <div class="buttonHold">
                    <button type="button" onclick="businessShowBack(2)">Back</button>
                    <button type="button" onclick="loanHistoryShow()">Next</button>
                </div> `;

        document.querySelector('section.detailsForm .progressLine').style.backgroundImage = "linear-gradient(to right, purple 0%,purple 66%,#f5f5f5 66%,#f5f5f5 100%)";
    }
    else{
        alert('Please fill all fields');
    }
}

function loanHistoryShow(){
    let biggestChallengesQuestion = document.querySelector('#biggestChallengesQuestionSelect').value;
    let govtSupportQuestion = document.querySelector('#govtSupportQuestionSelect').value;
    let businessGrowthQuestion = document.querySelector('#businessGrowthQuestionSelect').value;
    console.log(biggestChallengesQuestion, govtSupportQuestion, businessGrowthQuestion);

    // validate to ensure that all fields are filled. if not, alert the user. if all fields are filled, gather all the details in an object called loanInfo and store in local storage. replace the html in the div with the class: "questionsHold" with a heading saying hello.
    if(biggestChallengesQuestion && govtSupportQuestion && businessGrowthQuestion){
        var challengeInfo = {
            biggestChallengesQuestion: biggestChallengesQuestion,
            govtSupportQuestion: govtSupportQuestion,
            businessGrowthQuestion: businessGrowthQuestion,
        };
        const challengeInfoJSON = JSON.stringify(challengeInfo);
        localStorage.setItem('challengeInfo', challengeInfoJSON);
        document.querySelector('.questionsHold').innerHTML = `                 
                <label for="loanBeforeQuestion">Have you ever tried to get a loan for your business? </label>
                <select name="loanBeforeQuestion" id="loanBeforeQuestionSelect" title="select if you have ever tried to get a loan for your business">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                <label for="loanHowQuestion">If yes, how did you get the loan?</label>
                <select name="loanHowQuestion" id="loanHowQuestionSelect" title="select how you got the loan">
                    <option value="Bank or Financial Institution">Bank</option>
                    <option value="Family or Friends">Family or Friends</option>
                    <option value="Other">Other</option>
                </select>

                <label for="whyNoLoan">If you did not get a loan, what was the main reason? </label>
                <select name="whyNoLoan" id="whyNoLoanSelect" title="select the main reason you did not get a loan">
                    <option value="Didn't Know How to Apply">Bad Credit</option>
                    <option value="Interest Rates Too High">High Interest Rates</option>
                    <option value="No Collateral">No Collateral</option>
                    <option value="Other">Other</option>
                </select>

                <div class="buttonHold">
                    <button type="button" onclick="businessShowBack(3)">Back</button>
                        <button type="button" onclick="regulatoryChallengeShow()">Next</button>
                </div> `;

        document.querySelector('section.detailsForm .progressLine').style.backgroundImage = "linear-gradient(to right, purple 0%,purple 82%,#f5f5f5 82%,#f5f5f5 100%)";
    }
    else{
        alert('Please fill all fields');
    }
}

function regulatoryChallengeShow(){
    let loanBeforeQuestion = document.querySelector('#loanBeforeQuestionSelect').value;
    let loanHowQuestion = document.querySelector('#loanHowQuestionSelect').value;
    let whyNoLoan = document.querySelector('#whyNoLoanSelect').value;
    console.log(loanBeforeQuestion, loanHowQuestion, whyNoLoan);

    // validate to ensure that all fields are filled. if not, alert the user. if all fields are filled, gather all the details in an object called loanInfo and store in local storage. replace the html in the div with the class: "questionsHold" with a heading saying hello.
    if(loanBeforeQuestion && loanHowQuestion && whyNoLoan){
        var loanInfo = {
            loanBeforeQuestion: loanBeforeQuestion,
            loanHowQuestion: loanHowQuestion,
            whyNoLoan: whyNoLoan,
        };
        const loanInfoJSON = JSON.stringify(loanInfo);
        localStorage.setItem('loanInfo', loanInfoJSON);
        document.querySelector('.questionsHold').innerHTML = `                 
                <label for="regulatoryChallengeQuestion">Have you faced any issues with government rules or taxes? </label>
                <select name="regulatoryChallengeQuestion" id="regulatoryChallengeQuestionSelect" title="Have you faced any issues with government rules or taxes? ">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <div class="buttonHold">
                    <button type="button" onclick="businessShowBack(4)">Back</button>
                    <button type="button" onclick="submitForm()">Submit</button>
                </div> `;

        document.querySelector('section.detailsForm .progressLine').style.backgroundImage = "linear-gradient(to right, purple 0%,purple 100%,#f5f5f5 100%,#f5f5f5 100%)";
    }
}

function businessShowBack(num){
    if(num == 0){
        document.querySelector('.questionsHold').innerHTML = ` 
                    <label for="fullname">Full Name</label>
                    <input type="text" placeholder="Enter your full name " name="fullname" class="fullnameInput" required>

                    <label for="dob">Date of Birth</label>
                    <input type="date" class="dobInput" name="dob" title="Date of Birth" required>

                    <label for="gender">Gender</label>
                    <select name="gender" id="genderSelect" title="select your gender">
                        <option value="male">Male</option>
                        <option value="female">Femaile</option>
                        <option value="Other">Other</option>
                    </select>

                    <label for="email">Email Address</label>
                    <input type="email" class="emailInput" placeholder="Enter your email address" name="email" required>

                    <label for="phone number">Phone Number</label>
                    <input type="tel" class="phoneNumberInput" placeholder="Enter your phone number" name="phone" required>

                    <label for="residentAddress">Residential Address</label>
                    <input type="text" class="residentAddressInput" placeholder="Enter your residential address" name="residentAddress" required>

                    <label for="LGA">Local Government Area</label>
                    <input type="text" class="LGAInput" placeholder="Enter your Local Government Area" name="LGA" required>

                    <label for="state">State</label>
                    <input type="text" class="stateInput" placeholder="Enter your State of Origin" name="state" required> 
                    
                    <div class="buttonHold">
                        <button type="button" onclick="businessShow()">Next</button>
                    </div>`;
        console.log('back to personal info');
    }else
    if(num == 1){
        document.querySelector('.questionsHold').innerHTML = `
        <label for="businessName">Business Name</label>
                    <input type="text" class="businessNameInput" placeholder="Enter your business name" name="businessName" required>

                    <label for="businessAddress">Business Address</label>
                    <input type="text" class="businessAddressInput" placeholder="Enter your business address" name="businessAddress" required>

                    <label for="businessAge">Business Age</label>
                    <select name="businessAge" id="businessAgeSelect" title="select your business age">
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-3">1-3 years</option>
                        <option value="4-7">4-7 years</option>
                        <option value="7+">Over 7 years</option>
                    </select>

                    <label for="businessType">Business Type</label>
                    <select name="businessType" id="businessTypeSelect" title="select your business type">
                        <option value="Nanoenterprise">Nanoenterprise(0-4 employees)</option>
                        <option value="Microenterprise">Microenterprise (5-9 employees)</option>
                        <option value="Smallenterprise">Small Enterprise (10-49 employees)</option>
                        <option value="Mediumenterprise">Medium Enterprise (50-249 employees)</option>
                    </select>

                    <label for="businessIndustry">Business industry</label>
                    <select name="businessIndustry" id="businessIndustrySelect" title="select your business industry">
                        <option value="Retail">Retail</option>
                        <option value="Services">Services (e.g hardressing, tailoring e.t.c)</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Technology">Technology</option>
                        <option value="Other">Other</option>
                    </select>

                    <label for="businessLGA"> LGA of Business</label>
                    <select name="businessLGA" id="businessLGASel" title="select your business LGA">
                        <option value="Enugu East">Enugu East</option>
                        <option value="Enugu North">Enugu North</option>
                        <option value="Enugu South">Enugu South</option>
                        <option value="Nkanu East">Nkanu East</option>
                        <option value="Nkanu West">Nkanu West</option>
                        <option value="Udi">Udi</option>
                        <option value="Oji River">Oji River</option>
                        <option value="Igbo Etiti">Igbo Etiti</option>
                        <option value="Igbo Eze North">Igbo Eze North</option>
                        <option value="Igbo Eze South">Igbo Eze South</option>
                        <option value="Isi Uzo">Isi Uzo</option>
                        <option value="Uzo Uwani">Uzo Uwani</option>
                    </select>

                    <label for="businessTown">Town of Business</label>
                    <input type="text" class="businessTownInput" placeholder="Enter your business town" name="businessTown" required>

                    <div class="buttonHold">
                        <button type="button" onclick="businessShowBack(0)">Back</button>
                        <button type="button" onclick="financenOpShow()">Next</button>
                    </div> `;
        console.log('back to business info');
    }
    else
    if(num == 2){
        document.querySelector('.questionsHold').innerHTML = `
        <label for="bankAccountQuestion">Do you have a bank account for your business?</label>
                <select name="bankAccountQuestion" id="bankAccountQuestionSelect" title="select if you have a bank account for your business">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                <label for="digitalPaymentQuestion">Do you use any digital payment systems? </label>
                <select name="digitalPaymentQuestion" id="digitalPaymentQuestionSelect" title="select if you use any digital payment systems">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                <label for="businessFinanceQuestion">How do you manage your business finances? </label>
                <select name="businessFinanceQuestion" id="businessFinanceQuestionSelect" title="select how you manage your business finances">
                    <option value="Formal Accounting">Formal Accounting System</option>
                    <option value="Basic Bookeeping">Basic Bookeeping</option>
                    <option value="No Formal System">No Formal System</option>
                    <option value="Outsourced Accountant">Outsourced Accountant</option>
                </select>

                <div class="buttonHold">
                    <button type="button" onclick="businessShowBack(1)">Back</button>
                    <button type="button" onclick="challengenNeedShow()">Next</button>
                </div> `;
        console.log('back to finance info');
    }
    else
    if(num == 3){
        document.querySelector('.questionsHold').innerHTML = `
                <label for="biggestChallengesQuestion">What are the biggest challenges your business faces?</label>
                <select name="biggestChallengesQuestion" id="biggestChallengesQuestionSelect" title="select the biggest challenges your business faces">
                    <option value="Access to Finance">Access to Finance</option>
                    <option value="High costs of Operations">High cost of Operations</option>
                    <option value="Getting customers">Getting customers</option>
                    <option value="Competition">Competition</option>
                    <option value="Regulatory Compliance">Regulatory Compliance</option>
                    <option value="Other">Other</option>
                </select>
                

                <label for="govtSupportQuestion">What kind of support would you like from the government? </label>
                <select name="govtSupportQuestion" id="govtSupportQuestionSelect" title="select the kind of support you would like from the government">
                    <option value="Easier Access to Loans">Easier Access To Loans</option>
                    <option value="Lower taxes or fees">Lower taxes or fees</option>
                    <option value="Better infrastructure">Better infrastructure</option>
                    <option value="More Business advice and training">More Business advice and training</option>
                </select>

                <label for="businessGrowthQuestion">What would help your business grow the most?</label>
                <select name="businessGrowthQuestion" id="businessGrowthQuestionSelect" title="select what would help your business grow the most">
                    <option value="More access to money">Access to Finance</option>
                    <option value="Better Equipment">Better Equipment</option>
                    <option value="Lower business costs">Lower business costs</option>
                    <option value="Better infrastructure">Better infrastructure</option>
                    <option value="More skilled workers">More skilled workers</option>
                </select>

                <div class="buttonHold">
                    <button type="button" onclick="businessShowBack(2)">Back</button>
                    <button type="button" onclick="loanHistoryShow()">Next</button>
                </div> `;
        console.log('back to challenge info');
    }
    else
    if(num == 4){
        document.querySelector('.questionsHold').innerHTML = ` 
        <label for="loanBeforeQuestion">Have you ever tried to get a loan for your business? </label>
                <select name="loanBeforeQuestion" id="loanBeforeQuestionSelect" title="select if you have ever tried to get a loan for your business">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                <label for="loanHowQuestion">If yes, how did you get the loan?</label>
                <select name="loanHowQuestion" id="loanHowQuestionSelect" title="select how you got the loan">
                    <option value="Bank or Financial Institution">Bank</option>
                    <option value="Family or Friends">Family or Friends</option>
                    <option value="Other">Other</option>
                </select>

                <label for="whyNoLoan">If you did not get a loan, what was the main reason? </label>
                <select name="whyNoLoan" id="whyNoLoanSelect" title="select the main reason you did not get a loan">
                    <option value="Didn't Know How to Apply">Bad Credit</option>
                    <option value="Interest Rates Too High">High Interest Rates</option>
                    <option value="No Collateral">No Collateral</option>
                    <option value="Other">Other</option>
                </select>

                <div class="buttonHold">
                    <button type="button" onclick="businessShowBack(3)">Back</button>
                        <button type="button" onclick="regulatoryChallengeShow()">Next</button>
                </div> `;
        console.log('back to loan info');
    }

}


function submitForm(){
    let regulatoryChallengeQuestion = document.querySelector('#regulatoryChallengeQuestionSelect').value;
    console.log(regulatoryChallengeQuestion);

    // validate to ensure that all fields are filled. if not, alert the user. if all fields are filled, gather all the details in an object called regulatoryInfo and store in local storage. gather all the details in the local storage into one object and send a request to the server to save this object
    if(regulatoryChallengeQuestion){
        var regulatoryInfo = {
            regulatoryChallengeQuestion: regulatoryChallengeQuestion
        };
        const regulatoryInfoJSON = JSON.stringify(regulatoryInfo);
        localStorage.setItem('regulatoryInfo', regulatoryInfoJSON);

        var personalInfo = JSON.parse(localStorage.getItem('personalInfo'));
        // console.log("personalInfo is",personalInfo);
        var businessInfo = JSON.parse(localStorage.getItem('businessInfo'));
        // console.log("businessInfo is",businessInfo);
        var financeInfo = JSON.parse(localStorage.getItem('financeInfo'));
        // console.log("financeInfo is",financeInfo);
        var challengeInfo = JSON.parse(localStorage.getItem('challengeInfo'));
        // console.log("challengeInfo is",challengeInfo);
        var loanInfo = JSON.parse(localStorage.getItem('loanInfo'));
        // console.log("loanInfo is",loanInfo);
        var regulatoryInfo = JSON.parse(localStorage.getItem('regulatoryInfo'));
        // console.log("regulatoryInfo is",regulatoryInfo);
        var user = JSON.parse(localStorage.getItem('userLoginDetails'));
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://smebackendmain.onrender.com/api/businessShow', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            personalInfo: personalInfo,
            businessInfo: businessInfo,
            financeInfo: financeInfo,
            challengeInfo: challengeInfo,
            loanInfo: loanInfo,
            regulatoryInfo: regulatoryInfo,
            username: user.username, 
            usercookie: user.cookie}));
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                var response = JSON.parse(xhr.responseText);
                console.log(response);
                document.querySelector('.questionsHold').innerHTML = `
                <br><br>
                <h1>Thank you for filling the form. It is under Review</h1>
                <br><br><br>
                <div class="buttonHold">
                <button type="button" onclick="hideQuestionnaire()">Close</button>
                <button type="button" onclick="homepageMove()">Go to Homepage</button>
                </div>`;
            }
        }
    }
    else{
        alert('Please fill all fields');
    }
}

function homepageMove(){
    window.location.href = '/homepageUser/homepageU.html';
}