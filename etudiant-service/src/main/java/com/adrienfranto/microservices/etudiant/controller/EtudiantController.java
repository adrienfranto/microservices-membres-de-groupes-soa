package com.adrienfranto.microservices.etudiant.controller;

import com.adrienfranto.microservices.etudiant.dto.EtudiantReponse;
import com.adrienfranto.microservices.etudiant.dto.EtudiantRequest;
import com.adrienfranto.microservices.etudiant.service.EtudiantService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/etudiants")
@RequiredArgsConstructor
public class EtudiantController {

    private final EtudiantService etudiantService;
    private final String uploadDir = "uploads/images";

    // Ajouter étudiant avec image
    @PostMapping
    public ResponseEntity<EtudiantReponse> ajouterEtudiant(
            @RequestPart("etudiant") EtudiantRequest etudiantRequest,
            @RequestPart("image") MultipartFile imageFile) {
        return ResponseEntity.ok(etudiantService.ajouterEtudiant(etudiantRequest, imageFile));
    }

    @GetMapping
    public ResponseEntity<List<EtudiantReponse>> afficherEtudiants() {
        return ResponseEntity.ok(etudiantService.afficherEtudiants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EtudiantReponse> afficherEtudiantParId(@PathVariable String id) {
        return etudiantService.afficherEtudiantParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EtudiantReponse> modifierEtudiant(
            @PathVariable String id,
            @RequestPart("etudiant") EtudiantRequest etudiantRequest,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        return etudiantService.modifierEtudiant(id, etudiantRequest, imageFile)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerEtudiant(@PathVariable String id) {
        if (etudiantService.supprimerEtudiant(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Endpoint pour récupérer les images
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws MalformedURLException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
        if (!resource.exists()) return ResponseEntity.notFound().build();
        String contentType;
        try {
            contentType = Files.probeContentType(filePath);
        } catch (Exception e) {
            contentType = "application/octet-stream";
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .body(resource);
    }
}
