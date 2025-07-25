package co.com.claro.nameproject.contract.domain.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer userId;
    private Integer id;
    private String title;
    private Boolean completed;
}
