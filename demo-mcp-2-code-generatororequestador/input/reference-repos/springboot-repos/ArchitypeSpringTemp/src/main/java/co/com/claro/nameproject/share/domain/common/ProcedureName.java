package co.com.claro.nameproject.share.domain.common;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "procedure")
@RequiredArgsConstructor
@Data
public class ProcedureName {
    private String name;
}


