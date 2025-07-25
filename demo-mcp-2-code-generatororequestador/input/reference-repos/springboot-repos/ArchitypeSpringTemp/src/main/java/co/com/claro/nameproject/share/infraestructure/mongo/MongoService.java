package co.com.claro.nameproject.share.infraestructure.mongo;

import com.mongodb.MongoException;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MongoService {
    private final MongoClient mongoClient;

    public MongoService(@Value("${spring.data.mongodb.uri}") String mongoUri) {
        try {
            this.mongoClient = MongoClients.create(mongoUri);
        } catch (MongoException ex) {
            throw new MongoException("Failed to connect to MongoDB: " + ex.getMessage(), ex);
        }
    }

    public MongoDatabase getDatabase(String databaseName) {
        try {
            return mongoClient.getDatabase(databaseName);
        } catch (MongoException ex) {
            throw new MongoException("Failed to get MongoDB database: " + ex.getMessage(), ex);
        }
    }

    @PreDestroy
    public void close() {
        if (mongoClient != null) {
            mongoClient.close();
        }
    }
}