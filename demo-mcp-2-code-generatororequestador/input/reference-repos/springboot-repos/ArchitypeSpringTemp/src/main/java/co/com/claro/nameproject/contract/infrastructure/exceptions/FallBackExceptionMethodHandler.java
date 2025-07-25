package co.com.claro.nameproject.contract.infrastructure.exceptions;

import co.com.claro.apm.APMSpan;
import co.com.claro.log.LogExecutionTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import co.com.claro.nameproject.share.domain.dto.apiResponseDto;

/**
 * Interfaz para el consumo de el manejo de excepciones de tipo FallbackMethod
 */
@ControllerAdvice
public class FallBackExceptionMethodHandler {


	@APMSpan
	@LogExecutionTime
	@ExceptionHandler
	public ResponseEntity<apiResponseDto<?>> handlerException(FallBackMethodException ex) {
		return ResponseEntity.status(HttpStatus.OK).body(
				new apiResponseDto<Object>(HttpStatus.OK, ex.getMessage(), null));
	}

}