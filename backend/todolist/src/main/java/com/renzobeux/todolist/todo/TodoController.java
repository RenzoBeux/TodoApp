package com.renzobeux.todolist.todo;

import com.renzobeux.todolist.user.User;
import com.renzobeux.todolist.user.UserDetailsImpl;
import com.renzobeux.todolist.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/todo")
public class TodoController {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public TodoController(TodoRepository todoRepository, UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @RequestParam(defaultValue = "all") String doneFilter,
            @RequestParam(defaultValue = "") String search
    ) {
        UserDetailsImpl user = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        long userId = user.getId();
        Sort sort = Sort.by("id").descending();
        Pageable paging = PageRequest.of(page, size, sort);
        if (search.isEmpty()) {
            if(doneFilter.equals("all")) {
                return ResponseEntity.ok(todoRepository.findAllByUserId(userId, paging));
            } else if(doneFilter.equals("done")) {
                return ResponseEntity.ok(todoRepository.findAllByUserIdAndDone(userId, true, paging));
            } else if(doneFilter.equals("notDone")) {
                return ResponseEntity.ok(todoRepository.findAllByUserIdAndDone(userId, false, paging));
            }
        } else {
            if(doneFilter.equals("all")) {
                return ResponseEntity.ok(todoRepository.findAllByUserIdAndContains(userId, search.toLowerCase(), paging));
            } else if(doneFilter.equals("done")) {
                return ResponseEntity.ok(todoRepository.findAllByUserIdAndContains(userId, search.toLowerCase(), true, paging));
            } else if(doneFilter.equals("notDone")) {
                return ResponseEntity.ok(todoRepository.findAllByUserIdAndContains(userId, search.toLowerCase(), false, paging));
            }
        }
        return ResponseEntity.ok(todoRepository.findAllByUserId(userId, paging));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody @NotNull Todo todo) {
        UserDetailsImpl userDet = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> user = userRepository.findById(userDet.getId());
        if (user.isPresent()) {
            todo.setUser(user.get());
            todoRepository.save(todo);
            return ResponseEntity.ok(todo);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody @NotNull Todo todo) {
        Optional<Todo> todoOptional = todoRepository.findById(id);
        if (todoOptional.isPresent()) {
            Todo todoToUpdate = todoOptional.get();
            todoToUpdate.setTitle(todo.getTitle());
            todoToUpdate.setDescription(todo.getDescription());
            todoToUpdate.setDone(todo.isDone());
            todoRepository.save(todoToUpdate);
            return ResponseEntity.ok(todoToUpdate);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        Optional<Todo> todoOptional = todoRepository.findById(id);
        if (todoOptional.isPresent()) {
            todoRepository.delete(todoOptional.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

}
