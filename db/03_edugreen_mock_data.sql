SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `edugreen`;

INSERT INTO `institution` (`id`, `name`, `student_domain`, `teacher_domain`) VALUES
    ("1", "EduGreen Institute",     "student.edugreen.com", "teacher.edugreen.com"),
    ("2", "Institutos de Alicante", "alu.edu.gva.es",       "edu.gva.es");

-- Passwords: test_{role} | hectorrdez | hecrodtov | nombre_apellido
INSERT INTO `user` (`id`, `name`, `lastName`, `email`, `password`, `role`, `points`, `institution_id`) VALUES
    ("1",  "test",    "admin",     "test.admin@edugreen.com",               "$2b$10$mdSrDKcIKEySY5meUJo1r.SN6SbINBCW3QCSX3L4IqWH6Ro5YjX8.", "admin",   0,   NULL),
    ("2",  "test",    "teacher",   "test.teacher@teacher.edugreen.com",     "$2b$10$6RfZUDUaAVInYR7wnYSgcetzndKd5wtGlA02VbVPx0nZyQLvuc7nm",  "teacher", 0,   "1"),
    ("3",  "test",    "student",   "test.student@student.edugreen.com",     "$2b$10$7Tmecpz9jziPPfQGyOHQFuEYDNJCw8Q0X.OPyZSZVyY8zgrM0Gw62",  "student", 100, "1"),
    ("4",  "hector",  "rdez",      "hectorrdez@gmail.com",                  "$2b$10$sOyG9XQ.rLrkFNEBw4kKMuN0ns0GRfom4.PZQg8oRBmvnHNplCqbq",  "admin",   0,   NULL),
    ("5",  "maria",   "garcia",    "maria.garcia@edu.gva.es",               "$2b$10$l6KHsxhlakeWG03jFW7/xu4NTb43KZYObALKT0rTi06zLgc7GcXTS",  "teacher", 0,   "2"),
    ("6",  "carlos",  "lopez",     "carlos.lopez@teacher.edugreen.com",     "$2b$10$ccYl7JHC0CFrTBPLgH70Benn4rLrmTVbvZfjP69Y3hKTErrXjjTY.",  "teacher", 0,   "1"),
    ("7",  "ana",     "martinez",  "ana.martinez@student.edugreen.com",     "$2b$10$I9Mb2UqVjCGzvlKTluKC1eSscTLl3ARBeBMSFZw3cneDGhxEkWx2C",  "student", 0,   "1"),
    ("8",  "luis",    "fernandez", "luis.fernandez@student.edugreen.com",   "$2b$10$kOZCWo45DGAYeTVn04Z9f.TSCyWKHXowbNg2lPuXOYcCO0/WWbtUy",  "student", 0,   "1"),
    ("9",  "sofia",   "ruiz",      "sofia.ruiz@student.edugreen.com",       "$2b$10$LPverthzZ1wBzOm4WaUQpeRSEjKFak6KrRL4Jc1PTlN5ImPrmpCJa",  "student", 0,   "1"),
    ("10", "pablo",   "sanchez",   "pablo.sanchez@student.edugreen.com",    "$2b$10$zv90iRI1vHYHg6nE6tfhauNHAPBAqro1R2k58Epaw2Upstu/0f0d2",   "student", 0,   "1"),
    ("11", "lucia",   "perez",     "lucia.perez@student.edugreen.com",      "$2b$10$C13jb0E5I.ZXqKUBxs13UOLy2yKChI/hNmE0/X0bU80gg3gvGYa.q",  "student", 0,   "1"),
    ("12", "hecro",   "dtov",      "hecrodtov@alu.edu.gva.es",              "$2b$10$7yggK05M0sLcARB/Cw.T.uhnlJ5XEqhF6oLbOGV7YdE7qPoVl40WO",  "student", 0,   "2"),
    ("13", "juan",    "gomez",     "juan.gomez@alu.edu.gva.es",             "$2b$10$18kF.HRe9yvgrKejyyJ8W.a.XKzRYLPqZ9kztD0aWGe/DSazWiXD2",  "student", 0,   "2"),
    ("14", "carmen",  "diaz",      "carmen.diaz@alu.edu.gva.es",            "$2b$10$Ma6wjY15Is1CIY7t.i2Jd.mn5GixP2XlxmdOzt5jbAd3DC9hTlAKm",  "student", 0,   "2"),
    ("15", "roberto", "torres",    "roberto.torres@alu.edu.gva.es",         "$2b$10$582Vx2.mbvJaCrj4UDRRp.19jz68ggLvRFHw/mIwQfjvB65jW2Fu2",  "student", 0,   "2");

