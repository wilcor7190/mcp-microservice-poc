package co.com.claro.nameproject.share.domain;

import co.com.claro.nameproject.share.domain.common.DatabaseCredentials;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;


@Configuration
public class DatasourceConfiguration {
    private static final Logger logger = LoggerFactory.getLogger(DatasourceConfiguration.class);

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;


    @Bean
    public DataSource hikariDatasource(DatabaseCredentials credentials) {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName(credentials.getDriver());
        config.setMaximumPoolSize(10);
        config.setJdbcUrl(credentials.getUrl());
        config.setUsername(credentials.getUsername());
        config.setPassword(credentials.getPassword());
        return  new HikariDataSource(config);
    }

    @Bean
    public JdbcTemplate getJdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean
    public MongoClient mongoClient() {
        String user = System.getenv("BD_USER");
        String password = System.getenv("BD_PASSWORD");
        if (user != null && password != null) {
            String finalUri = mongoUri.replace("bd_user", user).replace("bd_password", password);
            return MongoClients.create(finalUri);
        } else {
            return MongoClients.create(mongoUri);
        }
    }
    
}
