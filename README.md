# Développement API Node

Dans ce cours, nous allons mettre en place une API Nodejs.

Pour ce cours, vous avez besoin de connaitre les bases d'une API REST et un minimum de javascript pour mettre en place notre API.

Nous utiliserons __Docker__ pour la mise en place environnement et __Postman__ pour l'exécution de requêtes API.

Afin de pouvoir récupérer plus facilement les modifications et garder un projet "propre", je vous conseille également d'utiliser Git pour versionner votre projet.

## Le projet

Pour cette API, nous allons développer une API simple pour un __réseau social__, nous allons implanter plusieurs points :

- Utilisateurs -> gestion des utilisateurs et authentification
- Message -> possibilité de créer des messages
- Like -> fonctionnalité de like de message

Pour ce projet nous n'allons pas développer la partie frontend de l'application, seulement les interactions avec la base de données via les requêtes API.

## Construire l'environnement

Dans un premier temps, vous allez devoir construire votre environnement avec docker.

J'ai préparé le fichier de __docker-compose__ et __Dockerfile__ afin de gagner du temps, sachez juste que nous allons utiliser 3 images :

- Mysql -> pour la base de données
- PhpMyAdmin -> pour la gestion de la base de données pendant le développement
- App -> Création d'une image Node pour mise en place serveur et ainsi faire tourner notre application NodeJs

Pour mettre en place l'environnement, ouvrez un terminal de commande à l'emplacement de votre dossier API (celui où il y a les fichiers docker etc..) et entrez la commande :

```bash
docker-composer up -d
```

Vous devriez voir le build de votre environnement se lancer.

## Mettre en place notre serveur NodeJs

Maintenant que nous avons notre environnement de construit, nous allons pouvoir développer notre serveur HTTP.

Pour ce faire, nous allons créer un nouveau fichier __server.js__, dans ce fichier, nous allons configurer notre serveur HTTP.

Tout d'abord, nous allons déclarer les lib que nous allons utiliser sur le serveur (pour le moment express).

```js
// Imports
var express = require('express');
```

_(Si vous avez une erreur comme quoi express n'est pas définit, il faut vous connecter sur le terminal du container app et lancer la commande __npm Install__ pour installer toutes les dépendance)_

Une fois la lib express importée, nous allons instancier le serveur :

```js
// Imports
var express = require('express');

// Instanciate server
var app = express();
```

Maintenant, quand nous allons vouloir modifier le serveur, nous allons utiliser la variable app.

Il nous reste pour finir à configurer la route de la page d'accueil et de lancer le serveur.

Dans un premier temps la route :

```js
// Route configuration
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send("<h1>Bienvenue son mon serveur API Node");
});
```

Ici nous devons utiliser la fonction get sur la variable app (l'instance de notre serveur), cette fonction veut dire que nous sommes en train de définir une nouvelle route en GET (récupérer des informations).

Cette fonction prend 2 paramètres :

- Le chemin de la route (ou path)
- La callback -> la fonction qui va être exécutée à chaque fois qu'un navigateur va aller sur cette route.

Pour la callback, celle-ci prend également 2 paramètres :

- La requête (req)
- La réponse (res)

Vous aurez compris que dans ces 2 paramètres nous allons stocker les informations de la requête ainsi que les informations de la réponse.

Dans notre callback nous avons simplement définit que la réponse serait de type text/html et nous avons ensuite envoyé un code de réponse 200 (Ok) avec un h1 pour avoir un rendu sur notre page d'accueil.

Dernière étape : __Le lancement du serveur__ :

```js
// Launch server
app.listen(8080, () => {
    console.log('Server running');
});
```

Cette nous allons utiliser la fonction listen pour définir sur quel port le serveur écoute (8080), ensuite nous lui passons la callback avec un console.log() pour vérifier que le serveur tourne.

Maintenant, vous pouvez aller sur localhost:8080 et voir votre réponse `Bienvenue son mon serveur API Node`.

Nous aurions pu également utiliser des constantes pour définir le port ainsi que l'host du serveur afin de faciliter les modifications :

```js
// Imports
var express = require('express');

// Constants
const PORT = 8080;
const HOST = 'localhost';
var app = express();

// Route configuration
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send("<h1>Bienvenue son mon serveur API Node");
});

// Launch server
app.listen(PORT, () => {
    console.log(`Server running on port: http://${HOST}:${PORT}`);
});
```

## Préparer la base de données

Maintenant que notre serveur Node tourne, nous allons nous intéresser à la base de données et notamment, comment notre application va communiquer avec notre BDD.

Pour ça nous allons utiliser un ORM (**Object-Relational Mapping**) qui va permettre de transformer des objets en langage base de données.

Dans notre cas, nous allons créer des objets en javascript qui vous représenter nos différentes tables et c'est notre ORM qui va faire la traduction pour envoyer ces informations vers la base de données.

Nous allons utiliser __sequelize__ pour notre projet, il est déjà installé sur votre application et il nous reste seulement à l'initialiser et le configurer.

Pour ça, ouvrez le terminal de commande de votre image docker app en lançant la commande :

```bash
docker exec -ti [CONTAINER_ID] bash 
```

Une fois dans le terminal de votre image, vous pouvez lancer la commande d'initialisation de sequelize :

```bash
sequelize init
```

Si tout se passe correctement, vous devriez voir ce message :

```bash
root@5690b264f1bf:/app# sequelize init 

Sequelize CLI [Node: 18.1.0, CLI: 6.4.1, ORM: 6.20.0]

