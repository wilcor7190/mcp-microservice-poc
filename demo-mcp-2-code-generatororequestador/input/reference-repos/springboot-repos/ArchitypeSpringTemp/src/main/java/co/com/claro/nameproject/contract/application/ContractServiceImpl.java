package co.com.claro.nameproject.contract.application;

import co.com.claro.apm.APMSpan;
import co.com.claro.log.LogExecutionTime;
import co.com.claro.nameproject.contract.domain.dto.User;
import co.com.claro.nameproject.contract.infrastructure.httpProvider.RestClientService;
import co.com.claro.nameproject.share.domain.dto.apiResponseDto;
import co.com.claro.nameproject.contract.domain.dto.Contract;
import co.com.claro.nameproject.contract.domain.dto.ResponseService;
import co.com.claro.nameproject.contract.domain.dto.StudentAgeRangeRequest;
import co.com.claro.nameproject.contract.infrastructure.exceptions.FallBackMethodException;
import co.com.claro.nameproject.contract.infrastructure.mongo.ContractMongoService;
import co.com.claro.nameproject.contract.infrastructure.oracle.cursor.DatabaseCursorService;
import co.com.claro.nameproject.contract.infrastructure.oracle.outbinds.DatabaseOutBindService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Clase encargada de hacer toda la lógica del negocio para el flujo Get
 */

@Service
public class ContractServiceImpl implements  IContractService{

    private DatabaseCursorService databaseCursorService;
    private DatabaseOutBindService databaseOutBindService;
    private ContractMongoService contractMongoService;
    private RestClientService restClientService;



    public ContractServiceImpl(DatabaseCursorService databaseCursorService, DatabaseOutBindService databaseOutBindService, ContractMongoService contractMongoService, RestClientService restClientService) {
        this.databaseCursorService = databaseCursorService;
        this.databaseOutBindService = databaseOutBindService;
        this.contractMongoService = contractMongoService;
        this.restClientService = restClientService;
    }

    ///private final IService service;

    //	private static final Logger LOGGER = LoggerFactory.getLogger(StudentServiceImpl.class);
    private static final String MESSAGE = "OK";


    /**
     * Funcion que consume el repository o legado
     */
    @APMSpan
    @LogExecutionTime
    @Override
    public apiResponseDto<List<ResponseService>> findAll() throws SQLException {
        List<Contract> responseOracle = databaseCursorService.findAll();
        List<Contract> responseMongo = contractMongoService.findAllGeneric();
        List<Map<String, Object>> respon=  restClientService.getReponseRest();


        // Preparar la respuesta final
        ResponseService response = new ResponseService( );
        response.setMongo(responseMongo);
        response.setOracle(responseOracle);
        response.setServiceRest(respon);


        return (apiResponseDto<List<ResponseService>>) buildResponse(response);
    }

    @APMSpan
    @LogExecutionTime
    @Override
    public apiResponseDto<List<Contract>> getContractByAgeRangePrc(StudentAgeRangeRequest payload) throws IllegalAccessException, SQLException {
        List<Contract> response = databaseOutBindService.getContractByAgeRangePrc(payload);
        return (apiResponseDto<List<Contract>>) buildResponseByAgeRangePrc(response);
    }

    /**
     * Funcion que construye el ResponseDto de la aplicacion
     * @param response
     *
     * @return ResponseDto
     */
//	@APMSpan
//	@LogExecutionTime
    private apiResponseDto<?> buildResponse(ResponseService response) {
        try {
            /**
             * Mapeo de datos con el objeto response recibido del consumo
             */
//			LOGGER.info("Fin exitoso de construccion de objeto de respuesta");
            return apiResponseDto.builder().responseCode(HttpStatus.OK).message(MESSAGE).data(response).build();
        } catch (Exception e) {
//			LOGGER.error("Error construyendo el objeto de respuesta: {}", e.getMessage());
            throw new FallBackMethodException("Error construyendo el objeto de respuesta");
        }
    }

    private apiResponseDto<?> buildResponseByAgeRangePrc(List<Contract> response) {
        try {
            return apiResponseDto.builder().responseCode(HttpStatus.OK).message(MESSAGE).data(response).build();
        } catch (Exception e) {
            throw new FallBackMethodException("Error construyendo el objeto de respuesta");
        }
    }
}
