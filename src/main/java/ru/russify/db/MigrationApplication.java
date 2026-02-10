package ru.russify.db;

import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Класс для мигрирования.
 * Запускается вместе с методом Migrator.migrate() после создания схем.
 */
@SpringBootApplication
public class MigrationApplication {
}
