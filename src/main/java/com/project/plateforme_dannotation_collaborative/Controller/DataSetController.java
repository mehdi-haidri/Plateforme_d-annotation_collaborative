package com.project.plateforme_dannotation_collaborative.Controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.plateforme_dannotation_collaborative.Dto.Annotators_DatasetDto;
import com.project.plateforme_dannotation_collaborative.Dto.DataSetDto;
import com.project.plateforme_dannotation_collaborative.Dto.DatasetMinResposeDto;
import com.project.plateforme_dannotation_collaborative.Model.Dataset;
import com.project.plateforme_dannotation_collaborative.Service.DataSetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;



@RestController
@RequestMapping("/app/v1/datasets")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*")
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

    @PostMapping("/addAnnotators")
    public  ResponseEntity <?> addAnnotaors(@RequestBody Annotators_DatasetDto annotatorsDatasetDto){
        Response response = new Response();
        try{
           Dataset dataset = dataSetService.getDataset(annotatorsDatasetDto.getDatasetId());
           dataSetService.saveAnnotators(dataset , annotatorsDatasetDto.getAnnotators());
           if ( dataset == null || dataset.getAnnotated()) {
               throw new Exception("Dataset cannot be annotated");
           }
           dataset.setAnnotated(true);
           dataSetService.saveDateSet(dataset);
           response.setError(false);
           DatasetMinResposeDto datasetMinResposeDto  = new DatasetMinResposeDto(dataset.getId() ,
                   dataset.getName(),
                   dataset.getDescription() ,
                   dataset.getAdvancement(),
                   dataset.getAnnotated() ,
                   dataset.getSize(),
                   dataset.getClasses().size());
           response.getData().put("dataset", datasetMinResposeDto);
           return new ResponseEntity<>(response , HttpStatus.OK);
        }catch (Exception e){
            response.setError(true);
            response.getData().put("error", e.getMessage());
            return new ResponseEntity<>(response , HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @GetMapping("/datasets")
    public ResponseEntity <?> GetDatasets(){
        Response response = new Response();
        response.setError(false);
        List<DatasetMinResposeDto> datasets = dataSetService.getAllDatasets();
        response.getData().put("datasets", datasets);
        return new ResponseEntity<>(response , HttpStatus.OK);
    }
}
