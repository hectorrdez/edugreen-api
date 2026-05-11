USE `edugreen`;

INSERT INTO `institution` (`id`, `name`, `student_domain`, `teacher_domain`) VALUES
    ("1", "EduGreen Institute", "student.edugreen.com", "teacher.edugreen.com");

-- Passwords are all "test_{role}" hashed with bcrypt
INSERT INTO `user` (`id`, `name`, `lastName`, `email`, `password`, `role`, `institution_id`) VALUES
    ("1", "test", "admin",   "test.admin@edugreen.com",             "$2b$10$GkvFW0qPgaAoPKpqUFQYwOHWts6WH0D8C2oeSGWzzS9VlgG.nCghm", "admin",   NULL),
    ("2", "test", "teacher", "test.teacher@teacher.edugreen.com",   "$2b$10$KK.VkQzVZn.nqUP41hlhru6MjKo5xSxseIDQhJGiookTHmmmWnXDC", "teacher", "1"),
    ("3", "test", "student", "test.student@student.edugreen.com",   "$2b$10$M5wAs4IUVTOvvtq2tp6ki.ki74421pZLHTDeSqmqetlkXkkzv66qO", "student", "1");

INSERT INTO `class` (`id`, `name`, `description`, `tutor_id`) VALUES
    ("1", "test-class", "prueba de clase", "2");

INSERT INTO `challenge` (`id`, `name`, `description`, `points`, `class_id`) VALUES
    ("1", "test-challenge", "prueba de reto", 100, "1");

INSERT INTO `user_class` (`user_id`, `class_id`) VALUES
    ("2", "1"),
    ("3", "1");

INSERT INTO `enrollment` (`user_id`, `challenge_id`, `enrolled_at`, `completed_at`) VALUES
    ("3", "1", NOW(), NOW());

INSERT INTO `stats` (`user_id`, `challenge_id`, `points`) VALUES
    ("3", "1", 100);
