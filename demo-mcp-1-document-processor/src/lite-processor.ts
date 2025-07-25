// Versión optimizada para ahorrar tokens
export interface CompactSpecification {
  src: string;           // sourceFile
  ts: number;           // timestamp
  ms: {                 // microservice
    n: string;          // name
    d: string;          // description
    p: number;          // port
  };
  db: string;           // database
  eps: Array<{          // endpoints
    m: string;          // method
    p: string;          // path
    ps: string[];       // parameters
  }>;
  ints: Array<{         // integrations
    n: string;          // name
    t: string;          // type
    c: string;          // connection
  }>;
}

export class LiteDocumentProcessor {
  async processCompact(filePath: string): Promise<CompactSpecification> {
    // Implementación optimizada que genera menos tokens
    // Solo extrae información esencial
    
    const workbook = xlsx.parse(filePath);
    const serviceName = this.extractServiceName(workbook[0]?.data || []);
    
    return {
      src: path.basename(filePath),
      ts: Date.now(),
      ms: {
        n: serviceName,
        d: "MS", // Descripción mínima
        p: 3001
      },
      db: this.detectDB(workbook),
      eps: this.extractEssentialEndpoints(workbook[1]?.data || []),
      ints: this.extractEssentialIntegrations(workbook.slice(2))
    };
  }

  private extractEssentialEndpoints(data: any[][]): any[] {
    // Solo endpoints críticos, sin detalles extras
    return [{
      m: "GET",
      p: this.findMainEndpoint(data),
      ps: this.findRequiredParams(data)
    }];
  }
}
