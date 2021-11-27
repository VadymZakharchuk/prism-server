sudo docker login -u vadymzakharchuk        // login into DockerHub
docker tag <mysql> vadymzakharchuk/mysql    // <mysql> name of repository after command :: sudo docker images
docker push vadymzakharchuk/mysql
