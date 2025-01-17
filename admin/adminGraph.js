let graphShow = 0;
function showGraphs(){
    if(graphShow == 0){
        document.querySelector('.g1').style.display = "none";
        document.querySelector('.g2').style.display = "none";
        document.querySelector('.g3').style.display = "none";
        graphShow++;
    }else
    if(graphShow == 1){
        document.querySelector('.g1').style.display = "flex";
        document.querySelector('.g2').style.display = "flex";
        document.querySelector('.g3').style.display = "flex";
        graphShow--;
    }
}



function getApplications() {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3003/api/adminGetAll', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ username: user.username }));

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log("Application Response Data is: ", response);
          
          // Process response data
          const eligibleApplicationsData = processApplications(response);

          // Create the line chart
          createLineChart(eligibleApplicationsData);
        }
      };
    }
  }

  // Function to process applications data
  function processApplications(data) {
    const eligibleApplications = {};
    const firstDate = new Date(data[0].dateSubmitted); // Get the first submission date
    const today = new Date();

    // Initialize eligibleApplications with days since first submission
    for (
      let date = new Date(firstDate);
      date <= today;
      date.setDate(date.getDate() + 1)
    ) {
      const key = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      eligibleApplications[key] = 0;
    }

    // Filter eligible applications and populate eligibleApplications object
    data.forEach((app) => {
      const submissionDate = new Date(app.dateSubmitted).toISOString().split('T')[0];
      if (app.loanStatus !== "Submitted" && app.loanStatus !== "Rejected") {
        eligibleApplications[submissionDate]++;
      }
    });

    // Format data for chart
    const labels = Object.keys(eligibleApplications);
    const values = Object.values(eligibleApplications);

    return { labels, values };
  }

  // Function to create a line chart using Chart.js
  function createLineChart(data) {
    const ctx = document.getElementById('eligibleApplicationsChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels, // Days since first submission
        datasets: [
          {
            label: 'Eligible Applications',
            data: data.values,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0.4, // Smooth line
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
                color: 'white'
            }
          },
        },
        scales: {
          x: {
            grid: {
                display: true, // Disable grid lines for X-axis
                color:'white'
            },
            ticks:{
                color:'white'
            },
            title: {
              display: true,
              text: 'Days Since First Submission',
              color:'white'
            },
          },
          y: {
            grid: {
                display: true, // Disable grid lines for Y-axis
                color:'white'
            },
            ticks:{
                color:'white'
            },
            title: {
              display: true,
              text: 'Eligible Applications',
              color:'white'
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Call the function to fetch applications and render the chart
  getApplications();



//   -----------------------------------------------------------------

// For the second one
// Extract submission dates and calculate days since the first submission
// const applications = [
//     // Response data here...
// ];

// const submissionDates = applications.map(app => new Date(app.dateSubmitted));
// submissionDates.sort((a, b) => a - b); // Sort dates in ascending order

// const firstSubmissionDate = submissionDates[0];
// const daysSinceFirstSubmission = [...new Set(submissionDates.map(date =>
//     Math.floor((date - firstSubmissionDate) / (1000 * 60 * 60 * 24))
// ))];

// // Count total applications made each day
// const dailyApplicationCounts = daysSinceFirstSubmission.map(day => {
//     const dayStart = new Date(firstSubmissionDate);
//     dayStart.setDate(dayStart.getDate() + day); // Calculate the specific day
//     const dayEnd = new Date(dayStart);
//     dayEnd.setDate(dayStart.getDate() + 1); // Add 1 day to calculate the range
//     return applications.filter(app => {
//         const appDate = new Date(app.dateSubmitted);
//         return appDate >= dayStart && appDate < dayEnd;
//     }).length;
// });

// // Render the line chart
// const ctx = document.querySelector('.g2').getContext('2d');
// new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: daysSinceFirstSubmission, // Days since the first submission
//         datasets: [{
//             label: 'Total Applications per Day',
//             data: dailyApplicationCounts, // Total applications per day
//             borderColor: 'rgba(75, 192, 192, 1)',
//             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//             tension: 0.2, // Smooth curve
//         }]
//     },
//     options: {
//         responsive: true,
//         scales: {
//             x: {
//                 grid: {
//                     color: 'white',
//                 },
//                 ticks: {
//                     color: 'white',
//                 },
//                 title: {
//                     display: true,
//                     text: 'Days Since First Submission',
//                     color: 'white',
//                 }
//             },
//             y: {
//                 grid: {
//                     color: 'white',
//                 },
//                 ticks: {
//                     color: 'white',
//                 },
//                 title: {
//                     display: true,
//                     text: 'Total Applications',
//                     color: 'white',
//                 }
//             }
//         },
//         plugins: {
//             legend: {
//                 labels: {
//                     color: 'white'
//                 }
//             },
//             tooltip: {
//                 enabled: true
//             }
//         }
//     }
// });


function getApplicationsAndRenderChart() {
    // Check if user exists in localStorage
    if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user'));
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3003/api/adminGetAll', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ username: user.username }));

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const response = JSON.parse(xhr.responseText);
                console.log("Application Response Data:", response);

                // Process the response to extract and group by date
                const applications = response;

                // Extract submission dates and format them as 'YYYY-MM-DD'
                const submissionDates = applications.map(app => new Date(app.dateSubmitted));
                submissionDates.sort((a, b) => a - b); // Sort dates in ascending order

                // Group applications by date
                const dailyApplicationCounts = {};
                submissionDates.forEach(date => {
                    const formattedDate = date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
                    dailyApplicationCounts[formattedDate] = (dailyApplicationCounts[formattedDate] || 0) + 1;
                });

                // Extract labels (dates) and data (application counts)
                const labels = Object.keys(dailyApplicationCounts); // Dates
                const data = Object.values(dailyApplicationCounts); // Counts

                // Render the line chart
                const ctx = document.querySelector('#totalApplicationsChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels, // Dates
                        datasets: [{
                            label: 'Total Applications per Day',
                            data: data, // Total applications per day
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.2, // Smooth curve
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                grid: {
                                    color: 'white',
                                },
                                ticks: {
                                    color: 'white',
                                    callback: function (value, index) {
                                        return labels[index]; // Show date on the X-axis
                                    }
                                },
                                title: {
                                    display: true,
                                    text: 'Dates',
                                    color: 'white',
                                }
                            },
                            y: {
                                grid: {
                                    color: 'white',
                                },
                                ticks: {
                                    color: 'white',
                                },
                                title: {
                                    display: true,
                                    text: 'Total Applications',
                                    color: 'white',
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: 'white'
                                }
                            },
                            tooltip: {
                                enabled: true
                            }
                        }
                    }
                });
            }
        };
    }
}

