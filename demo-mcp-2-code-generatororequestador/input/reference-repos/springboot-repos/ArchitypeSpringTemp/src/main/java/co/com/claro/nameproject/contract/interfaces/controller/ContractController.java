package co.com.claro.nameproject.contract.interfaces.controller;

import co.com.claro.nameproject.share.domain.common.Constants;
import co.com.claro.nameproject.share.domain.dto.apiResponseDto;
import co.com.claro.nameproject.contract.application.IContractService;
import co.com.claro.nameproject.contract.application.WebClientService;
import co.com.claro.nameproject.contract.domain.dto.StudentAgeRangeRequest;
import co.com.claro.nameproject.contract.domain.dto.User;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.sql.SQLException;

@RestController
@RequestMapping(Constants.CONTROLLER_CONTRACT)
public class ContractController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ContractController.class);

    @Autowired
    private IContractService service;

    @Autowired
    private WebClientService webClientService;

    @GetMapping("/users")
    public Flux<User> getAllUsers() {
        return webClientService.getAllUsers();
    }

    /**
     * Exposicion firma de servicio Agregar los parametros de entrada y salida
     * Ajustar el tipo de operacion
     *
     * @return
     */
    @GetMapping()
    @Operation(summary = "Obtener todos los contratos")
    public ResponseEntity<apiResponseDto<?>> findAll() throws SQLException {
        apiResponseDto<?> response = this.service.findAll();
        return ResponseEntity.ok(response);
    }


    @PostMapping("/by-age")
    @Operation(summary = "Obtener estudiantes de un rango de edad")
    public ResponseEntity<apiResponseDto<?>> getStudentsByAgeRange(
            @RequestBody StudentAgeRangeRequest payload) throws IllegalAccessException, SQLException {
        apiResponseDto<?> response = this.service.getContractByAgeRangePrc(payload);
        return ResponseEntity.ok(response);
    }
}
