package co.com.claro.nameproject.contract.infrastructure.exceptions;

/**
 * Interfaz para el consumo de el manejo de excepciones de tipo BadRequest
 */
public class ServiceUnavailableException extends RuntimeException{

	private static final long serialVersionUID = 1L;
	
	public ServiceUnavailableException(String message) {
        super(message);
    }

    public ServiceUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }

    public ServiceUnavailableException(Throwable cause) {
        super(cause);
    }
}
