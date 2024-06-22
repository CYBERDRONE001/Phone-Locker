document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('permissionDialog').style.display = 'block';

    document.getElementById('grantPermission').addEventListener('click', function() {
        document.getElementById('permissionDialog').style.display = 'none';
        document.getElementById('securityForm').style.display = 'block';
    });

    document.getElementById('denyPermission').addEventListener('click', function() {
        document.getElementById('message').textContent = 'Permission denied. Access restricted.';
    });
});

document.getElementById('securityForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var ownerAnswer = document.querySelector('input[name="owner"]:checked').value;

    if (ownerAnswer === 'yes') {
        document.getElementById('nameInput').style.display = 'block';
    } else {
        document.getElementById('message').textContent = 'Access denied. You must be the owner to proceed.';
    }
});

document.getElementById('securityForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var creatorName = document.getElementById('creatorName').value.trim().toLowerCase();

    if (creatorName === 'cyberdrone') {
        document.getElementById('securityForm').style.display = 'none';
        document.getElementById('unlockForm').style.display = 'block';
    } else {
        document.getElementById('message').textContent = 'Incorrect creator name. Phone disabled.';
        document.getElementById('creatorName').disabled = true;
        document.querySelector('#nameInput button').disabled = true;
    }
});

document.getElementById('unlockForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var secretPasscode = '1234'; // Replace with your secret passcode
    var enteredPasscode = document.getElementById('passcode').value;

    if (enteredPasscode === secretPasscode) {
        document.getElementById('message').textContent = 'Access granted. Loading...';
        setTimeout(function() {
            document.getElementById('unlockForm').style.display = 'none';
            document.getElementById('phoneContent').style.display = 'block';
        }, 2000); // Simulate loading for 2 seconds
    } else {
        document.getElementById('message').textContent = 'Incorrect passcode. Try again.';
    }
});
