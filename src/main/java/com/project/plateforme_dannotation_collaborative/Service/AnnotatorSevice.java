package com.project.plateforme_dannotation_collaborative.Service;

import com.project.plateforme_dannotation_collaborative.Controller.Response;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.AnnotatorsMinResponseDto;
import com.project.plateforme_dannotation_collaborative.Model.Annotator;
import com.project.plateforme_dannotation_collaborative.Repository.AnnotatorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnotatorSevice {
    private final AnnotatorRepository annotatorRepository;

    public List<AnnotatorsMinResponseDto> getAnnotatorsByState(Boolean b) {

        List<Annotator>  annotators  = annotatorRepository.findByState(b);

        return annotators.stream().map( a -> new AnnotatorsMinResponseDto(
                a.getId() ,
                a.getLastName(),
                a.getFirstName(),
                a.getState(),
                a.getEmail()
        )).toList();
    }

    public Response getAllAnnotators(int pageIndex) {
        PageRequest pageRequest = PageRequest.of(pageIndex, 10);
        Page<Annotator> page = annotatorRepository.findAll(pageRequest);
        int totalPages = page.getTotalPages();
        List<Annotator>  annotatorsPage  = page.getContent();
        Response response = new Response();

        List<AnnotatorsMinResponseDto>  annotators = annotatorsPage.stream().map( a -> new AnnotatorsMinResponseDto(
                a.getId() ,
                a.getLastName(),
                a.getFirstName(),
                a.getState(),
                a.getEmail()
        )).toList();

        response.getData().put("totalPages", totalPages);
        response.getData().put("annotators", annotators);
        return response;
    }

    public AnnotatorsMinResponseDto  getAnnotatorDtoById(Long id) {
        Annotator annotator = annotatorRepository.findById(id).orElse(new Annotator());
        return new AnnotatorsMinResponseDto(
                annotator.getId(),
                annotator.getLastName(),
                annotator.getFirstName(),
                annotator.getState(),
                annotator.getEmail());
    }
    public Annotator  getAnnotatorById(Long id) {
        return annotatorRepository.findById(id).orElse(new Annotator());
    }

    public void save(Annotator annotator) {
        annotatorRepository.save(annotator);
    }
}
