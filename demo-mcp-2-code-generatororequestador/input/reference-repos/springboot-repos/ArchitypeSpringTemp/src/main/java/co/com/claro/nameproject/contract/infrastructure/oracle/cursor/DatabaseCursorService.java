package co.com.claro.nameproject.contract.infrastructure.oracle.cursor;

import co.com.claro.apm.APMSpan;
import co.com.claro.log.LogExecutionTime;
import co.com.claro.nameproject.share.domain.common.ProcedureName;
import co.com.claro.nameproject.share.infraestructure.oracle.OracleService;
import co.com.claro.nameproject.contract.domain.dto.Contract;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DatabaseCursorService implements ContractCursorRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(DatabaseCursorService.class);

    private final OracleService oracleService;

    @Autowired
    private ProcedureName procedureName;

    public DatabaseCursorService(OracleService oracleService) {
        this.oracleService = oracleService;
    }

    private final RowMapper<?> mapper = (resultSet, i) -> {
        String id = resultSet.getString("id");
        String contractid = resultSet.getString("contractid");
        String status = resultSet.getString("status");
        return Contract.builder().id(id).contractId(contractid).status(status).build();
    };

    @APMSpan
    @LogExecutionTime
    @Override
    public List<Contract> findAll() {
        String SQL = "SELECT id, contractid, status FROM CONTRACT";
        return oracleService.queryToList(SQL, (RowMapper<Contract>) mapper);
    }

}