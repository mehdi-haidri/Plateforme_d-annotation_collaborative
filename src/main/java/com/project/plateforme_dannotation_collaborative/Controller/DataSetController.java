package com.project.plateforme_dannotation_collaborative.Controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.plateforme_dannotation_collaborative.Dto.*;
import com.project.plateforme_dannotation_collaborative.Model.Dataset;
import com.project.plateforme_dannotation_collaborative.Service.DataSetService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;



@RestController
@RequestMapping("/app/v1/datasets")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*")
public class DataSetController {

    private final DataSetService dataSetService;

    @PostMapping("/addDataset")
    public ResponseEntity <?> AddDataSet( @Valid @ModelAttribute  DatasetRequestDto dataSetRequestDto)  {

        Response response = new Response();
        try {
        ObjectMapper objectMapper = new ObjectMapper();
        DataSetDto dto = new DataSetDto();
        dto.setName(dataSetRequestDto.getName());
        dto.setDescription(dataSetRequestDto.getDescription());
        dto.setFile(dataSetRequestDto.getFile());
        dto.setDatelimit(dataSetRequestDto.getDatelimit());
        dto.setAnnotators(objectMapper.readValue(dataSetRequestDto.getAnnotators(), new TypeReference<List<Long>>() {}));
        dto.setClasses(objectMapper.readValue(dataSetRequestDto.getClasses(), new TypeReference<List<String>>(){}));
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
           dataSetService.saveAnnotators(dataset , annotatorsDatasetDto.getAnnotators() , annotatorsDatasetDto.getDatelimit());
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

    @GetMapping("/{id}")
    public ResponseEntity <?> GetDataset(@PathVariable Long id){
        Response response = new Response();
        response.setError(false);
        DatasetDetailsDto dataset = dataSetService.getDatasetDetails(id);
        response.getData().put("dataset" , dataset);
        return new ResponseEntity<>(response , HttpStatus.OK);
    }
}
