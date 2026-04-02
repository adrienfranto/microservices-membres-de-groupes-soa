package com.adrienfranto.microservices.groupe_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GroupeDto {
    private Long id;
    private String nomTravail;
    private Integer quantite;
}
