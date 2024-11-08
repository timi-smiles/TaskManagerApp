let signUpForm = document.querySelector('.signupForm');

signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

        const fname = document.querySelector('#firstName').value;
        const lname = document.querySelector('#lastName').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
    
       try {
        // Send sign-up data to the backend
        let response = await fetch('http://localhost:3000/api/users/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fname, lname, email, password })
        });

        if (response.ok) {
            let data = await response.json();
            alert(data.message);

            // Redirect to verify email page after a short delay
            setTimeout(() => {
                window.location.href = '/FRONTEND/login.html';
            }, 1000);
        } else {
            let errorData = await response.json();
            throw new Error(errorData.message || 'Sign-up failed');
        }
    } catch (error) { alert(error.message) }});