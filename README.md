# Lancement du projet

```
docker-compose up

docker-compose run php-fpm composer install

docker-compose run php-fpm bin/console doctrine:migrations:migrate

```
Visiter localhost


Pour tricher commenter la ligne 29 de src/public/assets/js/cards.js ;-)
