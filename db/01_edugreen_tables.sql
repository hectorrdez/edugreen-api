DROP DATABASE IF EXISTS `edugreen`;
CREATE DATABASE `edugreen`;
USE `edugreen`;

DROP TABLE IF EXISTS `stats`;
DROP TABLE IF EXISTS `enrollment`;
DROP TABLE IF EXISTS `user_class`;
DROP TABLE IF EXISTS `challenge`;
DROP TABLE IF EXISTS `class`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `institution`;

CREATE TABLE `institution`(
    `id` VARCHAR(40) PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `student_domain` VARCHAR(100) NOT NULL,
    `teacher_domain` VARCHAR(100) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `user`(
    `id` VARCHAR(40) PRIMARY KEY,
    `name` VARCHAR(30) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `old_password` VARCHAR(255),
    `role` ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
    `points` INT NOT NULL DEFAULT 0,
    `institution_id` VARCHAR(40),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `last_login_at` DATETIME,
    FOREIGN KEY (`institution_id`) REFERENCES `institution`(`id`) ON DELETE SET NULL
);

CREATE TABLE `class`(
    `id` VARCHAR(40) PRIMARY KEY,
    `name` VARCHAR(30) NOT NULL,
    `description` TEXT,
    `tutor_id` VARCHAR(40) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`tutor_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `challenge`(
    `id` VARCHAR(40) PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `points` INT NOT NULL DEFAULT 100,
    `class_id` VARCHAR(40) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`class_id`) REFERENCES `class`(`id`) ON DELETE CASCADE
);

CREATE TABLE `user_class`(
    `user_id` VARCHAR(40) NOT NULL,
    `class_id` VARCHAR(40) NOT NULL,
    `joined_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`, `class_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`class_id`) REFERENCES `class`(`id`) ON DELETE CASCADE
);

CREATE TABLE `enrollment`(
    `user_id` VARCHAR(40) NOT NULL,
    `challenge_id` VARCHAR(40) NOT NULL,
    `enrolled_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `completed_at` DATETIME,
    PRIMARY KEY (`user_id`, `challenge_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`challenge_id`) REFERENCES `challenge`(`id`) ON DELETE CASCADE
);

CREATE TABLE `stats`(
    `user_id` VARCHAR(40) NOT NULL,
    `challenge_id` VARCHAR(40) NOT NULL,
    `points` INT NOT NULL,
    `earned_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`, `challenge_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`challenge_id`) REFERENCES `challenge`(`id`) ON DELETE CASCADE
);
