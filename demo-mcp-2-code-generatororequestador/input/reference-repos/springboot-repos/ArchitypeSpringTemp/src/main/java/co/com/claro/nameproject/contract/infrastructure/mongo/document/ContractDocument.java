package co.com.claro.nameproject.contract.infrastructure.mongo.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Builder
@Getter
@AllArgsConstructor
@Document(collection = "coll_contract")
public class ContractDocument {
    @Field("id")
    private String id;
    private String contractId;
    private String status;
}
