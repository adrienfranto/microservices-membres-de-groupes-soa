package com.adrienfranto.microservices.travail_service.service;

import com.adrienfranto.microservices.travail_service.client.GroupeClient;
import com.adrienfranto.microservices.travail_service.dto.TravailDto;
import com.adrienfranto.microservices.travail_service.dto.TravailRequest;
import com.adrienfranto.microservices.travail_service.model.Travail;
import com.adrienfranto.microservices.travail_service.repository.TravailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TravailService {
    private final TravailRepository travailRepository;
    private final GroupeClient groupeClient;

    // CREATE
    public TravailDto placeTravail(TravailRequest travailRequest) {
        boolean isGroup = groupeClient
                .isInGroupe(travailRequest.nomTravail(), travailRequest.quantite());

        if (isGroup) {
            Travail travail = new Travail();
            travail.setOrdreTravail(travailRequest.ordreTravail());
            travail.setNomTravail(travailRequest.nomTravail());
            travail.setDetailTravail(travailRequest.detailTravail());
            travail.setSalaire(travailRequest.salaire());
            travail.setQuantite(travailRequest.quantite());

            Travail saved = travailRepository.save(travail);
            return mapToDto(saved);
        } else {
            throw new RuntimeException(
                    "Le travail " + travailRequest.nomTravail() + " n'existe pas dans groupe"
            );
        }
    }

    // READ - all
    public List<TravailDto> getAllTravaux() {
        return travailRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // READ - by id
    public TravailDto getTravailById(Long id) {
        Travail travail = travailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Travail non trouvé avec id : " + id));
        return mapToDto(travail);
    }

    // UPDATE
    public TravailDto updateTravail(Long id, TravailDto travailDto) {
        Travail travail = travailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Travail non trouvé avec id : " + id));

        travail.setOrdreTravail(travailDto.getOrdreTravail());
        travail.setNomTravail(travailDto.getNomTravail());
        travail.setDetailTravail(travailDto.getDetailTravail());
        travail.setSalaire(travailDto.getSalaire());
        travail.setQuantite(travailDto.getQuantite());

        Travail updated = travailRepository.save(travail);
        return mapToDto(updated);
    }

    // DELETE
    public void deleteTravail(Long id) {
        Travail travail = travailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Travail non trouvé avec id : " + id));
        travailRepository.delete(travail);
    }

    // === Mapping helpers ===
    private TravailDto mapToDto(Travail travail) {
        return new TravailDto(
                travail.getId(),
                travail.getOrdreTravail(),
                travail.getNomTravail(),
                travail.getDetailTravail(),
                travail.getSalaire(),
                travail.getQuantite()
        );
    }

    private Travail mapToEntity(TravailDto dto) {
        return new Travail(
                dto.getId(),
                dto.getOrdreTravail(),
                dto.getNomTravail(),
                dto.getDetailTravail(),
                dto.getSalaire(),
                dto.getQuantite()
        );
    }
}
