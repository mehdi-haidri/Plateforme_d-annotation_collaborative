package com.project.plateforme_dannotation_collaborative.Service;

import com.project.plateforme_dannotation_collaborative.Dto.Admin.AnnotatorsMinResponseDto;
import com.project.plateforme_dannotation_collaborative.Model.Annotator;
import com.project.plateforme_dannotation_collaborative.Repository.AnnotatorRepository;
import lombok.RequiredArgsConstructor;
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
                a.getState()
        )).toList();
    }

    public List<AnnotatorsMinResponseDto> getAllAnnotators() {
        List<Annotator>  annotators  = annotatorRepository.findAll();

        return annotators.stream().map( a -> new AnnotatorsMinResponseDto(
                a.getId() ,
                a.getLastName(),
                a.getFirstName(),
                a.getState()
        )).toList();
    }

    public AnnotatorsMinResponseDto  getAnnotatorDtoById(Long id) {
        Annotator annotator = annotatorRepository.findById(id).orElse(new Annotator());
        return new AnnotatorsMinResponseDto(annotator.getId(), annotator.getLastName(), annotator.getFirstName(), annotator.getState());
    }
    public Annotator  getAnnotatorById(Long id) {
        return annotatorRepository.findById(id).orElse(new Annotator());
    }
}
