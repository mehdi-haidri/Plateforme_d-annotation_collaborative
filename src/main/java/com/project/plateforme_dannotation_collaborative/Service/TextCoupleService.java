package com.project.plateforme_dannotation_collaborative.Service;

import com.project.plateforme_dannotation_collaborative.Controller.Response;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.TextCoupleDTO;
import com.project.plateforme_dannotation_collaborative.Dto.Annotator.SaveTextCoupleDto;
import com.project.plateforme_dannotation_collaborative.Model.Annotation;
import com.project.plateforme_dannotation_collaborative.Model.Dataset;
import com.project.plateforme_dannotation_collaborative.Model.Task;
import com.project.plateforme_dannotation_collaborative.Model.TextCouple;
import com.project.plateforme_dannotation_collaborative.Repository.AnnotationRepository;
import com.project.plateforme_dannotation_collaborative.Repository.AnnotatorRepository;
import com.project.plateforme_dannotation_collaborative.Repository.TextCoupleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TextCoupleService {

    private final TextCoupleRepository textCoupleRepository;
    private final AnnotationRepository annotationRepository;
    private  final AnnotatorRepository annotatorRepository ;

    public List<TextCouple> getTextCouples(Dataset dataset) {
        return  textCoupleRepository.findAllByDataset(dataset);
    }

    public  TextCouple saveTextCouple(TextCouple textCouple) {

        return textCoupleRepository.save(textCouple);
    }

    public  List<TextCouple> saveTextCouples(List<TextCouple> textCouples) {
       return textCoupleRepository.saveAll(textCouples);
    }

    public Response getTextCoupleByTaskAndAnnotatorAndPage(Task task, Integer index) {

        Response response = new Response();
        response.setError(false);

        List <String> classes = task.getDataset().getClasses().stream().map( c  -> c.getName()).toList();
        Page <TextCouple> page =   textCoupleRepository.findByTask(task , PageRequest.of(index,1));
        TextCouple textCouple =  page.getContent().get(0);
        long totalPages = page.getTotalElements();
        response.getData().put("textCouple", textCouple);
        response.getData().put("classes", classes);
        response.getData().put("totalPages", totalPages);
        response.getData().put("annotated", false);
        response.getData().put("index" , index);
        Optional <Annotation> annotationOptional =annotationRepository.findAnnotationByTextCouple(textCouple);
        if(annotationOptional.isPresent()){
            response.getData().put("annotated", true);
            response.getData().put("currentClasse",annotationOptional.get().getClasse() );
        }
      return response;
    }

    public Boolean saveAnnotation(Long annotator_id, SaveTextCoupleDto data) {
        try{
        TextCouple textCouple = textCoupleRepository.findById(data.getTextCoupleId()).get();
        Annotation annotation =  annotationRepository.findAnnotationByTextCouple(textCouple).orElse(new Annotation());
        annotation.setAnnotator(annotatorRepository.findById(annotator_id).get());
        Dataset dataset = textCouple.getDataset();
        Task task = textCouple.getTask();

        if(data.getIndex() > task.getCheckpoint() || task.getCheckpoint() == 0 ){
            task.setCheckpoint(data.getIndex());
            task.setAdvancement(100 *(double) (task.getCheckpoint()+1)/ task.getSize());
            dataset.setAdvancement(dataset.getAdvancement()+1);
        }
        annotation.setTextCouple(textCouple);
        annotation.setClasse(data.getClasse());
        annotationRepository.save(annotation);
        return true;
        }catch (Exception e){
            System.out.println(e.getMessage());
            return false;
        }

    }

    public Response getTextCouplesByPage(Long datasetId, int pageIndex) {
        PageRequest pageRequest = PageRequest.of(pageIndex, 10);
        Page<TextCouple> page  = textCoupleRepository.findAllByDataset_Id(datasetId , pageRequest);

        Response response = new Response();
        response.setError(false);
        int totalPages = page.getTotalPages();
        response.getData().put("totalPages", totalPages);
        List<TextCouple > textCouples = page.getContent();
        List<TextCoupleDTO> textCoupleDTOS =textCouples.stream().map( t ->{
            Boolean annotated = false;
            String classe ="";
            Optional <Annotation> annotationOptional = annotationRepository.findAnnotationByTextCouple(t);
            if(annotationOptional.isPresent()){
                annotated = true;
                classe = annotationOptional.get().getClasse();
            }
            return  new TextCoupleDTO(
                    t.getId(),
                    t.getText1(),
                    t.getText2(),
                    annotated,
                    classe
                    );
        }).toList();

        response.getData().put("textCouples", textCoupleDTOS);

        return  response ;

    }
}
