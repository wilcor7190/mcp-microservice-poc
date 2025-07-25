package co.com.claro.nameproject.contract.infrastructure.httpProvider;

import co.com.claro.nameproject.share.infraestructure.httpProvider.GenericRestClient;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RestClientService {

    private final GenericRestClient genericRestClient;

    public RestClientService(GenericRestClient genericRestClient) {
        this.genericRestClient = genericRestClient;
    }

    /**
     * Método para consumir el endpoint de ejemplo.
     *
     * @return Lista de tareas desde el endpoint de ejemplo.
     */
    public List<Map<String, Object>> getReponseRest() {
        String url = "https://jsonplaceholder.typicode.com/todos";
        return genericRestClient.executeRest(url, HttpMethod.GET, null, List.class);
    }
}
