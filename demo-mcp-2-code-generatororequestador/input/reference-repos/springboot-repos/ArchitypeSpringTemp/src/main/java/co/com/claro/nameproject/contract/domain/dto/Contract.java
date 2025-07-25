package co.com.claro.nameproject.contract.domain.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contract {
    private String id;
    private String contractId;
    private String status;
}
