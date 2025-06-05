package com.elitewheels.controller;

import com.elitewheels.dto.Customer;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/register")
public class RegistrationController {

    private static final String BACKEND_URL = "http://localhost:8081/api/users/register";

    @GetMapping
    public String showRegistrationForm(Model model) {
        model.addAttribute("customerForm", new Customer());
        return "customer/register";
    }

    @PostMapping 
    public String submitRegistrationForm(@ModelAttribute("customerForm") Customer customer,Model model) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // Prepare multipart form data
            MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();

            formData.add("firstName", customer.getFirstName());
            formData.add("middleName", customer.getMiddleName());
            formData.add("lastName", customer.getLastName());
            formData.add("dob", customer.getDob());
            formData.add("gender", customer.getGender());
            formData.add("nationality", customer.getNationality());
            formData.add("occupation", customer.getOccupation());

            formData.add("email", customer.getEmail());
            formData.add("phone", customer.getPhone());
            formData.add("address", customer.getAddress());
            formData.add("state", customer.getState());
            formData.add("pincode", customer.getPincode());
            formData.add("idProofType", customer.getIdProofType());
            formData.add("drivingLicenseNumber", customer.getDrivingLicenseNumber());
            formData.add("roleId", "2");

            formData.add("termsAndConditions", String.valueOf(customer.isTermsAndConditions()));
            formData.add("dataHandlingConsent", String.valueOf(customer.isDataHandlingConsent()));

            // Add files as resources
            formData.add("profilePhoto", convertToResource(customer.getProfilePhoto()));
            formData.add("idProof", convertToResource(customer.getIdProof()));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(formData, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(BACKEND_URL, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                model.addAttribute("registrationSuccess", true);
                model.addAttribute("customerForm", new Customer()); // reset form
                return "customer/register";
            }

        } catch (IOException e) {
            e.printStackTrace(); 
        }

        return "redirect:/customer/index";
    }

    // MultipartFile to ByteArrayResource
    private ByteArrayResource convertToResource(MultipartFile file) throws IOException {
        return new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename(); 
            }
        };
    }
}