Created "config/config.json"
Successfully created models folder at "/app/models".
Successfully created migrations folder at "/app/migrations".
Successfully created seeders folder at "/app/seeders".
```

En plus de ça, vous devriez voir plusieurs dossiers se créer sur votre projet :

- models -> qui va stocker nos models (objets)
- Migrations -> qui va faire la traduction entre vos objets et la base de données
- Config -> ici vous allez rentrer la configuration avec la base de données

### Configuration de Sequelize

Avant toute chose, il va falloir indiquer à notre ORM où trouver notre base de données et comment se connecter à elle.

Pour ça, ouvrez le fichier config.json qui se trouve dans le dossier config, nous allons modifier l'host, le nom de la base ainsi que le mot de passe pour se connecter à la base de données _(n'oubliez pas de créer votre base de données avec PHPMyAdmin)_ :

```json
{
  "development": {
    "username": "root",
    "password": "root",
    "database": "api-node",
    "host": "db_node_api",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "root",
    "database": "api-node",
    "host": "db_node_api",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "root",
    "database": "api-node",
    "host": "db_node_api",
    "dialect": "mysql"
  }
}
```

### Création des classes

Maintenant que nous avons fait la configuration, nous allons créer nos classes. Chaque classe que nous allons créer représente une table qui sera créer par notre ORM.

Dans notre application nous allons vouloir pour le moment 2 tables :

- User
  - Email -> string
  - Username -> string
  - Password -> string
  - isAdmin -> boolean
- Message
  - idUSERS -> integer
  - Title -> string
  - Content -> string 
  - Attachment -> string
  - Likes -> integer

Pour créer une nouvelle classe nous allons utiliser le cli de sequelize, donc ouvrez le terminal docker de votre image app et rentrer la commande :

```bash
sequelize model:create --attributes "email:string username:string password:string bio:string isAdmin:boolean" --name User
```

Décortiquons ensemble cette commande :

- D'abord __`sequelize model:create`__ -> qui dit que nous allons utiliser le cli sequelize et que nous voulons créer un model (objet)
- Ensuite __`--attributes`__ -> qui permet de définir les attributs de notre model (les champs que nous voulons dans la table)
- __`"email:string username:string password:string bio:string isAdmin:boolean"`__ -> qui permet de définir les attributs ainsi que leur type (toujours CHAMP:TYPE)
- Enfin __`--name User`__ -> qui va donner un nom à notre model

Si tout se passe bien vous devriez avoir 2 nouveaux fichiers : 1 dans le dossier migration, et un autre dans le dossier models. 

Ces 2 fichiers sont le fichier de migration (traduction de l'objet javascript vers une table dans notre base de données), et le model (l'objet javascript).

Faite la même commande avec cette fois la table Message :

```bash
sequelize model:create --attributes "idUSERS:integer title:string content:string attachment:string likes:integer" --name Message
```

### Configuration des migrations

Certaines informations sont manquante sur les fichiers de migrations, nous allons donc devoir modifier légèrement les fichiers qui ont été générés.

D'abord la migration create-user :

```js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      bio: {
        allowNull: true,
        type: Sequelize.STRING
      },
      isAdmin: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
