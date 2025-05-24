package com.project.plateforme_dannotation_collaborative.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.plateforme_dannotation_collaborative.Controller.Response;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.DataSetDto;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.DatasetDetailsDto;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.DatasetMinResposeDto;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.TaskDto;
import com.project.plateforme_dannotation_collaborative.Exception.CustomhandleMethodArgumentNotValidException;
import com.project.plateforme_dannotation_collaborative.Model.*;
import com.project.plateforme_dannotation_collaborative.Repository.DataSetRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class DataSetService {
    private final DataSetRepository dataSetRepository;
    private final UserSevice userSevice;
    private final TextCoupleService textCoupleService;
    private  final TaskService taskService;
    private  final  FileStorageService fileStorageService;


    @Transactional(rollbackOn = CustomhandleMethodArgumentNotValidException.class)
    public Dataset saveDateSet(DataSetDto dataSetDto) throws IOException , CustomhandleMethodArgumentNotValidException{

        if (dataSetDto.getClasses().isEmpty() || dataSetDto.getClasses().size() < 2){
            HashMap<String ,String> errors = new HashMap<>();
            errors.put("classes", "class should in the form of A;B;... ");
            throw new CustomhandleMethodArgumentNotValidException(errors);
        }
        Dataset dataset =  dataSetRepository.save(DtoToDataseet(dataSetDto));
        System.out.println(dataSetDto.getFile().getOriginalFilename());
        if(dataSetDto.getFile().getOriginalFilename().endsWith(".csv")){
           dataset = parseAndSaveCsvIndex(dataSetDto.getFile() ,dataset);
        }else if(dataSetDto.getFile().getOriginalFilename().endsWith(".json")){
            dataset  = parseAndSaveJson(dataSetDto.getFile() ,dataset);
        }else {
            HashMap<String ,String> errors = new HashMap<>();
            errors.put("file", "Only CSV and Json file allowed");
            throw new CustomhandleMethodArgumentNotValidException(errors);
        }
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


    public void saveAnnotators(Dataset dataset, List<Long> annotatorsIds ,  Date datelimit)  throws CustomhandleMethodArgumentNotValidException {
        LocalDate today = LocalDate.now();
        LocalDate dateLimit = datelimit.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        if(dateLimit.isBefore(today)) {
            HashMap <String ,String> errros  = new HashMap();
            errros.put("datelimit", "date limit not valid");
            throw new CustomhandleMethodArgumentNotValidException(errros);
        }
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

    public Dataset parseAndSaveCsvName(MultipartFile file  ,Dataset dataset) throws IOException {

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

    public Dataset parseAndSaveCsvIndex(MultipartFile file, Dataset dataset) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withTrim())) {

            int size = 0;

            boolean isFirstRow = true;
            for (CSVRecord csvRecord : csvParser) {
                // Assuming index 1 is text1 and index 2 is text2 (0-based indexing)

                if (csvRecord.size() < 3) continue; // Skip if the row doesn't have enough columns
                if (isFirstRow) {
                    isFirstRow = false;
                    continue;
                }
                String text1 = csvRecord.get(1); // 2nd column
                String text2 = csvRecord.get(2); // 3rd column

                TextCouple line = new TextCouple();
                line.setText1(text1);
                line.setText2(text2);
                line.setDataset(dataset);
                textCoupleService.saveTextCouple(line);

                size++;
            }

            dataset.setSize(size);
        }

        return dataset;
    }

    public Dataset parseAndSaveJson(MultipartFile file, Dataset dataset) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        int size = 0;

        // Read the JSON array from the file
        JsonNode rootNode = objectMapper.readTree(file.getInputStream());
        if (rootNode.isArray()) {
            for (JsonNode node : rootNode) {
                String text1 = node.get("text1").asText();
                String text2 = node.get("text2").asText();

                TextCouple line = new TextCouple();
                line.setText1(text1);
                line.setText2(text2);
                line.setDataset(dataset);
                textCoupleService.saveTextCouple(line);
                size++;
            }
        }

        dataset.setSize(size);
        return dataset;
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

    private String escapeCsv(String value) {
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            value = value.replace("\"", "\"\"");
            return "\"" + value + "\"";
        }
        return value;
    }

    public File GetAnnotattedDatasetFile(Long id) {
        try {
            Dataset dataset = dataSetRepository.findById(id).orElseThrow(() -> new RuntimeException("Dataset not found"));

            String filename = dataset.getName() + dataset.getId() + ".csv";

            File datasetFile = new File("uploads/" + filename);

            if (datasetFile.createNewFile()) {
                System.out.println("File created: " + datasetFile.getAbsolutePath());
                List< TextCouple> textCouples =  dataset.getTextCouples();
                System.out.println(textCouples.size());
                try (FileWriter writer = new FileWriter(datasetFile, true)) {
                    writer.write("id,text1,text2,label\n");  // Add newline here
                    int i = 1;
                    for (TextCouple textCouple : textCouples) {
                        writer.write(i + "," + escapeCsv(textCouple.getText1()) + "," + escapeCsv(textCouple.getText2()) + "," + textCouple.getAnnotation().getClasse() + "\n");
                        i++;
                    }
                }
            } else {
                System.out.println("File already exists: " + datasetFile.getAbsolutePath());
                datasetFile = fileStorageService.getFile(filename);
            }

            return datasetFile;

        }catch ( IOException e){
            throw new RuntimeException(e);
        }

    }


    public Response getAllDatasetsByPage(int pageINdex) {
        Response response = new Response();
        PageRequest pageRequest = PageRequest.of(pageINdex, 6);
        Page<Dataset> page = dataSetRepository.findAll(pageRequest);
        int totalPages = page.getTotalPages();
        List<DatasetMinResposeDto> datasets =  page.stream().map(dataset ->
                        new DatasetMinResposeDto(dataset.getId()
                                , dataset.getName()
                                , dataset.getDescription()
                                , dataset.getAdvancement()
                                , dataset.getAnnotated()
                                , dataset.getSize() , dataset.getClasses().size())).toList();
        response.getData().put("datasets", datasets);
        response.getData().put("totalPages", totalPages);
        return  response;

    }

    public void deleteDataset(Long id)  {

         dataSetRepository.deleteById(id);

    }
}
