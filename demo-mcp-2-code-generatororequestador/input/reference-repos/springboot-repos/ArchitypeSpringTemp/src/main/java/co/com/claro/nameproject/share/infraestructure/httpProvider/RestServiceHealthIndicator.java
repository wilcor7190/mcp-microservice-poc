package co.com.claro.nameproject.share.infraestructure.httpProvider;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class RestServiceHealthIndicator implements HealthIndicator {

    private final WebClient webClient;

    public RestServiceHealthIndicator(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://jsonplaceholder.typicode.com").build();
    }

    @Override
    public Health health() {
        try {
            Mono<String> healthCheck = webClient.get()
                    .uri("/todos/1") // Verifica una URL válida
                    .retrieve()
                    .bodyToMono(String.class);

            healthCheck.block(); // Espera la respuesta (no reactivo en este contexto)
            return Health.up().withDetail("message", "Servicio REST OK").build();
        } catch (Exception e) {
            return Health.down(e).withDetail("message", "Servicio REST DOWN").build();
        }
    }
}
