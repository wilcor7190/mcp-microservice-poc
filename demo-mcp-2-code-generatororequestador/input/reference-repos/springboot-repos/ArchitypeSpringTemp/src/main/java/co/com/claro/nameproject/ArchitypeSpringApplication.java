package co.com.claro.nameproject;

import co.com.claro.apm.ElasticApmConfig;
import co.com.claro.nameproject.share.domain.common.Constants;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Clase con método principal para la ejecución del servicio
 */
@ComponentScan(basePackages = {
		"co.com.claro.nameproject",
		"co.com.claro.nameproject.share.domain",
		"co.com.claro.nameproject.contract.infrastructure",
		"co.com.claro.log",
		"co.com.claro.http",
		"co.com.claro.nameproject.healthCheck"})
@SpringBootApplication
@EnableMongoRepositories(basePackages = "co.com.claro.nameproject.contract.infrastructure.mongo")

public class ArchitypeSpringApplication implements WebMvcConfigurer {
	
	public static void main(String[] args) {
		SpringApplication.run(ArchitypeSpringApplication.class, args);
		ElasticApmConfig.init();
	}

	@Override
	public void configurePathMatch(PathMatchConfigurer configurer) {
		// Configurar prefijo global para todas las rutas
		configurer.addPathPrefix(Constants.SERVICE_PREFIX, c -> true); // Aplica el prefijo a todos los controladores
	}

}
