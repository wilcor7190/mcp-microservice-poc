package co.com.claro.nameproject.share.infraestructure.mongo;

import com.mongodb.client.MongoClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class MongoHealthIndicator implements HealthIndicator {

    @Autowired
    private MongoClient mongoClient;

    @Override
    public Health health() {
        try {
            // Verifica si MongoDB responde correctamente
            mongoClient.listDatabaseNames().first();
            return Health.up().withDetail("MongoDB", "Disponible").build();
        } catch (Exception e) {
            return Health.down(e).withDetail("MongoDB", "No disponible").build();
        }
    }
}

