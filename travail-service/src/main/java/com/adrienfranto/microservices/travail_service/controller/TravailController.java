package com.adrienfranto.microservices.travail_service.controller;

import com.adrienfranto.microservices.travail_service.dto.TravailDto;
import com.adrienfranto.microservices.travail_service.dto.TravailRequest;
import com.adrienfranto.microservices.travail_service.service.TravailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/travail")
public class TravailController {
    private final TravailService travailService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String placeTravail(@RequestBody TravailRequest travailRequest){
        travailService.placeTravail(travailRequest);
        return "Travail enregistrer avec success";
    }

    @GetMapping
    public List<TravailDto> getAllTravaux() {
        return travailService.getAllTravaux();
    }

    // READ - by id
    @GetMapping("/{id}")
    public TravailDto getTravailById(@PathVariable Long id) {
        return travailService.getTravailById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public TravailDto updateTravail(@PathVariable Long id, @RequestBody TravailDto travailDto) {
        return travailService.updateTravail(id, travailDto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTravail(@PathVariable Long id) {
        travailService.deleteTravail(id);
    }
}
