package com.project.plateforme_dannotation_collaborative.Service;

import com.project.plateforme_dannotation_collaborative.Dto.Admin.DataSetDto;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.DatasetDetailsDto;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.DatasetMinResposeDto;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.TaskDto;
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
import java.util.Date;
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
        System.out.println("after");

       if(!dataSetDto.getAnnotators().isEmpty()){
           saveAnnotators(dataset, dataSetDto.getAnnotators() , dataSetDto.getDatelimit());
           dataset.setAnnotated(true);
       }

       dataSetRepository.save(dataset);
       return dataset;
    }

    public  Dataset saveDateSet(Dataset dataset) {
        return  dataSetRepository.save(dataset);
    }
    public void saveAnnotators(Dataset dataset, List<Long> annotatorsIds ,  Date datelimit) {
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
            newTask.setLimitDate(datelimit);
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
             int size = 0;
             for (CSVRecord csvRecord : csvParser) {
                 size++;
                String text1 = csvRecord.get("text1");
                String text2 = csvRecord.get("text2");
                TextCouple line = new TextCouple();
                line.setText1(text1);
                line.setText2(text2);
                line.setDataset(dataset);
                textCoupleService.saveTextCouple(line);
            }
             dataset.setSize(size);
        }

        return  dataset;
    }

    public Dataset getDataset(Long id){
          Dataset dataset =dataSetRepository.findById(id).orElse(new Dataset());
          return  dataset;
    }

    public DatasetDetailsDto getDatasetDetails(Long id){
        Dataset dataset =dataSetRepository.findById(id).orElse(new Dataset());
        Date date = dataset.getTasks().isEmpty() ?   null : dataset.getTasks().get(0).getLimitDate();
        List<Long> annotators = dataset.getTasks().stream().map( t -> t.getAnnotator().getId()).toList();
        List<String> classes = dataset.getClasses().stream().map(Classes::getName).toList();

        return new DatasetDetailsDto(
                dataset.getId() ,
                date ,
                dataset.getSize(),
                dataset.getName() ,
                dataset.getDescription() ,
                classes,annotators ,dataset.getAdvancement() ,
                dataset.getTasks().stream().map(t -> new TaskDto(t.getId() , t.getLimitDate() , t.getAdvancement() ,t.getSize() ,t.getAnnotator().getFirstName()+" "+ t.getAnnotator().getLastName())).toList());
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
