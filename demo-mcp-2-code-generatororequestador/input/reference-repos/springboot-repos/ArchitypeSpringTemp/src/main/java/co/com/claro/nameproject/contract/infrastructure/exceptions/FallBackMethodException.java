package co.com.claro.nameproject.contract.infrastructure.exceptions;

/**
 * Interfaz para el consumo de el manejo de excepciones de tipo FallbackMethod
 */
public class FallBackMethodException extends RuntimeException{


	private static final long serialVersionUID = 1L;


	public FallBackMethodException(String message) {
        super(message);
    }

    public FallBackMethodException(String message, Throwable cause) {
        super(message, cause);
    }


    public FallBackMethodException(Throwable cause) {
        super(cause);
    }


}