```

Ici nous avons rajouter les __allowNull__ sur les champs pour indiquer à notre serveur mysql les règles à suivr sur les champs.

Dans le __model user.js__ nous allons rajouter une relation entre la table user et la table message car dans notre application, nous voulons que chaque message soit rattaché à un User :

```js
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Message);
    }
  }
  User.init({
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
```

Ensuite dans la __migration create-message.js__ nous allons également rajouter les allowNull sur les champs et également rajouter la relation avec la table User :

```js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idUSERS: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING
      },
      attachment: {
        allowNull: true,
        type: Sequelize.STRING
      },
      likes: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
  }
};
```

Maintenant pour terminer la relation nous allons ouvrir le fichier __model message.js__ pour ajouter la relation :

```js
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Message.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        }
      })
    }
  }
  Message.init({
    idUSERS: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
```

### Migrer les changements

Maintenant que nous avons notre configuration ORM et que nous avons créé nos objets, il ne nous reste plus qu'à envoyer tout ces changements en BDD.

Pour ça vous avez simplement à rentrer la commande suivante dans le terminal de votre image Docker :

```bash
sequelize db:migrate
```

Si vous avez bien tout configurer la migration devrait être faite et vous pourrez votre sur PhpMyAdmin vos 2 tables Users et Messages.

## L'authentification

Maintenant que nous avons nos tables, nous allons commencer le développement de notre API avec d'abord l'authentification d'un utilisateur.

### Body parser

Pour récupérer plus facilement le body des requêtes HTTP, nous allons donc utiliser la lib body-parser sur notre projet.

Pour l'intégrer nous allons nous rendre dans le fichier server.js et importer la lib :

```js
// Imports
var express = require('express');
var bodyParser = require('body-parser');
```

Ensuite nous allons devoir dire à notre serveur d'utiliser bodyParser en lui passant la configuration :

```js
// Constants
const PORT = 8080;
const HOST = 'localhost';
var app = express();

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
```

### Création du routeur API

Maintenant, il va falloir créer notre routeur api pour définir toutes les routes qui vont faire des requêtes API.

Vous allez donc créer à la racine de votre projet un fichier __apiRouter.js__.

Ensuite nous allons créer un nouveau dossier que nous allons appeler __Routes__ dans lequel nous créerons les contrôleurs.

Dans ce dossier Routes, vous allez créer un fichier __usersController.js__ qui va stocker toutes les interactions avec les utilisateurs avec les requêtes API.

À l'intérieur nous allons importer 2 lib pour le moment : __bcrypt__ (pour hasher le password des utilisateurs) et __jsonwebtoken__ (pour attribuer un token d'authentification à chaque utilisateur) :

```js
// Imports
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
```

Ensuite, nous allons définir les fonction de nos routes :

```js
// Imports
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// Routes
// Imports
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// Routes
module.exports = {
    register: (req, res) => {
        // TODO: To implement
    },
    login: (req, res) => {
        // TODO: To implement
    }
}
```

Nous reviendrons plus tard sur ces 2 fonctions.

Retournons dans notre fichiers apiRouter.js afin de définir les paths ainsi que les contrôleurs à utiliser en fonction du path :

```js
// Imports
var express = require('express');
var usersCtrl = require('./Routes/usersController');

// Router
exports.router = (() => {
    var apiRouter = express.Router();

    // Users routes
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);

    return apiRouter;
})();
```

Maintenant, nous devons dire à notre serveur d'utiliser notre apiRouter, pour ça, rendez-vous dans le fichier server.js, importez le fichier apiRouter et utilisez le dans votre serveur (app) :

```js
// Imports
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;

// .....

// Use apiRouter
app.use('/api/', apiRouter);
```

## La fonction register

Maintenant que nous avons mis en place notre router API, il faut mettre en place les fonctions register et login afin de définir à notre application quoi faire quand un client va sur l'url en question.

### Récupération des paramètres

Allez dans le fichier __usersController.js__ et dans la fonction register nous allons commencer par récupérer les paramètres de la requête qui seront envoyées :

```js
register: (req, res) => {
        // Params
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio = req.body.bio;
    },
```

Ici on va stocker dans des variables les paramètres qui seront envoyés par la requête.

### Vérifier les paramètres

Ensuite, nous allons devoir vérifier ces paramètres (s'ils sont vide ou non), si c'est le cas, nous ne pouvons pas créer d'utilisateur, donc le serveur renverra un code de réponse 400 avec un message d'erreur  :

```js
// verify params
if (email == null || username == null || password == null) {
  return res.status(400).json({ error: 'Missing parameters' });
}
```

### Créer l'utilisateur en base de données

Maintenant que nous savons que les paramètres ne sont pas vident et que nous pouvons créer un user, nous allons devoir importer notre message User afin de pouvoir dire à notre ORM de créer une entrée dans la table avec les informations de la requête.

```js
// Imports
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var models = require('../models');
```

Ensuite, avant d'enregistrer un nouvel utilisateur, nous allons avant vérifier s'il n'existe pas déjà dans la base.

```js
// Vérify if user extist
models.User.findOne({
  attributes: ['email'],
  where: {email: email}
})
  .then((userFound) => {

})
  .catch((err) => {

});
```

Ici nous utilisons la méthode de notre model User findOne en recherchant si l'email que nous voulons créer n'existe pas déjà dans la BDD.

Ensuite nous allons faire un __then__ et __catch__ pour définir ce qui doit être fait s'il n'y a pas d'erreur (then et catch) :

```js
// Vérify if user extist
models.User.findOne({
  attributes: ['email'],
  where: {email: email}
})
  .then((userFound) => {

})
  .catch((err) => {
  return res.status(500).json({'error': 'Unable to verify user'});
});
```

Et maintenant, nous allons faire le then (si pas d'erreur). Il faut donc vérifier que notre findOne à renvoyé quelque chose ou non :

```js
 // Vérify if user extist
models.User.findOne({
  attributes: ['email'],
  where: {email: email}
})
  .then((userFound) => {
  if(!userFound) {

  } else {
    return res.status(409).json({'error': 'User already exists'});
  }
})
  .catch((err) => {
  return res.status(500).json({'error': 'Unable to verify user'});
});
```

Si l'email n'existe pas en base, nous allons vouloir créer l'utilisateur.

D'abord, nous allons devoir hasher son password avec bcrypt :

```js
// hash password
bcrypt.hash(password, 5, (err, hashPassword) => {

});
```

Une fois que nous avons hasher le mot de passe, nous pouvons créer notre utilisateur :

```js
// hash password
bcrypt.hash(password, 5, (err, hashPassword) => {
  var newUser = models.User.create({
    email: email,
    username: username,
    password: hashPassword,
    bio: bio,
    isAdmin: 0
  })
  .then((newUser) => {
    return res.status(201).json({'userId': newUser.id});
  })
  .catch((err) => {
    return res.status(500).json({'error': 'Cannot add user'});
  });
});
```

### Tester sa route avec Postman

À ce stade, nous avons terminé la configuration de notre route user, mais il faut maintenant tester cette route en faisant une requête API sur la route register pour vérifier que tout fonctionne.

Pour ça allez sur Postman, créez une requête __POST__ avec l'url __localhost:8080/api/users/register__ et pour le body sélectionnez __x-www-form-urlencoded__ avec les informations que vous voulez envoyer dans la requête :

![image-20220530115344597](/Users/pierre/Library/Application Support/typora-user-images/image-20220530115344597.png)

Exécutez la requête, si vous avez un status code 201 avec le numéro de l'id de l'utilisateur que vous avez créé, c'est que tout fonctionne, vous pouvez aller sur PhpMyAdmin pour vérifier que votre utilisateur est bien dans la base.

## La fonction login

Maintenant que nous pouvons créer des utilisateurs, nous allons créer la route de connexion afin que nos utilisateurs puissent se connecter.

Pour ça, nous allons dans le fichier usersController.js et la fonction login afin de la définir.

### Vérifier les paramètres

Nous savons que pour se connecter il faudra l'email et le password, alors nous allons commencer par vérifier que ces deux paramètres sont envoyés dans la requête et qu'ils ne sont pas vide :

```js
login: (req, res) => {
  // Params
  var email = req.body.email;
  var password = req.body.password;

  // Verify params
  if (email == null || password == null) {
    return res.status(400).json({'error': 'Missing parameters'});
  }
}
```

Ensuite nous allons devoir trouver l'email qui est envoyé dans la requête dans la base de données, si on ne le trouve pas, c'est que l'utilisateur n'existe pas en base de données et que les informations de connexion sont fausses :

```js
// Find User
models.User.findOne({
  where: { email: email}
})
  .then((userFound) => {

})
  .catch((err) => {
  return res.status(500).json({'error': 'Unable to find user'});
});
```

Maintenant il faut faire la vérification de si l'utilisateur est trouvé en base ou non :

```js
// Find User
models.User.findOne({
  where: {
    email: email
  }
})
  .then((userFound) => {
  if (userFound) {

  } else {
    return res.status(404).json({'error': 'Invalid email or password'});
  }
})
  .catch((err) => {
  return res.status(500).json({
    'error': 'Unable to find user'
  });
});
```

Ensuite il faut vérifier que le mot de passe est correct, et si oui, on renvoi l'id de l'utilisateur connecté + le Token que nous allons créer plus tard :

```js
.then((userFound) => {
  if (userFound) {
    // Verify password 
    bcrypt.compare(password, userFound.password, (err, resBcrypt) => {
      if (resBcrypt) {
        return res.status(200).json({
          'userId': userFound.id,
          'token': 'THE TOKEN'
        });
      } else {
        return res.status(403).json({'error': 'Invalid email or password'});
      }
    });
  } else {
    return res.status(403).json({'error': 'Invalid email or password'});
  }
})
```

### Création du token de connexion

Maintenant nous allons créer un nouveau dossier __Utils__ dans lequel nous allons mettre les fichiers qui nous serviront d'outils (comme celui de génération de token de connexion).

Donc dans ce dossier, vous allez créer un fichier __jwt.utils.js__.

Dans ce fichier nous allons importer __jsonwebtoken__ qui va nous permettre de générer facilement des tokens, ensuite nous allons exporter une fonction __generateTokenForUser__ dans laquelle nous allons écrire nos règles de génération du token :

```js
// Imports
var jwt = require('jsonwebtoken');

// Exported functions
module.exports = {
    generateTokenFoUser: (userData) => {

    }
}
```

#### Importer notre fichier jwt.utils.js 

Avant d'aller plus loins, nous allons retourner sur le fichier __usersController.js__ afin de remplacer l'importation de jwt directement par notre fichier jwt.utils.js :

```js
// Imports
var bcrypt = require('bcrypt');
var jwtUtils = require('../Utils/jwt.utils');
var models = require('../models');
```

Autre chose à faire dans le fichier __usersController.js__ : remplacer "THE TOKEN" par la fonction __`generateTokenForUser`__ pour la génération automatique du token :

```js
// Verify password 
bcrypt.compare(password, userFound.password, (err, resBcrypt) => {
  if (resBcrypt) {
    return res.status(200).json({
      'userId': userFound.id,
      'token': jwtUtils.generateTokenFoUser(userFound)
    });
  } else {
    return res.status(403).json({
      'error': 'Invalid email or password'
    });
  }
});
```

Et enfin, retour sur le fichier jwt.utils.js pour créer la règle de génération de token :

```js
// Imports
var jwt = require('jsonwebtoken');

// Exported functions
module.exports = {
    generateTokenFoUser: (userData) => {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        })
    }
}
```

Dernière chose à faire dans ce fichier, signer notre token afin de le rendre authentique et éviter les failles de sécurité :

```js
// Imports
var jwt = require('jsonwebtoken');

