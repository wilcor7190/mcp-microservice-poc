package co.com.claro.nameproject.contract.domain.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentAgeRangeRequest {
    private Number p_age_min;
    private Number p_age_max;
}
