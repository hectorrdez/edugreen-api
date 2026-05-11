DELIMITER //

DROP TRIGGER IF EXISTS before_user_password_update//

CREATE TRIGGER before_user_password_update
BEFORE UPDATE ON `user`
FOR EACH ROW
BEGIN
    IF NOT (OLD.`password` <=> NEW.`password`) THEN
        SET NEW.`old_password` = OLD.`password`;
    END IF;
END//

DELIMITER ;

DELIMITER //

DROP TRIGGER IF EXISTS after_stats_insert//

CREATE TRIGGER after_stats_insert
AFTER INSERT ON `stats`
FOR EACH ROW
BEGIN
    UPDATE `user` SET `points` = `points` + NEW.`points` WHERE `id` = NEW.`user_id`;
END//

DROP TRIGGER IF EXISTS after_stats_delete//

CREATE TRIGGER after_stats_delete
AFTER DELETE ON `stats`
FOR EACH ROW
BEGIN
    UPDATE `user` SET `points` = `points` - OLD.`points` WHERE `id` = OLD.`user_id`;
END//

DROP TRIGGER IF EXISTS after_enrollment_update//

CREATE TRIGGER after_enrollment_update
AFTER UPDATE ON `enrollment`
FOR EACH ROW
BEGIN
    IF OLD.`completed_at` IS NULL AND NEW.`completed_at` IS NOT NULL THEN
        INSERT INTO `stats` (`user_id`, `challenge_id`, `points`)
        SELECT NEW.`user_id`, NEW.`challenge_id`, c.`points`
        FROM `challenge` c WHERE c.`id` = NEW.`challenge_id`;
    END IF;
    IF OLD.`completed_at` IS NOT NULL AND NEW.`completed_at` IS NULL THEN
        DELETE FROM `stats` WHERE `user_id` = NEW.`user_id` AND `challenge_id` = NEW.`challenge_id`;
    END IF;
END//

DELIMITER ;
