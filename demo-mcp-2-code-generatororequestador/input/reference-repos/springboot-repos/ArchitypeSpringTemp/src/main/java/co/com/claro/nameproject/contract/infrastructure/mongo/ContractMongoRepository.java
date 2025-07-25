package co.com.claro.nameproject.contract.infrastructure.mongo;

import co.com.claro.nameproject.contract.infrastructure.mongo.document.ContractDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContractMongoRepository  extends MongoRepository<ContractDocument, String> {}
