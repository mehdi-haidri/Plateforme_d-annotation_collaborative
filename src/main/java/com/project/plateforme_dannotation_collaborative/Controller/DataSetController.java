package com.project.plateforme_dannotation_collaborative.Controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.*;
import com.project.plateforme_dannotation_collaborative.Exception.CustomhandleMethodArgumentNotValidException;
import com.project.plateforme_dannotation_collaborative.Model.Dataset;
import com.project.plateforme_dannotation_collaborative.Service.DataSetService;
import com.project.plateforme_dannotation_collaborative.Service.TextCoupleService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;



@RestController
@RequestMapping("/app/v1/datasets")
@RequiredArgsConstructor
@Transactional()
public class DataSetController {

    private final DataSetService dataSetService;
    private final TextCoupleService textCoupleService;

    @PostMapping("/addDataset")
    public ResponseEntity <?> AddDataSet( @Valid @ModelAttribute DatasetRequestDto dataSetRequestDto) throws CustomhandleMethodArgumentNotValidException {

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
        }catch (IOException e){
           response.setError(true);
           response.getData().put("error", e.getMessage());
           return new ResponseEntity<>(response , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addAnnotators")
    public  ResponseEntity <?> addAnnotaors(@RequestBody Annotators_DatasetDto annotatorsDatasetDto) throws CustomhandleMethodArgumentNotValidException {
        Response response = new Response();

           Dataset dataset = dataSetService.getDataset(annotatorsDatasetDto.getDatasetId());
           dataSetService.saveAnnotators(dataset , annotatorsDatasetDto.getAnnotators() , annotatorsDatasetDto.getDatelimit());
           /*if ( dataset == null || dataset.getAnnotated()) {
               throw new Exception("Dataset cannot be annotated");
           }*/
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


    }


     // or hasAuthority('ROLE_ADMIN')
/*
     @PreAuthorize("hasRole('ADMIN')")
*/
    @GetMapping("/datasets/{page}")
    public ResponseEntity <?> GetDatasets( @PathVariable int page){

        Response response = dataSetService.getAllDatasetsByPage(page);
        response.setError(false);
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


    @GetMapping("/download/{id}")
    public ResponseEntity <?> DownloadDataset(@PathVariable Long id) throws FileNotFoundException {
        Response response = new Response();
        response.setError(false);
        File file  = dataSetService.GetAnnotattedDatasetFile(id);
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + file.getName())
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(file.length())
                .body(resource);
    }


    @GetMapping("/dataset/{id}/textCouples/{page}")
    public ResponseEntity <?> getTextCoupels(@PathVariable int page , @PathVariable Long id){
        Response response = textCoupleService.getTextCouplesByPage(id , page);
        return  new ResponseEntity<>(response , HttpStatus.OK);

    }

    @DeleteMapping("/dataset/{id}")
    public ResponseEntity<?> deleteDataset(@PathVariable Long id){
        dataSetService.deleteDataset(id);
        return  ResponseEntity.ok("Dataset deleted successfully");
    }
}
