document.getElementById('securityForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var ownerAnswer = document.querySelector('input[name="owner"]:checked').value;

    if (ownerAnswer === 'yes') {
        document.getElementById('nameInput').style.display = 'block';
        document.getElementById('securityForm').style.display = 'none';
    } else {
        document.getElementById('message').textContent = 'Access denied. You must be the owner to proceed.';
    }
});

document.getElementById('unlockForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var creatorName = document.getElementById('creatorName').value.trim().toLowerCase();

    if (creatorName === 'cyberdrone') {
        document.getElementById('message').textContent = 'Access granted. Loading...';
        setTimeout(function() {
            document.getElementById('unlockForm').style.display = 'none';
            document.getElementById('phoneContent').style.display = 'block'; // Assuming 'phoneContent' is the id of the content to display
        }, 2000); // Simulate loading for 2 seconds
    } else {
        document.getElementById('message').textContent = 'Incorrect creator name. Phone disabled.';
        document.getElementById('passcode').disabled = true;
        document.querySelector('#unlockForm button').disabled = true;
    }
});
