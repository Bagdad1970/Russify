package ru.russify.db;

import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

/**
 * Класс для выполнения миграций из resources/db/changelog
 */
public class Migrator {
    /**
     * Метод миграции. Выполняет основную функцию.
     * @param args параметры главного стартового метода. По факту не нужны, но может что-то как-то когда-то...
     * Создаем спринг контекст/контейнер и с помощью него вытаскиваем значения полей application.yml
     * Подключаемся к бд, вручную создаем таблицы app и liquibase. Схема liquibase - по сути рабочая схема liquibase,
     * туда записывается контрольная сумма и прочее. Делается вручную, потому что иначе мигратор не видит этих схем.
     * И да, сейчас по сути схема liquibase никакой смысловой нагрузки не несет, т.к. все сервисные таблицы сохраняются
     * в схему public.
     * Если все выполнено верно выводятся соответствующие сообщения о создании схем, иначе - ошибка при создании схем.
     * После чего выводится сообщение о запуске Liquibase и выполняются сами миграции из resources/b/changelog
     */
    public static void migrate(String[] args) {
        try (ConfigurableApplicationContext tempContext = SpringApplication.run(MigrationApplication.class, args)){
            Environment env = tempContext.getEnvironment();

            String url = env.getProperty("spring.datasource.url");
            String user = env.getProperty("spring.datasource.username");
            String password = env.getProperty("spring.datasource.password");

            String[] schemas = env.getProperty("app.schemas").split(",");

            try (Connection connection = DriverManager.getConnection(url, user, password);
                 Statement statement = connection.createStatement()) {
                for (String schema : schemas) {
                    statement.execute("CREATE SCHEMA IF NOT EXISTS " + schema.trim());
                    System.out.println("Schema '" + schema.trim() + "' created");
                }
            } catch (Exception e) {
                throw new RuntimeException("Failed to create schemas", e);
            }
            System.out.println("Schemas ready, running Liquibase...");
        }
    }
}
