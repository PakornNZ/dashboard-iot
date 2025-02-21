function controlValue() {
    const fanValue = document.getElementById("fan-input").value;

    if (fanValue.trim() === "") {
        alert("Please enter a fan value.");
        return;
    } else if (fanValue.trim() >= 20 && fanValue.trim() <= 60) {
        fetch(`${API_BASE_URL}controlValue.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({fan: fanValue})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById("fan-input").value = "";
        })
        .catch(error => console.error("Error:", error))
    } else {
        alert("Please enter a value 20 to 60");
        document.getElementById("fan-input").value = "";
        return;
    }

}
