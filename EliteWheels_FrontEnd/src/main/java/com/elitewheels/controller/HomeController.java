package com.elitewheels.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import com.elitewheels.dto.CarDTO;
import com.elitewheels.dto.CarType;
import java.util.Arrays;
import java.util.List;

@Controller
public class HomeController {

	@Autowired
    private RestTemplate restTemplate;
	
	@GetMapping("/index")
    public String showIndex(Model model) {
        List<String> carImages = List.of(
            "/assets/pexels-photo-8376593.webp",
            "/assets/pexels-photo-733745(1).jpg",
            "/assets/pexels-photo-30840781.webp"
        );
        model.addAttribute("carImages", carImages);
        
        
        return "customer/index"; 
    }
	
	@GetMapping("/explore")
    public String exploreCarsPage() {
        return "customer/carscards"; 
    }
	@GetMapping("/payment")
    public String paymentPage() {
        return "customer/payment"; 
    }

    @GetMapping("/offers")
    public String offersPage() {
        return "customer/offers"; 
    }

    @GetMapping("/profile")
    public String profilePage(Model model) {
        
        return "customer/profile"; 
    }
    
    @GetMapping("/luxury")
    public String luxuryCarsPage(Model model) {
   
        String typesUrl = "http://localhost:8081/api/types";
        ResponseEntity<CarType[]> typeResponse = restTemplate.getForEntity(typesUrl, CarType[].class);
        List<CarType> carTypes = Arrays.asList(typeResponse.getBody());
        model.addAttribute("carTypes", carTypes);

        String mercedesUrl = "http://localhost:8081/api/cars/brand/5";
        ResponseEntity<CarDTO[]> mercedesResponse = restTemplate.getForEntity(mercedesUrl, CarDTO[].class);
        model.addAttribute("mercedesCars", Arrays.asList(mercedesResponse.getBody()));

        String bmwUrl = "http://localhost:8081/api/cars/brand/3";
        ResponseEntity<CarDTO[]> bmwResponse = restTemplate.getForEntity(bmwUrl, CarDTO[].class);
        model.addAttribute("bmwCars", Arrays.asList(bmwResponse.getBody()));

        
        String lamboUrl = "http://localhost:8081/api/cars/brand/6";
        ResponseEntity<CarDTO[]> lamboResponse = restTemplate.getForEntity(lamboUrl, CarDTO[].class);
        model.addAttribute("lamboCars", Arrays.asList(lamboResponse.getBody()));
   
        String rrUrl = "http://localhost:8081/api/cars/brand/12";
        ResponseEntity<CarDTO[]> rrResponse = restTemplate.getForEntity(rrUrl, CarDTO[].class);
        model.addAttribute("rrCars", Arrays.asList(rrResponse.getBody()));
        
        String porscheUrl = "http://localhost:8081/api/cars/brand/15";
        ResponseEntity<CarDTO[]> porscheResponse = restTemplate.getForEntity(porscheUrl, CarDTO[].class);
        model.addAttribute("porscheCars", Arrays.asList(porscheResponse.getBody()));


        return "customer/luxury";
    }

    
    @GetMapping("/affordable")
    public String showAffordableCars(Model model) {
        // Fetch car types
        String typesUrl = "http://localhost:8081/api/types";
        ResponseEntity<CarType[]> typeResponse = restTemplate.getForEntity(typesUrl, CarType[].class);
        List<CarType> carTypes = Arrays.asList(typeResponse.getBody());
        model.addAttribute("carTypes", carTypes);

        // Fetch all cars
        String carsUrl = "http://localhost:8081/api/cars/category/1";
        ResponseEntity<CarDTO[]> carResponse = restTemplate.getForEntity(carsUrl, CarDTO[].class);
        List<CarDTO> cars = Arrays.asList(carResponse.getBody());
        model.addAttribute("cars", cars);

        return "customer/affordable";
    }
    




}

