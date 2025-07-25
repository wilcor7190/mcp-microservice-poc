export interface ISKUSond {
    "@type": string
    channel: Channel
    productConfiguration: ProductConfiguration
  }
  
  export interface Channel {
    "@type": string
    href: string
    id: string
    name: string
  }
  
  export interface ProductConfiguration {
    contextCharacteristic: ContextCharacteristic
  }
  
  export interface ContextCharacteristic {
    "@type": string
    name: string
    value: Value
  }
  
  export interface Value {
    "@type": string
    parentMaterial: string
    childMaterial: string
    parentMaterialDescription: string
    articleGroup: string
    articleGroupDescription: string
    materialType: string
    materialTypeDescription: string
    brand: string
    productCost: string
    length: string
    width: string
    height: string
    weight: string
  }
  