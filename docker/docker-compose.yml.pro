name: "edugreen-pro"
services:
  edugreen_pro_api:
    container_name: edugreen_pro_api
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - ${API_PORT}:${API_PORT}
    environment:
      API_PORT: ${API_PORT}
      API_KEY: ${API_KEY}
      DB_HOST: ${DB_HOST}
      DB_PORT: ${DB_PORT}
      DB_USER: ${DB_USER}
      DB_PASS: ${DB_PASS}
      DB_NAME: ${DB_NAME}
      API_SECRET: ${API_SECRET}
      API_REFRESH_SECRET: ${API_REFRESH_SECRET}
      REPORTING: ${REPORTING}
      REPORTING_FOLDER: ${REPORTING_FOLDER}
    networks:
      - edugreen
    depends_on:
      edugreen_pro_db:
        condition: service_healthy

  edugreen_pro_db:
    build:
      context: ..
      dockerfile: docker/Dockerfile.db
    restart: on-failure
    container_name: edugreen_pro_db
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASS}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASS}
    tmpfs:
      - /var/run/mysqld
    volumes:
      - edugreen_pro_db_data:/var/lib/mysql
    networks:
      - edugreen_pro
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    ports:
      - 3306:3306
networks:
  edugreen_pro:
    external: false

volumes:
 edugreen_pro_db_data:
