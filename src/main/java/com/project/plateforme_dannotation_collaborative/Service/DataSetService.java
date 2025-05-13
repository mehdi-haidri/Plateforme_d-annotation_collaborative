package com.project.plateforme_dannotation_collaborative.Service;

import com.project.plateforme_dannotation_collaborative.Dto.DataSetDto;
import com.project.plateforme_dannotation_collaborative.Dto.DatasetMinResposeDto;
import com.project.plateforme_dannotation_collaborative.Model.*;
import com.project.plateforme_dannotation_collaborative.Repository.DataSetRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;

import java.util.Collections;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DataSetService {
    private final DataSetRepository dataSetRepository;
    private final UserSevice userSevice;
    private final TextCoupleService textCoupleService;
    private  final TaskService taskService;

    public Dataset saveDateSet(DataSetDto dataSetDto) throws IOException {

       Dataset dataset =  dataSetRepository.save(DtoToDataseet(dataSetDto));
       dataset = parseAndSaveCsv(dataSetDto.getFile() ,dataset);

       if(!dataSetDto.getAnnotators().isEmpty()){
           saveAnnotators(dataset, dataSetDto.getAnnotators());
           dataset.setAnnotated(true);
       }

       dataSetRepository.save(dataset);
       return dataset;
    }

    public  Dataset saveDateSet(Dataset dataset) {
        return  dataSetRepository.save(dataset);
    }
    public void saveAnnotators(Dataset dataset, List<Long> annotatorsIds) {
        List<Annotator> annotators = userSevice.findAllAnnotatorsById(annotatorsIds);
        List <TextCouple> textCouples = textCoupleService.getTextCouples(dataset);
        Collections.shuffle(textCouples);
        int shunkSize = (int) Math.ceil((double) textCouples.size() / annotators.size());
        int startIndex = 0;
        for (Annotator annotator : annotators) {
            int endIndex = Math.min(textCouples.size(), startIndex + shunkSize);
            List<TextCouple> newTextCouples = textCouples.subList(startIndex, endIndex);
            Task newTask =  new Task();
            newTask.setAnnotator(annotator);
            newTask.setDataset(dataset);
            newTask.setSize(newTextCouples.size());
            newTask.setAdvancement(0d);
            Task savedTask  = taskService.saveTask(newTask);
            newTextCouples.forEach(textCouple -> textCouple.setTask(savedTask));
            textCoupleService.saveTextCouples(newTextCouples);
            startIndex += shunkSize;
        }
    }
    private Dataset DtoToDataseet(DataSetDto dataSetDto) {
        Dataset dataset = new Dataset();
        dataset.setName(dataSetDto.getName());
        dataset.setDescription(dataSetDto.getDescription());
        List<Classes> classes = new ArrayList<>();
        dataSetDto.getClasses().forEach(classe -> {
            Classes newClass = new Classes();
            newClass.setDataset(dataset);
            newClass.setName(classe);
            classes.add(newClass);
        });
        dataset.setClasses(classes);
        return dataset;
    }
    public Dataset parseAndSaveCsv(MultipartFile file  ,Dataset dataset) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withTrim())) {
             dataset.setSize(csvParser.getRecords().size());
             for (CSVRecord csvRecord : csvParser) {
                String text1 = csvRecord.get("text1");
                String text2 = csvRecord.get("text2");
                TextCouple line = new TextCouple();
                line.setText1(text1);
                line.setText2(text2);
                line.setDataset(dataset);
                textCoupleService.saveTextCouple(line);
            }
        }

        return  dataset;
    }

    public Dataset getDataset(Long id){
        return  dataSetRepository.findById(id).orElse(null);
    }

    public List<DatasetMinResposeDto> getAllDatasets() {

       List<Dataset> datasets  = dataSetRepository.findAll();
       return  datasets.stream()
               .map(dataset ->
                       new DatasetMinResposeDto(dataset.getId()
                               , dataset.getName()
                               , dataset.getDescription()
                               , dataset.getAdvancement()
                               , dataset.getAnnotated()
                               , dataset.getSize() , dataset.getClasses().size()))
               .toList();
    }
}
