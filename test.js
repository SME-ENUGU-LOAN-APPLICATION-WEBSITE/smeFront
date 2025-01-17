// var object = {
//     man:'yes',
//     woman:'no'}
// // document.querySelector('body').innerHTML = `<button type="button" onclick="show(object)">Button</button>`
// // writing out the name works
// document.querySelector('body').innerHTML = `<button type="button">Button</button>`
// document.querySelector('button').onclick = () => show(object);

// function show(params) {
//     console.log(params.man)
// }

// Get the canvas element
const ctx = document.getElementById('myLineChart').getContext('2d');

// Data for the line graph
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [{
    label: 'Acceptance Rate',
    data: [30, 50, 40, 60, 80, 70],
    borderColor: 'rgba(75, 192, 192, 1)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderWidth: 2,
    tension: 0.4 // Smooth line
  }]
};

// Configuration options
const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Sales ($)'
        },
        beginAtZero: true
      }
    }
  }
};

// Create the chart
new Chart(ctx, config);