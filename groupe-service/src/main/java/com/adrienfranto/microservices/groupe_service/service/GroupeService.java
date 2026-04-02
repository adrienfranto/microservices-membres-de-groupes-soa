package com.adrienfranto.microservices.groupe_service.service;

import com.adrienfranto.microservices.groupe_service.dto.GroupeDto;
import com.adrienfranto.microservices.groupe_service.model.Groupe;
import com.adrienfranto.microservices.groupe_service.repository.GroupeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroupeService {
    private final GroupeRepository groupeRepository;

    public boolean InGroup(String nomTravail,Integer quantite){
        log.info("Cherche le travail"+ nomTravail+ " avec quantite = "+ quantite +" dans groupe ");
        return groupeRepository.existsByNomTravailAndQuantiteIsGreaterThanEqual(nomTravail,quantite);
    }

    // CREATE / SAVE
    public Groupe saveGroupe(GroupeDto dto) {
        Groupe g = new Groupe();
        g.setNomTravail(dto.getNomTravail());
        g.setQuantite(dto.getQuantite());
        return groupeRepository.save(g);
    }

    // READ ALL
    public List<Groupe> getAllGroupes() {
        return groupeRepository.findAll();
    }

    // READ BY ID
    public Groupe getGroupeById(Long id){
        return groupeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé avec id : " + id));
    }

    // UPDATE
    public Groupe updateGroupe(Long id, GroupeDto dto){
        Groupe groupe = getGroupeById(id);
        groupe.setNomTravail(dto.getNomTravail());
        groupe.setQuantite(dto.getQuantite());
        return groupeRepository.save(groupe);
    }

    // DELETE
    public void deleteGroupe(Long id){
        Groupe groupe = getGroupeById(id);
        groupeRepository.delete(groupe);
    }

    // Mapper
    public GroupeDto mapToDto(Groupe groupe) {
        return new GroupeDto(
                groupe.getId(),
                groupe.getNomTravail(),
                groupe.getQuantite()
        );
    }
}