// Constants
const JWT_SIGN_SECRET = 'sdkjhsdfkhu08970983kjbdkfhAIHIDU987089HàçukhdsfoIUOHDIYQGiuf';

// Exported functions
module.exports = {
    generateTokenFoUser: (userData) => {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        }, JWT_SIGN_SECRET, {
            expiresIn: '2h'
        })
    }
}
```

Vous noterez que notre token expire toute les 2h.

### Tester la route login

Maintenant que nous avons finis la configuration et la gestion de la route, il faut la tester.

Pour ça rendez sur Postman et créez un nouvelle requête avec les informations suivantes :

- Verbe HTTP -> __POST__
- Url -> __localhost:8080/api/users/login__
- Body -> __x-www-form-urlencoded__ avec :
  - email
  - Password

En envoyant la requête et si vous avez mis les bons identifiants, vous devriez avoir ce rendu en réponse :

![image-20220530122750315](/Users/pierre/Library/Application Support/typora-user-images/image-20220530122750315.png)

### Les vérifications poussées des paramètres

Afin d'éviter les failles de sécurités, nous allons faire des vérifications plus poussées sur les paramètres qui sont envoyés pour la méthode de register et login, nous allons intégrer un regex d'email et password ainsi que vérifier la longueur du pseudo que la requête envoie.

Pour ça, rendez-vous dans le fichier __usersController.js__ et dans la fonction register, en dessous de la récupération des paramètres et avant la recherche d'utilisateur existant.

#### Le pseudo

D'abord, vérifier que le pseudo fait minimum 5 caractère et 12 caractères maximum :

```js
// Verify length username
if(username.length >= 13 || username.length <= 4) {
  return res.status(400).json({'error': 'Username must be at least 13 characters maximum and 4 characters minimum'});
}
```

#### L'email

Maintenant, nous allons vouloir vérifier que l'email envoyé par la requête est bien un email, pour ça, nous allons utiliser un regex, vous pouvez en retrouver un sur le site [emailregex.com](http://emailregex.com/) dans l'onglet javascript en scrollant la page.

Pour l'intégrer dans votre projet, vous pouvez copier le regex sur le site et le coller dans une constante en haut du fichier __usersController.js__ :

```js
// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
```

Ensuite en dessous de la vérification du pseudo, nous allons ajouter la vérification de l'email en testant l'email de la requête avec notre regex :

```js
// Verify email
if (!EMAIL_REGEX.test(email)) {
  return res.status(400).json({'error': 'Invalid email address'});
}
```

#### Le password

Maintenant, nous allons également intégrer un regex sur le password afin de créer des règles de mot de passe.

Pour récupérer le regex, vous pouvez aller sur le site [regexlib.com](https://regexlib.com/REDetails.aspx?regexp_id=15).

L'intégrez à votre projet, copiez le regex sur le site et créez une deuxième constante dans le fichier __usersController.js__ et collez le entre deux __/__: 

```js
const PASSWORD_REGEX = /^[a-zA-Z]\w{3,14}$/;
```

Ensuite créez la même condition que pour l'email, mais cette fois avec le password et la nouvelle constante :

```js
// Verify pasword
if(!PASSWORD_REGEX.test(password)) {
  return res.status(400).json({'error': 'The password\'s first character must be a letter, it must contain at least 4 characters and no more than 15 characters and no characters other than letters, numbers and the underscore may be used'})
}
```

### Test avec Postman

Maintenant vous devez faire vos test sur Postman afin de vérifier que vos vérification supplémentaires sont bien prises en compte.

## Simplification du code avec le Waterfall

Le problème que nous allons vite avoir dans le code de notre application, ce sont les promesses (then et catch).

Sur certaines routes, nous allons potentiellement avec BEAUCOUP de promesse à faire, donc le code va très rapidement être compliqué à lire et à maintenir.

Afin de simplifier au maximum, nous allons utiliser une lib __async__ et la fonction de __waterfall__ 

Cette fonction va nous permettre __d'exécuter des fonctions en cascade__ :

D'abord nous allons devoir définir dans un tableau toutes les fonctions dont on a besoin, elles seront exécutées les unes à la suite des autres, et enfin nous allons avoir un fonction qui sera exécutée si toutes les autres ne sont pas en erreur.

Cette méthode nous permet d'avoir un code plus simple et plus propre que des promesses enchainées les unes aux autres.

Pour plus d'information sur le waterfall, vous pouvez consulter la [documentation](https://caolan.github.io/async/v3/docs.html#waterfall).

Dans un premier temps, vous allez devoir importer la lib __async__ : 

```js
// Imports
var bcrypt = require('bcrypt');
var jwtUtils = require('../Utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');
```

 Maintenant, il va falloir créer notre waterfall pour la création d'un utilisateur, il faut donc remplacer toute la partie __find user__ dans notre fonction register et la remplacer par ce code :

```js
// Waterfall find user and create
asyncLib.waterfall([
  (done) => {
    models.User.findOne({
      attributes: ['email'],
      where: { email: email}
    })
      .then((userFound) => {
      done(null, userFound);
    })
      .catch((err) => {
      return res.status(500).json({ 'error': 'Unable to verify user'})
    })
  },
  (userFound, done) => {
    if (!userFound) {
      bcrypt.hash(password, 5, (err, hashPassword) => {
        done(null, userFound, hashPassword);
      });
    } else {
      return res.status(409).json({'error': 'User allready exist'});
    }
  },
  (userFound, hashPassword, done) => {
    var newUser = models.User.create({
      email: email,
      username: username,
      password: hashPassword,
      bio: bio,
      isAdmin: 0
    })
    .then((newUser) => {
      done(newUser);
    })
    .catch((err) => {
      return res.status(500).json({'error': 'Cannot add user'});
    });
  }
], (newUser) => {
  if(newUser) {
    return res.status(200).json({'userId': newUser.id})
  } else {
    return res.status(500).json({'error': 'Cannot add user'});
  }
});
```

Ce code reproduit exactement la même chose que celui que nous avions mis en place, mais il est moins complexe car nous n'avons pas de promesse imbriquées.

Faites pareil pour la fonction de login :

```js
// Waterfall find User
asyncLib.waterfall([
  (done) => {
    models.User.findOne({
      where: { email: email}
    })
      .then((userFound) => {
      done(nulll, userFound);
    })
      .catch((err) => {
      return res.status(500).json({'error': 'Unable to verify User'});
    });
  },
  (userFound, done) => {
    if(userFound) {
      bcrypt.compare(password, userFound.password, (err, resBcrypt) => {
        done(null, userFound, resBcrypt);
      });
    } else {
      return res.status(404).json({'error': 'Invalid email or password'});
    }
  },
  (userFound, resBcrypt, done) => {
    if(resBcrypt) {
      done(userFound);
    } else {
      return res.status(403).json({'error': 'Invalid email or password'});
    }
  }
], (userFound) => {
  if (userFound) {
    return res.status(200).json({
      'userId': userFound.id,
      'token': jwtUtils.generateTokenForUser(userFound)
    });
  } else {
    return res.status(500).json({
      'error': 'cannot log on user'
    });
  }
});
```

## Création d'une route profil

Maintenant que nous avons nos routes register et login, nous allons vouloir pouvoir afficher les informations d'un utilisateur connecté et surtout de pouvoir modifier les informations de l'utilisateur.

### Récupérer les informations du profil

Commençons par le plus simple, la récupération des informations d'un utilisateur connecté.

Dans le fichier usersController.js, ajoutez une fonction __`getUserProfile`__ :

```js
getUserProfile: (req, res) => { 
}
```

Dans cette fonction, nous allons commencer par vérifier l'authentification de l'utilisateur qui va se faire via le token que notre application génère au moment de la connexion. Ce token sera envoyé en header de la requête :

```js
getUserProfile: (req, res) => {
  // Getting auth header
  var headerAuth = req.headers['authorization'];
}
```

Maintenant, dans le fichier __jwt.utils.js__ nous allons devoir créer une fonction qui va vérifier si le token est valide et si l'utilisateur est authentifié ou non :

```js
parseAuthorization: (authorization) => {
}
```

#### Comprendre comment envoyer le token dans une requête

D'abord, allez sur Postman et créez une nouvelle requête avec les informations suivante : 

- Verbe HTTP -> __GET__
- Url -> __localhost:8080/api/users/profil__
- Headers ->
  - Authorization -> __Bearer [VOTRETOKEN]__

Comme vous pouvez le voir, le token sera envoyé dans le header 'authorization' avec Bearer juste avant le token.

Nous allons donc devoir enlever Bearer pour garder simplement le token :

```js
parseAuthorization: (authorization) => {
  return (authorization != null) ? authorization.replace('Bearer ', '') : null;
}
```

Maintenant que nous avons parsé notre token, nous allons pouvoir le vérifier pour récupérer l'id de l'utilisateur, donc vous pouvez créer une nouvelle fonction __`getUserId`__ en dessous que celle de parse token :

```js
getUserId: (authorization) => {
  var userId = -1;
  var token = module.exports.parseAuthorization(authorization);
}
```

Maintenant nous allons devoir vérifier la signature du token ainsi que de récupérer l'id de l'utilisateur qui est stocké dans le token :

```js
getUserId: (authorization) => {
  var userId = -1;
  var token = module.exports.parseAuthorization(authorization);

  if (token != null) {
    try {
      var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);

      if (jwtToken != null) {
        userId = jwtToken.userId;
      }
    } catch (err) {}
  }

  return userId;
}
```

#### Utiliser la fonction getUserId

Maintenant que nous avons créé nos outils avec la fonction de parse token et de vérification token, nous allons pouvoir utiliser getUserId dans le fichier __usersController.js__ :

```js
getUserProfile: (req, res) => {
  // Getting auth header
  var headerAuth = req.headers['authorization'];
  var userId = jwtUtils.getUserId(headerAuth);
}
```

#### Vérifier le userId

Avant d'afficher les informations de l'utilisateur, nous allons devoir vérifier que le userId n'est pas négatif (la fonction getUserId renvoie -1 si le token n'est pas valide) : 

```js
// Getting auth header
var headerAuth = req.headers['authorization'];
var userId = jwtUtils.getUserId(headerAuth);

