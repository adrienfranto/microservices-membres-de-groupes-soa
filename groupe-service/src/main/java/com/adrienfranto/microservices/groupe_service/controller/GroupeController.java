package com.adrienfranto.microservices.groupe_service.controller;

import com.adrienfranto.microservices.groupe_service.dto.GroupeDto;
import com.adrienfranto.microservices.groupe_service.model.Groupe;
import com.adrienfranto.microservices.groupe_service.service.GroupeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groupes")
@RequiredArgsConstructor
public class GroupeController {
    private final GroupeService groupeService;
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public boolean inGroup(
            @RequestParam("nomTravail") String nomTravail,
            @RequestParam(value = "quantite", required = false, defaultValue = "0") Integer quantite
    ){
        return groupeService.InGroup(nomTravail, quantite);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GroupeDto ajouterGroupe(@RequestBody GroupeDto dto) {
        Groupe saved = groupeService.saveGroupe(dto);
        return groupeService.mapToDto(saved);
    }

    @GetMapping("/list")
    public List<GroupeDto> getAllGroupes() {
        return groupeService.getAllGroupes()
                .stream()
                .map(groupeService::mapToDto)
                .toList();
    }

    @GetMapping("/{id}")
    public GroupeDto rechercheGroupe(@PathVariable Long id) {
        Groupe groupe = groupeService.getGroupeById(id);
        return groupeService.mapToDto(groupe);
    }

    @PutMapping("/{id}")
    public GroupeDto modifierGroupe(@PathVariable Long id, @RequestBody GroupeDto dto) {
        Groupe updated = groupeService.updateGroupe(id, dto);
        return groupeService.mapToDto(updated);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGroupe(@PathVariable Long id) {
        groupeService.deleteGroupe(id);
    }

}
