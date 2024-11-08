let loginForm = document.querySelector('.loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;

    try {
        let response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            let result = await response.json();
            let userId = result.user.id; 

            sessionStorage.setItem('userId', userId);
            setTimeout(() => {
                window.location.href = '/FRONTEND/task.html';
            }, 1000);
        } else {
            let error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        alert(error.message);
    }
});