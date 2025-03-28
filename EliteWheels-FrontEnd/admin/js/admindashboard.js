new Chart(document.getElementById('bookingsChart'), {
    type: 'pie',
    data: {
        labels: ['Completed', 'Pending', 'Cancelled'],
        datasets: [{ data: [120, 45, 20], backgroundColor: ['#d94e3c', '#2d8a4e', '#3380ff'] }]
    }
});

new Chart(document.getElementById('carTypeChart'), {
    type: 'bar',
    data: {
        labels: ['Sedan', 'SUV', 'Hatchback', 'Luxury'],
        datasets: [{ data: [40, 30, 25, 15], backgroundColor: ['#d94e3c', '#2d8a4e', '#3380ff', '#ffb533'] }]
    }
});