INSERT INTO `class` (`id`, `name`, `description`, `tutor_id`) VALUES
    ("1", "test-class",                  "prueba de clase",                                                          "2"),
    ("2", "Estadística Ambiental",       "Análisis de datos ecológicos, modelos de crecimiento y métricas verdes",  "6"),
    ("3", "Tecnología Verde",            "Desarrollo web y apps orientadas a la sostenibilidad y el medio ambiente", "2"),
    ("4", "Ecología y Biodiversidad",    "Ecosistemas, cadenas tróficas, conservación de especies y biomas",        "5"),
    ("5", "Historia del Ecologismo",     "Del movimiento conservacionista del s.XIX a los acuerdos climáticos actuales", "5");

INSERT INTO `challenge` (`id`, `name`, `description`, `points`, `auto_enroll`, `participants`, `class_id`, `end_date`) VALUES
    ("1",  "test-challenge",                    "prueba de reto",                                                           100, FALSE, 1,  "1", NULL),
    ("2",  "Análisis de Datos Climáticos",      "Matrices de temperatura, regresión lineal y detección de anomalías",       150, FALSE, 3,  "2", DATE_ADD(NOW(), INTERVAL 30 DAY)),
    ("3",  "Modelos de Crecimiento Poblacional","Derivadas aplicadas a poblaciones de fauna silvestre y especies invasoras", 200, FALSE, 2,  "2", DATE_ADD(NOW(), INTERVAL 45 DAY)),
    ("4",  "Web de Concienciación Ecológica",   "Crea una landing page sobre una especie en peligro con HTML y CSS",        100, TRUE,  5,  "3", NULL),
    ("5",  "App de Huella de Carbono",          "Calcula y visualiza la huella de carbono personal con JavaScript",         150, FALSE, 4,  "3", DATE_ADD(NOW(), INTERVAL 20 DAY)),
    ("6",  "Dashboard Energías Renovables",     "Interfaz interactiva con React que muestra datos de producción solar/eólica", 200, FALSE, 2, "3", DATE_ADD(NOW(), INTERVAL 60 DAY)),
    ("7",  "Arrecifes de Coral en Peligro",     "Causas del blanqueamiento coralino y propuestas de restauración marina",  100, FALSE, 3,  "4", NULL),
    ("8",  "Cambio Climático",                  "Causas, consecuencias y soluciones sostenibles para el siglo XXI",         150, TRUE,  4,  "4", NULL),
    ("9",  "Desastres Ecológicos del s.XX",     "Chernóbil, Exxon Valdez, lluvia ácida: análisis de impacto ambiental",    100, FALSE, 3,  "5", NULL),
    ("10", "Movimientos Ecologistas Globales",  "De Greenpeace al Acuerdo de París: activismo, política y ciencia verde",  150, TRUE,  4,  "5", DATE_ADD(NOW(), INTERVAL 15 DAY));

INSERT INTO `user_class` (`user_id`, `class_id`) VALUES
    -- class 1: test
    ("2",  "1"),
    ("3",  "1"),
    -- class 2: Matemáticas Avanzadas (tutor + students)
    ("6",  "2"),
    ("7",  "2"),
    ("8",  "2"),
    ("9",  "2"),
    -- class 3: Programación Web (tutor + students)
    ("2",  "3"),
    ("6",  "3"),
    ("7",  "3"),
    ("8",  "3"),
    ("9",  "3"),
    ("10", "3"),
    ("11", "3"),
    -- class 4: Ciencias Naturales
    ("5",  "4"),
    ("12", "4"),
    ("13", "4"),
    ("14", "4"),
    -- class 5: Historia Moderna
    ("5",  "5"),
    ("12", "5"),
    ("13", "5"),
    ("14", "5"),
    ("15", "5");

