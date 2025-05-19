package com.project.plateforme_dannotation_collaborative.Repository;

import com.project.plateforme_dannotation_collaborative.Model.UserLoginEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface UserLoginEventRepository extends JpaRepository<UserLoginEvent, Long> {

    @Query(
            value = "SELECT FORMATDATETIME(login_time, 'yyyy-MM-dd') AS login_date, COUNT(*) AS count " +
                    "FROM user_login_events " +
                    "WHERE login_time >= :fromDate " +
                    "GROUP BY FORMATDATETIME(login_time, 'yyyy-MM-dd') " +
                    "ORDER BY login_date",
            nativeQuery = true
    )
    List<Object[]> getLoginStatsLast7Days(@Param("fromDate") LocalDateTime fromDate);

}