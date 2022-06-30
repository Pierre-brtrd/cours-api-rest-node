let listDiv = document.querySelector('#list-message');

function listMessage() {
    axios.get("http://localhost:8080/api/messages?order=createdAt:DESC")
        .then((response) => {
            listDiv.innerHTML = "";

            let data = response.data;

            data.forEach((element) => {
                listDiv.innerHTML += `
                <div class="col-md-4 p-2">
                    <div class="card">
                        <div class="card-header">
                            <h1>${element.title}</h1>
                            <a id="nbr-likes" class="nbr-likes text-muted stretched-link" data-id-message="${element.id}">${(element.likes > 0) ? `<i class="bi bi-heart-fill"></i>` : `<i class="bi bi-heart"></i>`} ${element.likes}</a>
                        </div>
                        <div class="card-body">
                            <em class="cart-text text-muted">${element.Category.nom}</em>
                            <p class="text-muted">${element.user.username}</p>
                            <p class="card-text">${element.content}</p>
                        </div>
                    </div>
                </div>
                `
            });

            let likeBtn = document.querySelectorAll('#nbr-likes');

            likeBtn.forEach(element => {
                element.addEventListener('click', () => {
                    like(element)
                });
            });

        })
        .catch((error) => {
            console.error(error);
        });
}

function like(data) {
    axios.post(`/api/messages/${data.dataset.idMessage}/vote/like`, '', {
        headers: {
            'Authorization': 'Bearer ' + document.cookie.replace('token=', '')
        }
    }).then(response => {
        if (response.status === 200) {
            listMessage();
        }
    }).catch(err => {
        console.error(err);
    })
}