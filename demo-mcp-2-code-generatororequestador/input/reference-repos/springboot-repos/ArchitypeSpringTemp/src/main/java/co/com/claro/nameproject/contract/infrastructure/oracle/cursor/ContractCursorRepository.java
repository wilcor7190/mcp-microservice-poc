package co.com.claro.nameproject.contract.infrastructure.oracle.cursor;


import co.com.claro.nameproject.contract.domain.dto.Contract;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractCursorRepository {
    List<Contract> findAll();
}
