package ru.russify;

import ru.russify.db.Migrator;

public class App {
    public static void main(String[] args) {
        Migrator.migrate(args);
    }
}
