package co.com.claro.nameproject.share.infraestructure.oracle;

import co.com.claro.nameproject.contract.domain.dto.Contract;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;
import co.com.claro.log.LogExecutionTime;
import co.com.claro.apm.APMSpan;
import java.lang.reflect.Field;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OracleService {

    private static final Logger LOGGER = LoggerFactory.getLogger(OracleService.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @APMSpan
    @LogExecutionTime
    public Map<String, Object> execute(String prcName, Object request, Boolean isCursor, String cursorName) throws IllegalAccessException {
//        LOGGER.info("Inicio de consumo del procedimiento");
        List<Map<String, ?>> data = convertRequest(request);
        Map<String, Object> requestMap = (Map<String, Object>) data.get(0);
        Map<String, SqlParameter> sqlParameters = (Map<String, SqlParameter>) data.get(1);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName(prcName)
                .declareParameters(sqlParameters.values().toArray(new SqlParameter[0]));
        if (isCursor && !cursorName.isEmpty()) {
            simpleJdbcCall.declareParameters(new SqlOutParameter(cursorName, Types.REF_CURSOR, new contractResultSetExtractor()));
        }
        return simpleJdbcCall.execute(requestMap);
    }

    @APMSpan
    @LogExecutionTime
    public List<Contract> queryToList(String SQL, RowMapper<Contract> mapper) {
        return jdbcTemplate.query(SQL, mapper);
    }

    @APMSpan
    @LogExecutionTime
    public static List<Map<String, ?>> convertRequest(Object object) throws IllegalAccessException {
        Map<String, Object> map = new HashMap<>();
        Map<String, SqlParameter> sqlParameters = new HashMap<>();
        for (Field field : object.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            String fieldName = field.getName();
            Object fieldValue = field.get(object);
            int sqlType = determineSqlType(fieldValue); // Determine SQL type based on value
            sqlParameters.put(fieldName, new SqlParameter(fieldName, sqlType));
            map.put(fieldName, fieldValue);
        }
        List<Map<String, ?>> list = new ArrayList<>();
        list.add(map);
        list.add(sqlParameters);
        return list;
    }

    @APMSpan
    @LogExecutionTime
    private static int determineSqlType(Object value) {
        if (value instanceof Integer) {
            return Types.INTEGER;
        } else if (value instanceof String) {
            return Types.VARCHAR;
        } else if (value instanceof Double) {
            return Types.DOUBLE;
        } else {
            // Handle other data types or throw an exception
            throw new IllegalArgumentException("Unsupported data type for request parameter: " + value.getClass().getName());
        }
    }


    private static class contractResultSetExtractor implements ResultSetExtractor<List<Map<String, Object>>> {

        @Override
        public List<Map<String, Object>> extractData(ResultSet rs) throws SQLException {
            List<Map<String, Object>> contract = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> contractObj = new HashMap<>();
                contractObj.put("id", rs.getString("id"));
                contractObj.put("contractid", rs.getString("contractid"));
                contractObj.put("status", rs.getString("status"));
                // ... agregar más columnas según la estructura de la tabla 'CONTRACT'
                contract.add(contractObj);
            }
            return contract;
        }
    }
}