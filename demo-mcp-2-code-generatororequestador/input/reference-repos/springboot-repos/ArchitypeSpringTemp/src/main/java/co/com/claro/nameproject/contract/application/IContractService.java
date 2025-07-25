package co.com.claro.nameproject.contract.application;

import co.com.claro.nameproject.contract.domain.dto.Contract;
import co.com.claro.nameproject.share.domain.dto.apiResponseDto;
import co.com.claro.nameproject.contract.domain.dto.ResponseService;
import co.com.claro.nameproject.contract.domain.dto.StudentAgeRangeRequest;

import java.sql.SQLException;
import java.util.List;

public interface IContractService {
    apiResponseDto<List<ResponseService>> findAll() throws SQLException;
    apiResponseDto<List<Contract>> getContractByAgeRangePrc(StudentAgeRangeRequest payload) throws IllegalAccessException, SQLException;
}
