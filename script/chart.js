   // Sample data for ratings
   const ratingsData = {
    '5 stars': 20,
    '4 stars': 15,
    '3 stars': 10,
    '2 stars': 8,
    '1 star': 11
};

// Prepare data for Chart.js
const labels = Object.keys(ratingsData);
const data = Object.values(ratingsData);

// Render chart using Chart.js
const ctx = document.getElementById('ratingChart').getContext('2d');
const ratingChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Number of Reviews',
            data: data,
            backgroundColor: "#fdd247",
            borderColor: 'rgba(253, 210, 71, 1)',
            borderWidth: 0,
            borderRadius: 10,
            barPercentage: 1 // Control the width of bars
        }]
    },
    options: {
        indexAxis: 'y',
        animation: {
            duration: 2000, // Animation duration in milliseconds
            easing: 'easeOutBounce' // Easing function for the animation
        },
        scales: {
            x: {
                display: false,
                beginAtZero: true,
                grid: {
                    display: false // Remove grid lines on x-axis
                }
            },
            y: {
                display: true,
                beginAtZero: true,
                grid: {
                    display: false // Remove grid lines on y-axis
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});