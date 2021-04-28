---
title: Intégration continu avec Gitlab et Laravel
date: 2021-02-24
author: Guillaume HANOTEL
location: Bordeaux
image: https://source.unsplash.com/random
---

Pour ce projet, j'ai choisi d'utiliser Gitlab pour mettre en place
ma pipeline d'intégration continue (ainsi que pour le déploiement continu).

La mise en place d'un flux CI/CD peut faire peur au premier abord pour un dev
mais c'est plus simple qu'il n'en a l'air et une fois mise en place cet outil change vraiment
la vie.

Voici donc comment j'ai utilisé Gitlab CI/CD avec mon application Laravel.

## Gitlab Pipeline & Docker

Les pipelines de GitLab contiennent un ou plusieurs tâches. Ces tâches s'exécutent de manière totalement isolée. 
Cela signifie qu'à chaque fois qu'une tâche est exécutée, un nouveau conteneur docker est créé en montant une image docker qui est créée via un DockerFile.

Pour rappel, revoyons le vocabulaire Docker :

- Pensez à un conteneur docker comme la boîte contenant votre code et tout ce dont il a besoin (système d'exploitation, dépendances de composer, etc.).
- Considérez une image Docker comme l'usine qui peut créer autant de boîtes (conteneurs Docker) que nécessaire.
- Considérez un DockerFile comme un modèle permettant de la description de la création d'une nouvelle image Docker.
- Un DockerFile construit une image Docker qui est montée dans des conteneurs Docker.

![Schema Docker](../.vuepress/public/gitlab-docker-explanation.png)

Le côté pratique est qu'il est possible d'utiliser des images Docker déjà construites par d'autres personnes
et qui conviennent parfaitement à nos besoins. On peut retrouver ces images notamment sur [Docker Hub](https://hub.docker.com/).

## Construction du fichier gitlab-ci.yml

Pour configurer une pipeline de CI/CD dans Gitlab, il suffit simplement de créer un fichier 
nommé `.gitlab-ci.yml` à la racine du projet. Nous allons voir comment il est construit.

### Choisir l'image Docker de départ

Typiquement, on part d'une image docker déjà existante, comme par exemple `php:latest` pour la dernière
version de php. Puis nous devrions ajouter manuellement tous les modules et dépendances requis par Laravel.
Gitlab possède pour option pour effectuer ceci avec l'instruction `before_script` permettant d'exécuter
une suite d'instruction avant chaque tâche. On peut l'utiliser pour installer composer, les modules PHP, etc. 
Notre fichier ressemblerait alors à ça :

```yaml
image: php:latest

before_script:
    - # Install php modules
    - # Install composer
    - # ...
```

Cependant il y a moyen de faire bien plus simple et bien plus court en choisissant une image docker qui possède déjà
tout ce qu'il faut.
J'ai donc trouvé une image docker qui possédait déjà tout ce dont j'avais besoin pour commencer : 

```yaml
image: lorisleiva/laravel-docker:latest
```

### Exécuter nos tests

La première tâche que j'aimerais mettre en place est simplement une tâche qui exécute tous nos tests. 
Cette tâche sera réussie si et seulement si tous les tests sont réussis. 
Cela devrait être aussi simple que ça :

```yaml
phpunit:
  stage: test
  script:
    - php artisan test
```

Cependant, dans mon cas, cela ne va pas suffire. En effet, mes tests comportent une connexion à la base de donnée.
Il faut donc au préalable installé le projet et initialiser la base de donnée pour pouvoir réaliser ces tests.

Pour cela, on va rajouter des instructions qui vont installer les dépendances PHP et initialiser la Base de Données.

```yaml
phpunit:
  stage: test
  extends: .before_test_script_template
  script:
    - composer install --prefer-dist --no-ansi --no-interaction --no-progress --no-scripts
    - cp .env.example.docker .env
    - php artisan key:generate
    - php artisan migrate:refresh
    - php artisan db:seed
    - php artisan test
```

L'instruction `extends` permet exécuter le bloc `before_test_script_template` avant le reste de la tâche.
Cela permet de réutiliser un bloc d'instruction au sein de plusieurs autre tâche.

Puis, nous déclarons que nous allons utiliser le service mysql, permettant au gitlab runner 
d'utiliser MySQL, ainsi que les variables d'environnement permettant d'initialiser la base de donnée.
Ces credentials ne seront utilisés que dans le gitlab runner, donc ce n'est pas nécessaire de les cacher,
ce ne sont pas les credentials définitifs.

```yaml
.before_test_script_template:
  services:
    - mysql:latest
  variables:
    MYSQL_ROOT_PASSWORD: secret
    MYSQL_DATABASE: dawndash_api
    MYSQL_USER: homestead
    MYSQL_PASSWORD: secret
```

### Vérifier le code style

Dans une autre tâche, nous allons vérifier si notre code PHP respecte les standards. Pour cela, il faut simplement
appeler `phpcs`.

```yaml
codestyle:
  stage: test
  dependencies:
    - composer
  script:
    - vendor/bin/phpcs --ignore=config/deploy.php
```

### Mettre en cache nos dépendances `vendor`

Vous avez peut-être remarqué que, jusqu'à présent, chaque fois que la tâche `phpunit` s'exécute,
composer installe toutes les dépendances à partir de zéro. 
Nous pouvons améliorer les performances de nos pipelines en mettant en cache 
et en partageant le dossier vendor entre tous les commits d'une branche.

```yaml
cache:
    # We key the cache using the branch's unique identifier.
    key: ${CI_COMMIT_REF_SLUG}
    paths:
        - vendor/
```

Cela permettra de mettre en cache et de partager le dossier `vendor` entre toutes nos tâches. 


## Conclusion

Il y a beaucoup plus à faire mais cela est suffisant pour démarrer avec les pipelines de GitLab pour une application Laravel. 
Dans un prochain article, nous verrons comment compléter ce fichier pour mettre en place du déploiement continu.