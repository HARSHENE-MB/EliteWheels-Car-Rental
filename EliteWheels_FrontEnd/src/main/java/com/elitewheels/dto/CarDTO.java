package com.elitewheels.dto;

public class CarDTO {
    
    private Integer carId;
    private String model;
    private String vehicleNo;
    private Integer year;
    private Double rentalRate;
    private String status;
    private Integer seatCount;
    private Integer mileage;
    private String features;
    private String imageUrl;

    private Brand brand;
    private Category category;
    private Type type;

    // No-argument constructor
    public CarDTO() {
    }

    // All-argument constructor
    public CarDTO(Integer carId, String model, String vehicleNo, Integer year, Double rentalRate, String status, 
                  Integer seatCount, Integer mileage, String features, String imageUrl, Brand brand, Category category, Type type) {
        this.carId = carId;
        this.model = model;
        this.vehicleNo = vehicleNo;
        this.year = year;
        this.rentalRate = rentalRate;
        this.status = status;
        this.seatCount = seatCount;
        this.mileage = mileage;
        this.features = features;
        this.imageUrl = imageUrl;
        this.brand = brand;
        this.category = category;
        this.type = type;
    }

    // Getters and setters
    public Integer getCarId() {
        return carId;
    }

    public void setCarId(Integer carId) {
        this.carId = carId;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Double getRentalRate() {
        return rentalRate;
    }

    public void setRentalRate(Double rentalRate) {
        this.rentalRate = rentalRate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getSeatCount() {
        return seatCount;
    }

    public void setSeatCount(Integer seatCount) {
        this.seatCount = seatCount;
    }

    public Integer getMileage() {
        return mileage;
    }

    public void setMileage(Integer mileage) {
        this.mileage = mileage;
    }

    public String getFeatures() {
        return features;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    // Brand class
    public static class Brand {
        
        private Long brandId;
        private String brandName;

        // No-argument constructor
        public Brand() {
        }

        // All-argument constructor
        public Brand(Long brandId, String brandName) {
            this.brandId = brandId;
            this.brandName = brandName;
        }

        public Long getBrandId() {
            return brandId;
        }

        public void setBrandId(Long brandId) {
            this.brandId = brandId;
        }

        public String getBrandName() {
            return brandName;
        }

        public void setBrandName(String brandName) {
            this.brandName = brandName;
        }
    }

    // Category class
    public static class Category {
        
        private Integer categoryId;
        private String categoryName;

        // No-argument constructor
        public Category() {
        }

        // All-argument constructor
        public Category(Integer categoryId, String categoryName) {
            this.categoryId = categoryId;
            this.categoryName = categoryName;
        }

        public Integer getCategoryId() {
            return categoryId;
        }

        public void setCategoryId(Integer categoryId) {
            this.categoryId = categoryId;
        }

        public String getCategoryName() {
            return categoryName;
        }

        public void setCategoryName(String categoryName) {
            this.categoryName = categoryName;
        }
    }

    // Type class
    public static class Type {
        
        private Long typeId;
        private String typeName;

        // No-argument constructor
        public Type() {
        }

        // All-argument constructor
        public Type(Long typeId, String typeName) {
            this.typeId = typeId;
            this.typeName = typeName;
        }

        public Long getTypeId() {
            return typeId;
        }

        public void setTypeId(Long typeId) {
            this.typeId = typeId;
        }

        public String getTypeName() {
            return typeName;
        }

        public void setTypeName(String typeName) {
            this.typeName = typeName;
        }
    }
}
