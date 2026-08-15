package lk.onehealth.api.doctor;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/onehealth/api")
public class DoctorSearchController {
    private final WebClient supabaseClient;

    public DoctorSearchController(
            WebClient.Builder webClientBuilder,
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.service-role-key}") String serviceRoleKey) {
        this.supabaseClient = webClientBuilder
                .baseUrl(supabaseUrl + "/rest/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + serviceRoleKey)
                .defaultHeader("apikey", serviceRoleKey)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @GetMapping("/searchDoctor")
    public ResponseEntity<String> searchDoctors(
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String town,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, name = "q") String searchText) {
        String areaOrTown = firstText(area, town);
        String query = buildQuery(areaOrTown, name, category, searchText);

        String doctors = supabaseClient.get()
                .uri(URI.create("/doctors?" + query))
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> response.bodyToMono(String.class)
                        .map(message -> new ResponseStatusException(response.statusCode(), message)))
                .bodyToMono(String.class)
                .block();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(doctors == null ? "[]" : doctors);
    }

    private String buildQuery(String areaOrTown, String name, String category, String searchText) {
        StringBuilder query = new StringBuilder("select=*");
        addIlike(query, "town", areaOrTown);
        addIlike(query, "name", name);
        addIlike(query, "category", category);

        if (hasText(searchText)) {
            String value = encode("*" + searchText.trim() + "*");
            query.append("&or=")
                    .append(encode("(" + String.join(",", List.of(
                            "town.ilike." + value,
                            "name.ilike." + value,
                            "category.ilike." + value)) + ")"));
        }

        return query.toString();
    }

    private void addIlike(StringBuilder query, String column, String value) {
        if (hasText(value)) {
            query.append('&')
                    .append(column)
                    .append("=ilike.")
                    .append(encode("*" + value.trim() + "*"));
        }
    }

    private String firstText(String first, String second) {
        return hasText(first) ? first : second;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