if (userId < 0) {
  return res.status(400).json({'error': 'Invalid token'});
}
```

### Récupérer les informations utilisateur

Maintenant que nous avons vérifié l'utilisateur nous allons vouloir renvoyer ses informations :

```js
 // Find User informations
models.User.findOne({
  attributes: ['id', 'email', 'username', 'bio'],
  where: { id: userId },
})
  .then((user) => {
  if(user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({'error': 'User not found'});
  }
})
  .catch((err) => {
  return res.status(500).json({'error': 'Unable to find user'});
});
```

### Ajout de la route

À ce stade nous pouvons faire le test de se connecter avec un user et de récupérer ses informations, mais il faut d'abord ajouter notre fonction à notre router et lui passer le chemin (path), pour ça rendez vous dans le fichier __apiRouter.js__ pour ajouter :

```js
// Users routes
apiRouter.route('/users/register/').post(usersCtrl.register);
apiRouter.route('/users/login/').post(usersCtrl.login);
apiRouter.route('/users/profil/').get(usersCtrl.getUserProfile);
```

### Test de la route

Dernière étape test de la route sur Postman !

Voici les informations à intégrer :

- Verbe HTTP -> __GET__
- Url -> __localhost:8080/api/users/profil__
- Headers ->
  - Authorization -> __Bearer [VOTRETOKEN]__ _(remplacez par le token donné lors de la connexion)_

Si tout se passe correctement, votre requête devrait vous renvoyer les informations de l'utilisateur.

## Update profil utilisateur

Maintenant que nous savons comment afficher des informations avec un utilisateur vérifié, nous allons vouloir mettre en place une route qui peut modifier un utilisateur.

Pour ça, vous devez créer une nouvelle fonction dans le fichier __userController.js__ :

```js
updateUserProfile: (req, res) => {
}
```

Commençons par vérifier l'authentification de l'utilisateur ainsi que de récupérer le paramètre bio de la requête (pour le moment, c'est le seul paramètre où l'on autorise la modification) :

```js
updateUserProfile: (req, res) => {
  // Getting auth header
  var headerAuth = req.headers['authorization'];
  var userId = jwtUtils.getUserId(headerAuth);

  // Params
  var bio = req.body.bio;

}
```

Une fois que c'est fait, mettons en place un waterfall pour faire le traitement de la modification :

```js
// Update user Waterfall
asyncLib.waterfall([
  (done) => {
    models.User.findOne({
      attributes: ['id', 'bio'],
      where: {id: userId}
    })
      .then((userFound) => {
      done(null, userFound);
    })
      .catch(err => {
      return res.status(500).json({'error': 'Unable to verify User'});
    });
  },
  (userFound, done) => {
    if (userFound) {
      userFound.update({
        bio: (bio ? bio : userFound.bio)
      })
        .then(() => {
        done(userFound);
      })
        .catch((err) => {
        return res.status(500).json({'error': 'Cannot update user'});
      });
    } else {
      return res.status(404).json({'error': 'User not found'});
    }
  }
], (userFound) => {
  if(userFound) {
    return res.status(200).json(userFound);
  } else {
    return res.status(500).json({'error': 'Cannot update user profile'});
  }
});
```

### Ajout de la route

Maintenant il ne nous reste plus qu'à créer une nouvelle route qui va exécuter cette nouvelle fonction.

Pour ça rendez-vous dans le fichier apiRouter.js et ajoutez : 

```js
apiRouter.route('/users/profil/').put(usersCtrl.updateUserProfile);
```

### Test de la route

Maintenant direction Postman pour tester votre nouvelle route. 

Voici les informations :

- Verbe HTTP -> __PUT__
- Url -> __localhost:8080/api/users/profil__
- Header :
  - authorization -> __votre token de connexion__
- body -> bio : __Votre nouvelle Bio__

Si tout se passe bien vous devriez avoir un status code 201 et vous devriez voir votre nouvelle bio.

## Route Message

Maintenant que nous avons mis en place la gestion des utilisateur et la connexion à notre application de manière sécurisée, nous allons implémenter la fonctionnalité de message.

Dans un premier temps, pouvoir poster un message par un utilisateur identifié.

### Création du controlleur

Avant tout, nous devons créer un nouveau fichier contrôleur __messagesController.js__ qui va nous permettre  de gérer toutes les interactions avec les messages.

Nous allons donc faire les importations nécessaires à notre contrôleur ainsi que définir 2 nouvelles routes, une pour créer un message et l'autre pour lister les messages :

```js
// Imports
var models = require('../models');
var asyncLib = require('async');

