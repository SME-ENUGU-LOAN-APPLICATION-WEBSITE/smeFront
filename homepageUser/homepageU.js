checkLogin();
function checkLogin(){
    // if there is no user logged in, redirect to login page
    if(!localStorage.getItem('user')){
        window.location.href = '../login/login.html';
        // console.log('No user logged in');
    }
    // if there is a user logged in, send a request to the server to check if the user is still valid. it should expect a response that first tells if the user is valid and second shows if the user is an admin or just user. If not, redirect to login page
    else{
        var user = JSON.parse(localStorage.getItem('user'));
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3003/api/checkUser', true);
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
                    window.location.href = '../login/login.html';
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
            xhr.open('POST', 'http://localhost:3003/api/checkUser', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({username: user.username, password: user.password}));
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4 && xhr.status == 200){
                    var response = JSON.parse(xhr.responseText);
                    if(response.valid == true){
                        if(response.admin == false){
                            // document.querySelector('.checklogin').className = 'loggedIn';
                            console.log("admin response, you are not an admin and logged in as " + user.username);
                        }
                        else{
                            window.location.href = 'admin.html';
                        }
                    }
                }
            }
        }
    
}


function getApplications(){
            // get all applications related to username(email) and put in applicationsHold
            if(localStorage.getItem('user')){
                var user = JSON.parse(localStorage.getItem('user'));
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'http://localhost:3003/api/getAllApplic', true);
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

        document.querySelector("section.activityHold").innerHTML = `
        <div class="activity">
                <p>Submitted</p>
                <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
        </div>
        <div class="activity">
                <p>Accepted</p>
                <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
        </div>`

        document.querySelector(".buttonHold").innerHTML = `
        <button type="button" id="cta" onclick="uploadDocument('${applicID}','${bizName}','${loanAmount}','${timeSubmitted}','${loanStatus}')">Upload Document</button>`
    }else
    if(loanStatus == "Submitted"){
        document.querySelector(".statusBox").innerHTML = `
            <p>Status</p>
            <h2>Submitted<span> - Pending</span></h2><!-- we have under review - pending, - accepted and plain old rejected-->`;
    }else
    if(loanStatus == "Rejected"){
        document.querySelector(".statusBox").innerHTML = `
            <p>Status</p>
            <h2>${loanAmount}</h2>
            <p>Rejected</p><!-- we have under review - pending, - accepted and plain old rejected-->`;

        document.querySelector("section.activityHold").innerHTML = `
        <div class="activity">
                <p>Submitted</p>
                <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
        </div>
        <div class="activity">
                <p>Rejected</p>
        </div>`
    }else
    if(loanStatus == "Pending"){
        document.querySelector(".statusBox").innerHTML = `
            <p>Status</p>
            <h2>${loanAmount}</h2>
            <p>Pending Document Review</p><!-- we have under review - pending, - accepted and plain old rejected-->`;

            document.querySelector("section.activityHold").innerHTML = `
            <div class="activity">
                    <p>Submitted</p>
                    <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            </div>
            <div class="activity">
                    <p>Accepted</p>
                    <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            </div>
            <div class="activity">
                    <p>Documents Uploaded</p>
                    <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            </div>`
    }else
    if(loanStatus == "Approved"){
        document.querySelector(".statusBox").innerHTML = `
            <p>Status</p>
            <h2>${loanAmount}</h2>
            <p>Approved</p><!-- we have under review - pending, - accepted and plain old rejected-->`;

            document.querySelector("section.activityHold").innerHTML = `
            <div class="activity">
                    <p>Submitted</p>
                    <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            </div>
            <div class="activity">
                    <p>Accepted</p>
                    <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            </div>
            <div class="activity">
                    <p>Documents Uploaded</p>
                    <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            </div>
            <div class="activity">
                    <p>Approved</p>
                    <img src="../approvedGreen.svg" alt="good" width="30px" height="30px">
            </div>`
    }
}

function uploadDocument(applicID,bizName,loanAmount,timeSubmitted,loanStatus){
    console.log("uploading documents")
    document.querySelector('section.content').innerHTML = `
        <h1 class="contentHeading">
            Application #${applicID}
        </h1>
        <h2>Upload Documents</h2>

        <h3 class="activityHeading">Process Description</h3>
        <ul>
            <li>Upload the required images to Google drive</li>
            <li>In Google Drive, click on the 3 dots on the images and select "Share"</li>
            <li>Under "General access", Select "Anyone with link can view" then click on copy link</li>
            <li>Paste the link in the required field</li>
        </ul>

        <h3 class="activityHeading">ID Card</h3>
        <p>Personal ID card</p>
        <label for="idCardLink">Form Link</label>
        <input type="text" id="idCardLink" name="idCardLink" title="ID card link">

        <h3 class="activityHeading">Business Certificate</h3>
        <p>Business Certificate</p>
        <label for="businessCertificateLink">Form Link</label>
        <input type="text" id="businessCertificateLink" name="businessCertificateLink" title="Paste the link to your Business Certificate image here">

        <h3 class="activityHeading">Bank Statement</h3>
        <p>Business Bank Statement</p>
        <label for="bankStatementLink">Form Link</label>
        <input type="text" id="bankStatementLink" name="bankStatementLink" title="Bank Statement Link">

        <h3 class="activityHeading">BVN</h3>
        <p>11-digit Bank Verification Number</p>
        <label for="BVN">BVN</label>
        <input type="text" id="BVN" name="BVN" title="Input your BVN">

        <h3 class="activityHeading">Loan Amount</h3>
        <p>Input the amount your business needs</p>
        <label for="LoanAmount">Loan Amount</label>
        <input type="text" id="LoanAmount" name="LoanAmount" title="Loan Amount">

        <h3 class="activityHeading">Loan Duration</h3>
        <p>Loan duration in months</p>
        <label for="LoanDuration">Loan Duration</label>
        <input type="text" id="LoanDuration" name="LoanDuration" title="Loan Duration">

        <h3 class="activityHeading">Interest Rate</h3>
        <p>Interest rate per month</p>
        <input type="text" id="interestRate" name="interestRate" title="Interest rate" disabled>

        <h3 class="activityHeading">Payment per month</h3>
        <p>Payment per month</p>
        <input type="text" id="PaymentPer" name="PaymentPer" title="PaymentPer" disabled>

        <div class="buttonHold">
            <button type="button" id="submitDocumentBtn" onclick="submitDocument('${applicID}','${bizName}','${loanAmount}','${timeSubmitted}','${loanStatus}')">Submit</button>
        </div>`

        updateInterest()
}

