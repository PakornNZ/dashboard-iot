checkSession();

function checkSession() {
    fetch("./API/session.php")
    .then(response => response.json())
    .then(data => {
        if (data.status == 0) {
            document.querySelector('[name="login"]').style.display = 'block';
        } else {
            document.querySelector('[name="login"]').style.display = 'none';
        }
    })
}

function loginJS() {
    const formData = new FormData(document.querySelector('[name="loginForm"]'));
    fetch("./API/login.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == 'success') {
            checkSession();
        } else {
            alert(data.status);
        }
    })
}

function logoutJS() {
    fetch("./API/logout.php")
}