// Constants

// Routes
module.exports = {
    createMessage: (req, res) => {

    },
    listMessages: (req, res) => {

    }
}
```

Maintenant la fonction de création de message, dans un premier temps, nous devons vérifier l'utilisateur qui veut poster le message, donc comme pour les routes d'affichage information profil ou d'edit, nous allons utiliser les méthodes que nous avons créé dans utils :

```js
// Imports
var models = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../Utils/jwt.utils');

// Constants

// Routes
module.exports = {
    createMessage: (req, res) => {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
    },
    listMessages: (req, res) => {

    }
}
```

### Vérification des paramètres

Maintenant nous allons devoir gérer les paramètres dans la requête :

```js
// Params
var title = req.body.title;
var content = req.body.content;

if (title == null || content == null) {
  return res.status(400).json({'error': 'Missing parameters'});
}
```

On vérifie que les paramètres ne sont pas null, le cas échéant on renvois une erreur.

### Valider les données

Maintenant nous allons valider les données, nous ne voulons pas d'un titre de message trop court

```js
// Constants
const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 4;

// Validate message
if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
  return res.status(400).json({'error': 'Invalid parameters'});
}
```

Nous avons placé les limites de caractères dans des constantes pour faciliter la modification.

Maintenant nous allons mettre en place le waterfall pour valider la création du message :

```js
 // Creation message waterfall
asyncLib.waterfall([
  (done) => {
    models.User.findOne({
      where:{ id: userId }
    })
      .then((userFound) => {
      done(null, userFound);
    })
      .catch((err) => {
      return res.status(500).json({'error': 'Unable to verify user'});
    })
  },
  (userFound, done) => {
    if (userFound) {
      models.Message.create({
        title: title,
        content: content,
        likes: 0,
      })
        .then((newMessage) => {
        done(null, userFound, newMessage);
      })
        .catch((err) => {
        return res.status(404).json({'error': 'User not found'});
      });
    } else {
      return res.status(404).json({'error': 'User not found'});
    }
  }
], (newMessage) => {

});
```

Pour le moment nous allons nous arrêter là car nous avons une modification sur la base de données à faire pour ajouter un user à un message.

### Modification du model Message

La première modification que nous allons faire se fait sur le fichier __message.js__, il faut supprimer la ligne :

```js
idUSERS: DataTypes.INTEGER,
```

Ensuite, il va falloir modifier le fichier de migration __create-message.js__ pour renommer le champ idUSERS par :

```js
userId: {
  allowNull: false,
    type: Sequelize.INTEGER,
      references: {
        model: 'Users',
          key: 'id',
      }
}
```

### Migrer les modifications

Maintenant il va falloir vider notre base de donnée pour migrer la nouvelle (avec la prise en compte de nos modifications).

Pour ça vous devez rentrer la commande suivante dans le terminal de votre image docker :

```bash
sequelize db:drop
```

Et ensuite recréer la base :

```bash
sequelize db:create
```

Et enfin, jouer les migrations :

```bash
sequelize db:migrate
```

### Ajouter la relation

Maintenant que nous avons facilité la mise en place de la relation, nous pouvons retourner dans le __messageController.js__ afin d'ajouter le user identifier au nouveau message (faites attention à la syntaxe) :

```js
if (userFound) {
  models.Message.create({
    title: title,
    content: content,
    likes: 0,
    UserId: userFound.id,
  })
    .then((newMessage) => {
    done(null, userFound, newMessage);
  })
    .catch((err) => {
    return res.status(404).json({
      'error': 'User not found'
    });
  });
```

Il nous reste maintenant à enlever null et userFound à notre callback pour finaliser le waterfall :

```js
(userFound, done) => {
  if (userFound) {
    models.Message.create({
      title: title,
      content: content,
      likes: 0,
      UserId: userFound.id,
    })
      .then((newMessage) => {
      done(newMessage);
    })
      .catch((err) => {
      return res.status(404).json({
        'error': 'User not found'
      });
    });
  } else {
    return res.status(404).json({
      'error': 'User not found'
    });
  }
}
```

Et finir le waterfall par :

```js
(newMessage) => {
  if (newMessage) {
    return res.status(201).json(newMessage);
  } else {
    return res.status(500).json({'error': 'Cannot post Message'});
  }
});
```

Ce qui vous donne le waterfall suivant :

```js
// Creation message waterfall
asyncLib.waterfall([
  (done) => {
    models.User.findOne({
      where: {
        id: userId
      }
    })
      .then((userFound) => {
      done(null, userFound);
    })
      .catch((err) => {
      return res.status(500).json({
        'error': 'Unable to verify user'
      });
    })
  },
  (userFound, done) => {
    if (userFound) {
      models.Message.create({
        title: title,
        content: content,
        likes: 0,
        UserId: userFound.id,
      })
        .then((newMessage) => {
        done(newMessage);
      })
        .catch((err) => {
        return res.status(404).json({
          'error': 'User not found'
        });
      });
    } else {
      return res.status(404).json({
        'error': 'User not found'
      });
    }
  },
], (newMessage) => {
  if (newMessage) {
    return res.status(201).json(newMessage);
  } else {
    return res.status(500).json({'error': 'Cannot post Message'});
  }
});
```

### Attribuer les routes

Maintenant il nous reste à attribuer les nouvelles fonctions à de nouvelles routes.

Pour ça rendez-vous dans le fichier __apiRouter.js__ pour ajouter :

```js
// Imports
var express = require('express');
var usersCtrl = require('./Routes/usersController');
var messageCtrl = require('./Routes/messagesControlller');

