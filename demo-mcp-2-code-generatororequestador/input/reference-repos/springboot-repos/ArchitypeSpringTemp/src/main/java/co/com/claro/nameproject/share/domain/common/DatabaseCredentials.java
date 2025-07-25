package co.com.claro.nameproject.share.domain.common;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "spring.datasource")
@RequiredArgsConstructor
@Data
public class DatabaseCredentials {
    private String username;
    private String password;
    private String url;
    private String driver;
}


