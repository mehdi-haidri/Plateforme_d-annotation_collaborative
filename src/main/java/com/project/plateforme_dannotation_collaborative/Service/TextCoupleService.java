package com.project.plateforme_dannotation_collaborative.Service;

import com.project.plateforme_dannotation_collaborative.Model.Dataset;
import com.project.plateforme_dannotation_collaborative.Model.TextCouple;
import com.project.plateforme_dannotation_collaborative.Repository.TextCoupleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TextCoupleService {

    private final TextCoupleRepository textCoupleRepository;


    public List<TextCouple> getTextCouples(Dataset dataset) {
        return  textCoupleRepository.findAllByDataset(dataset);
    }
    public  TextCouple saveTextCouple(TextCouple textCouple) {

        return textCoupleRepository.save(textCouple);
    }

    public  List<TextCouple> saveTextCouples(List<TextCouple> textCouples) {
       return textCoupleRepository.saveAll(textCouples);
    }

}
