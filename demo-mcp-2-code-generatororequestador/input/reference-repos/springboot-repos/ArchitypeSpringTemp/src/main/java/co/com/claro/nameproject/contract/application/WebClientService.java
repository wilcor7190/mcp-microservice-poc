package co.com.claro.nameproject.contract.application;


import co.com.claro.nameproject.contract.domain.dto.User;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class WebClientService {

    private final WebClient webClient;

    public WebClientService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://jsonplaceholder.typicode.com").build();
    }

    public Flux<User> getAllUsers() {
        return webClient.get()
                .uri("/todos")
                .retrieve()
                .bodyToFlux(User.class);
    }
}