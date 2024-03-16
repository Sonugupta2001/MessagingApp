document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn1').addEventListener('click', async () => {
        var username = document.getElementById('usrname').value;
        var password = document.getElementById('password').value;
        var confirm_password = document.getElementById('confirm_password').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;

        if (password !== confirm_password) {
            alert('Password and Confirm Password do not match');
            return;
        }

        var response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                phone: phone
            })
        });

        var result = await response.json();
        if (result.status === 'success') {
            alert('Signup successful');
            window.location.href = 'http://localhost:3000/loginPage';
        } else {
            alert('Signup failed');
        }
    });
});