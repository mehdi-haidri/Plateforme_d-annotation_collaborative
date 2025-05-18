package com.project.plateforme_dannotation_collaborative.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    private final Path uploadDir;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) throws IOException {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();

        Files.createDirectories(this.uploadDir);
    }

    public void saveFile(String filename, byte[] content) throws IOException {
        Path targetLocation = this.uploadDir.resolve(filename);
        Files.write(targetLocation, content);
    }

    public File getFile(String filename) {
        Path filePath = uploadDir.resolve(filename).normalize();
        return filePath.toFile();
    }
}
