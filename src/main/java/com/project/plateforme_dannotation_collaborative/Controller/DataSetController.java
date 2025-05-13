package com.project.plateforme_dannotation_collaborative.Controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.plateforme_dannotation_collaborative.Dto.DataSetDto;
import com.project.plateforme_dannotation_collaborative.Model.Dataset;
import com.project.plateforme_dannotation_collaborative.Service.DataSetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;



@RestController
@RequestMapping("/app/v1/datasets")
@RequiredArgsConstructor
public class DataSetController {

    private final DataSetService dataSetService;

    @PostMapping("/addDataSet")
    public ResponseEntity <?> AddDataSet( @RequestPart("name") String name,
                                          @RequestPart("description") String description,
                                          @RequestPart("classes") String classesJson,
                                          @RequestPart("annotators") String annotatorsJson,
                                          @RequestPart("file") MultipartFile file)  {

        Response response = new Response();
        try {
        ObjectMapper objectMapper = new ObjectMapper();
        DataSetDto dto = new DataSetDto();
        dto.setName(name);
        dto.setDescription(description);
        dto.setFile(file);
        dto.setAnnotators(objectMapper.readValue(annotatorsJson, new TypeReference<List<Long>>() {}));
        dto.setClasses(objectMapper.readValue(classesJson, new TypeReference<List<String>>(){}));
        Dataset newDataset= dataSetService.saveDateSet(dto);
        response.setError(false);
        response.getData().put("dataset", newDataset);
        return new ResponseEntity<>(response , HttpStatus.OK);
        }catch (Exception e){
           response.setError(true);
           response.getData().put("error", e.getMessage());
           return new ResponseEntity<>(response , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
