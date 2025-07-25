package co.com.claro.nameproject.share.domain.dto;

import java.io.Serializable;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Clase encargada de generar el objeto de respuesta del servicio
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class apiResponseDto<T> implements Serializable {
	
	private HttpStatus responseCode;
    private String message;
    private transient T data;

}
