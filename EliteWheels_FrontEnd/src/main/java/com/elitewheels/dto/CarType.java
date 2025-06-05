package com.elitewheels.dto;

public class CarType {
    
    private Long typeId;
    private String typeName;

    // No-argument constructor
    public CarType() {
    }

    // All-argument constructor
    public CarType(Long typeId, String typeName) {
        this.typeId = typeId;
        this.typeName = typeName;
    }

    // Getters and setters
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
