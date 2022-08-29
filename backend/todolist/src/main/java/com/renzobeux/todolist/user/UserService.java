package com.renzobeux.todolist.user;


import org.springframework.stereotype.Service;

@Service
final class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User update(User user) {
        return userRepository.save(user);
    }
}