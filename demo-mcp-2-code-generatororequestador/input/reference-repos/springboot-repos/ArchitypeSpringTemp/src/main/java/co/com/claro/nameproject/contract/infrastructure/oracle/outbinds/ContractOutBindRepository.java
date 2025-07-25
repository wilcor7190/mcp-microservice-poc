package co.com.claro.nameproject.contract.infrastructure.oracle.outbinds;

import co.com.claro.nameproject.contract.domain.dto.Contract;
import co.com.claro.nameproject.contract.domain.dto.StudentAgeRangeRequest;

import java.sql.SQLException;
import java.util.List;

public interface ContractOutBindRepository {
    List<Contract> getContractByAgeRangePrc(StudentAgeRangeRequest payload) throws IllegalAccessException, SQLException;
}
