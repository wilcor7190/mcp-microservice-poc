package co.com.claro.nameproject.contract.domain.dto;


import jakarta.xml.bind.annotation.*;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
        "numberToWordsResult"
})
@XmlRootElement(name = "NumberToWordsResponse")
public class NumberToWordsResponse {

    @XmlElement(name = "NumberToWordsResult")
    protected String numberToWordsResult;

    /**
     * Obtiene el valor de la propiedad numberToWordsResult.
     * * @return
     * possible object is
     * {@link String }
     * */
    public String getNumberToWordsResult() {
        return numberToWordsResult;
    }


}