// Messages routes
apiRouter.route('/message/create').post(messageCtrl.createMessage);
apiRouter.route('/message/').get(messageCtrl.listMessages);
```

### Liste des messages

Maintenant nous allons faire la fonction de liste de message, donc dans le fichier __messagesController.js__ :

```js
listMessages: (req, res) => {
  var fields = req.query.fields;
  var limit = parseInt(req.query.limit);
  var offset = parseInt(req.query.offset);
  var order = req.query.order;
}
```

Ces champs vont nous servir pour lister et filtrer les données.

```js
// Get All message
models.Message.findAll({
  order: [(order != null) ? order.split(':') : ['title', 'ASC']],
  attributes: (fields !== '*' && fields != null) ? fields.split(', ') : null,
  limit: (!isNaN(limit)) ? limit : null,
  offset: (!isNaN(offset)) ? offset : null
})
  .then((messages) => {
  if (messages) {
    return res.status(200).json(messages);
  } else {
    return res.status(404).json({'error': 'No messages found'});
  }
})
  .catch((err) => {
  return res.status(500).json({'error': 'Invalid fields'});
});
```

Il ne nous reste plus qu'à inclure la relation avec la table users dans la requête :

```js
models.Message.findAll({
  order: [(order != null) ? order.split(':') : ['title', 'ASC']],
  attributes: (fields !== '*' && fields != null) ? fields.split(', ') : null,
  limit: (!isNaN(limit)) ? limit : null,
  offset: (!isNaN(offset)) ? offset : null,
  include: [{
    model: models.User,
    attributes: ['username']
  }]
})
```

### Tester vos routes

Maintenant que nous avons finis la configuration, nous allons tester tout ça avec Postman.

N'oubliez pas de recréer un compte et de vous connecter pour pouvoir poster un nouveau message.

Essayez de créer au moins 10 message pour pouvoir utiliser les différentes solutions de filtres sur la route du liste message.

## La gestion des likes

Maintenant que notre API commence à avoir des fonctionnalités intéressantes, nous voulons maintenant développer la fonctionnalité de Like ou de disLike d'un message.

### Modifier la base de données

En effet nous allons devoir modifier notre base de données pour création une table de liaison pour gérer la relation manyToMany entre les utilisateurs et les message étant donnée q'un utilisateur peut liker plusieurs messages et qu'un message peut être liké par plusieurs utilisateurs.

### Création de la table de liaison

Pour la création de cette table, nous allons utiliser le cli sequelize, donc rendez-vous dans le terminal de votre image docker et rentrez la commande suivante :

```bash
sequelize model:create --attributes "messageId:integer userId:integer" --name Like 
```

Cette commande vous à créé le fichier like.js avec le model et le fichier de migration croate-like.js.

Dans un premier temps ouvrez le fichier __like.js__ et nous allons mettre en place les références pour nos clés étrangères :

```js
Like.init({
  messageId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Message',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id'
    }
  }
}
```

Ensuite toujours dans le fichier __like.js__ nous allons mettre en place les associations, il y en a 4 pour cette tables :

```js
// define association here
models.User.belongsToMany(models.Message, {
  through: models.Like,
  foreignKey: 'userId',
  otherKey: 'messageId',
});

models.Message.belongsToMany(models.User, {
  through: models.Like,
  foreignKey: 'messageId',
  otherKey: 'userId',
});

models.Like.belongsTo(models.User, {
  foreignKey: 'userId',
  as: 'user',
});

models.Like.belongsTo(models.Message, {
  foreignKey: 'messageId',
  as: 'message',
});
```

Maintenant nous allons devoir modifier le fichier __create-like.js__ où nous allons devoir préciser le allowNull ainsi que le références :

```js
messageId: {
  allowNull: false,
    type: Sequelize.INTEGER,
      references: {
        model: 'Messages',
          key: 'id'
      }
},
  userId: {
    allowNull: false,
      type: Sequelize.INTEGER,
        references: {
          model: 'Users',
            key: 'id',
        }
  }
```

### Migrer les modifications en base

Maintenant il ne reste plus qu'à exécuter les migrations en ouvrant le terminal de l'image docker et en rentrant la commande suivante :

```js
sequelize db:migrate
```

Si vous allez voir sur PhpMyAdmin, vous devriez voir votre nouvelle table like de créé.

### Création du controller

Maintenant il va falloir créer un nouveau contrôleur pour gérer les likes, donc création d'un nouveau fichier __likesController.js__ :

```js
// Imports
var models = require('../models');

// Constants

// Routes
module.exports = {
    likePost: (req, res) => {
    },
    dislikePost: (req, res) => {
    }
}
```

Pour le moment nous allons créer 2 fonctions, une pour liker un message et l'autre pour disliker.

### Vérification du user

Pour liker ou disliker un message, nous devons authentifier l'utilisateur, donc nous allons devoir importer jwt.utils.js afin de pouvoir authentifier facilement notre user, nous allons également importer async pour pouvoir utiliser le waterfall par la suite :

```js
// Imports
var models = require('../models');
var jwtUtils = require('../Utils/jwt.utils');
var asyncLib = require('async');

// Constants

