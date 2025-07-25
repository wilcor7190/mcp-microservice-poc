package co.com.claro.nameproject.contract.infrastructure.oracle.outbinds;

import co.com.claro.apm.APMSpan;
import co.com.claro.log.LogExecutionTime;
import co.com.claro.nameproject.contract.domain.dto.Contract;
import co.com.claro.nameproject.share.domain.common.ProcedureName;
import co.com.claro.nameproject.share.infraestructure.oracle.OracleService;
import co.com.claro.nameproject.contract.domain.dto.StudentAgeRangeRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class DatabaseOutBindService implements ContractOutBindRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(DatabaseOutBindService.class);

    private final OracleService oracleService;

    @Autowired
    private ProcedureName procedureName;

    public DatabaseOutBindService(OracleService oracleService) {
        this.oracleService = oracleService;
    }

    private final RowMapper<?> mapper = (resultSet, i) -> {
        String id = resultSet.getString("id");
        String contractId = resultSet.getString("contractId");
        String status = resultSet.getString("status");
        return Contract.builder().id(id).contractId(contractId).status(status).build();
    };

    @APMSpan
    @LogExecutionTime
    @Override
    public List<Contract> getContractByAgeRangePrc(StudentAgeRangeRequest payload) throws IllegalAccessException, SQLException {
        String prcName = procedureName.getName();
        String cursorName = ""; // in case of having cursor name set here, if not, set empty string
        Map<String, Object> response = oracleService.execute(prcName, payload, true, cursorName);
        List<Contract> contract = new ArrayList<>();
        Iterator<Map.Entry<String, Object>> iterator = response.entrySet().iterator();
        if (iterator.hasNext()) {
            Map.Entry<String, Object> entry = iterator.next();
            Object value = entry.getValue();
            contract = (List<Contract>) value;
        }
        return contract;
    }
}