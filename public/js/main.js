let listDiv = document.querySelector('#list-message');

function listMessage() {
    axios.get("http://localhost:8080/api/messages/")
        .then((response) => {
            let data = response.data;

            data.forEach((element) => {
                listDiv.innerHTML += `
                <div>
                    <h1>${element.title}</h1>
                    <p>${element.content}</p>
                </div>
                `
            });

        })
        .catch((error) => {
            console.error(error);
        });
}