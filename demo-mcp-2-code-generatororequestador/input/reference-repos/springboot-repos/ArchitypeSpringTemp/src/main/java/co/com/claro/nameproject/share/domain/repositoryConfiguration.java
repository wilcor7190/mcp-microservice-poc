package co.com.claro.nameproject.share.domain;

import co.com.claro.nameproject.share.infraestructure.oracle.OracleService;
import co.com.claro.nameproject.contract.infrastructure.oracle.cursor.ContractCursorRepository;
import co.com.claro.nameproject.contract.infrastructure.oracle.cursor.DatabaseCursorService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class repositoryConfiguration {

    @Bean
    public ContractCursorRepository studentRepository(OracleService oracleService) {
        return new DatabaseCursorService(oracleService);
    }
}
