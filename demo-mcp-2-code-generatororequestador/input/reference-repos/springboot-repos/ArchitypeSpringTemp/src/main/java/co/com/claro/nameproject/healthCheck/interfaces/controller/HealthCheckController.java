package co.com.claro.nameproject.healthCheck.interfaces.controller;

import co.com.claro.nameproject.share.domain.common.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.HealthComponent;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(Constants.CONTROLLER_HEALTH)
public class HealthCheckController {

    private final HealthEndpoint healthEndpoint;

    @Autowired
    public HealthCheckController(HealthEndpoint healthEndpoint) {
        this.healthEndpoint = healthEndpoint;
    }

    @GetMapping
    public HealthComponent getHealthStatus() {
        // Devuelve el estado de salud completo, incluyendo MongoDB y Oracle
        return healthEndpoint.health();
    }
}
