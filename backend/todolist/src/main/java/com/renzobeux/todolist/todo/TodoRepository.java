package com.renzobeux.todolist.todo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    Page<Todo> findAllByUserId(long userId, Pageable pageable);

    Page<Todo> findAllByUserIdAndDone(long userId, Boolean done, Pageable pageable);

    @Query("SELECT t FROM Todo t WHERE t.user.id = ?1 AND t.done = ?3 AND (LOWER(t.title) LIKE %?2% OR LOWER(t.description) LIKE %?2%)")
    Page<Todo> findAllByUserIdAndContains(long userId, String search, Boolean done, Pageable pageable);

    @Query("SELECT t FROM Todo t WHERE t.user.id = ?1 AND (LOWER(t.title) LIKE %?2% OR LOWER(t.description) LIKE %?2%)")
    Page<Todo> findAllByUserIdAndContains(long userId, String search, Pageable pageable);



}

