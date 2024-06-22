document.getElementById('owner-check-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const isOwner = document.getElementById('is-owner').checked;
    const ownerName = document.getElementById('owner-name').value;

    fetch('/check-owner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isOwner, ownerName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('owner-check-form').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
        } else {
            alert('Owner verification failed. Phone is locked.');
            lockPhone();
        }
    });
});

document.getElementById('login').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.requires2FA) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('2fa-form').style.display = 'block';
        } else {
            alert('Login failed');
        }
    });
});

document.getElementById('submit-2fa').addEventListener('click', function () {
    const token = document.getElementById('2fa-code').value;

    fetch('/verify-2fa', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('2fa-form').style.display = 'none';
            document.getElementById('tracking-info').style.display = 'block';
            trackPhone();
        } else {
            alert('2FA verification failed');
        }
    });
});

function trackPhone() {
    fetch('/track')
        .then(response => response.json())
        .then(data => {
            document.getElementById('location').innerText = `Location: ${data.location}`;
        });

    document.getElementById('lock-phone').addEventListener('click', function () {
        fetch('/lock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Phone locked');
            } else {
                alert('Failed to lock phone');
            }
        });
    });
}

function lockPhone() {
    // Function to lock the phone
    fetch('/lock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Phone locked');
        } else {
            alert('Failed to lock phone');
        }
    });
}