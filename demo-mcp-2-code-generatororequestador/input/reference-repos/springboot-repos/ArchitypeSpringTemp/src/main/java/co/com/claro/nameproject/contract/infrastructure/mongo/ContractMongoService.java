package co.com.claro.nameproject.contract.infrastructure.mongo;

import co.com.claro.nameproject.share.infraestructure.mongo.MongoService;
import co.com.claro.nameproject.contract.domain.dto.Contract;
import co.com.claro.nameproject.contract.infrastructure.mongo.document.ContractDocument;
import com.mongodb.client.MongoCollection;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class ContractMongoService {

    private final MongoService mongoService;
    private final ContractMongoRepository contractMongoRepository;


    @Autowired
    public ContractMongoService(MongoService mongoService, ContractMongoRepository contractMongoRepository) {
        this.mongoService = mongoService;
        this.contractMongoRepository = contractMongoRepository;
    }


    public List<Contract> findAllGeneric() {
        MongoCollection<Document> collection = this.getContractCollection();

        return StreamSupport.stream(collection.find().spliterator(), false)
                .map(this::convertDocumentToContract)
                .collect(Collectors.toList());
    }
    // @LogExecutionTime
    public List<ContractDocument> findAll() {
        return contractMongoRepository.findAll();
    }

    private Contract convertDocumentToContract(Document doc) {

        Contract contract = new Contract();
        contract.setId(doc.getString("id"));
        contract.setContractId(doc.getString("contractId"));
        contract.setStatus(doc.getString("status"));
        return contract;
    }

    public MongoCollection<Document> getContractCollection() {
        try {
            // Obtener la colección como Document
            return mongoService.getDatabase("DBArchitypeSpring_DE").getCollection("coll_contract");
        } catch (Exception e) {
            throw new RuntimeException("Failed to get contract collection", e);
        }
    }
}

