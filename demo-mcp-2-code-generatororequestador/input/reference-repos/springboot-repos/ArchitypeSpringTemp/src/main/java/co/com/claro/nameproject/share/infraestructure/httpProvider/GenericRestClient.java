package co.com.claro.nameproject.share.infraestructure.httpProvider;

import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Component
public class GenericRestClient {

    private final WebClient webClient;

    public GenericRestClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    /**
     * Método genérico para realizar solicitudes REST.
     *
     * @param url          La URL del servicio.
     * @param method       El método HTTP (GET, POST, PUT, DELETE).
     * @param requestBody  El cuerpo de la solicitud (puede ser null para GET o DELETE).
     * @param responseType La clase del tipo de respuesta esperada.
     * @param <T>          Tipo de la respuesta.
     * @param <R>          Tipo del cuerpo de la solicitud.
     * @return La respuesta del servicio deserializada en el tipo especificado.
     */
    public <T, R> T executeRest(String url, HttpMethod method, R requestBody, Class<T> responseType) {
        try {
            WebClient.RequestBodySpec requestSpec = webClient.method(method).uri(url);

            if (requestBody != null) {
                requestSpec.body(Mono.just(requestBody), requestBody.getClass());
            }

            return requestSpec
                    .retrieve()
                    .bodyToMono(responseType)
                    .block(); // Bloquea para obtener el resultado sincrónicamente
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Error during " + method.name() + " request to " + url, e);
        }
    }
}