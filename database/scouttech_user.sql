DROP DATABASE IF NOT EXISTS `scouttech`;
CREATE DATABASE `scouttech`;

CREATE TABLE `user`(
    `ìd` VARCHAR(40) PRIMARY KEY,
    `name` VARCHAR(30) NOT NULL,
);

INSERT INTO `user` VALUES("1", "hector"),VALUES("2", "pedro");