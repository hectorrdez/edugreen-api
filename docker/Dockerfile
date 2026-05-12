# Seleccionamos la imagen desde la que queremos
# partir, esta sera la ultima version de node
FROM node

# Se crea la carpeta para poder guardar
# los archivos que nos hagan falta
RUN mkdir -p /home/app

# Se establece el directorio de trabajo
# para que se pueda trasladar datos o
# tomar como referencia
WORKDIR /home/app

COPY ../package*.json ./

# Expone el puerto del contener para que
# sea accesible desde el exterior
EXPOSE 3002

# El CMD lanzara el comando al arrancar
# el contenedor. Este esta configurado
# para que instale las ultimas dependencias
# de librerias y lance la API automaticamente.
CMD npm i && npm run dev
