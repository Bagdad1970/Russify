package ru.russify.russifyservice.utils;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class FileHashGenerator {

    public static String generateFileHash(InputStream inputStream) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {
                digest.update(buffer, 0, bytesRead);
            }

            byte[] hash = digest.digest();

            BigInteger number = new BigInteger(1, hash);
            StringBuilder hexString = new StringBuilder(number.toString(16));

            while (hexString.length() < 64) {
                hexString.insert(0, '0');
            }

            return hexString.toString();
        }
        catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Hashing algorithm does not exist");
        }
        catch (IOException e) {
            throw new RuntimeException("Failed when reading stream");
        }
        catch (Exception e) {
            throw new RuntimeException("Unhandled exception");
        }
    }

}