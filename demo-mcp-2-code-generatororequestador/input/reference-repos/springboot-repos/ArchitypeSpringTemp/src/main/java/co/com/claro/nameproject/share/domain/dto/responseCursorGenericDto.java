package co.com.claro.nameproject.share.domain.dto;

import java.io.Serializable;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Clase encargada de generar la respuesta generica del cursor
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class responseCursorGenericDto<T> implements Serializable {
    private T dataCursor;
}
