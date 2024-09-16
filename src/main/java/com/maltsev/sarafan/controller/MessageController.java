package com.maltsev.sarafan.controller;

//import com.maltsev.sarafan.exceptions.NotFoundException;
//import com.maltsev.sarafan.repo.MessageRepo;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("message")
//public class MessageController {
//    private final MessageRepo messageRepo;
//
//private int counter=4;
//
//        private List<Map<String,String>> messages=new ArrayList<Map<String,String>>(){{
//            add(new HashMap<String,String>(){{put("id","1");put("text","Первое сообщение");}});
//            add(new HashMap<String,String>(){{put("id","2");put("text","Второе сообщение");}});
//            add(new HashMap<String,String>(){{put("id","3");put("text","Третье сообщение");}});
//            System.out.println("негр");
//        }};
//
//    @GetMapping
//    public List<Map<String,String>> list(){return messages;}
//
//    @GetMapping("{id}")
//    public Map<String,String> getOne(@PathVariable String id){
//        return getMessage(id);
//    }
//
//    public Map<String,String> getMessage(@PathVariable String id){
//        return messages.stream()
//                .filter(message ->message.get("id").equals(id))
//                .findFirst()
//                .orElseThrow(NotFoundException::new);
//    }
//
//
//    @PostMapping
//    public Map<String,String> create(@RequestBody Map<String,String> message){
//        message.put("id",String.valueOf(counter++));
//        messages.add(message);
//        return message;
//    }
//
//    @PutMapping("{id}")
//    public Map<String,String> update(@PathVariable String id, @RequestBody Map<String,String> message){
//        Map<String,String> messageFromDb=getMessage(id);
//        messageFromDb.putAll(message);
//        messageFromDb.put("id",id);
//        return messageFromDb;
//    }
//
//    @DeleteMapping("{id}")
//    public void delete(@PathVariable String id){
//        Map<String, String> message = getMessage(id);
//messages.remove(message);
//    }
//}

import com.fasterxml.jackson.annotation.JsonView;
import com.maltsev.sarafan.domain.Message;
import com.maltsev.sarafan.domain.Views;
import com.maltsev.sarafan.exceptions.NotFoundException;
import com.maltsev.sarafan.repo.MessageRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("message")
public class MessageController {


    @Autowired
    private final MessageRepo messageRepo;


    @Autowired
    public MessageController(MessageRepo messageRepo){
    this.messageRepo=messageRepo;
}



@GetMapping
@JsonView(Views.IdName.class)
    public List<Message> list(){return messageRepo.findAll();}

    @GetMapping("{id}")
    @JsonView(Views.FullMessage.class)
    public Message getOne(@PathVariable("id") Message message){
    return message;
    }

    @PostMapping
    public Message create(@RequestBody Message message){
    message.setCreationDate(LocalDateTime.now());
    return messageRepo.save(message);
    }

    @PutMapping("{id}")
    public Message update(@PathVariable("id") Message messageFromDb,
                          @RequestBody Message message){
        BeanUtils.copyProperties(message,messageFromDb,"id");
        return messageRepo.save(messageFromDb);

    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Message message){
    messageRepo.delete(message);
    }

}