// Routes
module.exports = {
    likePost: (req, res) => {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
    },
    dislikePost: (req, res) => {

    }
}
```

### Vérification des paramètres

Maintenant, il va falloir récupérer les paramètres à savoir l'id du message à liker qui sera envoyé dans l'url :

```js
// Params
var messageId = parseInt(req.params.messageId);
```

### Validation des paramètres

Afin de valider si l'id d'un message est bon (qu'il est positif), nous devons ajouter une vérification :

```js
// Verify message Id number
if (messageId <= 0) {
  return res.status(400).json({'error': 'Invalid parameters'});
}
```

### Like du message avec waterfall 

Nous allons maintenant commencer le waterfall de la fonction :

```js
// Like message waterfall
asyncLib.waterfall([
  (done) => {

  }
], (likedPost) => {

});
```

Voici le waterfall complet avec toutes les étapes :

```js
// Like message waterfall
asyncLib.waterfall([
  (done) => {
    models.Message.findOne({
      where: { id: messageId }
    })
      .then((messageFound) => {
      done(null, messageFound);
    })
      .catch((err) => {
      return res.status(500).json({'error': 'Unable to find message'});
    })
  },
  (messageFound, done) => {
    if (messageFound) {
      models.User.findOne({
        where: { id: userId }
      })
        .then((userFound) => {
        done(null, messageFound, userFound);
      })
        .catch((err) => {
        return res.status(500).json({'error': 'Unablel to verify user'});
      });
    } else {
      return res.status(404).json({'error': 'Post already liked'});
    }
  },
  (messageFound, userFound, done) => {
    if (userFound) {
      models.Like.findOne({
        where: {
          userId: userId,
          messageId: messageId
        }
      })
        .then((isUserAllreadyLiked) => {
        done(null, messageFound, userFound, isUserAllreadyLiked);
      })
        .catch((err) => {
        return res.status(500).json({'error': 'Unable to verify if user already liked post'});
      });
    } else {
      res.status(404).json({'error': 'User not found'});
    }
  },
  (messageFound, userFound, isUserAllreadyLiked, done) => {
    if (!isUserAllreadyLiked) {
      messageFound.addUser(userFound)
        .then((alreadyLikeFound) => {
        done(null, messageFound, userFound);
      })
        .catch((err) => {
        return res.status(500).json({'error': 'Unable to set reaction'});
      });
    } else {
      res.status(409).json({'error': 'User already liked the post'});
    }
  },
  (messageFound, userFound, done) => {
    messageFound.update({
      likes: messageFound.likes + 1,
    })
      .then(() => {
      done(messageFound);
    })
      .catch((err) => {
      return res.status(500).json({'error': 'Cannot update like counter'});
    })
  }
], (messageFound) => {
  if (messageFound) {
    return res.status(201).json(messageFound);
  } else {
    return res.status(500).json({'error': 'Cannot update message'});
  }
});
```

Pour la fonction dislike il faut faire exactement la même chose que pour le like, mais modifier l'étape d'ajout d'un like en mettant -1 et en modifiant la condition de l'étape précédente en mettant un destroy plutôt qu'un create :

```js
dislikePost: (req, res) => {
  // Getting auth header
  var headerAuth = req.headers['authorization'];
  var userId = jwtUtils.getUserId(headerAuth);

  // Params
  var messageId = parseInt(req.params.messageId);

  // Verify message Id number
  if (messageId <= 0) {
    return res.status(400).json({
      'error': 'Invalid parameters'
    });
  }

  // Dislike message waterfall
  asyncLib.waterfall([
    (done) => {
      models.Message.findOne({
        where: {
          id: messageId
        }
      })
        .then((messageFound) => {
        done(null, messageFound);
      })
        .catch((err) => {
        return res.status(500).json({
          'error': 'Unable to find message'
        });
      })
    },
    (messageFound, done) => {
      if (messageFound) {
        models.User.findOne({
          where: {
            id: userId
          }
        })
          .then((userFound) => {
          done(null, messageFound, userFound);
        })
          .catch((err) => {
          return res.status(500).json({
            'error': 'Unablel to verify user'
          });
        });
      } else {
        return res.status(404).json({
          'error': 'Post already disliked'
        });
      }
    },
    (messageFound, userFound, done) => {
      if (userFound) {
        models.Like.findOne({
          where: {
            userId: userId,
            messageId: messageId
          }
        })
          .then((isUserAllreadyLiked) => {
          done(null, messageFound, userFound, isUserAllreadyLiked);
        })
          .catch((err) => {
          return res.status(500).json({
            'error': 'Unable to verify if user already disliked post'
          });
        });
      } else {
        res.status(404).json({
          'error': 'User not found'
        });
      }
    },
    (messageFound, userFound, isUserAllreadyLiked, done) => {
      if (isUserAllreadyLiked) {
        isUserAllreadyLiked.destroy()
          .then(() => {
          done(null, messageFound, userFound);
        })
          .catch((err) => {
          return res.statu(500).json({
            'error': 'Cannot remove liked'
          });
        });
      } else {
        res.status(409).json({
          'error': 'User already liked the post'
        });
      }
    },
    (messageFound, userFound, done) => {
      messageFound.update({
        likes: messageFound.likes - 1,
      })
        .then(() => {
        done(messageFound);
      })
        .catch((err) => {
        return res.status(500).json({
          'error': 'Cannot update like counter'
        });
      })
    }
  ], (messageFound) => {
    if (messageFound) {
      return res.status(201).json(messageFound);
    } else {
      return res.status(500).json({
        'error': 'Cannot update message'
      });
    }
  });
}
```

### Attribuer les routes

Maintenant, il faut ajouter ces 2 nouvelles fonctions à 2 nouvelles routes dans notre fichier __apiRouter.js__ :

```js
// Imports
var express = require('express');
var usersCtrl = require('./Routes/usersController');
var messageCtrl = require('./Routes/messagesControlller');
var likeCtrl = require('./Routes/likesController');

// .........

// Like routes
apiRouter.route('/messages/:messageId/vote/like').post(likeCtrl.likePost);
apiRouter.route('/messages/:messageId/vote/dislike').post(likeCtrl.dislikePost);
```

### Test des routes 

Maintenant vous devez tester vos routes sur Postman avec 2 nouvelles requête avec les informations suivantes

- Verbe HTTP -> __POST__
- Url -> __localhost:8080/api/messages/1/vote/dislike__ (Le 1 dans l'url est l'id du message à liker ou disliker)
- Authorization -> __TOKEN DE CONEXION__ 

Si vous arrivez à liker et disliker un like c'est que vous n'avez pas d'erreur dans votre code.



<span style="color:green; font-size:25px; font-weight: bold;">Félicitation, vous avez développé une API REST avec Node Js !</span>