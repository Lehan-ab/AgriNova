document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm');
    const bookingContainer = document.getElementById('bookingContainer');
    const successState = document.getElementById('successState');

    // Set today as min date
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const reqData = {
                service: document.getElementById('serviceType').value,
                date: document.getElementById('bookingDate').value,
                time: document.getElementById('bookingTime').value,
                location: document.getElementById('farmLocation').value,
                notes: document.getElementById('notes').value,
                status: 'Pending',
                farmerName: 'User', // Would be from auth in real app
                supplierId: 1 // hardcoded for prototype
            };

            // Save to DB
            await db.requests.add(reqData);

            // Hide form, show success
            bookingContainer.classList.add('hidden');
            successState.classList.remove('hidden');
        });
    }
});
