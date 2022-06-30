let profilContent = document.querySelector('#profil-user');
let messageDanger = document.querySelector('#message-danger');

if (profilContent) {
    axios.get('/api/users/profil', {
        headers: {
            'Authorization': 'Bearer ' + document.cookie.replace('token=', '')
        }
    })
        .then(response => {
            console.error(response);
            if (response.status === 200) {
                let data = response.data;

                profilContent.innerHTML += `
                    <h2>${data.username}</h2>
                    <p>${data.email}</p>
                    <p>${data.bio}</p>
                    `;
            }

        }).catch(err => {
            messageDanger.innerHTML += `<p>Vous devez être <a href="/login">connecté</a></p>`;
            messageDanger.classList.remove('d-none');
            profilContent.classList.add('d-none');
        });
}