function updateInterest(){
        // update the interest and payment per month as user is typing 
        const loanAmountInput = document.getElementById("LoanAmount");
        const loanDurationInput = document.getElementById("LoanDuration");
        const interestRateInput = document.getElementById("interestRate");
        const paymentPerInput = document.getElementById("PaymentPer");
    
        loanDurationInput.addEventListener("input", () => {
          const loanAmount = parseFloat(loanAmountInput.value);
          const loanDuration = parseInt(loanDurationInput.value);
    
          if (!isNaN(loanAmount) && !isNaN(loanDuration)) {
            let interestRate;
    
            // Determine the interest rate based on loan duration
            if (loanDuration >= 1 && loanDuration <= 6) {
              interestRate = 0.21 - ((loanDuration - 1) * 0.01); // 21% to 17%
            } else if (loanDuration >= 7 && loanDuration <= 12) {
              interestRate = 0.16 - ((loanDuration - 7) * 0.01); // 16% to 12%
            } else if (loanDuration >= 13 && loanDuration <= 24) {
              interestRate = 0.11 - ((loanDuration - 13) * 0.004); // 11% to 7%
            } else if (loanDuration >= 25 && loanDuration <= 36) {
              interestRate = 0.06 - ((loanDuration - 25) * 0.002); // 6% to 4%
            } else if (loanDuration >= 37 && loanDuration <= 60) {
              interestRate = 0.03 - ((loanDuration - 37) * 0.001); // 3% to 1%
            } else {
              interestRate = 0; // Invalid duration
            }
    
            if (interestRate > 0) {
              // Calculate the interest payment per month
              const interestPerMonth = loanAmount * interestRate;
    
              // Calculate the monthly repayment of the principal
              const principalPerMonth = loanAmount / loanDuration;
    
              // Total monthly payment
              const totalMonthlyPayment = principalPerMonth + interestPerMonth;
    
              // Update the fields
              interestRateInput.value = (interestRate * 100).toFixed(2) + "%"; // Display interest rate as a percentage
              paymentPerInput.value = totalMonthlyPayment.toFixed(2); // Total payment per month
    
              // Log the total amount to be paid over the entire duration
              const totalPayment = totalMonthlyPayment * loanDuration;
              console.log("Total Amount to be paid:", totalPayment.toFixed(2));
            } else {
              interestRateInput.value = "";
              paymentPerInput.value = "";
            }
          } else {
            interestRateInput.value = "";
            paymentPerInput.value = "";
          }
        });
}

function submitDocument(applicID,bizName,loanAmount,timeSubmitted,loanStatus){
    let idCardLink = document.querySelector('#idCardLink').value;
    let businessCertificateLink = document.querySelector('#businessCertificateLink').value;
    let bankStatementLink = document.querySelector('#bankStatementLink').value;
    let BVN = document.querySelector('#BVN').value;
    let LoanAmount = document.querySelector('#LoanAmount').value;
    let LoanDuration = document.querySelector('#LoanDuration').value;
    let interestRate = document.querySelector('#interestRate').value;
    let PaymentPer = document.querySelector('#PaymentPer').value;

//if all the inputs have value, store in backend
if(idCardLink && businessCertificateLink && bankStatementLink && BVN && LoanAmount && LoanDuration && interestRate && PaymentPer){
    // store the document details
    if(localStorage.getItem('user')){
        var user = JSON.parse(localStorage.getItem('user'));
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3003/api/uploadDocument', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            username: user.username,
            applicationID: applicID,
            idCardLink: idCardLink,
            businessCertificateLink:businessCertificateLink,
            bankStatementLink: bankStatementLink,
            BVN:BVN,
            LoanAmount: LoanAmount,
            LoanDuration: LoanDuration,
            interestRate: interestRate,
            PaymentPer: PaymentPer
        }));
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                var response = JSON.parse(xhr.responseText);
                // code from here
                // something to show that the submission was successful
                updatePending(applicID)
                alert('Documents submitted successfully')

            }
        }
    }
} else{
    alert("Fill All The Fields Please")
}

}

function updatePending(applicID){
    // update loan status to pending
    var user = JSON.parse(localStorage.getItem('userLoginDetails'));
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3003/api/adminChangeOne', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        id:applicID,
        loanStatus: "Pending"}));
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            if(response.valid == true){
                // document.querySelector('.questionsHold').innerHTML = `<h1>Hello ${fullname}</h1>`;
                alert("Changed Loan Status to pending")
                location.reload();
            }
        }
    }
}

function logout(){
    // remove the user from the local storage and redirect to login page
    localStorage.removeItem('user');
    window.location.href = '../login/login.html';
}

function adminLogout(){
    // remove the user from the local storage and redirect to login page
    localStorage.removeItem('userLoginDetails');
    window.location.href = '../login/login.html';
}