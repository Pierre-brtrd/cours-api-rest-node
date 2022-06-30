let select = document.querySelector('#form-create-message #categoryId');
let formMessage = document.querySelector('#form-create-message');
let formLogin = document.querySelector('#form-login');
let formTags = document.querySelector('#form-create-category');

let messageSucess = document.querySelector('#message-sucess');

if (formMessage) {
    formMessage.addEventListener('submit', (event) => {
        event.preventDefault();

        let data = {
            "title": formMessage.querySelector('#title').value,
            "content": formMessage.querySelector('#content').value,
            "categoryId": parseInt(formMessage.querySelector('#categoryId').value)
        };

        axios.post('http://localhost:8080/api/messages/new', data, {
            headers: {
                'Authorization': 'Bearer ' + document.cookie.replace('token=', '')
            }
        })
            .then(response => {
                if (response.status === 200) {
                    messageSucess.innerHTML += `<p>Message envoyé avec succès</p>`;
                    messageSucess.classList.remove('d-none');
                }
            }).catch(err => {
                console.error(err);
            })
    });
}

if (select) {
    axios.get('http://localhost:8080/api/tags')
        .then(response => {
            let data = response.data;

            data.forEach(element => {
                select.innerHTML += `
                    <option value="${element.id}">${element.nom}</option>
                `
            });
        });
}

if (formLogin) {
    formLogin.addEventListener('submit', (event) => {
        event.preventDefault();

        let data = {
            "email": formLogin.querySelector('#email').value,
            "password": formLogin.querySelector('#password').value,
        };

        axios.post('/api/users/login', data)
            .then(response => {
                if (response.status === 200) {
                    document.cookie = "token=" + response.data.token;
                    messageSucess.innerHTML += `<p>Vous êtes connecté</p>`;
                    messageSucess.classList.remove('d-none');
                }

            }).catch(err => {
                console.error(err);
            })
    })
}

if (formTags) {
    formTags.addEventListener('submit', (event) => {
        event.preventDefault();

        let data = {
            "nom": formTags.querySelector('#categorie').value,
        };

        axios.post('/api/tags/create', data, {
            headers: {
                'Authorization': 'Bearer ' + document.cookie.replace('token=', '')
            }
        })
            .then(response => {
                if (response.status === 200) {
                    messageSucess.innerHTML += `<p>Catégorie créée avec succès</p>`;
                    messageSucess.classList.remove('d-none');
                }
            }).catch(err => {
                console.error(err);
            })
    });
}