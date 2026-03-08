package ru.russify.russifyservice.specification;

import org.springframework.data.jpa.domain.Specification;
import ru.russify.russifyservice.model.Track;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class TrackSpecification {

    public static Specification<Track> filter(String name, List<Long> genreIds) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("name")),
                                "%" + name.toLowerCase() + "%"
                        )
                );
            }

            if (genreIds != null && !genreIds.isEmpty()) {
                predicates.add(
                        root.get("genre").get("id").in(genreIds)
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}