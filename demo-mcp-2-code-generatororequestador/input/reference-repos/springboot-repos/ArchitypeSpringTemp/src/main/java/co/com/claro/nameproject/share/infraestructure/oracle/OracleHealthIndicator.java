package co.com.claro.nameproject.share.infraestructure.oracle;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import java.sql.Connection;
import java.sql.DriverManager;

@Component
public class OracleHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        try (Connection connection = DriverManager.getConnection(
                "jdbc:oracle:thin:@localhost:1521:xe",
                "system",
                "Ora1234")) {
            if (connection != null && !connection.isClosed()) {
                return Health.up().withDetail("Oracle", "Disponible").build();
            } else {
                return Health.down().withDetail("Oracle", "No disponible").build();
            }
        } catch (Exception e) {
            return Health.down(e).withDetail("Oracle", "No disponible").withException(e).build();
        }
    }
}

