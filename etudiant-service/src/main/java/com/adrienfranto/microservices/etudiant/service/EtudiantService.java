package com.adrienfranto.microservices.etudiant.service;

import com.adrienfranto.microservices.etudiant.dto.EtudiantReponse;
import com.adrienfranto.microservices.etudiant.dto.EtudiantRequest;
import com.adrienfranto.microservices.etudiant.model.Etudiant;
import com.adrienfranto.microservices.etudiant.repository.EtudiantRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;
    private final String uploadDir = "uploads/images";

    // Crée automatiquement le dossier au démarrage de l'application
    @PostConstruct
    public void init() {
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                log.info("Dossier de stockage créé : " + path.toAbsolutePath());
            }
        } catch (IOException e) {
            throw new RuntimeException("Impossible de créer le dossier d'upload", e);
        }
    }

    public EtudiantReponse ajouterEtudiant(EtudiantRequest etudiantRequest, MultipartFile imageFile) {
        String imageName = storeImage(imageFile);

        Etudiant etudiant = Etudiant.builder()
                .matricule(etudiantRequest.matricule())
                .nom(etudiantRequest.nom())
                .prenoms(etudiantRequest.prenoms())
                .sexe(etudiantRequest.sexe())
                .niveau(etudiantRequest.niveau())
                .id_groupe(etudiantRequest.id_groupe())
                .image(imageName)
                .build();

        etudiant = etudiantRepository.save(etudiant);
        log.info("Étudiant enregistré avec succès, id: " + etudiant.getId());
        return mapToResponse(etudiant);
    }

    public Optional<EtudiantReponse> modifierEtudiant(String id, EtudiantRequest etudiantRequest, MultipartFile imageFile) {
        return etudiantRepository.findById(id).map(etudiant -> {
            etudiant.setMatricule(etudiantRequest.matricule());
            etudiant.setNom(etudiantRequest.nom());
            etudiant.setPrenoms(etudiantRequest.prenoms());
            etudiant.setSexe(etudiantRequest.sexe());
            etudiant.setNiveau(etudiantRequest.niveau());
            etudiant.setId_groupe(etudiantRequest.id_groupe());

            if (imageFile != null && !imageFile.isEmpty()) {
                String imageName = storeImage(imageFile);
                etudiant.setImage(imageName);
            }

            Etudiant updated = etudiantRepository.save(etudiant);
            log.info("Étudiant modifié avec succès, id: " + updated.getId());
            return mapToResponse(updated);
        });
    }

    public List<EtudiantReponse> afficherEtudiants() {
        return etudiantRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Optional<EtudiantReponse> afficherEtudiantParId(String id) {
        return etudiantRepository.findById(id).map(this::mapToResponse);
    }

    public boolean supprimerEtudiant(String id) {
        if (etudiantRepository.existsById(id)) {
            etudiantRepository.deleteById(id);
            log.info("Étudiant supprimé avec succès, id: " + id);
            return true;
        }
        return false;
    }

    private EtudiantReponse mapToResponse(Etudiant etudiant) {
        return new EtudiantReponse(
                etudiant.getId(),
                etudiant.getImage() != null ? "/api/etudiants/images/" + etudiant.getImage() : null,
                etudiant.getMatricule(),
                etudiant.getNom(),
                etudiant.getPrenoms(),
                etudiant.getSexe(),
                etudiant.getNiveau(),
                etudiant.getId_groupe()
        );
    }

    private String storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        try {
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = StringUtils.getFilenameExtension(originalFilename);
            String newFileName = UUID.randomUUID() + "." + extension;

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            file.transferTo(uploadPath.resolve(newFileName));
            return newFileName;
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'enregistrement de l'image", e);
        }
    }
}
