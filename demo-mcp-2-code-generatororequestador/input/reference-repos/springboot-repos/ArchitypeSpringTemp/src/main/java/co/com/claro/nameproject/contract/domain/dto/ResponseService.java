package co.com.claro.nameproject.contract.domain.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseService {
    private List<Contract> oracle  ;
    private List<Contract>  mongo ;
    private List<Map<String, Object>>  serviceRest ;

}