getApplicationsAndRenderChart()


// ----------------------------------------------------------------------
// approved vs rejected bar chart

function getApplicationsAndRenderBarChart() {
    // Check if user exists in localStorage
    if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user'));
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3003/api/adminGetAll', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ username: user.username }));

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const response = JSON.parse(xhr.responseText);
                console.log("Application Response Data:", response);

                // Process the response to extract and group by date for Approved and Rejected statuses
                const applications = response;

                // Extract submission dates and categorize by loan status
                const submissionDates = applications.map(app => new Date(app.dateSubmitted));
                submissionDates.sort((a, b) => a - b); // Sort dates in ascending order

                // Group applications by date and loan status (Approved/Rejected)
                const dailyStatusCounts = {};
                submissionDates.forEach(date => {
                    const formattedDate = date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
                    if (!dailyStatusCounts[formattedDate]) {
                        dailyStatusCounts[formattedDate] = { approved: 0, rejected: 0 };
                    }
                    const loanStatus = applications.find(app => new Date(app.dateSubmitted).getTime() === date.getTime()).loanStatus;
                    if (loanStatus === 'Approved') {
                        dailyStatusCounts[formattedDate].approved += 1;
                    } else if (loanStatus === 'Rejected') {
                        dailyStatusCounts[formattedDate].rejected += 1;
                    }
                });
                
                // Extract labels (dates) and data for both "Approved" and "Rejected" applications
                const labels = Object.keys(dailyStatusCounts); // Dates
                const approvedData = Object.values(dailyStatusCounts).map(status => status.approved);
                const rejectedData = Object.values(dailyStatusCounts).map(status => status.rejected);

                // Render the bar chart
                // console.log("Dis dat chartoo")
                const ctx = document.querySelector('#approvedVsRejectedChart').getContext('2d');
                // console.log("Dis dat chartee")
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels, // Dates
                        datasets: [
                            {
                                label: 'Approved Applications',
                                data: approvedData, // Approved applications per day
                                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                            },
                            {
                                label: 'Rejected Applications',
                                data: rejectedData, // Rejected applications per day
                                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                grid: {
                                    color: 'white',
                                },
                                ticks: {
                                    color: 'white',
                                    callback: function (value, index) {
                                        return labels[index]; // Show date on the X-axis
                                    }
                                },
                                title: {
                                    display: true,
                                    text: 'Dates',
                                    color: 'white',
                                }
                            },
                            y: {
                                grid: {
                                    color: 'white',
                                },
                                ticks: {
                                    color: 'white',
                                },
                                title: {
                                    display: true,
                                    text: 'Number of Applications',
                                    color: 'white',
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: 'white'
                                }
                            },
                            tooltip: {
                                enabled: true
                            }
                        }
                    }
                });
            }
        };
    }
}
getApplicationsAndRenderBarChart()