INSERT INTO `enrollment` (`user_id`, `challenge_id`, `enrolled_at`, `completed_at`) VALUES
    -- challenge 1 (test)
    ("3",  "1",  DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
    -- challenge 2: Álgebra Lineal — ana+luis completed, sofia only enrolled
    ("7",  "2",  DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY)),
    ("8",  "2",  DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY)),
    ("9",  "2",  DATE_SUB(NOW(), INTERVAL 18 DAY), NULL),
    -- challenge 3: Cálculo Diferencial — only luis completed
    ("7",  "3",  DATE_SUB(NOW(), INTERVAL 15 DAY), NULL),
    ("8",  "3",  DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    -- challenge 4: HTML y CSS (auto_enroll) — all class 3 students, most completed
    ("7",  "4",  DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY)),
    ("8",  "4",  DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 24 DAY)),
    ("9",  "4",  DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 22 DAY)),
    ("10", "4",  DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY)),
    ("11", "4",  DATE_SUB(NOW(), INTERVAL 30 DAY), NULL),
    -- challenge 5: JavaScript — ana+sofia completed, others enrolled
    ("7",  "5",  DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    ("8",  "5",  DATE_SUB(NOW(), INTERVAL 14 DAY), NULL),
    ("9",  "5",  DATE_SUB(NOW(), INTERVAL 13 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
    ("10", "5",  DATE_SUB(NOW(), INTERVAL 12 DAY), NULL),
    ("11", "5",  DATE_SUB(NOW(), INTERVAL 10 DAY), NULL),
    -- challenge 6: React Intro — only ana enrolled+started, not done
    ("7",  "6",  DATE_SUB(NOW(), INTERVAL 5 DAY),  NULL),
    ("8",  "6",  DATE_SUB(NOW(), INTERVAL 3 DAY),  NULL),
    -- challenge 7: Ecosistemas Marinos — hecrodtov+carmen done, juan not
    ("12", "7",  DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY)),
    ("13", "7",  DATE_SUB(NOW(), INTERVAL 24 DAY), NULL),
    ("14", "7",  DATE_SUB(NOW(), INTERVAL 23 DAY), DATE_SUB(NOW(), INTERVAL 18 DAY)),
    -- challenge 8: Cambio Climático (auto_enroll) — all done
    ("12", "8",  DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
    ("13", "8",  DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
    ("14", "8",  DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    -- challenge 9: Primera Guerra Mundial — hecrodtov+roberto done, others not
    ("12", "9",  DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 14 DAY)),
    ("13", "9",  DATE_SUB(NOW(), INTERVAL 19 DAY), NULL),
    ("14", "9",  DATE_SUB(NOW(), INTERVAL 18 DAY), NULL),
    ("15", "9",  DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 13 DAY)),
    -- challenge 10: Segunda Guerra Mundial (auto_enroll) — mixed
    ("12", "10", DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    ("13", "10", DATE_SUB(NOW(), INTERVAL 10 DAY), NULL),
    ("14", "10", DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    ("15", "10", DATE_SUB(NOW(), INTERVAL 10 DAY), NULL);

INSERT INTO `stats` (`user_id`, `challenge_id`, `points`, `earned_at`) VALUES
    -- challenge 1
    ("3",  "1",  100, DATE_SUB(NOW(), INTERVAL 9 DAY)),
    -- challenge 2
    ("7",  "2",  150, DATE_SUB(NOW(), INTERVAL 15 DAY)),
    ("8",  "2",  150, DATE_SUB(NOW(), INTERVAL 12 DAY)),
    -- challenge 3
    ("8",  "3",  200, DATE_SUB(NOW(), INTERVAL 5 DAY)),
    -- challenge 4
    ("7",  "4",  100, DATE_SUB(NOW(), INTERVAL 25 DAY)),
    ("8",  "4",  100, DATE_SUB(NOW(), INTERVAL 24 DAY)),
    ("9",  "4",  100, DATE_SUB(NOW(), INTERVAL 22 DAY)),
    ("10", "4",  100, DATE_SUB(NOW(), INTERVAL 20 DAY)),
    -- challenge 5
    ("7",  "5",  150, DATE_SUB(NOW(), INTERVAL 8 DAY)),
    ("9",  "5",  150, DATE_SUB(NOW(), INTERVAL 6 DAY)),
    -- challenge 7
    ("12", "7",  100, DATE_SUB(NOW(), INTERVAL 20 DAY)),
    ("14", "7",  100, DATE_SUB(NOW(), INTERVAL 18 DAY)),
    -- challenge 8
    ("12", "8",  150, DATE_SUB(NOW(), INTERVAL 10 DAY)),
    ("13", "8",  150, DATE_SUB(NOW(), INTERVAL 9 DAY)),
    ("14", "8",  150, DATE_SUB(NOW(), INTERVAL 8 DAY)),
    -- challenge 9
    ("12", "9",  100, DATE_SUB(NOW(), INTERVAL 14 DAY)),
    ("15", "9",  100, DATE_SUB(NOW(), INTERVAL 13 DAY)),
    -- challenge 10
    ("12", "10", 150, DATE_SUB(NOW(), INTERVAL 5 DAY)),
    ("14", "10", 150, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Update accumulated points on user table
UPDATE `user` SET `points` = 100  WHERE `id` = "3";   -- test student: ch1
UPDATE `user` SET `points` = 400  WHERE `id` = "7";   -- ana: ch2+ch4+ch5
UPDATE `user` SET `points` = 450  WHERE `id` = "8";   -- luis: ch2+ch3+ch4
UPDATE `user` SET `points` = 250  WHERE `id` = "9";   -- sofia: ch4+ch5
UPDATE `user` SET `points` = 100  WHERE `id` = "10";  -- pablo: ch4
UPDATE `user` SET `points` = 400  WHERE `id` = "12";  -- hecrodtov: ch7+ch8+ch9+ch10
UPDATE `user` SET `points` = 150  WHERE `id` = "13";  -- juan: ch8
UPDATE `user` SET `points` = 400  WHERE `id` = "14";  -- carmen: ch7+ch8+ch10
UPDATE `user` SET `points` = 100  WHERE `id` = "15";  -- roberto: ch9
